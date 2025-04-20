const { Socket } = require("socket.io");
const db = require("../lib/db");
const generateHash = require("../utils/generateHash");

const roomMap = new Map();

// const docIsNeedUpdate = () => new Promise(async (resolve, reject) => {
//     const [lastVersion] = await db("docs_version").where({ doc_id }).orderBy("version", "desc").limit(1);
// })

const updateDoc = async ({ creator_id, doc_id, title, content }) => new Promise(async (resolve, reject) => {
    const isNeedUpdate = new Promise(async (res, rej) => {
        const [lastVersion] = await db("docs_version").where({ doc_id }).orderBy("version", "desc").limit(1);
        if (!lastVersion) return res(lastVersion);
        else {
            const prevHash = generateHash(lastVersion.title + lastVersion.content);
            const currHash = generateHash(title + content);

            if (prevHash !== currHash) res();
            else rej();
        }
    })

    isNeedUpdate.then(async res => {
        const [version] = await db("docs_version").max("version").where({ doc_id })

        await db("docs").update({ title, content }).where({ id: doc_id })
        await db("docs_version").insert({
            creator_id,
            doc_id,
            version: version['max(`version`)'] + 1,
            title,
            content
        })

        resolve()
    }).catch(err => resolve())
})

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
            const roomData = {
                members: new Map(),
                timer: null
            };
            roomData.members.set(email, userInfo);
            roomMap.set(roomId, roomData);
        } else {
            roomMap.get(roomId).members.set(email, userInfo);
        }

        const persons = [...roomMap.get(roomId).members.values()].sort((a, b) => a.id - b.id);
        io.of("/doc").to(roomId).emit("collaborator/change", persons);

        socket.on("doc/update", async ({ book_id, doc_id, title, content, isForce }) => {
            const { email, id } = socket.user;
            const roomId = `${book_id}-${doc_id}`;

            if (!roomMap.has(roomId)) return;

            try {
                socket.broadcast.to(roomId).emit("doc/update", {
                    title,
                    content
                });

                if (roomMap.get(roomId).timer) clearTimeout(roomMap.get(roomId).timer);
                roomMap.get(roomId).timer = setTimeout(async () => {
                    clearTimeout(roomMap.get(roomId).timer);
                    roomMap.get(roomId).timer = null;
                    await updateDoc({ creator_id: id, doc_id, title, content })
                }, 5 * 1000);
            } catch (error) {
                console.log(error);
            }
        })
    })

    socket.on("disconnect", async () => {
        const { roomId, email } = socket.user;
        roomMap.get(roomId).members.delete(email);
        if (roomMap.get(roomId).members.size === 0) return roomMap.delete(roomId);

        const persons = [...roomMap.get(roomId).members.values()].sort((a, b) => a.id - b.id);
        io.of("/doc").to(roomId).emit("collaborator/change", persons);
    })
}

module.exports = { socketOnConnect };