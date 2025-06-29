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

export const requestUploadDocFile = (data) =>
  request(apiList.docApi.uploadDocFile, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })
