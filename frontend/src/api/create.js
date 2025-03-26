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
 * @returns {import("axios").AxiosPromise}
 */
export const requestCreateBook = (bookinfo) => {
  return request(apiList.createApi.createBook, {
    method: "post",
    data: bookinfo
  })
}

/**
 * @typedef docInfo
 * @property {number} book_id
 * @property {String | Number | null} parent_id
 */

/**
 * 创建文档
 * @param {docInfo} docInfo 
 * @returns {import("axios").AxiosPromise}
 */
export const requestCreateDoc = (docInfo) => {
  return request(apiList.createApi.createDoc, {
    method: "post",
    data: docInfo
  })
}

/**
 * @typedef docGroupInfo
 * @property {number} book_id
 * @property {String | Number | null} parent_id
 */

/**
 * 创建分组文件夹
 * @param {docGroupInfo} docGroupInfo 
 * @returns {import("axios").AxiosPromise}
 */
export const requestCreateDocGroup = (docGroupInfo) => {
  return request(apiList.createApi.createDocGroup, {
    method: "post",
    data: docGroupInfo
  })
}