
require("./src/lib/env.js")
const express = require("express");
const cors = require("cors");

const loginRouter = require("./src/router/login.js");
const userRouter = require("./src/router/user.js");

const initTables = require("./src/schema/index.js");
initTables();

const app = express();

app.use(cors())
app.use(express.json())
app.use("/api", loginRouter)
app.use("/api", userRouter)


app.listen(3000, () => {
    console.log("服务器已启动在 3000 端口");
})