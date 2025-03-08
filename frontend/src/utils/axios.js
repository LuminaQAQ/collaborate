import axios from "axios";
import { useUserStore } from "@/stores/user";

const useUser = useUserStore();

const instance = axios.create({
  baseURL: "http://localhost:3000/v1",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${useUser.token}`
  }
})

instance.interceptors.request

export default instance;
