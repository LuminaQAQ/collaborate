import { useUserStore } from "@/stores/user";
import { io } from "socket.io-client";

/**
 * 
 * @param {string} nameSpace 
 * @returns 
 */
export default function useSocket(nameSpace) {
    const socketIo = io(`http://localhost:3000${nameSpace}`, {
        auth: {
            token: useUserStore().user.token,
        }
    })

    return socketIo;
}