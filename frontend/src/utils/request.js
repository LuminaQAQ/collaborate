import axios from "axios";
import { useUserStore } from "@/stores/user.js";
import { ElMessage } from "element-plus";
import { apiList } from "@/api";

const { authApi } = apiList;

const whiteList = [authApi.login, authApi.register, authApi.verifyCode];

export const request = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json"
  }
})

request.interceptors.request.use(config => {
  const useUser = useUserStore();
  const token = useUser.token || localStorage.getItem("token");

  if (useUser.token && !whiteList.includes(config.url)) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
}, err => {
  return Promise.reject(err)
})

request.interceptors.response.use(config => {
  return config;
}, err => {
  ElMessage({ type: "error", message: err.response?.data?.error })
  return Promise.reject(err);
})
