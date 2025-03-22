const whiteList = ["localhost"]

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const preventHotLinking = (req, res, next) => {
    const referer = req.get("referer");

    if (referer) {
        const { hostname } = new URL(referer);
        if (!whiteList.includes(hostname)) return res.status(403).send("forbidden")
    }

    next();
}

module.exports = preventHotLinking;