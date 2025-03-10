const express = require("express");

const db = require("../lib/db.js");
const mailer = require("../lib/mailer.js")
const mailerConfigs = require("../configs/mailer.d.js")

const loginRouter = express.Router();

loginRouter.post("/login", (req, res) => {
    const { account, pwd } = req.body;
})

loginRouter.post("/verifyCode", (req, res) => {
    const { email } = req.body;

    const randCode = Math.ceil(Math.random() * Math.pow(10, 6));

    mailer.sendMail({
        from: mailerConfigs.auth.user,
        to: email,
        subject: "协作平台--登录保护验证",
        text: `本次请求的验证码为：${randCode}，验证码3分钟内有效。`
    }).then().catch(err => {
        console.log(err);

        return res.send({ msg: "发送失败！" })
    })

})

loginRouter.post("/register", (req, res) => {
    const { account, pwd } = req.body;

    console.log(req.body);

})

module.exports = loginRouter;