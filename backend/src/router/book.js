const express = require("express");

const { sign, verify } = require("jsonwebtoken")
const jwtMiddleware = require("../middleware/jwtMiddleware");
const db = require("../lib/db");
const { InternalServerError } = require("../middleware/errorMiddleware");
const bookPermissionMiddleware = require("../middleware/roleMiddleware");
const redis = require("../lib/redis");
const bookRouter = express.Router();

// 获取文档库列表
bookRouter.get("/bookList", jwtMiddleware, async (req, res, next) => {
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

// 创建文档库
bookRouter.post("/createBook", jwtMiddleware, async (req, res, next) => {
    const { email } = req.user;
    const { name, description } = req.body

    try {
        const [result] = await db("users").select("id").where({ email })

        const [book_id] = await db("books").insert({ name, description, creator_id: result.id })
        await db("book_permissions").insert({ book_id, user_id: result.id, permission: "owner" })

        return res.status(200).send({
            msg: "创建成功！"
        })
    } catch (error) {
        return next(new InternalServerError(500, "创建失败！", error.message))
    }
})

bookRouter.get("/bookJoinURL", jwtMiddleware, bookPermissionMiddleware, async (req, res, next) => {
    try {
        const { book_id, role } = req.query;
        const { email } = req.user;

        if (await redis.get(`book:share:token:${book_id}`)) return res.status(200).send({
            msg: "ok",
            bookToken
        })

        const bookToken = sign({
            book_id, email,
            role: role && Number(role) === 1 ? "viewer" : "editor"
        }, "book-share-token", { expiresIn: "24h" })
        await redis.set(`book:share:token:${bookToken}`, book_id, "EX", 24 * 60 * 60)

        return res.status(200).send({
            msg: "ok",
            bookToken
        })
    } catch (error) {
        return next(new InternalServerError(500, "获取失败！", error.message))
    }
})

bookRouter.post("/bookJoin", jwtMiddleware, async (req, res, next) => {
    try {
        const { bookToken } = req.body
        const { email } = req.user

        const bookId = await redis.get(`book:share:token:${bookToken}`)
        if (!bookId) return res.status(404).send({ error: "邀请链接无效" })
        const isValid = verify(bookToken, "book-share-token")
        if (!isValid) return res.status(404).send({ error: "邀请链接无效" })

        const { book_id, role } = isValid
        const [result] = await db("users").select("id").where({ email })
        const hasPermission = await db("book_permissions").select("*").where({ book_id, user_id: result.id })
        if (hasPermission.length > 0) return res.status(200).send({ msg: "ok", user: isValid.email, bookId })

        await db("book_permissions").insert({ book_id, user_id: result.id, permission: role })

        return res.status(200).send({ msg: "ok", user: isValid.email, bookId })
    } catch (error) {
        return next(new InternalServerError(500, "获取失败！", error.message))
    }
})

module.exports = bookRouter;