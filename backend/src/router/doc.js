const express = require("express");

const jwtMiddleware = require("../middleware/jwtMiddleware");
const db = require("../lib/db");
const { InternalServerError } = require("../middleware/errorMiddleware");

const docRouter = express.Router();

docRouter.post("/createBook", jwtMiddleware, async (req, res, next) => {
    const { email } = req.user;
    const { name, description } = req.body

    try {
        const [result] = await db("users").select("id").where({ email })

        await db("books").insert({ name, description, creator_id: result.id })

        return res.status(200).send({
            msg: "创建成功！"
        })
    } catch (error) {
        return next(new InternalServerError(500, "创建失败！",))
    }

})

module.exports = docRouter;