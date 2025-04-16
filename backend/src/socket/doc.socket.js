const { Socket } = require("socket.io");
const db = require("../lib/db");
const generateHash = require("../utils/generateHash");

const roomMap = new Map();

/**
 * 
 * @param {Socket} socket 
 * @param {import("express").NextFunction} next
 */
const main = (socket, next) => {
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

    socket.on("doc/update", async ({ book_id, doc_id, title, content }) => {
        const { email } = socket.user;
        const roomId = `${book_id}-${doc_id}`;

        try {
            if (!content || content === "") {
                await db("docs").update({ title }).where({ id: doc_id });
                return;
            }

            const [lastVersion] = await db("docs_version").where({ doc_id }).orderBy("version", "desc").limit(1)
            if (!lastVersion?.content && generateHash(lastVersion.content) === generateHash(content) && generateHash(lastVersion.title) === generateHash(title)) return;

            await db("docs").update({ title, content }).where({ id: doc_id })

            const [version] = await db("docs_version").max("version").where({ doc_id })
            await db("docs_version").insert({
                creator_id: socket.user.id,
                doc_id,
                version: version['max(`version`)'] + 1,
                title,
                content
            })


            socket.broadcast.to(roomId).emit("doc/update", {
                title,
                content
            });
        } catch (error) {
            console.log(error);

            // next(new InternalServerError(500, "文档保存失败！", error.message))
        }
    })
}

module.exports = main;