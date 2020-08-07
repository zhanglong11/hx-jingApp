import http from '../utils/http'
// 通用
export const workingAPI = {
  // app图纸库列表
  getEntityList: (params, isLoading = true) => {
    return http.construction.post(`/working/procedure/config/app/library/list`, params, {
      isLoading
    })
  },
  //房间下工序列表
  getProcessList: (params, isLoading = true) => {
    return http.construction.post(`/working/procedure/config/app/libraryProcedure/list`, params, {
      isLoading
    })
  },

  //房间下材料
  getRoomMaterialList: (params, isLoading = true) => {
    return http.construction.post(`/working/procedure/config/app/libraryProcedureMaterial/list`, params, {
      isLoading
    })
  },

  getTotalTree: (params, isLoading = true) => {
    return http.construction.post(`/working/procedure/config/app/library/tree`, params, {
      isLoading
    })
  },

  //材料统计
  getMaterialList: (params, isLoading = true) => {
    return http.construction.post(`/working/procedure/config/app/monthMaterial/list`, params, {
      isLoading
    })
  },

  //材料统计
  getProgressData: (params, isLoading = true) => {
    return http.construction.post(`/working/procedure/config/app/monthSchedule/list`, params, {
      isLoading
    })
  },

  //工序开始
  start: (id, isLoading = true) => {
    return http.construction.get(
      `/working/procedure/floor/schedule/startSingle/${id}`,
      {},
      {
        isLoading
      }
    )
  },

  // 单体下楼层列表
  getFloorList: (configId, isLoading = true) => {
    return http.construction.get(
      `/working/procedure/floor/list/${configId}`,
      {},
      {
        isLoading
      }
    )
  },
  // 单体下特定楼层统计信息
  getFloorSingle: (configId, floorNum, isLoading = true) => {
    return http.construction.get(
      `/working/procedure/floor/single/${configId}/${floorNum}`,
      {},
      {
        isLoading
      }
    )
  },
  // 楼层下工序列表
  getScheduleList: (configId, floorNum, isLoading = true) => {
    return http.construction.get(
      `/working/procedure/schedule/list/${configId}/${floorNum}`,
      {},
      {
        isLoading
      }
    )
  },
  // 工序确认
  updateSchedule: data => {
    return http.construction.post(`/working/procedure/floor/schedule/confirm`, data)
  },
  // 工序任务详情
  getDetailsSchedule: (id, isLoading = true) => {
    return http.construction.get(
      `/working/procedure/floor/schedule/get/${id}`,
      {},
      {
        isLoading
      }
    )
  },
  // 获取bim版本号
  queryBimVersion: (data, isLoading = true) => {
    return http.system.post('/project/bim/version/list', data, {
      isLoading
    })
  }
}
