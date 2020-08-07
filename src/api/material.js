import http from '../utils/http'
export const Api = {
  // 采购通知列表页
  getPartyList: data => {
    return http.inspect.post('/materialSupplyPlan/list', data, { isLoading: true })
  },
  //采购通知详情
  getPartyDetail: id =>{
    return http.inspect.get(`/materialSupplyPlan/get/${id}`)
  },
  //通知供应商
  getNotifySupply: id => {
    return http.inspect.get(`/materialSupplyPlan/${id}/notifySupply`)
  },
  //材料确认单列表页
  getConfirmationList:data => {
    return http.inspect.post('/materialSupplyConfirmBill/list', data, { isLoading: true })
  },
  //材料确认单添加页
  getConfirmationAdd:data => {
    return http.inspect.post('/materialSupplyConfirmBill/add', data)
  },
  //材料确认单提交
  getConfirmationSubmit:data => {
    return http.inspect.post('/materialSupplyConfirmBill/saveAndsubmitAudit', data)
  },
  //材料确认单详情
  getConfirmationDetail: id =>{
    return http.inspect.get(`/materialSupplyConfirmBill/get/${id}`)
  },
  //材料确认单撤回
  getConfirmationRevocation: id =>{
    return http.inspect.get(`/materialSupplyConfirmBill/${id}/revocation`)
  },
  //材料确认单作废
  getConfirmationCancellation: id =>{
    return http.inspect.get(`/materialSupplyConfirmBill/${id}/cancellation`)
  },
}
