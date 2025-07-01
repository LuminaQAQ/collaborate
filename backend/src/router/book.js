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
      .join("book_permissions", "book_permissions.book_id", "books.id")
      .select(["books.id", "books.name", "books.description", "users.email"])
      .where({ "book_permissions.user_id": id })
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

// 编辑文档库信息
bookRouter.post("/editBook", jwtMiddleware, async (req, res, next) => {
  const { email } = req.user;
  const { id, name, description } = req.body;

  try {
    await db("books")
      .update({
        name,
        description,
      })
      .where({ id });

    return res.status(200).send({
      msg: "修改成功！",
    });
  } catch (error) {
    return next(new InternalServerError(500, "修改失败！", error.message));
  }
});

// 删除文档库
bookRouter.post("/delBook", jwtMiddleware, async (req, res, next) => {
  const { email } = req.user;
  const { id } = req.body;

  try {
    await db("books").where({ id }).del();

    return res.status(200).send({
      msg: "删除成功！",
    });
  } catch (error) {
    return next(new InternalServerError(500, "删除失败！", error.message));
  }
});

module.exports = bookRouter;
