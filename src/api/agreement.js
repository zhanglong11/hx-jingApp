import http from '../utils/http'
const baseURL = '/cim6d-construction'
export default {
  //添加合同
  addContract: data => {
    return http.construction.post('/contractBaseinfoSupply/add', data)
  },
  getContractList: data => {
    return http.construction.post('/contractBaseinfoSupply/list', data, { isLoading: true })
  },
  deleteContractById: id => {
    return http.construction.post(`/contractBaseinfoSupply/delete/${id}`)
  },
  getContractById: id => {
    return http.construction.get(`/contractBaseinfoSupply/get/${id}`)
  },
  updateContractById: data => {
    return http.construction.post(`/contractBaseinfoSupply/update`, data)
  },
  /*  //添加合同清单信息
  addOrderFile: data => {
    return http.construction.post(`/contractBaseinfoSupply/upload/inventory`, data, {
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  },*/
  //添加合同清单信息
  addOrderFile: data => {
    return http.construction.post(`/contractBaseinfoSupply/app/upload/inventory`, data)
  },
  getContractInventoryPurchase: data => {
    return http.construction.post('/contractInventoryPurchase/list', data)
  },
  //导出租赁采购清单
  exportContractInventoryPurchase: data => {
    return http.construction.post('/contractBaseinfoSupply/export/inventory', data, {
      responseType: 'blob'
    })
  }
}
