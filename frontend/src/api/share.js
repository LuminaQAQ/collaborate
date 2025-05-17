import { apiList } from '.'
import { request } from '@/utils/request'

const { fetchJoinURL, urlJoinToShare } = apiList.shareApi

/**
 * 获取分享链接
 * @param {Object} params
 * @param {string} params.target_id id
 * @param {'Book'|'Doc'} params.target_type 类型
 * @param {1|2} params.role
 * @returns
 */
export const requestFetchDocJoinURL = (params) => {
  return request(fetchJoinURL, {
    method: 'get',
    params,
  })
}

/**
 * 通过分享链接加入
 * @param {Object} data
 * @param {string} data.token
 * @returns
 */
export const requestUrlJoinToShare = (data) => {
  return request(urlJoinToShare, {
    method: 'post',
    data,
  })
}
