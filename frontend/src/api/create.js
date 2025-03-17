import { request } from "@/utils/request.js"
import { apiList } from "./index.js"

/**
 * @typedef bookinfo
 * @property {string} name
 * @property {string} description
 */

/**
 * 创建文档库
 * @param {bookinfo} bookinfo
 * @returns
 */
export const requestCreateBook = (bookinfo) => {
  return request(apiList.createApi.createBook, {
    method: "post",
    data: bookinfo
  })
}