/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const jwtMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]
    console.log(req.headers);
}

module.exports = jwtMiddleware;