import http from '@/utils/http'
export default {
  // 采购单删除
  getUserInfo: id => {
    return http.system.get(`/cim6d/system/user/get/${id}`)
    //return http.system.get(`/cim6d/system/user/current/get`)
  },
  updateUser: data => {
    return http.system.post('/cim6d/system/user/update', data, { isLoading: true })
  },
  changePassword: data => {
    return http.system.post('/cim6d/system/user/password/change', data, { isLoading: true })
  }
}
