import http from '@/utils/http'
// 通用
export const confirmationApi = {
  // 添加质量临检项--http.inspect
  addQualityCheckItem: data => {
    return http.safety.post('/quality/casualCheck/add', data, { isLoading: true })
  }
}
