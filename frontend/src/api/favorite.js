import { request } from "@/utils/request.js"
import { apiList } from "./index.js"

const { fetchFavoriteGroup } = apiList.favoriteApi;

/**
 * 获取收藏分组列表
 * @returns {import("axios").AxiosPromise}
 */
export const requestFetchFavoriteGroup = () => {
    return request(fetchFavoriteGroup, {
        method: "get"
    })
}

/**
 * 
 * @param {Object} data
 * @param {String} data.name
 * @returns 
 */
export const requestCreateFavoriteGroup = (data) => {
    return request(apiList.favoriteApi.createFavoriteGroup, {
        method: "post",
        data
    })
}
