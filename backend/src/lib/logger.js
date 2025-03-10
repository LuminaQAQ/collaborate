const log4js = require("log4js")

log4js.configure({
    appenders: {
        out: { type: "console" },
        file: {
            filename: ""
        }
    },
    categories: {

    }
})