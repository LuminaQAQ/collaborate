import { useUserStore } from "@/stores/user";
import { io } from "socket.io-client"

export default function useSocket(nameSpace) {
    const socket = io(`http://localhost:3000${nameSpace}`, {
        auth: {
            token: useUserStore().user.token,
        }
    })

    return {
        socket
    }
} 