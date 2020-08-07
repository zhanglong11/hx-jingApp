import userApi from '@/api/user'
import toTree from '@/utils/toTree'
import treeForEach from '@/utils/treeForEach'
export default {
  state: {
    project: uni.getStorageSync('project') || '', // 项目信息
    projectId: uni.getStorageSync('projectId') || '',
    projectName: uni.getStorageSync('projectName') || '',
    weatherInfo: uni.getStorageSync('weatherInfo') || {},
    userList: uni.getStorageSync('userList') || [],
    departmentList: uni.getStorageSync('departmentList') || [], //项目下的部门
    departmentTreeList: uni.getStorageSync('departmentTreeList') || [], //项目下的部门树形结构
    departmentUserList: uni.getStorageSync('departmentUserList') || [], //项目下的部门、人员树
    companyDepartmentList: uni.getStorageSync('companyDepartmentList') || [] //公司下的部门
  },
  mutations: {
    // 缓存项目信息
    setSelectedProjectInfo(state, { projectInfo, callBack }) {
      // console.log('设置', projectInfo)
      uni.setStorageSync('projectId', projectInfo.id)
      uni.setStorageSync('projectName', projectInfo.name)
      uni.setStorageSync('project', projectInfo)
      state.projectId = projectInfo.id
      state.projectName = projectInfo.name
      state.project = projectInfo
      callBack()
    },
    // 缓存天气信息
    setWeatherInfo(state, data) {
      uni.setStorageSync('weatherInfo', data)
      state.weatherInfo = data
    },
    // 清除项目信息
    clearProject(state) {
      // console.log('清除')
      state.projectId = ''
      state.projectName = ''
      state.project = {}
      state.weatherInfo = {}
    },
    changeUserList(state, list) {
      uni.setStorageSync('userList', list)
      state.userList = list
    },
    changeDepartmentList(state, list) {
      uni.setStorageSync('departmentList', list)
      let TreeData = toTree(list, 'parentId')
      uni.setStorageSync('departmentTreeList', TreeData)
      state.departmentList = list
      state.departmentTreeList = TreeData
    },
    changeDepartmentUserList(state, list) {
      uni.setStorageSync('departmentUserList', list)
      state.departmentUserList = list
    },
    changeCompanyDepartmentList(state, list) {
      uni.setStorageSync('companyDepartmentList', list)
      state.companyDepartmentList = list
    }
  },
  actions: {
    getUserList({ commit }, projectId) {
      userApi.getUserList(projectId).then(res => {
        let datas = res || []
        // console.log(1122, datas)
        let userList = []
        treeForEach(datas, (e, parent) => {
          e.label = e.name
          if (e.type === 2) {
            e.organId = parent.id
            e.organName = parent.name
          }
          if (e.type === 3) {
            e.organId = parent && parent.organId
            e.organName = parent && parent.organName
            e.roleId = parent.id
            e.roleName = parent.name
            userList.push(e)
          }
        })
        commit('changeUserList', userList)
        commit('changeDepartmentUserList', datas[0]?.children ?? [])
      })
    },
    getDepartmentList({ commit }) {
      userApi.getDepartmentList().then(departmentList => {
        departmentList.map(e => {
          if (e.level === 2) {
            e.parentId = null
          }
        })
        commit('changeDepartmentList', departmentList)
      })
    },
    getCompanyDepartmentList({ commit }) {
      userApi.getCompanyDepartmentList([]).then(departmentList => {
        commit('changeCompanyDepartmentList', departmentList)
      })
    }
  }
}
