const log4js = require("log4js")

log4js.configure({
    appenders: {
        out: { type: "console" },
        dateFile: {
            filename: "../log/",
            level: "error"
        }
    },
    categories: {
        default: {
            type: ["out"],
            level: "debug"
        },
        error: {
            type: ["out", "dateFile"],
            level: "error"
        }
    }
})