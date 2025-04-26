const { Socket } = require("socket.io");
const jwtConfigs = require("../../configs/jwt.d.js");
const jwt = require("jsonwebtoken");
const redis = require("../../lib/redis");
const generateHash = require("../../utils/generateHash");

/**
 * 
 * @param {Socket} socket 
 * @param {import("express").NextFunction} next 
 */
const socketIoTokenVerifyMiddleware = async (socket, next) => {
    const token = socket.handshake.auth.token;

    const redisToken = await redis.get(`user:jwt:${token}`);
    if (!redisToken) return socket.disconnect();

    const SECRET_KEY = generateHash(jwtConfigs.options.secret);
    const decode = jwt.verify(token, SECRET_KEY);
    if (!decode) return socket.disconnect();

    socket.user = decode;
    next();
}

module.exports = socketIoTokenVerifyMiddleware;