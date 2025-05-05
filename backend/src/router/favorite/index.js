const express = require("express");
const db = require("../../lib/db.js");
const { serviceDebug } = require("../../lib/logger.js");

const jwtMiddleware = require("../../middleware/jwtMiddleware.js");

const favoriteRouter = express.Router();

favoriteRouter.get("/favoriteGroup", jwtMiddleware, async (req, res) => {
    const docFavorites = await db("doc_favorite_group").select("*").where({ user_id: req.user.id });

    return res.send(docFavorites);
});


module.exports = favoriteRouter