const express = require("express");

const db = require("../../lib/db");
const redis = require("../../lib/redis");

const jwtMiddleware = require("../../middleware/jwtMiddleware");
const { InternalServerError } = require("../../middleware/errorMiddleware");

const AIRouter = express.Router();


// TODO: DeepSeek Example
AIRouter.post("/test", jwtMiddleware, async (req, res, next) => {
  const { favorite_group_id, offset, limit, q } = req.query;

  try {
    // return res.json();
  } catch (error) {
    next(new InternalServerError(500, "失败！", error.message));
  }
});

module.exports = AIRouter;
