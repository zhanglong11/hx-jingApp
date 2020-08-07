import http from '@/utils/http'
// 通用
export const loginApi = {
  // 登录
  login: data => {
    return http.system.post('/login', data)
  },
  getUserInfo: () => {
    return http.system.get('/cim6d/system/user/current/get')
  }
}
