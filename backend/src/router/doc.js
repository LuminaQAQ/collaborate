const express = require("express");

const jwtMiddleware = require("../middleware/jwtMiddleware");
const db = require("../lib/db");
const { InternalServerError } = require("../middleware/errorMiddleware");

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
    const { } = req.user;
    const { book_id } = req.query;

    try {
        const result = await db("docs")
            .join("users")
            .join("books", "docs.book_id", "books.id")
            .select(["docs.*", "users.email"])
            .where({ book_id })
            .orderBy("docs.id")
        const [{ name }] = await db("books").select("name").where({ id: book_id })
        return res.status(200).send({ msg: "ok", docList: result, bookName: name })
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
    const { book_id } = req.body;

    try {
        const [doc_id] = await db("docs").insert({ book_id, title: "无标题文档", content: "", creator_id: id }).select("id as doc_id");

        return res.status(200).send({ msg: "创建成功！", doc_id })
    } catch (error) {
        next(new InternalServerError(500, "创建失败！", error.message))
    }
})

module.exports = docRouter;