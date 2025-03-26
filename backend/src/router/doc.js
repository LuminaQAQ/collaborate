const express = require("express");

const jwtMiddleware = require("../middleware/jwtMiddleware");
const db = require("../lib/db");
const { InternalServerError } = require("../middleware/errorMiddleware");
const upload = require("../middleware/uploadMiddleware");

const docRouter = express.Router();

// 获取文档库列表
docRouter.get("/bookList", jwtMiddleware, async (req, res, next) => {
  const { email, id } = req.user;

  try {
    const bookList = await db("books")
      .join("users", "books.creator_id", "users.id")
      .select(["books.id", "books.name", "books.description", "users.email"])
      .where({ "books.creator_id": id })
      .orderBy("books.id");

    return res.status(200).send({ msg: "ok", bookList, email })
  } catch (error) {
    return next(new InternalServerError(500, "获取失败！", error.message))
  }
})

// 获取文档列表
docRouter.get("/docList", jwtMiddleware, async (req, res, next) => {
  const { book_id } = req.query;

  try {
    const group = await db("doc_group")
      .join("users")
      .select(["doc_group.*", "users.email"])
      .where({ book_id })
    const doc = await db("docs")
      .join("users")
      .join("books", "docs.book_id", "books.id")
      .select(["docs.*", "users.email"])
      .where({ book_id })
      .orderBy("docs.id")

    const tree = []
    /**
     * @type {Map}
     */
    const groupMap = group.reduce((map, cur) => map.set(cur.id, { ...cur, type: "group", children: [] }), new Map())
    doc.forEach(item => {
      if (!item.parent_id) return tree.push(item);

      const parent = groupMap.get(item.parent_id);
      parent.children.push(item)
    })
    /**
     *
     * @param {Map} map
     */
    const builder = (map) => {
      const cache = new Map()
      map.forEach(item => {
        if (!item.parent_id) return;

        const parent = map.get(item.parent_id);
        parent.children.push(item)
        cache.set(item.id, item.parent_id)
      })

      if (cache.size > 0) {
        map.forEach(item => {
          if (item.parent_id) map.delete(item.id);
        })
        return map;
      }
    }

    return res.send({ docList: [...tree, ...builder(groupMap).values()] })
  } catch (error) {
    next(new InternalServerError(500, "文档列表获取失败！", error.message));
  }
})

// 创建文档库
docRouter.post("/createBook", jwtMiddleware, async (req, res, next) => {
  const { email } = req.user;
  const { name, description } = req.body

  try {
    const [result] = await db("users").select("id").where({ email })

    await db("books").insert({ name, description, creator_id: result.id })

    return res.status(200).send({
      msg: "创建成功！"
    })
  } catch (error) {
    return next(new InternalServerError(500, "创建失败！",))
  }
})

// 创建文档
docRouter.post("/createDoc", jwtMiddleware, async (req, res, next) => {
  const { id } = req.user;
  const { book_id, parent_id } = req.body;

  try {
    const [doc_id] = await db("docs").insert({ book_id, title: "无标题文档", content: "", creator_id: id, parent_id: parent_id || null }).select("id as doc_id");

    return res.status(200).send({ msg: "创建成功！", doc_id })
  } catch (error) {
    next(new InternalServerError(500, "创建失败！", error.message))
  }
})

// 创建文档分组
docRouter.post("/createDocGroup", jwtMiddleware, async (req, res, next) => {
  const { name, book_id, parent_id } = req.body;

  try {
    const [doc_group_id] = await db("doc_group").insert({ name: name || "新分组", parent_id: parent_id || null, book_id, }).select("id as doc_group_id");

    return res.status(200).send({ msg: "创建成功！", doc_group_id })
  } catch (error) {
    next(new InternalServerError(500, "创建失败！", error.message))
  }
})

// 获取当前文档信息
docRouter.get("/doc", jwtMiddleware, async (req, res, next) => {
  const { book_id, doc_id } = req.query;

  try {
    const [result] = await db("docs").select(["title", "content"]).where({ id: doc_id, book_id, })

    return res.send(result)
  } catch (error) {

  }
})

// 更新文档信息
docRouter.post("/updateDoc", jwtMiddleware, async (req, res, next) => {
  const { doc_id, title, content } = req.body;

  try {
    await db("docs").update({ title, content }).where({ id: doc_id })

    return res.send({ msg: "ok" })
  } catch (error) {
    next(new InternalServerError(500, "文档保存失败！", error.message))
  }
})

// 删除文档
docRouter.post("/delDoc", jwtMiddleware, async (req, res, next) => {
  const { doc_id } = req.body;

  try {
    await db("docs").delete().where({ id: doc_id })

    return res.send({ msg: "ok" })
  } catch (error) {
    next(new InternalServerError(500, "文档删除失败！", error.message))
  }
})

// 上传文档内的图片
docRouter.post("/docImageUpload", upload.single("img"), async (req, res, next) => {
  const { name } = req.body;

  res.send({ desc: name, url: `http://localhost:3000/files/${req.file.filename}` })
})

module.exports = docRouter;