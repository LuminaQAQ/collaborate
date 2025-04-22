import { useUserStore } from "@/stores/user";
import * as Y from 'yjs';
import { io } from 'socket.io-client';
import { useRoute } from "vue-router";
import { useDocStore } from "@/stores/doc";

export class SocketIOProvider {
    constructor(serverUrl, roomName, ydoc, options = {}) {
        this.ydoc = ydoc;
        this.roomName = roomName;

        this.docStore = useDocStore();

        this.socket = io(serverUrl, options);

        this.socket.on('connect', this.#onConnect);
        this.socket.on('disconnect', this.#onDisconnect);
        this.socket.on('sync', this.#onSync);
        this.socket.on('update', this.#onUpdate);
        this.socket.on('collaborator/change', this.#onCollaboratorChange);

        // this.ydoc.on('update', this.#onDocUpdate);
    }

    connect() {
        this.socket.connect();
    }

    disconnect() {
        this.socket.disconnect();
    }

    destroy() {
        this.ydoc.off('update', this.#onDocUpdate);

        this.disconnect();

        this.socket.off('connect', this.#onConnect);
        this.socket.off('disconnect', this.#onDisconnect);

        this.socket.off('collaborator/change', this.#onCollaboratorChange);
        this.socket.off('sync', this.#onSync);
        this.socket.off('update', this.#onUpdate);
    }

    #onConnect = () => {
        this.socket.emit('doc/join', this.roomName);
    };

    #onDisconnect = () => { };

    // 处理服务端发来的同步数据
    /**
     * 
     * @param {ArrayBuffer} encodedStateVector 
     */
    #onSync = (encodedStateVector) => {
        // const stateVector = Y.encodeStateVector(this.ydoc);
        const update = Y.encodeStateAsUpdate(this.ydoc, encodedStateVector);
        this.socket.emit('sync-response', update);
    };

    // 处理服务端发来的更新
    #onUpdate = (update) => {
        Y.applyUpdate(this.ydoc, update, this);
    };

    #onCollaboratorChange = (collaborators) => {
        this.docStore.currentDocState.collaborators = collaborators;
    }


    #onDocUpdate = (update, origin) => {
        if (origin !== this) {
            this.socket.emit('update', update);
        }
    };
}

export default function useSocket(nameSpace, ydoc) {
    // const socketIo = io(`http://localhost:3000${nameSpace}`, {
    //     auth: {
    //         token: useUserStore().user.token,
    //     }
    // })

    const route = useRoute();
    const socketIo = new SocketIOProvider(
        `ws://localhost:3000${nameSpace}`,
        {
            bookId: Number(route.params.book),
            docId: Number(route.params.doc),
        },
        ydoc,
        {
            transports: ['websocket'],
            forceBase64: false,
            auth: {
                token: useUserStore().user.token,
            }
        }
    )

    return {
        socketIo,
    }
} 