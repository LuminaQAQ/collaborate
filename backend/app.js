// env 文件
require("./src/lib/env.js")()

const express = require("express");
const cors = require("cors");
const http = require("http")

require("./src/ws/index.js")();

const loginRouter = require("./src/router/login.js");
const homeRouter = require("./src/router/home.js");
const bookRouter = require("./src/router/book.js");
const docRouter = require("./src/router/doc.js");
const historyRouter = require("./src/router/history.js");
const userRouter = require("./src/router/user/index.js");

const { errorMiddleware } = require("./src/middleware/errorMiddleware.js");

const initTables = require("./src/schema/index.js");
const preventHotLinking = require("./src/middleware/preventHotLinking.js");
const collectionRouter = require("./src/router/favorite/index.js");

initTables();

const app = express();
const server = http.createServer(app);

app.use(preventHotLinking)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use("/files", express.static("./uploads"))
app.use("/api", loginRouter)
app.use("/api", homeRouter)
app.use("/api", docRouter)
app.use("/api", historyRouter)
app.use("/api", bookRouter)
app.use("/user", userRouter)
app.use("/favorite", collectionRouter);
app.use(errorMiddleware);


require("./src/socket/index")(server)


server.listen(3000, () => {
    console.log("服务器已启动在 3000 端口");
})

// const io = new Server(server, {
//     cors: { origin: "*" },
//     allowEIO3: true,
//     transports: ['websocket'],
// })

// io.of("/doc")
//     .use(socketIoTokenVerifyMiddleware)
//     .on("connect", (socket) => {
//         socketOnConnect(io, socket);
//     })