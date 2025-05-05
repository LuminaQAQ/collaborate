const express = require("express");
const db = require("../../lib/db.js");
const { serviceDebug } = require("../../lib/logger");

const jwtMiddleware = require("../../middleware/jwtMiddleware");

const userRouter = express.Router();

userRouter.get("/info", jwtMiddleware, async (req, res) => {
    const [user] = await db("users").select(["id", "email", "username", "avatar", "created_at"]).where({ id: req.user.id });

    return res.send(user);
});


module.exports = userRouter