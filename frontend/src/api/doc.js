import { request } from '@/utils/request.js'
import { apiList } from './index.js'

const computedCommentsDocIdAPI = (api, doc_id) => api.replace(':doc_id', doc_id)

/**
 * 评论
 * @param {Object} data
 * @param {Number} data.doc_id
 * @param {String} data.comment_content
 * @param {String} data.comment_quote
 * @param {String} data.parent_id
 * @returns
 */
export const requestCommentDoc = (data) =>
  request(computedCommentsDocIdAPI(apiList.docApi.comment, data.doc_id), {
    method: 'post',
    data,
  })

/**
 * 获取文档评论列表
 * @param {Object} data
 * @param {Number} data.doc_id
 * @returns
 */
export const requestFetchComments = (data) =>
  request(computedCommentsDocIdAPI(apiList.docApi.fetchComments, data.doc_id))

/**
 * 导入文档
 * @param {FormData} data
 * @param {File} data.file
 * @param {String} data.file_name
 * @param {Number} data.file_size
 * @param {String} data.file_type
 * @param {Number|String} data.parent_id
 * @returns
 */
export const requestUploadDocFile = (data) =>
  request(apiList.docApi.uploadDocFile, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })

/**
 * 文档移动
 * @param {Object} data
 * @param {Number} data.book_id
 * @param {Number} data.doc_id
 * @param {Number} data.parent_id
 * @returns
 */
export const requestDocMove = (data) =>
  request(apiList.docApi.moveDoc, {
    method: 'post',
    data,
  })

export const requestDocCopy = (data) =>
  request(apiList.docApi.copyDoc, {
    method: 'post',
    data,
  })
