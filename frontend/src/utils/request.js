import axios from "axios";
import { useUserStore } from "@/stores/user.js";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    // "Authorization": `Bearer ${useUser.token}`
  }
})

instance.interceptors.request.use(config => {
  const useUser = useUserStore();

  if (useUser.token) {
    config.headers["Authorization"] = `Bearer ${useUser.token}`;
  }

  return config;
}, err => Promise.reject(err))

/**
 * axios 请求实例
 * @param {string} api 接口地址
 * @param {import("axios").AxiosRequestConfig} data 配置+数据项
 * @returns {import("axios").AxiosInstance}
 */
export const request = (api, data) => {
  return instance(api, data)
}
