const express = require("express");
const jwtMiddleware = require("../middleware/jwtMiddleware");
const db = require("../lib/db");
const { serviceDebug } = require("../lib/logger");

const userRouter = express.Router();

userRouter.get("/home", jwtMiddleware, async (req, res) => {
    const { email } = req.user;

    try {
        const [result] = await db("users").select(["username", "avatar"]).where({ email });

        return res.status(200).send(result);

    } catch (error) {
        serviceDebug(error);
        return res.status(500).send({ error: "数据查询失败！" })
    }

})

module.exports = userRouter;