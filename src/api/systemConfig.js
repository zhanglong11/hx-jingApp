import http from '@/utils/http'
export default {
  getArgTree() {
    return http.global.post('cim6d/arg/tree').then(res => res.data)
  }
}
