import { request } from '@/utils/request'
import { apiList } from '.'

/**
 * 获取文档历史版本
 * @param {Object} params
 * @param {string} params.doc_id
 * @returns {Promise}
 */
export const requestDocHistory = (params) => {
    return request(apiList.historyApi.fetchDocHistory, {
        method: 'get',
        params
    })
}

export const requestDocHistoryDetail = (params) => {
    return request(apiList.historyApi.fetchDocHistoryDetail, {
        method: 'get',
        params
    })
}