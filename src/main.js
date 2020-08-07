import Vue from 'vue'
import App from './App'

import store from './store'
import utils from './utils/utils' // 通用函数封装
import toFixed from './utils/toFixed' // 通用函数封装

import moment from 'moment'
import 'moment/locale/zh-cn'
import EmptyTemplate from '@/components/empty-template' // 无数据空载页
import DepartmentTree from '@/pages/contact/department/DepartmentTree'

Vue.component('EmptyTemplate', EmptyTemplate)
moment.locale('zh-cn')
import fly from './utils/http'
import _ from 'lodash'
Vue.config.productionTip = false

/*
  APP类型
  appType
  1 精装修
  2 开发商
  3 施工
*/
let appType = 1
Vue.prototype.$appType = appType

Vue.prototype.$store = store
Vue.prototype.$utils = utils
Vue.prototype.fly = fly
Vue.prototype.$log = console.log
Vue.prototype._ = _
Vue.prototype.toFixed = toFixed
Vue.component('DepartmentTree', DepartmentTree)
const getLabel = (options, value) => {
  return _.get(_.find(options, { value }), 'label', '-')
}
Vue.prototype.$getLabel = getLabel
Vue.prototype.$getLabelFromArg = (argGroup, value) => {
  return getLabel(_.find(store.state.systemConfig.argTree, { argGroup })?.children ?? [], value)
}
Vue.prototype.$getArgList = group => {
  return _.find(store.state.systemConfig.argTree, { argCode: group }).children
}
/*
  是否有按钮操作权限
  true 有权限
  false 无权限
*/
Vue.prototype.$hasPower = e => {
  if (!store.state.user.token) {
    // 未登录可以查看模块
    return true
  }
  return store.state.userPower.power.includes(e)
}
Vue.prototype.$decorationUser = store.state.userPower.decorationUser // 精装修用户id
// 全局过滤器
import * as customFilters from '@/utils/filters'
Object.keys(customFilters).forEach(key => {
  Vue.filter(key, customFilters[key])
})
Vue.filter('toFixed', toFixed)
App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
