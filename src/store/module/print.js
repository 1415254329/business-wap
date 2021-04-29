const getDefaultState = () => {
  return {
    isLodopLoad: false,
    setting: JSON.parse(localStorage.getItem('printSetting')) || {
      switch: 0,
      num: 1
    }
  }
}
const state = getDefaultState()

const actions = {

}

const mutations = {
  setIsLodopLoad (state, data) {
    state.isLodopLoad = data
  },
  setSetting (state, data) {
    state.setting.switch = data.switch
    state.setting.num = data.num
    localStorage.setItem('printSetting', JSON.stringify(state.setting))
  }
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
