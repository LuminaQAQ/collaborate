const express = require("express");
const db = require("../../lib/db.js");

const jwtMiddleware = require("../../middleware/jwtMiddleware.js");
const { InternalServerError } = require("../../middleware/errorMiddleware.js");

const favoriteRouter = express.Router();

// 获取收藏夹
favoriteRouter.get("/favoriteGroup", jwtMiddleware, async (req, res, next) => {
  try {
    const docFavorites = await db("favorite_group")
      .select("*")
      .where({ user_id: req.user.id });

    return res.send(docFavorites);
  } catch (error) {
    next(new InternalServerError(500, "创建失败！", error.message));
  }
});

// 创建收藏夹
favoriteRouter.post(
  "/createFavoriteGroup",
  jwtMiddleware,
  async (req, res, next) => {
    const { name, desc } = req.body;

    try {
      await db("favorite_group").insert({
        name,
        desc,
        user_id: req.user.id,
      });

      return res.status(200).send({ msg: "创建成功！" });
    } catch (error) {
      next(new InternalServerError(500, "创建失败！", error.message));
    }
  }
);

// 添加到收藏夹
favoriteRouter.post("/addToFavorite", jwtMiddleware, async (req, res, next) => {
  const { favorite_group_id, target_id, target_type } = req.body;

  try {
    await db("favorites").insert({
      user_id: req.user.id,
      group_id: favorite_group_id || null,
      target_id,
      target_type,
    });

    return res.status(200).send({ msg: "添加成功！" });
  } catch (error) {
    next(new InternalServerError(500, "添加失败！", error.message));
  }
});

// 取消收藏
favoriteRouter.post("/delFavorite", jwtMiddleware, async (req, res, next) => {
  const { target_id, target_type } = req.body;

  try {
    await db("favorites")
      .where({
        user_id: req.user.id,
        target_id,
        target_type,
      })
      .del();

    return res.status(200).send({ msg: "取消成功！" });
  } catch (error) {
    next(new InternalServerError(500, "取消失败！", error.message));
  }
});

module.exports = favoriteRouter;
