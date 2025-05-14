const express = require("express");
const db = require("../../lib/db.js");

const jwtMiddleware = require("../../middleware/jwtMiddleware.js");
const { InternalServerError } = require("../../middleware/errorMiddleware.js");

const favoriteRouter = express.Router();

// 获取收藏夹
favoriteRouter.get("/favoriteGroup", jwtMiddleware, async (req, res, next) => {
    try {
        const docFavorites = await db("doc_favorite_group").select("*").where({ user_id: req.user.id });

        return res.send(docFavorites);
    } catch (error) {
        next(new InternalServerError(500, "创建失败！", error.message))
    }
});

// 创建收藏夹
favoriteRouter.post("/createFavoriteGroup", jwtMiddleware, async (req, res, next) => {
    const { name, desc } = req.body;

    try {
        await db("doc_favorite_group").insert({ name, desc, user_id: req.user.id, });

        return res.status(200).send({ msg: "创建成功！" })
    } catch (error) {
        next(new InternalServerError(500, "创建失败！", error.message))
    }
});

// 添加到收藏夹
favoriteRouter.post("/addToFavorite", jwtMiddleware, async (req, res, next) => {
    const { doc_id, favorite_group_id } = req.body;

    try {
        await db("doc_favorite").insert({ doc_id, favorite_group_id, });

        return res.status(200).send({ msg: "添加成功！" })
    } catch (error) {
        next(new InternalServerError(500, "添加失败！", error.message))
    }
})

module.exports = favoriteRouter