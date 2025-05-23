import { request } from '@/utils/request.js'
import { apiList } from './index.js'

const { fetchFavoriteGroup } = apiList.favoriteApi

/**
 * 获取收藏分组列表
 * @returns {import("axios").AxiosPromise}
 */
export const requestFetchFavoriteGroup = () => {
  return request(fetchFavoriteGroup, {
    method: 'get',
  })
}

/**
 * 获取收藏列表
 * @param {Object} params
 * @param {Number} params.favorite_group_id
 * @param {Number} params.limit
 * @param {Number} params.offset
 * @returns {import("axios").AxiosPromise}
 */
export const requestFetchFavoriteList = (params) => {
  return request(apiList.favoriteApi.fetchFavoriteList, {
    method: 'get',
    params,
  })
}

/**
 * 创建收藏分组
 * @param {Object} data
 * @param {String} data.name
 * @returns
 */
export const requestCreateFavoriteGroup = (data) => {
  return request(apiList.favoriteApi.createFavoriteGroup, {
    method: 'post',
    data,
  })
}

/**
 * 修改收藏夹
 * @param {Object} data
 * @param {Number} data.id
 * @param {String} data.name
 * @param {String} data.desc
 * @returns
 */
export const requestUpdateFavoriteGroup = (data) => {
  return request(apiList.favoriteApi.updateFavoriteGroup, {
    method: 'post',
    data,
  })
}

/**
 * 删除收藏夹
 * @param {Object} data
 * @param {Number} data.id
 * @returns
 */
export const requestDelFavoriteGroup = (data) => {
  return request(apiList.favoriteApi.delFavoriteGroup, {
    method: 'post',
    data,
  })
}

/**
 * 添加到收藏
 * @param {Object} data
 * @param {Number} data.doc_id
 * @param {Number} data.favorite_group_id
 * @returns
 */
export const requestAddToFavorite = (data) => {
  return request(apiList.favoriteApi.addToFavorite, {
    method: 'post',
    data,
  })
}

/**
 * 删除收藏
 * @param {Object} data
 * @param {Number} data.doc_id
 * @param {Number} data.favorite_group_id
 * @returns
 */
export const requestDelFavorite = (data) => {
  return request(apiList.favoriteApi.delFavorite, {
    method: 'post',
    data,
  })
}
