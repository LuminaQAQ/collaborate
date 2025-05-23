const express = require("express");
const db = require("../../lib/db.js");

const jwtMiddleware = require("../../middleware/jwtMiddleware.js");
const { InternalServerError } = require("../../middleware/errorMiddleware.js");
const { set } = require("../../lib/redis.js");

const favoriteRouter = express.Router();

// 获取收藏夹
favoriteRouter.get("/favoriteGroup", jwtMiddleware, async (req, res, next) => {
  try {
    const docFavorites = await db("favorite_group")
      .select([
        "favorite_group.*",
        db("favorites")
          .count("*")
          .whereRaw("favorites.group_id = favorite_group.id")
          .as("count"),
      ])
      .where({ user_id: req.user.id });

    const [allCollection] = await db("favorites").count("* as count");
    allCollection.name = "全部收藏";
    allCollection.id = 0;
    docFavorites.unshift(allCollection);

    return res.send(docFavorites);
  } catch (error) {
    next(new InternalServerError(500, "创建失败！", error.message));
  }
});

/**
 *
 * @param {Array} favoriteList
 * @returns
 */
const handleFavoritesInfo = async (favoriteList) => {
  const books = favoriteList.filter((item) => item.target_type === "Book");
  const docs = favoriteList.filter((item) => item.target_type === "Doc");

  return new Promise(async (resolve, reject) => {
    for (const item of books) {
      item.target_info = await db("books")
        .select(["books.*", "users.email", "books.name as title"])
        .join("users", "books.creator_id", "users.id")
        .where("books.id", item.target_id)
        .first();
    }
    for (const item of docs) {
      item.target_info = await db("docs")
        .select([
          "docs.id",
          "docs.title",
          "docs.book_id",
          "docs.creator_id",
          "docs.created_at",
          "users.email",
        ])
        .join("users", "docs.creator_id", "users.id")
        .where("docs.id", item.target_id)
        .first();
    }

    resolve(
      [...books, ...docs].sort((a, b) => {
        return a.created_at - b.created_at;
      })
    );
  });
};

// 获取收藏夹中的文档
favoriteRouter.get("/favoriteList", jwtMiddleware, async (req, res, next) => {
  const { favorite_group_id, offset, limit, q } = req.query;

  try {
    // TODO: 获取收藏夹中的文档和库

    let whereQuery = { user_id: req.user.id };
    if (Number(favorite_group_id) !== 0) {
      Object.assign(whereQuery, { group_id: favorite_group_id });
    }

    let favoriteList = await db("favorites")
      .select(["*"])
      .where(whereQuery)
      .offset(offset)
      .limit(limit);

    const result = await handleFavoritesInfo(favoriteList);
    const searchRes = result.filter((item) => {
      const { title } = item.target_info;

      return title.includes(q);
    });

    return res.json(searchRes);
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

// 修改收藏夹
favoriteRouter.post(
  "/updateFavoriteGroup",
  jwtMiddleware,
  async (req, res, next) => {
    const { id, name, desc } = req.body;
    try {
      await db("favorite_group")
        .update({
          name,
          desc,
        })
        .where({ id, user_id: req.user.id });

      return res.status(200).send({ msg: "更新成功！" });
    } catch (error) {
      next(new InternalServerError(500, "更新失败！", error.message));
    }
  }
);

favoriteRouter.post(
  "/delFavoriteGroup",
  jwtMiddleware,
  async (req, res, next) => {
    const { id } = req.body;

    try {
      await db("favorite_group")
        .delete()
        .where({ id: req.body.id, user_id: req.user.id });

      return res.status(200).send({ msg: "删除成功！" });
    } catch (error) {
      next(new InternalServerError(500, "删除失败！", error.message));
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
