const express = require("express");
const db = require("../lib/db");
const zlib = require("zlib");
const { InternalServerError } = require("../middleware/errorMiddleware");
const jwtMiddleware = require("../middleware/jwtMiddleware");
const historyRouter = express.Router();

historyRouter.get("/historyList", jwtMiddleware, async (req, res, next) => {
    const { doc_id } = req.query;

    try {
        const history = await db("docs_version")
            .join("docs", "docs.id", "docs_version.doc_id")
            .join("users", "users.id", "docs_version.creator_id")
            .select([
                "docs_version.id",
                "docs_version.created_at",
                "docs_version.doc_id",
                "docs.title",
                "users.id as user_id",
                "users.username",
                "users.avatar"
            ])
            .where({ doc_id })
            .orderBy("created_at", "desc")

        const list = zlib.gzipSync(JSON.stringify({ list: history }));
        res.setHeader("Content-encoding", "gzip");

        res.send(list);
    } catch (error) {
        next(new InternalServerError(500, "获取历史版本失败", error.message));
    }
});

historyRouter.get("/historyDetail", jwtMiddleware, async (req, res, next) => {
    const { id } = req.query;

    try {
        const [history] = await db("docs_version")
            .join("users", "users.id", "docs_version.creator_id")
            .join("docs", "docs.id", "docs_version.doc_id")
            .select([
                "docs_version.id",
                "docs_version.created_at",
                "docs_version.doc_id",
                "docs_version.content",
                "docs.title",
                "users.username",
                "users.avatar"
            ])
            .where("docs_version.id", id)

        return res.send(history);
    } catch (error) {
        next(new InternalServerError(500, "获取历史版本详情失败", error.message));
    }
});

module.exports = historyRouter;