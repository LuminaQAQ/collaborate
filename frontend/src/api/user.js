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
    params
  })
}

/**
 * @typedef docParams
 * @property {string} email
 * @property {number} book_id
 * @property {number} doc_id
 */
/**
 * 获取文档信息
 * @param {docParams} params
 * @returns {import("axios").AxiosPromise}
 */
export const requestDoc = (params) => {
  return request(apiList.docApi.fetchDoc, {
    method: "get",
    params
  });
}

/**
 * @typedef DocUpdateData
 * @property {number} book_id
 * @property {string} title
 * @property {string} content
 */
/**
 *
 * @param {DocUpdateData} data
 * @returns {import("axios").AxiosPromise}
 */
export const requestDocUpdate = (data) => {
  return request(apiList.docApi.updateDoc, {
    method: "post",
    data
  });
}

/**
 * @typedef DocDelData
 * @property {number} doc_id
 */
/**
 *
 * @param {DocDelData} data
 * @returns {import("axios").AxiosPromise}
 */
export const requestDocDel = (data) => {
  return request(apiList.docApi.delDpc, {
    method: "post",
    data
  });
}