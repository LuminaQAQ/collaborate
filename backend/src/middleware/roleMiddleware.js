const db = require("../lib/db");
const { InternalServerError } = require("./errorMiddleware");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const bookPermissionMiddleware = async (req, res, next) => {
  const book_id = req.query.book_id || req.params.book_id;

  // 校验用户权限
  try {
    const [permission] = await db("book_permissions")
      .join("users", "book_permissions.user_id", "users.id")
      .select(["book_permissions.*", "users.email"])
      .where({ "book_permissions.book_id": book_id, user_id: req.user.id });

    if (!permission) return res.status(403).send({ error: "权限不足！" });

    req.user.role = `book:${permission.permission}`;
    next();
  } catch (error) {
    next(new InternalServerError(500, "文档列表获取失败！", error.message));
  }
};

module.exports = bookPermissionMiddleware;
