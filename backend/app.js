require("./src/lib/env.js")
const express = require("express");
const cors = require("cors");

const loginRouter = require("./src/router/login.js");
const homeRouter = require("./src/router/home.js");
const docRouter = require("./src/router/doc.js");

const { errorMiddleware } = require("./src/middleware/errorMiddleware.js");

const initTables = require("./src/schema/index.js");
const preventHotLinking = require("./src/middleware/preventHotLinking.js");
initTables();

const app = express();

app.use(preventHotLinking)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use("/files", express.static("./uploads"))
app.use("/api", loginRouter)
app.use("/api", homeRouter)
app.use("/api", docRouter)
app.use(errorMiddleware);

app.listen(3000, () => {
    console.log("服务器已启动在 3000 端口");
})