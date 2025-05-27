import { request } from '@/utils/request'
import { apiList } from '.'

export const requestEditBookInfo = (data) => {
  return request(apiList.bookApi.editBook, {
    method: 'post',
    data,
  })
}
