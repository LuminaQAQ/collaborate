const express = require("express");
const db = require("../lib/db");

const jwtMiddleware = require("../middleware/jwtMiddleware");
const { InternalServerError } = require("../middleware/errorMiddleware");
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

    return res.status(200).send({ msg: "ok", bookList, email });
  } catch (error) {
    return next(new InternalServerError(500, "获取失败！", error.message));
  }
});

// 创建文档库
bookRouter.post("/createBook", jwtMiddleware, async (req, res, next) => {
  const { email } = req.user;
  const { name, description } = req.body;

  try {
    const [result] = await db("users").select("id").where({ email });

    const [book_id] = await db("books").insert({
      name,
      description,
      creator_id: result.id,
    });
    await db("book_permissions").insert({
      book_id,
      user_id: result.id,
      permission: "owner",
    });

    return res.status(200).send({
      msg: "创建成功！",
    });
  } catch (error) {
    return next(new InternalServerError(500, "创建失败！", error.message));
  }
});

module.exports = bookRouter;
