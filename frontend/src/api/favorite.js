import { request } from "@/utils/request.js"
import { apiList } from "./index.js"
import { Axios } from "axios";

const { fetchFavoriteGroup } = apiList.favoriteApi;

/**
 * 获取收藏分组列表
 * @returns {Axios}
 */
export const requestFetchFavoriteGroup = () => {
    return request(fetchFavoriteGroup, {
        method: "get"
    })
}
