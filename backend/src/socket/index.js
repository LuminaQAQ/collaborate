const { Server } = require("socket.io");
const socketIoTokenVerifyMiddleware = require("../middleware/socket/tokenVerifyMiddleware");
const db = require("../lib/db");

const roomMap = new Map();

/**
 * 
 * @param {import("http2").Http2Server} server 
 */
module.exports = (server) => {

    const io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
            ]
        },
        allowEIO3: true,
    })

    io.of("/doc")
        .use(socketIoTokenVerifyMiddleware)
        .on("connect", (socket) => {
            socket.on("doc/join", async ({ bookId, docId }) => {
                const roomId = `${bookId}-${docId}`;
                const { email } = socket.user;
                socket.join(roomId);
                socket.user.roomId = roomId;

                const [userInfo] = await db("users").select(["id", "email", "username", "avatar"]).where({ email });

                if (!roomMap.has(roomId)) {
                    const roomData = {
                        members: new Map(),
                        timer: null,
                    };
                    roomData.members.set(email, userInfo);
                    roomMap.set(roomId, roomData);
                } else {
                    roomMap.get(roomId).members.set(email, userInfo);
                }

                const persons = [...roomMap.get(roomId).members.values()].sort((a, b) => a.id - b.id);
                io.of("/doc").to(roomId).emit("collaborator/change", persons);
            })

            socket.on("disconnect", async () => {
                const { roomId, email } = socket.user;

                if (!roomMap.has(roomId)) return;

                roomMap.get(roomId).members.delete(email);
                if (roomMap.get(roomId).members.size === 0) return roomMap.delete(roomId);

                const persons = [...roomMap.get(roomId).members.values()].sort((a, b) => a.id - b.id);
                io.of("/doc").to(roomId).emit("collaborator/change", persons);
            })
        })
}