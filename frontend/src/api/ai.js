import { request } from '@/utils/request'
import { apiList } from '.'

/**
 *
 * @param {Object} data
 * @param {String} data.prompt
 * @param {String} data.content
 * @returns
 */
export const requestChatToAi = (data) => {
  return request(apiList.aiApi.chat, {
    method: 'post',
    data,
  })
}
