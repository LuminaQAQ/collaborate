const log4js = require("log4js")
const path = require("path")

log4js.configure({
    appenders: {
        out: { type: "console" },
        dateFile: {
            type: "file",
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            filename: path.join(__dirname, "../logs/server"),
        }
    },
    categories: {
        default: {
            appenders: ["out", "dateFile"],
            level: "debug"
        },
        error: {
            appenders: ["out", "dateFile"],
            level: "error"
        }
    }
})

const logger = log4js.getLogger("default");
/**
 * 
 * @param {any} user 用户标志
 * @param {string} filePath 错误来源文件
 * @param {Error} err 错误
 */
const serviceDebug = (user, filePath, err) => {
    logger.debug(`user: '${user}'\nfilePath: ${filePath}\n${err}`)
}

module.exports = { serviceDebug }

// if (process.env.NODE_ENV === "dev") {
//     module.exports = log4js.getLogger("default")
// } else {
//     module.exports = log4js.getLogger("error")
// }