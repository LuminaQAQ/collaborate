import { request } from "@/utils/request.js"
import { apiList } from "./index.js"

/**
 * 请求首页数据
 * @param {object} params 
 * @returns {import("axios").AxiosPromise}
 */
export const requestHomeData = () => {
    return request(apiList.userApi.home, {
        method: "get"
    })
}