const express = require("express");
const db = require("../../lib/db.js");

const jwtMiddleware = require("../../middleware/jwtMiddleware.js");
const { InternalServerError } = require("../../middleware/errorMiddleware.js");

const favoriteRouter = express.Router();

favoriteRouter.get("/favoriteGroup", jwtMiddleware, async (req, res, next) => {
    try {
        const docFavorites = await db("doc_favorite_group").select("*").where({ user_id: req.user.id });

        return res.send(docFavorites);
    } catch (error) {
        next(new InternalServerError(500, "创建失败！", error.message))
    }
});

favoriteRouter.post("/createFavoriteGroup", jwtMiddleware, async (req, res, next) => {
    const { name, desc } = req.body;

    try {
        await db("doc_favorite_group").insert({ name, desc, user_id: req.user.id, });

        return res.status(200).send({ msg: "创建成功！" })
    } catch (error) {
        next(new InternalServerError(500, "创建失败！", error.message))
    }
});

module.exports = favoriteRouter