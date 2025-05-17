const db = require("../lib/db");
const { InternalServerError } = require("./errorMiddleware");

const stategies = {
  /**
   * 查询文档库权限
   * @param {String} book_id
   * @param {String} user_id
   * @returns
   */
  Book: (book_id, user_id) =>
    new Promise(async (resolve, reject) => {
      const [permission] = await db("book_permissions").select("*").where({
        book_id,
        user_id,
      });

      if (!permission) reject();

      resolve(permission);
    }),
  /**
   * 查询文档权限
   * @param {String} doc_id
   * @param {String} user_id
   * @returns
   */
  Doc: (doc_id, user_id) =>
    new Promise(async (resolve, reject) => {
      const [docPermission] = await db("doc_permissions").select("*").where({
        doc_id,
        user_id,
      });

      if (docPermission) resolve({ role: `doc:${docPermission.permission}` });

      const [{ book_id }] = await db("docs")
        .select("book_id")
        .where({ id: doc_id });

      const bookPermission = await stategies.Book(book_id, user_id);

      if (bookPermission)
        resolve({ role: `book:${bookPermission.permission}` });

      reject(false);
    }),
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const sharePermissionMiddleware = async (req, res, next) => {
  const { target_type, target_id } = req.query || req.params;

  try {
    const permission = await stategies[target_type](target_id, req.user.id);
    if (!permission) return res.status(403).send({ error: "权限不足！" });

    req.user.role = permission.role;
    next();
  } catch (error) {
    next(new InternalServerError(500, "分享权限校验失败", error.message));
  }
};

module.exports = sharePermissionMiddleware;
