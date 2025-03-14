const express = require("express");
const os = require("node:os")

const db = require("../lib/db");
const { serviceDebug } = require("../lib/logger");

const jwtMiddleware = require("../middleware/jwtMiddleware");

const homeRouter = express.Router();

homeRouter.get("/home", jwtMiddleware, async (req, res) => {
    const { email } = req.user;

    try {
        const [userResult] = await db("users").select(["id", "username", "avatar"]).where({ email });
        const recentDocs = await db("docs").select(["title"]).where({ creator_id: userResult.id }).orderBy("updated_at", "desc")
        // const 
        // console.log(os.totalmem(), os.freemem());
        console.log(recentDocs);


        return res.status(200).send({
            user: userResult
        });
    } catch (error) {
        serviceDebug(error);
        return res.status(500).send({ error: "数据查询失败！" })
    }

})

module.exports = homeRouter;