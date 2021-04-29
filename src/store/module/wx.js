import { setToken, getToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    openId: localStorage.getItem('openId'), // 商户信息
    info: JSON.parse(localStorage.getItem('WXInfo')),
    token: getToken()
  }
}
const state = getDefaultState()

const mutations = {
  setOpenId (state, data) {
    state.openId = data
    localStorage.setItem('openId', data)
  },
  setInfo (state, data) {
    state.info = data
    localStorage.setItem('WXInfo', JSON.stringify(data))
  },
  setToken (state, token) {
    state.token = token
    setToken(token)
  }
}

const actions = {

}

const getters = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
