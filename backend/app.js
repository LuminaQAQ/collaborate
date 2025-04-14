require("./src/lib/env.js")
const express = require("express");
const cors = require("cors");
const http = require("http")
const { Server } = require("socket.io");

const loginRouter = require("./src/router/login.js");
const homeRouter = require("./src/router/home.js");
const bookRouter = require("./src/router/book.js");
const docRouter = require("./src/router/doc.js");
const historyRouter = require("./src/router/history.js");

const { errorMiddleware } = require("./src/middleware/errorMiddleware.js");

const initTables = require("./src/schema/index.js");
const preventHotLinking = require("./src/middleware/preventHotLinking.js");
const socketIoTokenVerifyMiddleware = require("./src/middleware/socketIoTokenVerifyMiddleware.js");
initTables();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: "http://localhost:5173"
})

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
app.use(errorMiddleware);

io.use(socketIoTokenVerifyMiddleware);

io.on("connection", (socket) => {
    console.log(`用户 ${socket.id} 已连接`, socket.user);

    socket.on('updateDoc', (msg) => {
        io.emit('updateDoc', msg);
    });

    socket.on("updateCursor", (pos) => {
        io.emit("updateCursor", pos);
    })

    socket.on('disconnect', () => {
        console.log(`用户 ${socket.id} 已断开`);
    });
})

server.listen(3000, () => {
    console.log("服务器已启动在 3000 端口");
})