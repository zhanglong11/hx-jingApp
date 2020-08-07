import http from '../utils/http'
// 通用
export const msgApi = {
  // 获取消息种类列表
  queryMsgCategoryList: projectId => {
    return http.system.get(`message/category/queryList/${projectId}`, {}, { isLoading: true })
  },
  // 获取指定类型的消息列表
  queryMsgList: data => {
    return http.system.post(`common/message/list`, data, { isLoading: true })
  }
}
