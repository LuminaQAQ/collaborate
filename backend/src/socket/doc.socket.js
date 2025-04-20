const { Socket } = require("socket.io");
const db = require("../lib/db");
const generateHash = require("../utils/generateHash");

const roomMap = new Map();

/**
 * 
 * @param {Socket} io 
 * @param {Socket} socket 
 */
const socketOnConnect = (io, socket) => {
    socket.on("doc/join", async ({ bookId, docId }) => {
        const roomId = `${bookId}-${docId}`;
        const { email } = socket.user;
        socket.join(roomId);
        socket.user.roomId = roomId;

        const [userInfo] = await db("users").select(["id", "email", "username", "avatar"]).where({ email });

        if (!roomMap.has(roomId)) {
            const roomData = { members: new Map() };
            roomData.members.set(email, userInfo);
            roomMap.set(roomId, roomData);
        } else {
            roomMap.get(roomId).members.set(email, userInfo);
        }

        const persons = [...roomMap.get(roomId).members.values()].sort((a, b) => a.id - b.id);
        io.of("/doc").to(roomId).emit("collaborator/change", persons);

        socket.on("doc/update", async ({ book_id, doc_id, title, content }) => {
            const { email } = socket.user;
            const roomId = `${book_id}-${doc_id}`;

            try {
                // if (!content || content === "") {
                //     await db("docs").update({ title }).where({ id: doc_id });
                //     return;
                // }

                // const [lastVersion] = await db("docs_version").where({ doc_id }).orderBy("version", "desc").limit(1)
                // if (!lastVersion?.content && generateHash(lastVersion.content) === generateHash(content) && generateHash(lastVersion.title) === generateHash(title)) return;

                // await db("docs").update({ title, content }).where({ id: doc_id })

                // const [version] = await db("docs_version").max("version").where({ doc_id })
                // await db("docs_version").insert({
                //     creator_id: socket.user.id,
                //     doc_id,
                //     version: version['max(`version`)'] + 1,
                //     title,
                //     content
                // })

                socket.broadcast.to(roomId).emit("doc/update", {
                    title,
                    content
                });
            } catch (error) {
                console.log(error);
            }
        })
    })

    socket.on("disconnect", async () => {
        const { roomId, email } = socket.user;
        roomMap.get(roomId).members.delete(email);
        const persons = [...roomMap.get(roomId).members.values()].sort((a, b) => a.id - b.id);
        io.of("/doc").to(roomId).emit("collaborator/change", persons);
    })
}

module.exports = { socketOnConnect };