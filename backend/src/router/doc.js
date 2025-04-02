const express = require("express");
const zlib = require("node:zlib");

const jwtMiddleware = require("../middleware/jwtMiddleware");
const db = require("../lib/db");
const { InternalServerError } = require("../middleware/errorMiddleware");
const upload = require("../middleware/uploadMiddleware");
const generateHash = require("../utils/generateHash");

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
  let role = null;

  // 校验用户权限
  try {
    const [permission] = await db("book_permissions")
      .join("users", "book_permissions.user_id", "users.id")
      .select(["book_permissions.*", "users.email"])
      .where({ "book_permissions.book_id": book_id, user_id: req.user.id });

    if (!permission) return next(new InternalServerError(403, "权限不足！"));

    role = `book:${permission.permission}`;
  } catch (error) {
    next(new InternalServerError(500, "文档列表获取失败！", error.message));
  }

  // 实际逻辑
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
    const [{ bookName, bookDescription }] = await db("books")
      .select(["name as bookName", "description as bookDescription"])
      .where({ id: book_id })

    const tree = [];
    const groupMap = group.reduce((map, cur) => map.set(cur.id, { ...cur, type: "group", children: [] }), new Map())
    doc.forEach(item => {
      if (!item.parent_id) return tree.push(item);

      const parent = groupMap.get(item.parent_id);
      parent.children.push(item)
    })
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
      }

      return map;
    }

    const result = JSON.stringify({
      bookName,
      bookDescription,
      role,
      docList: [...tree, ...builder(groupMap).values()]
    });
    const zip = zlib.gzipSync(result);
    res.setHeader("content-encoding", "gzip");

    return res.send(zip)
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
const template = {
  "meta": {
    "abilities": {
      "create": true,
      "destroy": true,
      "update": true,
      "read": true,
      "export": true,
      "manage": true,
      "join": true,
      "share": true,
      "force_delete": true,
      "create_collaborator": true,
      "destroy_comment": true
    },
    "latestReviewStatus": -1,
    "matchCondition": {
      "editType": "Lake",
      "useEditorTileRendering": true,
      "useEditorTileRenderingForOT": true,
      "useEditorDelayTileChange": true,
      "useEditorVirtualRendering": false,
      "useEditorVirtualRenderingForOT": false
    },
    "collab": {
      "host": "wss://collab.yuque.com",
      "id": "yuque/prod/doc/212953678",
      "token": "4gVwNP1_FUZPMXNYwi9kHQ==|JTsTFyDxkg5N0fdA7a4wQLtWo77FOX7CRFiqJk1Ppol4M7G34QaZ6AE7MzpW831ZFezhRO6m6Xnm505hOYE84iwIs_VLwfMB6NyYJ82z4JcTNOh1nxCXSne_iUXZVX6y1wdbGwNBXy1lAVb8DiyHuZjZbP_DfIi1ctwd_wN97oIhWYETnusoFqG-LY4tKvkTs3k54A4ieuZk9nk6GepXe3d_U9O2QUghcGK08tybw1zNWZoolimWA2ADUgJfK6SW8p3AaX2wZQRpAbNffPOb-RYQJAlnf1JovrqzJeAzKGE9L6stG1nY1hjyaErQ-8wHBezAuN-sluQU8K1TB3pzuQ75UVWrHlWoM-vJol05p46_WvOK8pbxrUa3d_FYHYSbzqv6wLJ6F-DWKcN8_wztxXYMPNy4pZu9n0xE_O-8KJ7A_7dWSHdwFYhUm-6GrKreEm2nZlKToSW0p8jCWQgt_QwJZpRG5Ur-F1De0ERKf3tbDNpyplCJNvn3140ePuGTvnMRpz1Tv0vrTk_7kAqHqYX36bkaSbeLqVo7TYiV7Dc="
    }
  },
  "data": {
    "id": 212953678,
    "space_id": 0,
    "type": "Doc",
    "sub_type": null,
    "title": "无标题文档",
    "tag": null,
    "title_draft": null,
    "slug": "mp9yl3twyflznezg",
    "user_id": 44393491,
    "book_id": 63030179,
    "last_editor_id": 44393491,
    "cover": null,
    "description": "",
    "custom_description": "",
    "body": "",
    "body_draft": "",
    "body_asl": "",
    "body_draft_asl": "",
    "format": "lake",
    "origin_format": "lake",
    "status": 0,
    "read_status": 0,
    "view_status": 0,
    "public": 0,
    "draft_version": 0,
    "comments_count": 0,
    "like": {
      "count": 0,
      "actioned": null
    },
    "likes_count": 0,
    "abilities": {
      "create": true,
      "destroy": true,
      "update": true,
      "read": true,
      "export": true,
      "manage": true,
      "join": true,
      "share": true,
      "force_delete": true,
      "create_collaborator": true,
      "destroy_comment": true
    },
    "content_updated_at": "2025-03-29T15:14:34.000Z",
    "created_at": "2025-03-29T15:14:34.000Z",
    "updated_at": "2025-03-29T15:14:34.000Z",
    "published_at": null,
    "first_published_at": null,
    "pinned_at": null,
    "hits": 0,
    "word_count": 0,
    "editor_meta": null,
    "editor_meta_draft": null,
    "marked": true,
    "mark": {
      "action_name": "mark_doc",
      "id": 133472998427,
      "created_at": "2025-03-29T16:03:54.000Z",
      "updated_at": "2025-03-29T16:03:54.000Z",
      "space_id": 0,
      "action_type": "mark",
      "action_option": "doc",
      "action_setting_type": "default",
      "user_id": 44393491,
      "organization_id": 0,
      "target_type": "Doc",
      "target_id": 212953678,
      "target_book_id": 63030179,
      "target_group_id": 44393491,
      "title": "无标题文档"
    },
    "meta": {

    },
    "collab": {
      "host": "wss://collab.yuque.com",
      "id": "yuque/prod/doc/212953678",
      "token": "4gVwNP1_FUZPMXNYwi9kHQ==|JTsTFyDxkg5N0fdA7a4wQLtWo77FOX7CRFiqJk1Ppol4M7G34QaZ6AE7MzpW831ZFezhRO6m6Xnm505hOYE84iwIs_VLwfMB6NyYJ82z4JcTNOh1nxCXSne_iUXZVX6y1wdbGwNBXy1lAVb8DiyHuZjZbP_DfIi1ctwd_wN97oIhWYETnusoFqG-LY4tKvkTs3k54A4ieuZk9nk6GepXe3d_U9O2QUghcGK08tybw1zNWZoolimWA2ADUgJfK6SW8p3AaX2wZQRpAbNffPOb-RYQJAlnf1JovrqzJeAzKGE9L6stG1nY1hjyaErQ-8wHBezAuN-sluQU8K1TB3pzuQ75UVWrHlWoM-vJol05p46_WvOK8pbxrUa3d_FYHYSbzqv6wLJ6F-DWKcN8_wztxXYMPNy4pZu9n0xE_O-8KJ7A_7dWSHdwFYhUm-6GrKreEm2nZlKToSW0p8jCWQgt_QwJZpRG5Ur-F1De0ERKf3tbDNpyplCJNvn3140ePuGTvnMRpz1Tv0vrTk_7kAqHqYX36bkaSbeLqVo7TYiV7Dc="
    },
    "doc_dynamic_data": [],
    "region": "福建",
    "indexed_level": 0,
    "privacy_migrated": true,
    "share_expired_time": null,
    "password": null,
    "book": null,
    "user": {
      "id": 44393491,
      "type": "User",
      "login": "luolin-r0hmx",
      "name": "洛霖",
      "description": "",
      "avatar": "https://cdn.nlark.com/yuque/0/2024/png/anonymous/1715402378741-yuque/__avatar/thirdpart_register/7867084d-2082-4087-a8d3-5ede4baff8ab.png",
      "avatar_url": "https://cdn.nlark.com/yuque/0/2024/png/anonymous/1715402378741-yuque/__avatar/thirdpart_register/7867084d-2082-4087-a8d3-5ede4baff8ab.png",
      "followers_count": 0,
      "following_count": 0,
      "role": 1,
      "status": 1,
      "public": 1,
      "scene": null,
      "source": "index",
      "created_at": "2024-05-11T04:39:40.000Z",
      "updated_at": "2025-03-29T15:14:34.000Z",
      "expired_at": "2025-02-26T15:59:59.000Z",
      "isPaid": false,
      "member_level": 1,
      "memberLevelName": "专业会员",
      "hasMemberLevel": true,
      "isTopLevel": false,
      "isNewbie": false,
      "members_count": 0,
      "profile": null,
      "organizationUser": null,
      "_serializer": "web.user"
    },
    "last_editor": {
      "id": 44393491,
      "type": "User",
      "login": "luolin-r0hmx",
      "name": "洛霖",
      "description": "",
      "avatar": "https://cdn.nlark.com/yuque/0/2024/png/anonymous/1715402378741-yuque/__avatar/thirdpart_register/7867084d-2082-4087-a8d3-5ede4baff8ab.png",
      "avatar_url": "https://cdn.nlark.com/yuque/0/2024/png/anonymous/1715402378741-yuque/__avatar/thirdpart_register/7867084d-2082-4087-a8d3-5ede4baff8ab.png",
      "followers_count": 0,
      "following_count": 0,
      "role": 1,
      "status": 1,
      "public": 1,
      "scene": null,
      "source": "index",
      "created_at": "2024-05-11T04:39:40.000Z",
      "updated_at": "2025-03-29T15:14:34.000Z",
      "expired_at": "2025-02-26T15:59:59.000Z",
      "isPaid": false,
      "member_level": 1,
      "memberLevelName": "专业会员",
      "hasMemberLevel": true,
      "isTopLevel": false,
      "isNewbie": false,
      "members_count": 0,
      "profile": null,
      "organizationUser": null,
      "_serializer": "web.user"
    },
    "server_time": 1743264380148,
    "locker": null,
    "contributors": [],
    "_serializer": "web.doc_raw"
  }
}
docRouter.get("/doc", jwtMiddleware, async (req, res, next) => {
  const { book_id, doc_id } = req.query;

  try {
    const [result] = await db("docs").select("*").where({ id: doc_id, book_id, })

    return res.send(result)
  } catch (error) {

  }
})

// 更新文档信息
docRouter.post("/updateDoc", jwtMiddleware, async (req, res, next) => {
  const { doc_id, title, content } = req.body;

  try {
    if (!content || content === "") {
      await db("docs").update({ title }).where({ id: doc_id });
      return res.send({ msg: "ok" });
    }

    const [lastVersion] = await db("docs_version").where({ doc_id }).orderBy("version", "desc").limit(1)
    if (lastVersion?.content && generateHash(lastVersion.content) === generateHash(content)) return res.send({ msg: "ok" })

    await db("docs").update({ title, content }).where({ id: doc_id })

    const [version] = await db("docs_version").max("version").where({ doc_id })
    await db("docs_version").insert({
      creator_id: req.user.id,
      doc_id,
      version: version['max(`version`)'] + 1,
      content
    })

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
    await db("docs_version").delete().where({ doc_id })

    return res.send({ msg: "ok" })
  } catch (error) {
    next(new InternalServerError(500, "文档删除失败！", error.message))
  }
})

// 删除分组
docRouter.post("/delDocGroup", jwtMiddleware, async (req, res, next) => {
  const { groupList, docList } = req.body;

  try {
    const del = async (table, list) => {
      for (const k of list) {
        await db(table).delete().where({ id: k })
      }
    }
    await del("doc_group", groupList);
    await del("docs", docList);

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