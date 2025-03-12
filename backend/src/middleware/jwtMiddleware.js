const jwt = require("jsonwebtoken");
const jwtConfigs = require("../configs/jwt.d.js");
const generateHash = require("../utils/generateHash.js");

/**
 * `token` 验证
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const jwtMiddleware = (req, res, next) => {
    const ary = req.headers["authorization"]?.split(" ");

    if (ary[0] === "Bearer" && ary[1]) {
        const token = ary[1]?.trim();

        if (!token) return res.status(401).send({ error: "未授权！" });

        const SECRET_KEY = generateHash(jwtConfigs.options.secret);

        jwt.verify(token, SECRET_KEY, (err, decode) => {
            if (err) return res.status(401).send({ error: "未授权！" })

            req.user = decode;
            next();
        })
    } else return res.status(401).send({ error: "未授权！" });

}

module.exports = jwtMiddleware;