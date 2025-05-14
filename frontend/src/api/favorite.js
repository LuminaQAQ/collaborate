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
