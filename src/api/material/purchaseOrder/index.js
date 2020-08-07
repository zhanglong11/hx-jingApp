import http from '@/utils/http'
export const Api = {
  //采购单列表
  getPurchaseOrderList: data => {
    return http.material.post(`materialPurchase/list`, data, { isLoading: true })
  },
  //采购单添加
  getPurchaseOrderAdd: data => {
    return http.material.post(`materialPurchase/save`, data)
  },
  //采购单添加并提交
  getPurchaseOrderSubmit: data => {
    return http.material.post(`materialPurchase/saveAndSubmit`, data)
  },
  // 添加选择列表数据
  getPurchaseOrderAddList: data => {
    return http.material.post(`material/list`, data)
  },
  // 采购单详情
  getPurchaseOrderDetail: id => {
    return http.material.get(`materialPurchase/get/${id}`)
  },
  // 采购单详情
  getPurchaseOrderDelete: id => {
    return http.material.post(`materialPurchase/delete/${id}`)
  }

}
