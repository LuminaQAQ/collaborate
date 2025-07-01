import { request } from '@/utils/request.js'
import { apiList } from './index.js'

/**
 * 请求首页数据
 * @returns {import("axios").AxiosPromise}
 */
export const requestHomeData = () => {
  return request(apiList.userApi.home, {
    method: 'get',
  })
}

export const requestUserInfo = () => {
  return request(apiList.userApi.userInfo, {
    method: 'get',
  })
}

export const requestBookList = () => {
  return request(apiList.userApi.bookList, {
    method: 'get',
  })
}

/**
 * 请求对应文档库存在的文档
 * @param {object} params
 * @param {number} params.book_id
 * @returns {import("axios").AxiosPromise}
 */
export const requestDocList = (params) => {
  return request(apiList.userApi.docList, {
    method: 'get',
    params,
  })
}

/**
 * 获取文档信息
 * @param {Object} params
 * @param {string} params.email
 * @param {number} params.book_id
 * @param {number} params.doc_id
 * @returns {import("axios").AxiosPromise}
 */
export const requestDoc = (params) => {
  return request(apiList.docApi.fetchDoc, {
    method: 'get',
    params,
  })
}

/**
 *
 * @param {Object} data
 * @param {number} data.doc_id
 * @param {string} data.title
 * @param {string} data.content
 * @returns {import("axios").AxiosPromise}
 */
export const requestDocUpdate = (data) => {
  return request(apiList.docApi.updateDoc, {
    method: 'post',
    data,
  })
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
  return request(apiList.docApi.delDoc, {
    method: 'post',
    data,
  })
}

/**
 * @typedef GroupDelData
 * @property {number[]} groupList 分组的 `id` 数组
 * @property {number[]} docList 文档的 `id` 数组
 */
/**
 *
 * @param {GroupDelData} data
 * @returns {import("axios").AxiosPromise}
 */
export const requestGroupDel = (data) => {
  return request(apiList.docApi.delDocGroup, {
    method: 'post',
    data,
  })
}
