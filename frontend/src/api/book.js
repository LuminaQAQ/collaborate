import { request } from '@/utils/request'
import { apiList } from '.'

/**
 * @typedef {Object} BookInfo
 * @property {Number} id
 * @property {String} name
 * @property {String} description
 */

/**
 * 编辑知识库信息
 * @param {BookInfo} data
 * @returns
 */
export const requestEditBookInfo = (data) => {
  return request(apiList.bookApi.editBook, {
    method: 'post',
    data,
  })
}

/**
 *
 * @param {Number} id
 * @returns
 */
export const requestDeleteBook = (id) => {
  return request(apiList.bookApi.delBook, {
    method: 'post',
    data: {
      id,
    },
  })
}
