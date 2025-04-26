import useSocket from "@/utils/useSocket";

const methods = {
    "doc/join": () => {

    },
    "collaborator/change": (persons) => {
        console.log(persons);
    }
}

export default class DocSocket {
    /**
     * 
     * @param {Object} room 
     * @param {String} room.bookId
     * @param {String} room.docId
     */
    constructor(room) {
        this.socket = useSocket("/doc");

        this.socket.on("connect", () => {
            this.socket.emit("doc/join", room);
        });

        this.connect()
    }

    connect() {
        this.socket.connect();

        Object.entries(methods).forEach(([event, callback]) => {
            this.socket.on(event, callback);
        });
    }

    disconnect() {
        this.socket.disconnect();
        this.socket.removeAllListeners();
    }
}