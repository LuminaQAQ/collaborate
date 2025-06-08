const express = require("express");

const db = require("../../lib/db");
const redis = require("../../lib/redis");

const jwtMiddleware = require("../../middleware/jwtMiddleware");
const { InternalServerError } = require("../../middleware/errorMiddleware");
const { useDeepSeek } = require("../../lib/AIModel");

const AIRouter = express.Router();

const formatPrompt = (prompt, content) => {
  return `指令：${prompt}\n文档内容：${content}。`;
};

AIRouter.post("/chat", jwtMiddleware, async (req, res, next) => {
  const { prompt, content } = req.body;

  try {
    const chatResult = await useDeepSeek(formatPrompt(prompt, content));

    return res.json({ response: chatResult });
  } catch (error) {
    next(new InternalServerError(500, "失败！", error.message));
  }
});

module.exports = AIRouter;
