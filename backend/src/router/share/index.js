const express = require("express");
const { sign, verify } = require("jsonwebtoken");

const db = require("../../lib/db");
const redis = require("../../lib/redis");

const jwtMiddleware = require("../../middleware/jwtMiddleware");
const sharePermissionMiddleware = require("../../middleware/sharePermissionMiddleware");
const { InternalServerError } = require("../../middleware/errorMiddleware");

const shareRouter = express.Router();
/**
 * 处理分享链接的角色分配
 * @param {1|2} role
 * @returns {"viewer"|"editor"} role
 */
const handleRole = (role) => {
  return role && Number(role) === 2 ? "editor" : "viewer";
};

/**
 * 获取redis分享链接缓存
 * @param {Object} param0
 * @param {'Book'|'Doc'} param0.target_type
 * @param {String|Number} param0.target_id
 * @param {"viewer"|"editor"} param0.role
 * @returns {Promise<String>}
 */
const getRedisShareToken = async ({ target_type, target_id, role }) => {
  const token = await redis.get(
    `${target_type}:share:token:${handleRole(role)}:${target_id}`
  );

  return token;
};

/**
 * 生成redis分享链接缓存
 * @param {Object} param0
 * @param {Object} param0.target_type
 * @param {String|Number} param0.target_id
 * @param {"viewer"|"editor"} param0.role
 * @param {String} param0.email
 * @returns {Promise<String>}
 */
const generateShareToken = async ({ target_type, target_id, role }, email) => {
  const token = sign(
    {
      target_id,
      target_type,
      email,
      role: handleRole(role),
    },
    `${target_type}-share-token`,
    { expiresIn: "24h" }
  );

  await redis.set(
    `${target_type}:share:token:${handleRole(role)}:${target_id}`,
    token,
    "EX",
    24 * 60 * 60
  );

  return token;
};

// 获取分享链接
shareRouter.get(
  "/getJoinURL",
  jwtMiddleware,
  sharePermissionMiddleware,
  async (req, res, next) => {
    try {
      const { email } = req.user;

      const tokenCache = await getRedisShareToken(req.query);

      if (tokenCache)
        return res.status(200).send({
          msg: "ok",
          token: tokenCache,
        });

      const token = await generateShareToken(req.query, email);

      return res.status(200).send({
        msg: "ok",
        token,
      });
    } catch (error) {
      return next(new InternalServerError(500, "获取失败！", error.message));
    }
  }
);

// TODO: 重写链接加入
shareRouter.post("/urlJoin", jwtMiddleware, async (req, res, next) => {
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
