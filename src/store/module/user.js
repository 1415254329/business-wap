import { login as storeLogin } from '@/api/user'
import { login as staffLogin } from '@/api/staff'
import { setToken, getToken, clearToken } from '@/utils/auth'
import store from '@/store'

export default {
  namespaced: true,
  state: {
    userType: localStorage.getItem('userType'), // 当前用户类型
    password: localStorage.getItem('pwd'), // 需要密码验证，此处缓存
    token: getToken(),
    userInfo: JSON.parse(localStorage.getItem('userInfo'))
  },
  mutations: {
    setUserType (state, data) {
      state.userType = data
      localStorage.setItem('userType', data)
    },
    setPassword (state, data) {
      state.password = data
      localStorage.setItem('pwd', data)
    },
    setUserInfo (state, data) {
      state.userInfo = data
      localStorage.setItem('userInfo', JSON.stringify(data))
    },
    setToken (state, data) {
      state.token = data || []
      setToken(data)
    },
    logout (state) {
      // TODO 登出只做用户信息方面的移除remove token
      // localStorage.clear()
      clearToken()
      localStorage.removeItem('userType')
      localStorage.removeItem('pwd')
      localStorage.removeItem('userInfo')
      // 暂且先重新存下需要信息,做完在调
      localStorage.setItem('userInfo', JSON.stringify(store.getters.userInfo))
    }
  },
  getters: {

  },
  actions: {
    // 登录
    handleLogin ({ commit }, form) {
      return new Promise((resolve, reject) => {
        let login
        if (form.type === 'store') {
          login = storeLogin
        } else if (form.type === 'staff') {
          login = staffLogin
        } else {
          reject(new Error('登录类型错误'))
        }
        login && login(form).then(res => {
          commit('setUserType', form.type)
          commit('setToken', res.data.token)
          commit('setUserInfo', res.data)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('setToken', '')
        commit('logout')
        resolve()
      })
    }
  }
}
