const multer = require("multer");
const path = require("path");
const generateHash = require("../utils/generateHash");
const { existsSync, mkdirSync } = require("fs");

const dir = path.join(process.cwd(), "/uploads");
const dirIsExists = existsSync(dir);
if (!dirIsExists) mkdirSync(dir)


const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, dir)
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname)
        const name = generateHash(Date.now().toString(), "hex");

        cb(null, name + ext)
    }
})

const upload = multer({ storage })

module.exports = upload;