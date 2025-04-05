const express = require("express");

const { sign, verify } = require("jsonwebtoken")
const jwtMiddleware = require("../middleware/jwtMiddleware");
const db = require("../lib/db");
const { InternalServerError } = require("../middleware/errorMiddleware");
const bookPermissionMiddleware = require("../middleware/roleMiddleware");
const redis = require("../lib/redis");
const bookRouter = express.Router();

/**
 * 
 * @param {Number | String} role 
 */
const handleRole = (role) => {
    return role && Number(role) === 2 ? "editor" : "viewer"
}

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

        const token = await redis.get(`book:share:token:${handleRole(role)}:${book_id}`)

        if (token) return res.status(200).send({
            msg: "ok",
            token
        })

        const bookToken = sign({
            book_id, email,
            role: handleRole(role)
        }, "book-share-token", { expiresIn: "24h" })
        await redis.set(`book:share:token:${handleRole(role)}:${book_id}`, bookToken, "EX", 24 * 60 * 60)

        return res.status(200).send({
            msg: "ok",
            token: bookToken
        })
    } catch (error) {
        return next(new InternalServerError(500, "获取失败！", error.message))
    }
})

bookRouter.post("/bookJoin", jwtMiddleware, async (req, res, next) => {
    try {
        const { bookToken } = req.body
        const { email } = req.user

        const isValid = verify(bookToken, "book-share-token")
        if (!isValid) return res.status(404).send({ error: "邀请链接无效" })

        const { book_id, role } = isValid
        const token = await redis.get(`book:share:token:${isValid.role}:${book_id}`)
        if (!token) return res.status(404).send({ error: "邀请链接无效" })

        const [result] = await db("users").select("id").where({ email })
        const hasPermission = await db("book_permissions").select("*").where({ book_id, user_id: result.id })
        const data = { msg: "ok", user: isValid.email, book_id }
        if (hasPermission.length > 0) {
            if (hasPermission[0].permission !== role) await db("book_permissions").update({ permission: role }).where({ book_id, user_id: result.id })

            return res.status(200).send(data)
        }

        await db("book_permissions").insert({ book_id, user_id: result.id, permission: role })

        return res.status(200).send(data)
    } catch (error) {
        return next(new InternalServerError(500, "获取失败！", error.message))
    }
})

module.exports = bookRouter;