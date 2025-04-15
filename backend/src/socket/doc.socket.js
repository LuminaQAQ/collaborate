const { Socket } = require("socket.io");
const db = require("../lib/db");

const roomMap = new Map();

/**
 * 
 * @param {Socket} socket 
 */
const main = (socket) => {
    // console.log(`用户 ${socket.id} 已连接`, socket.user);

    socket.on("doc/join", async ({ bookId, docId }) => {
        const roomId = `${bookId}-${docId}`;
        const { email } = socket.user;
        socket.join(roomId);

        const [userInfo] = await db("users").select(["id", "username", "avatar"]).where({ email });

        if (!roomMap.has(roomId)) {
            const roomData = { members: new Map() };
            roomData.members.set(email, userInfo);
            roomMap.set(roomId, roomData);
        } else {
            roomMap.get(roomId).members.set(email, userInfo);
        }

        socket.broadcast.to(roomId).emit("user/add", [Object.fromEntries([...roomMap.get(roomId).members].filter(([key, value]) => key === email))]);
    })
}

module.exports = main;