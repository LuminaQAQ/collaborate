const socketIoErrorMiddleware = (socket, next) => {
    next(new Error("未授权"));
}

module.exports = socketIoErrorMiddleware;