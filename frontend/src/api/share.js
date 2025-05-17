import { apiList } from '.'
import { request } from '@/utils/request'

const { fetchJoinURL, joinToShare } = apiList.shareApi

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
