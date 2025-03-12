const jwt = require("jsonwebtoken");
const jwtConfigs = require("../configs/jwt.d.js");
const generateHash = require("../utils/generateHash.js");
const { serviceDebug } = require("../lib/logger.js");
const redis = require("../lib/redis.js");

/**
 * `token` 验证
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const jwtMiddleware = async (req, res, next) => {
    const ary = req.headers["authorization"]?.split(" ");

    if (ary[0] === "Bearer" && ary[1]) {
        const token = ary[1]?.trim();

        if (!token) return res.status(401).send({ error: "token未携带！" });

        const SECRET_KEY = generateHash(jwtConfigs.options.secret);

        try {
            const redisToken = await redis.get(token);

            if (!redisToken) return res.status(401).send({ error: "token已失效!" })

            const decode = jwt.verify(token, SECRET_KEY);
            req.user = decode;
            next();
        } catch (error) {
            serviceDebug(req.user?.email, __filename, error);
            return res.status(401).send({ error: "未授权！" });
        }

    } else return res.status(401).send({ error: "token未携带或格式错误！" });

}

module.exports = jwtMiddleware;