const { serviceDebug } = require("../lib/logger");

class InternalServerError extends Error {
    /**
     * @param {string} error 返回数据中的错误信息 
     * @param {number} status 返回数据中的错误码
     */
    constructor(error, status = 500) {
        super();
        this.error = error;
        this.status = status;
    }
}

/**
 * `jwt` 错误中间件
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const errorMiddleware = (err, req, res, next) => {
    const { status, error, stack } = err;

    serviceDebug(req?.user?.email || "", "", stack)

    return res.status(status).send({ error })
}

module.exports = { InternalServerError, errorMiddleware };