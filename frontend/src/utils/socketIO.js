import { useUserStore } from "@/stores/user";
import { io } from "socket.io-client"

export const socketIO = io(
    "http://localhost:3000",
    {
        auth: {
            token: useUserStore().user.token
        }
    }
)