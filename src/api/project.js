import http from '../utils/http'
// 通用
export const projectAPI = {
  // 获取用户项目列表
  queryProjectListInfo: data => {
    return http.system.get('/cim6d/system/user/project/list', data, { isLoading: true })
  }
}
