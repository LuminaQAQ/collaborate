const crypto = require("crypto");

/**
 * 生成 `hash` 值
 * @param {string | any} text 需要被加密的值
 * @param {"binary" | "hex" | "base64" | "base64url"} encoding `hash` 解码
 * @returns 
 */
const generateHash = (text, encoding = "hex") => {
    const hash = crypto.createHash("md5");
    hash.update(text);

    return hash.digest(encoding)
}

module.exports = generateHash;