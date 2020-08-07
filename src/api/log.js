import http from '../utils/http'
// 通用
export const logApi = {
  // 添加编辑施工日志
  editLogItem: data => {
    return http.construction.post('/constructionlog/saveOrUpdate', data)
  },
  // 查询施工日志列表
  queryLogList: data => {
    return http.construction.post('/constructionlog/queryList', data, { isLoading: true })
  },
  // 查询选中月份内有日至项的日期
  queryDateList: data => {
    return http.construction.post('/constructionlog/dateList', data)
  },
  // 获取日志详情
  logItemInfo: logId => {
    return http.construction.get(`/constructionlog/detail/${logId}`, {}, { isLoading: true })
  }
}
