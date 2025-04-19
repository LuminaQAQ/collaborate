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

const socketIoTokenVerifyMiddleware = require("./src/middleware/socket/tokenVerifyMiddleware.js");
const { socketOnConnect } = require("./src/socket/doc.socket.js");

const { errorMiddleware } = require("./src/middleware/errorMiddleware.js");

const initTables = require("./src/schema/index.js");
const preventHotLinking = require("./src/middleware/preventHotLinking.js");
const socketIoErrorMiddleware = require("./src/middleware/socket/errorMiddleware.js");
const db = require("./src/lib/db.js");

initTables();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: "*"
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

io.of("/doc")
    .use(socketIoTokenVerifyMiddleware)
    .on("connect", (socket) => {
        socketOnConnect(io, socket);
    })
// .on("connect", (socket) => {
//     socket.on("doc/join", async ({ bookId, docId }) => {
//         const roomId = `${bookId}-${docId}`;
//         socket.roomId = roomId;
//         const { email } = socket.user;
//         socket.join(roomId);

//         const [userInfo] = await db("users").select(["id", "username", "avatar"]).where({ email });

//         if (!roomMap.has(roomId)) {
//             const roomData = { members: new Map() };
//             roomData.members.set(email, userInfo);
//             roomMap.set(roomId, roomData);
//         } else {
//             roomMap.get(roomId).members.set(email, userInfo);
//         }

//         console.log(roomMap.get(roomId).members);

//         // io.of("/doc").to(roomId).emit("user/add", [Object.fromEntries([...roomMap.get(roomId).members].filter(([key, value]) => key === email))]);
//         io.of("/doc").to(roomId).emit("user/add", [Object.fromEntries([...roomMap.get(roomId).members])][0]);
//     })

//     socket.on("doc/leave", async ({ bookId, docId }) => {
//         roomMap.get(`${bookId}-${docId}`).members.delete(socket.user.email);
//     })
// })

server.listen(3000, () => {
    console.log("服务器已启动在 3000 端口");
})