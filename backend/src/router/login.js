const express = require("express");
const { readFileSync } = require("fs");
const { join } = require("path");

const redis = require("../lib/redis.js")
const db = require("../lib/db.js");
const mailer = require("../lib/mailer.js")
const { serviceDebug } = require("../lib/logger.js")

const mailerConfigs = require("../configs/mailer.d.js");

const loginRouter = express.Router();

loginRouter.post("/login", (req, res) => {
    const { account, pwd } = req.body;
})

loginRouter.post("/verifyCode", (req, res) => {
    const { email } = req.body;

    const REDIS_CODE_KEY = `sms:code:${email}`;

    const LOTTERY_KEY = `sms:code:${email}-lottery`;
    const LIMIT_COUNT = 3;
    const EX_TIME = 60;

    redis.eval(readFileSync(join(__dirname, "../lib/lottery.lua")), 1, LOTTERY_KEY, LIMIT_COUNT, EX_TIME, (err, result) => {
        if (err) {
            serviceDebug(email, __filename, err)
            return res.status(500).send({ msg: "发送失败！" })
        }

        if (result) {
            const randCode = Math.ceil(Math.random() * Math.pow(10, 6));
            redis.set(REDIS_CODE_KEY, randCode);
            redis.expire(REDIS_CODE_KEY, 180)

            mailer.sendMail({
                from: mailerConfigs.auth.user,
                to: email,
                subject: "协作平台--登录保护验证",
                text: `本次请求的验证码为：${randCode}，验证码3分钟内有效。`
            }).then().catch(err => {
                serviceDebug(email, __filename, err);

                return res.status(500).send({ msg: "发送失败！" })
            })
        } else {
            return res.send({ msg: "发送过于频繁！" })
        }
    });


})

loginRouter.post("/register", async (req, res) => {
    const { email, pwd, code } = req.body;

    try {
        const verifyCode = await redis.get(`sms:code:${email}`)
    } catch (error) { serviceDebug(email, __filename, error) }

    console.log(req.body);
    db("users").insert()
})

module.exports = loginRouter;