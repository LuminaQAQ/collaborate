const express = require("express");

const { sign, verify } = require("jsonwebtoken");
const jwtMiddleware = require("../middleware/jwtMiddleware");
const db = require("../lib/db");
const { InternalServerError } = require("../middleware/errorMiddleware");
const redis = require("../lib/redis");
const shareRouter = express.Router();

// TODO: 重构邀请路由
shareRouter.post("/bookJoinURL", jwtMiddleware, async (req, res, next) => {
  try {
    const { bookToken } = req.body;
    const { email } = req.user;

    const isValid = verify(bookToken, "book-share-token");
    if (!isValid) return res.status(404).send({ error: "邀请链接无效" });

    const { book_id, role } = isValid;
    const token = await redis.get(
      `book:share:token:${isValid.role}:${book_id}`
    );
    if (!token) return res.status(404).send({ error: "邀请链接无效" });

    const [result] = await db("users").select("id").where({ email });
    const hasPermission = await db("book_permissions")
      .select("*")
      .where({ book_id, user_id: result.id });
    const data = { msg: "ok", user: isValid.email, book_id };
    if (hasPermission.length > 0) {
      if (hasPermission[0].permission !== role)
        await db("book_permissions")
          .update({ permission: role })
          .where({ book_id, user_id: result.id });

      return res.status(200).send(data);
    }

    await db("book_permissions").insert({
      book_id,
      user_id: result.id,
      permission: role,
    });

    return res.status(200).send(data);
  } catch (error) {
    return next(new InternalServerError(500, "获取失败！", error.message));
  }
});

module.exports = shareRouter;
