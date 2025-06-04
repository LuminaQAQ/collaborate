import { request } from '@/utils/request'
import { apiList } from '.'

export const requestChatToAi = (data) => {
  return request(apiList.aiApi.chat, {
    method: 'post',
    data,
  })
}
