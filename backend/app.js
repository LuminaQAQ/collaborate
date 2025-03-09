const express = require("express");
const loginRouter = require("./src/router/login");

const initTables = require("./src/schema/index.js")
initTables();

const app = express();

app.use(express.json())
app.use(loginRouter)

app.listen(3000, () => {
    console.log("服务器已启动在 3000 端口");
})