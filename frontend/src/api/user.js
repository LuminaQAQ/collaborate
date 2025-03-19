import { request } from "@/utils/request.js"
import { apiList } from "./index.js"

/**
 * 请求首页数据
 * @returns {import("axios").AxiosPromise}
 */
export const requestHomeData = () => {
    return request(apiList.userApi.home, {
        method: "get"
    })
}

export const requestBookList = () => {
    return request(apiList.userApi.bookList, {
        method: "get"
    })
}

/**
 * 请求对应文档库存在的文档
 * @param {object} params 
 * @returns {import("axios").AxiosPromise}
 */
export const requestDocList = (params) => {
    return request(apiList.userApi.docList, {
        method: "get",
        data: {
            params
        }
    })
}