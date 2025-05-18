const express = require("express");

const db = require("../../lib/db");
const redis = require("../../lib/redis");

const jwtMiddleware = require("../../middleware/jwtMiddleware");
const sharePermissionMiddleware = require("../../middleware/sharePermissionMiddleware");
const { InternalServerError } = require("../../middleware/errorMiddleware");

const shareRouter = express.Router();

/**
 * @typedef {(target_id: Number, user_info: Object) => {}} inviteeJoinFunction
 */

/**
 * 处理邀请者加入的策略
 * @typedef {Object} inviteeJoinStrategies
 * @property {inviteeJoinFunction} update
 * @property {inviteeJoinFunction} insert
 */

/**
 * @typedef {'Doc'|'Book'} TargetType
 * @typedef {'viewer'|'editor'} Role
 */
/**
 * 邀请链接的token所带有的载荷
 * @typedef {Object} SharePayload
 * @property {Number} target_id
 * @property {TargetType} target_type
 * @property {String} email
 * @property {Role} role
 */

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
 * @param {SharePayload} param0
 * @returns {Promise<String>}
 */
const getRedisShareToken = async ({ target_type, target_id, role }) => {
  const token = await redis.get(
    `${target_type}:share:${handleRole(role)}:${target_id}`
  );

  if (token) return JSON.parse(token).token;
  return null;
};

const generateSharePayloadStrategy = {
  /**
   * @param {SharePayload} payload
   */
  Book: async (payload) => payload,
  /**
   * @param {SharePayload} payload
   */
  Doc: async (payload) => {
    const [{ book_id }] = await db("docs")
      .select("book_id")
      .where({ id: payload.target_id });

    return {
      ...payload,
      book_id,
    };
  },
};
/**
 * 生成redis分享链接缓存
 * @param {SharePayload} param0
 * @param {String} email
 * @returns {Promise<String>}
 */
const generateShareToken = async ({ target_type, target_id, role }, email) => {
  target_id = Number(target_id);
  const nanoid = await import("nanoid").then((module) => {
    return module.nanoid;
  });

  const token = nanoid();
  const EX = 24 * 60 * 60;
  const payload = await generateSharePayloadStrategy[target_type]({
    target_id,
    target_type,
    email,
    role: handleRole(role),
  });

  await redis.set(`share:${token}`, JSON.stringify(payload), "EX", EX);

  await redis.set(
    `${target_type}:share:${handleRole(role)}:${target_id}`,
    JSON.stringify({ token, ...payload }),
    "EX",
    EX
  );

  return token;
};

/**
 * 校验分享token
 * @param {String} token
 * @returns {Promise<SharePayload>}
 */
const verifyShareToken = async (token) => {
  const payload = await redis.get(`share:${token}`);

  if (payload) return JSON.parse(payload);
  return null;
};

// 检查链接分享者自身的权限
const checkPermissonStrategies = {
  Book: async (book_id, user_id) => {
    const [hasPermission] = await db("book_permissions").select("*").where({
      book_id,
      user_id,
    });

    return hasPermission;
  },
  Doc: async (doc_id, user_id) => {
    const [hasPermission] = await db("doc_permissions").select("*").where({
      doc_id,
      user_id,
    });

    return hasPermission;
  },
};

/**
 * 处理完成加入后返回给前端的信息
 * @param {SharePayload} sharePayload
 * @returns
 */
const handleReturnInviteeJoinDataStrategies = {
  Book: (sharePayload) => {
    const { role, target_id, target_type } = sharePayload;
    return {
      book_id: target_id,
      target_type,
      permission: role,
    };
  },
  Doc: (sharePayload) => {
    const { role, target_id, target_type, book_id } = sharePayload;
    return {
      book_id,
      doc_id: target_id,
      target_type,
      permission: role,
    };
  },
};

// 处理邀请者加入的策略
const handleInviteeJoinStrategies = {
  /**
   * @param {SharePayload} sharePayload
   * @param {Object} hasPermission
   * @returns {inviteeJoinStrategies}
   */
  Book: (sharePayload, hasPermission) => {
    const { role } = sharePayload;
    const data = handleReturnInviteeJoinDataStrategies.Book(sharePayload);

    return {
      update: async (target_id, user_id) => {
        const { permission } = hasPermission;

        if (permission !== role)
          await db("book_permissions")
            .update({ permission: role })
            .where({ book_id: target_id, user_id });

        return data;
      },
      insert: async (target_id, user_id) => {
        await db("book_permissions").insert({
          book_id: target_id,
          user_id,
          permission: role,
        });

        return data;
      },
    };
  },
  /**
   * @param {SharePayload} sharePayload
   * @param {Object} hasPermission
   * @returns {inviteeJoinStrategies}
   */
  Doc: (sharePayload, hasPermission) => {
    const { role } = sharePayload;
    const data = handleReturnInviteeJoinDataStrategies.Doc(sharePayload);

    return {
      update: async (target_id, user_id) => {
        const { permission } = hasPermission;

        if (permission !== role)
          await db("doc_permissions")
            .update({ permission: role })
            .where({ doc_id: target_id, user_id });

        return data;
      },
      insert: async (target_id, user_id) => {
        await db("doc_permissions").insert({
          doc_id: target_id,
          user_id,
          permission: role,
        });

        return data;
      },
    };
  },
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

// 通过链接加入
shareRouter.post("/urlJoinToShare", jwtMiddleware, async (req, res, next) => {
  try {
    const { token } = req.body;
    const { email } = req.user;

    const payload = await verifyShareToken(token);
    if (!payload) return res.status(404).send({ error: "邀请链接无效" });

    const shareOwner = payload.email;
    if (email === shareOwner)
      return res.status(404).send({ error: "不能邀请自己" });

    const { target_id, target_type, role } = payload;
    const [user_info] = await db("users")
      .select(["id as user_id", "email", "username", "avatar"])
      .where({ email });
    const hasPermission = await checkPermissonStrategies[target_type](
      target_id,
      user_info.user_id
    );

    const handler = handleInviteeJoinStrategies[target_type](
      payload,
      hasPermission
    );

    const data = await handler[hasPermission ? "update" : "insert"](
      target_id,
      user_info.user_id
    );

    return res.status(200).send({ target_user: shareOwner, ...data });
  } catch (error) {
    return next(new InternalServerError(500, "获取失败！", error.message));
  }
});

module.exports = shareRouter;
