import axios from "axios";
import { useUserStore } from "@/stores/user.js";
import { ElMessage } from "element-plus";
// import { ElMessage } from "element-plus"

export const request = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    // "Authorization": `Bearer ${useUser.token}`
  }
})

request.interceptors.request.use(config => {
  const useUser = useUserStore();

  if (useUser.token) {
    config.headers["Authorization"] = `Bearer ${useUser.token}`;
  }

  return config;
}, err => {
  return Promise.reject(err)
})

request.interceptors.response.use(config => {
  return config;
}, err => {
  ElMessage({ type: "error", message: err.response.data?.error })
  return Promise.reject(err);
})
