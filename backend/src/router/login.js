const express = require("express");
const { readFileSync } = require("fs");
const { join } = require("path");
const crypto = require("node:crypto")
const jwt = require("jsonwebtoken")

const redis = require("../lib/redis.js")
const db = require("../lib/db.js");
const mailer = require("../lib/mailer.js")
const { serviceDebug } = require("../lib/logger.js")
const { generateRedisSMSCodeKey, generateRedisSMSCodeLotteryKey } = require("../utils/generateRedisKey.js");

const mailerConfigs = require("../configs/mailer.d.js");
const jwtConfigs = require("../configs/jwt.d.js");
const generateHash = require("../utils/generateHash.js");
const jwtMiddleware = require("../middleware/jwtMiddleware.js");

const loginRouter = express.Router();

loginRouter.post("/login", async (req, res) => {
    const { email, pwd } = req.body;

    try {
        const password_hash = generateHash(pwd);
        const userIsExists = await db("users").select("*").where({ email, password_hash });
        if (!userIsExists.length) return res.status(401).send({ error: "邮箱或密码错误！" });

        const EX_TIME = 2 * 60 * 60;
        const jwtSecretKey = generateHash(jwtConfigs.options.secret);

        const payload = { email };
        const token = jwt.sign(payload, jwtSecretKey, { expiresIn: EX_TIME });
        await redis.set(token, 1, "EX", EX_TIME);

        const [userinfo] = userIsExists;

        return res.status(200).send({
            token,
            username: userinfo.username,
            avatar: userinfo.avatar,
            created_at: new Date(userinfo.created_at).toISOString().slice(0, 10)
        });
    } catch (error) {
        serviceDebug(email, __filename, error);
        return res.status(500).send({ error: "登录失败！" })
    }
})

loginRouter.post("/verifyCode", async (req, res) => {
    const { email } = req.body;

    try {
        const result = await db("users").select("email").where({ email })
        if (result.length) return res.status(400).send({ error: "账号已存在！" })
    } catch (err) {
        serviceDebug(email, __filename, err);
        return res.status(500).send({ error: "注册失败！" });
    }

    const REDIS_CODE_KEY = generateRedisSMSCodeKey(email);
    const LOTTERY_KEY = generateRedisSMSCodeLotteryKey(email);
    const LIMIT_COUNT = 3;
    const EX_TIME = 60;

    redis.eval(readFileSync(join(__dirname, "../lib/lottery.lua")), 1, LOTTERY_KEY, LIMIT_COUNT, EX_TIME, (err, result) => {
        if (err) {
            serviceDebug(email, __filename, err)
            return res.status(500).send({ error: "发送失败！" })
        }

        if (result) {
            const randCode = Math.ceil(Math.random() * Math.pow(10, 6));
            redis.set(REDIS_CODE_KEY, randCode);
            redis.expire(REDIS_CODE_KEY, 5 * 60)

            mailer.sendMail({
                from: mailerConfigs.auth.user,
                to: email,
                subject: "协作平台--登录保护验证",
                text: `本次请求的验证码为：${randCode}，验证码5分钟内有效。`
            }).then(() => {
                return res.status(200).send({ msg: "验证码已发送" })
            }).catch(err => {
                serviceDebug(email, __filename, err);

                return res.status(500).send({ error: "发送失败！" })
            })
        } else {
            return res.status(429).send({ error: "发送过于频繁！" })
        }
    });
})

loginRouter.post("/register", async (req, res) => {
    const { email, pwd, code } = req.body;

    try {
        const result = await db("users").select("email").where({ email })
        if (result.length) return res.status(400).send({ error: "账号已存在！" })
    } catch (err) {
        serviceDebug(email, __filename, err);
        return res.status(500).send({ error: "注册失败！" });
    }

    try {
        const REDIS_CODE_KEY = generateRedisSMSCodeKey(email);
        const LOTTERY_KEY = generateRedisSMSCodeLotteryKey(email);

        const verifyCode = await redis.get(REDIS_CODE_KEY)
        if (verifyCode !== code) return res.status(400).send({ error: "验证码错误或已过期！" })

        const password_hash = generateHash(pwd);

        const isSuccess = await db("users").insert({ email, password_hash, username: "用户_" + crypto.randomUUID().split("-").join().slice(0, 6) });
        await redis.del(REDIS_CODE_KEY);
        await redis.del(LOTTERY_KEY);
        return res.status(200).send({ msg: "注册成功！" });
    } catch (error) {
        serviceDebug(email, __filename, error);
        return res.status(500).send({ error: "注册失败！" })
    }

})

loginRouter.post("/logout", jwtMiddleware, async (req, res) => {
    const token = req.headers["authorization"].split(" ")[1];
    try {
        await redis.del(token)
    } catch (error) {
        serviceDebug(req.user.email, __filename, error)
        return res.status(500).send({ error: "退出失败！" })
    }

    return res.send({ msg: "退出成功！" })
})

module.exports = loginRouter;