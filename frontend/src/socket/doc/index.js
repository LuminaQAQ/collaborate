import { useDocStore } from "@/stores/doc";
import useSocket from "@/utils/useSocket";

const methods = {
    "collaborator/change": (persons) => {
        const docStore = useDocStore();
        docStore.currentDocState.collaborators = persons;
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