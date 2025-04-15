const { Socket } = require("socket.io");
const db = require("../lib/db");

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

    socket.on("doc/update", async (data) => {
        const { email } = socket.user;
        const { doc_id, title, content } = data;

        console.log(1);

        try {
            if (!content || content === "") {
                await db("docs").update({ title }).where({ id: doc_id });
                return res.send({ msg: "ok" });
            }

            const [lastVersion] = await db("docs_version").where({ doc_id }).orderBy("version", "desc").limit(1)
            if (lastVersion?.content && generateHash(lastVersion.content) === generateHash(content)) return res.send({ msg: "ok" })

            await db("docs").update({ title, content }).where({ id: doc_id })

            const [version] = await db("docs_version").max("version").where({ doc_id })
            await db("docs_version").insert({
                creator_id: req.user.id,
                doc_id,
                version: version['max(`version`)'] + 1,
                content
            })
            console.log(error);

            return res.send({ msg: "ok" })
        } catch (error) {
            next(new InternalServerError(500, "文档保存失败！", error.message))
        }
    })
}

module.exports = main;