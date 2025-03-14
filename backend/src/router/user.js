const express = require("express");
const jwtMiddleware = require("../middleware/jwtMiddleware");
const db = require("../lib/db");
const { serviceDebug } = require("../lib/logger");

const crypto = require("node:crypto");

const userRouter = express.Router();

userRouter.get("/home", jwtMiddleware, async (req, res) => {
    const { email } = req.user;

    try {
        const [result] = await db("users").select(["username", "avatar"]).where({ email });

        console.log(result);

        // console.log(crypto.randomUUID().split("-").join().slice(0, 6));

        return res.status(200).send({})

    } catch (error) {
        serviceDebug(error);
        return res.status(500).send({ error: "数据查询失败！" })
    }

})

module.exports = userRouter;