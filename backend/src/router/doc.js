const express = require("express");
const zlib = require("node:zlib");

const jwtMiddleware = require("../middleware/jwtMiddleware");
const db = require("../lib/db");
const { InternalServerError } = require("../middleware/errorMiddleware");
const upload = require("../middleware/uploadMiddleware");
const generateHash = require("../utils/generateHash");
const bookPermissionMiddleware = require("../middleware/roleMiddleware");
const path = require("node:path");

const multer = require("multer")();
const convertDocxToMarkdown = require("../utils/convertDocxToMarkdown");

const docRouter = express.Router();

// 获取文档列表
docRouter.get(
  "/docList",
  jwtMiddleware,
  bookPermissionMiddleware,
  async (req, res, next) => {
    const { book_id } = req.query;

    try {
      const group = await db("doc_group")
        .join("users")
        .select(["doc_group.*", "users.email"])
        .where({ book_id, is_deleted: 0 });
      const doc = await db("docs")
        .join("users", "users.id", "docs.creator_id")
        .join("books", "docs.book_id", "books.id")
        .select(["docs.*", "users.email"])
        .where({ book_id, "docs.is_deleted": 0 })
        .orderBy("docs.id");
      const [bookInfo] = await db("books")
        .select([
          "books.id",
          "name as bookName",
          "description as bookDescription",
          db("favorites")
            .select("favorites.id")
            .where({
              user_id: req.user.id,
              target_type: "Book",
              target_id: book_id,
              is_deleted: 0,
            })
            .as("isFavorite"),
        ])
        .where({ id: book_id });

      const tree = [];
      const groupMap = group.reduce(
        (map, cur) => map.set(cur.id, { ...cur, type: "group", children: [] }),
        new Map()
      );
      doc.forEach((item) => {
        if (!item.parent_id) return tree.push(item);

        const parent = groupMap.get(item.parent_id);
        parent.children.push(item);
      });
      const builder = (map) => {
        const cache = new Map();
        map.forEach((item) => {
          if (!item.parent_id) return;

          const parent = map.get(item.parent_id);
          parent.children.push(item);
          cache.set(item.id, item.parent_id);
        });

        if (cache.size > 0) {
          map.forEach((item) => {
            if (item.parent_id) map.delete(item.id);
          });
        }

        return map;
      };

      const result = JSON.stringify({
        bookInfo,
        role: req.user.role,
        docList: [...tree, ...builder(groupMap).values()],
      });

      const zip = zlib.gzipSync(result);
      res.setHeader("content-encoding", "gzip");

      return res.send(zip);
    } catch (error) {
      next(new InternalServerError(500, "文档列表获取失败！", error.message));
    }
  }
);

// 创建文档
docRouter.post("/createDoc", jwtMiddleware, async (req, res, next) => {
  const { id } = req.user;
  const { book_id, parent_id } = req.body;

  try {
    const [doc_id] = await db("docs")
      .insert({
        book_id,
        title: "无标题文档",
        content: "",
        creator_id: id,
        parent_id: parent_id || null,
      })
      .select("id as doc_id");

    return res.status(200).send({ msg: "创建成功！", doc_id });
  } catch (error) {
    next(new InternalServerError(500, "创建失败！", error.message));
  }
});

// 创建文档分组
docRouter.post("/createDocGroup", jwtMiddleware, async (req, res, next) => {
  const { name, book_id, parent_id } = req.body;

  try {
    const [doc_group_id] = await db("doc_group")
      .insert({
        title: name || "新分组",
        parent_id: parent_id || null,
        book_id,
      })
      .select("id as doc_group_id");

    return res.status(200).send({ msg: "创建成功！", doc_group_id });
  } catch (error) {
    next(new InternalServerError(500, "创建失败！", error.message));
  }
});

// 获取文档
docRouter.get(
  "/doc",
  jwtMiddleware,
  bookPermissionMiddleware,
  async (req, res, next) => {
    const { doc_id } = req.query;
    let role = null;

    // 校验用户权限
    try {
      if (req.user.role) {
        role = req.user.role;
      } else {
        const [permission] = await db("doc_permissions")
          .join("users", "doc_permissions.user_id", "users.id")
          .select(["doc_permissions.*", "users.email"])
          .where({ "doc_permissions.doc_id": doc_id, user_id: req.user.id });

        if (!permission)
          return next(new InternalServerError(403, "权限不足！"));

        role = `doc:${permission.permission}`;
      }
    } catch (error) {
      next(new InternalServerError(500, "文档列表获取失败！", error.message));
    }

    try {
      const [result] = await db("docs")
        .select("docs.*")
        .select(
          db("favorites")
            .select("favorites.target_id")
            .whereRaw(
              "favorites.target_id = docs.id and favorites.user_id = ? and favorites.target_type = 'Doc'",
              req.user.id
            )
            .as("isFavorite")
        )
        .where({ id: doc_id });
      result.role = role;

      return res.send(result);
    } catch (error) {
      next(new InternalServerError(500, "文档获取失败！", error.message));
    }
  }
);

// 更新文档信息
docRouter.post("/updateDoc", jwtMiddleware, async (req, res, next) => {
  const { doc_id, title, content } = req.body;
  const updateDoc = async ({ creator_id, doc_id, title, content }) =>
    new Promise(async (resolve, reject) => {
      const isNeedUpdate = new Promise(async (res, rej) => {
        const [lastVersion] = await db("docs_version")
          .where({ doc_id })
          .orderBy("version", "desc")
          .limit(1);
        if (!lastVersion) return res(lastVersion);
        else {
          const prevHash = generateHash(
            lastVersion.title + lastVersion.content
          );
          const currHash = generateHash(title + content);

          if (prevHash !== currHash) res();
          else rej();
        }
      });

      isNeedUpdate
        .then(async (res) => {
          const [version] = await db("docs_version")
            .max("version")
            .where({ doc_id });

          await db("docs").update({ title, content }).where({ id: doc_id });
          await db("docs_version").insert({
            creator_id,
            doc_id,
            version: version["max(`version`)"] + 1,
            title,
            content,
          });

          resolve();
        })
        .catch((err) => resolve());
    });

  try {
    await updateDoc({
      creator_id: req.user.id,
      doc_id,
      title,
      content,
    });

    return res.send({ msg: "ok" });
  } catch (error) {
    next(new InternalServerError(500, "文档保存失败！", error.message));
  }
});

// 删除文档
docRouter.post("/delDoc", jwtMiddleware, async (req, res, next) => {
  const { doc_id } = req.body;

  try {
    // await db("docs").delete().where({ id: doc_id });
    await db("docs").update({ is_deleted: 1 }).where({ id: doc_id });
    // await db("docs_version").delete().where({ doc_id });
    // await db("favorites")
    //   .delete()
    //   .where({ target_id: doc_id, target_type: "Doc" });

    return res.send({ msg: "ok" });
  } catch (error) {
    next(new InternalServerError(500, "文档删除失败！", error.message));
  }
});

// 删除分组
docRouter.post("/delDocGroup", jwtMiddleware, async (req, res, next) => {
  const { groupList, docList } = req.body;

  try {
    const del = async (table, list) => {
      for (const k of list) {
        // await db(table).delete().where({ id: k });
        await db(table).update({ is_deleted: 1 }).where({ id: k });
      }
    };
    await del("doc_group", groupList);
    await del("docs", docList);

    return res.send({ msg: "ok" });
  } catch (error) {
    next(new InternalServerError(500, "文档删除失败！", error.message));
  }
});

// 上传文档内的图片
docRouter.post(
  "/docImageUpload",
  upload.single("img"),
  async (req, res, next) => {
    const { name } = req.body;

    res.send({
      desc: name,
      url: `http://localhost:3000/files/${req.file.filename}`,
    });
  }
);

// 评论
docRouter.post("/comment/:doc_id", jwtMiddleware, async (req, res, next) => {
  const { user } = req;
  const { doc_id, comment_content, comment_quote, parent_id } = req.body;

  try {
    await db("doc_comments").insert({
      doc_id,
      comment_user: user.id,
      comment_content,
      comment_quote: comment_quote || null,
      parent_id: parent_id || null,
    });

    return res.json({ msg: "评论成功" });
  } catch (error) {
    next(new InternalServerError(500, "评论失败！", error.message));
  }
});

// 获取评论
docRouter.get("/comments/:doc_id", async (req, res, next) => {
  const { doc_id } = req.params;

  try {
    const comments = await db("doc_comments")
      .where({ doc_id })
      .join("users", "users.id", "doc_comments.comment_user")
      .select(
        "doc_comments.id as comment_id",
        "doc_comments.comment_content",
        "doc_comments.comment_quote",
        "doc_comments.created_at as comment_time",
        "doc_comments.parent_id as comment_parent_id",
        "users.username as comment_user_name",
        "users.avatar as comment_user_avatar"
      )
      .orderBy("comment_time", "asc");

    const likes = await db("comment_likes")
      .select("comment_id")
      .count("* as like_count")
      .groupBy("comment_id");

    const likeMap = {};
    likes.forEach((l) => {
      likeMap[l.comment_id] = l.like_count;
    });

    // TODO: 优化评论层级与回复对象
    // const commentsMap = new Map();

    // comments.forEach((c) => {
    //   if (!c.comment_parent_id) {
    //     c.children = [];
    //     commentsMap.set(c.comment_id, c);
    //   }
    // });
    // comments.forEach((c) => {
    //   if (c.comment_parent_id) {
    //     const parent = commentsMap.get(c.comment_parent_id);
    //     if (parent) {
    //       parent.children.push(c);
    //       commentsMap.delete(c.comment_id);
    //     }
    //   }
    // });

    // const withLikes = [...commentsMap.values()].map((comment) => ({
    //   ...comment,
    //   like_count: likeMap[comment.id] || 0,
    // }));

    const withLikes = comments.map((comment) => ({
      ...comment,
      like_count: likeMap[comment.id] || 0,
    }));

    return res.status(200).json(withLikes);
  } catch (error) {
    next(new InternalServerError(500, "获取评论列表失败！", error.message));
  }
});

// 导入文档
docRouter.post(
  "/uploadDocFile",
  jwtMiddleware,
  multer.single("file"),
  async (req, res, next) => {
    const { id } = req.user;

    const file = req.file;
    const { file_name, book_id, parent_id } = req.body;

    const whiteList = [".docx", ".md", ".markdown", ".txt"];

    try {
      let md = null;
      const ext = path.extname(req.file.originalname);

      if (!whiteList.includes(ext))
        return res.status(400).send({
          error: "文件格式错误！",
        });

      if (ext === ".docx") md = await convertDocxToMarkdown(file.buffer);
      else md = file.buffer.toString("utf-8");

      const [doc_id] = await db("docs")
        .insert({
          book_id,
          title: file_name,
          content: md,
          creator_id: id,
          parent_id: parent_id === "null" || !parent_id ? null : parent_id,
        })
        .select("id as doc_id");

      return res.status(200).send({ msg: "文件导入成功！", doc_id });
    } catch (error) {
      return next(new InternalServerError(500, "文件处理失败!", error.message));
    }
  }
);

// 文档移动
docRouter.post("/moveDoc", jwtMiddleware, async (req, res, next) => {
  try {
    const { doc_id, book_id, parent_id } = req.body;

    if (!doc_id || !book_id)
      return res.status(400).json({ success: false, message: "参数不完整" });

    const doc = await db("docs").where({ id: doc_id, is_deleted: 0 }).first();
    if (!doc)
      return res.status(404).json({ success: false, message: "文档不存在" });

    await db("docs")
      .where({ id: doc_id })
      .update({
        book_id,
        parent_id: parent_id || null,
        updated_at: db.fn.now(),
      });

    return res.json({ msg: "移动成功" });
  } catch (error) {
    return next(new InternalServerError(500, "移动失败", error.message));
  }
});

// 文档复制
docRouter.post("/copyDoc", jwtMiddleware, async (req, res, next) => {
  try {
    const { doc_id, book_id, parent_id } = req.body;

    if (!doc_id || !book_id)
      return res.status(400).json({ success: false, message: "参数不完整" });

    const doc = await db("docs").where({ id: doc_id, is_deleted: 0 }).first();
    if (!doc)
      return res.status(404).json({ success: false, message: "原文档不存在" });

    const newDoc = {
      title: doc.title + "（副本）",
      content: doc.content,
      book_id,
      parent_id,
      creator_id: req.user.id,
    };

    await db("docs").insert(newDoc);

    return res.json({ msg: "复制成功" });
  } catch (error) {
    return next(new InternalServerError(500, "复制失败", error.message));
  }
});

module.exports = docRouter;
