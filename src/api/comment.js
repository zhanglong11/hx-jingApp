import http from '../utils/http'
export default {
  ConstructionLog: { key: 'construction', url: '/decorate/diary/updateCommentStatus' }, //施工日志
  Material: { key: 'material', url: '/material/updateCommentStatus' }, //材料模块
  MaterialPurchase: { key: 'material', url: '/materialPurchase/updateCommentStatus' }, //材料采购模块
  QualityAcceptanceSpecification: { key: 'safety', url: '/quality/checkSpecific/updateCommentStatus' }, //质量管理-验验收规
  QualityAcceptanceTemplate: { key: 'safety', url: '/quality/constructTemplate/updateCommentStatus' }, //质量管理-质量样板
  QualityInspectPlan: { key: 'safety', url: '/inspect/plan/updateCommentStatus' }, //质量管理-质量巡检计划
  QualityInspectRecord: { key: 'safety', url: '/inspect/updateCommentStatus' }, //质量管理-质量检查记录
  MeasureRecord: { key: 'safety', url: '/measureRecord/updateCommentStatus' }, //质量管理-实测实量
  QualityAcceptanceRecord: { key: 'safety', url: '/quality/acceptanceApply/updateCommentStatus' }, //质量管理-质量验收记录
  SafetyInspectPlan: { key: 'safety', url: '/inspect/plan/updateCommentStatus' }, //安全管理-安全巡检计划
  SafetyInspectRecord: { key: 'safety', url: ' /inspect/updateCommentStatus' }, //安全管理-安全检查记录
  SafetyAccidentHandling: { key: 'safety', url: '/accidentHandling/updateCommentStatus' }, //安全管理-安全事故记录
  // 添加批注 @author huanghaoqi
  addCommonComment: data => {
    return http.system.post('/commonComment/add', data)
  },
  // 更新批注 @author huanghaoqi

  // 删除评论信息 @author huanghaoqi
  deleteCommonComment: id => {
    return http.system.get(`/commonComment/delete/${id}`)
  },
  // 查询列表 @author huanghaoqi
  queryCommonCommentList: data => {
    return http.system.post('/commonComment/list', data)
  }
}
