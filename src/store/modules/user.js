import { getToken, setToken, removeToken } from '@/utils/auth'
import { loginApi } from '@/api/login'
const state = {
  token: getToken() || '',
  userId: uni.getStorageSync('userId') || '',
  userName: uni.getStorageSync('userName') || '',
  telephone: uni.getStorageSync('telephone') || '',
  roleTexts: uni.getStorageSync('roleTexts') || '', //用户的角色文本
  headImage: uni.getStorageSync('headImage') || '/static/images/default-user.png',
  mobile: uni.getStorageSync('mobile') || '',
  loginInfo: uni.getStorageSync('loginInfo') || '' // 登录信息,用于自动登录
}

const mutations = {
  // 保存登录信息,用于自动登录
  saveLoginInfo(state, info) {
    uni.setStorageSync('loginInfo', info)
    state.loginInfo = info
  },
  setToken(state, token) {
    setToken(token)
    state.token = token
  },
  // 登录成功后将用户信息存储到storge和vuex中
  setUserInfo(state, data) {
    Object.keys(data).forEach(key => {
      let value = data[key] ? data[key] : ''
      state[key] = value
      uni.setStorageSync(key, value)
    })
  },
  // 退出时清空用户信息包含storge和vuex
  logOut(state) {
    removeToken()
    uni.clearStorageSync()
    this.commit('clearProject')
    this.commit('clearPower')
    Object.keys(state).forEach(key => {
      state[key] = ''
    })
  }
}
const actions = {
  async getUserInfo({ commit }) {
    //获取用户信息
    //成功后设置到storge和vuex中
    let result = await loginApi.getUserInfo()
    let datas = result.data
    console.log(datas)
    if (result.code === 200 && datas) {
      let roleTexts = datas.roleTexts.length > 0 ? datas.roleTexts.join(' ') : '暂无'
      let model = {
        userId: datas.id,
        userName: datas.realName,
        telephone: datas.telephone,
        roleTexts,
        headImage: datas.headImage,
        mobile: datas.mobile
      }
      commit('setUserInfo', model)
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
