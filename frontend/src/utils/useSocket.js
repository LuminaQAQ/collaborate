import { useUserStore } from "@/stores/user";
import { io } from "socket.io-client"

export default function useSocket(nameSpace) {
    const socketIo = io(`http://localhost:3000${nameSpace}`, {
        auth: {
            token: useUserStore().user.token,
        }
    })

    const emit = (eventName, data) => new Promise((resolve, reject) => {
        socketIo.emit(eventName, data, (res) => {
            console.log(res);

            if (res.error) {
                reject(res.error)
            } else {
                resolve(res)
            }
        })
    })

    return {
        socketIo,
        emit,
    }
} 