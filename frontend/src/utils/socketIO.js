import { useUserStore } from "@/stores/user";
import { io } from "socket.io-client"

export default function useSocket(baseURL = "http://localhost:3000") {
    const socket = io(baseURL, {
        auth: {
            token: useUserStore().user.token
        }
    })

    return {
        socket
    }
} 