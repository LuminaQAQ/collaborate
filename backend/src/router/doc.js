const express = require("express");

const jwtMiddleware = require("../middleware/jwtMiddleware");
const db = require("../lib/db");
const { InternalServerError } = require("../middleware/errorMiddleware");
const upload = require("../middleware/uploadMiddleware");

const docRouter = express.Router();

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

docRouter.get("/docList", jwtMiddleware, async (req, res, next) => {
  const { book_id } = req.query;

  try {
    // const result = await db("docs")
    //   .join("users")
    //   .join("books", "docs.book_id", "books.id")
    //   .select(["docs.*", "users.email"])
    //   .where({ book_id })
    //   .orderBy("docs.id")
    // const [{ name, description }] = await db("books").select(["name", "description"]).where({ id: book_id })
    // return res.status(200).send({ msg: "ok", docList: result, bookName: name, bookDescription: description })

    const group = await db("doc_group").select("*").where({ book_id })
    const doc = await db("docs")
      .join("users")
      .join("books", "docs.book_id", "books.id")
      .select(["docs.*", "users.email"])
      .where({ book_id })
      .orderBy("docs.id")


    /**
     * 
     * @param {Array} group 
     * @returns 
     */
    const fn = (group, grade) => {
      const childTree = [];
      for (let i = 0; i < group.length; i++) {
        const item = group[i]
        if (item.parent_id) continue;
        childTree.push(item);
      }

      return childTree

      // return childTree.length ? fn(childTree, 0) : ;

      // const result = [];

      // for (let i = 0; i < result.length; i++) {
      //   const item = data[i]
      //   if (!item.parent_id) result.push(item);
      //   else return fn()
      // }

      // // if (data)
      // return result;
    }

    console.log(fn(group));


    return res.send({ group, doc })
  } catch (error) {
    next(new InternalServerError(500, "文档列表获取失败！", error.message));
  }
})

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

docRouter.post("/createDocGroup", jwtMiddleware, async (req, res, next) => {
  // const { id } = req.user;
  const { name, book_id, parent_id } = req.body;

  try {
    const [doc_group_id] = await db("doc_group").insert({ name, parent_id: parent_id || null, book_id, }).select("id as doc_group_id");

    return res.status(200).send({ msg: "创建成功！", doc_group_id })
  } catch (error) {
    next(new InternalServerError(500, "创建失败！", error.message))
  }
})

docRouter.get("/doc", jwtMiddleware, async (req, res, next) => {
  const { book_id, doc_id } = req.query;

  try {
    const [result] = await db("docs").select(["title", "content"]).where({ id: doc_id, book_id, })

    return res.send(result)
  } catch (error) {

  }
})

docRouter.post("/updateDoc", jwtMiddleware, async (req, res, next) => {
  const { doc_id, title, content } = req.body;

  try {
    await db("docs").update({ title, content }).where({ id: doc_id })

    return res.send({ msg: "ok" })
  } catch (error) {
    next(new InternalServerError(500, "文档保存失败！", error.message))
  }
})

docRouter.post("/delDoc", jwtMiddleware, async (req, res, next) => {
  const { doc_id } = req.body;

  try {
    await db("docs").delete().where({ id: doc_id })

    return res.send({ msg: "ok" })
  } catch (error) {
    next(new InternalServerError(500, "文档删除失败！", error.message))
  }
})

docRouter.post("/docImageUpload", upload.single("img"), async (req, res, next) => {
  const { name } = req.body;

  res.send({ desc: name, url: `http://localhost:3000/files/${req.file.filename}` })
})

module.exports = docRouter;