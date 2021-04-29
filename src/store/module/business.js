const getDefaultState = () => {
  return {
    countBoughtUseList: [],
    pointCache: 0 // 买单积分缓存
  }
}
const state = getDefaultState()

const mutations = {
  setCountBoughtUseList (state, data) {
    state.countBoughtUseList = data
  },
  setPoint (state, data) {
    state.pointCache = data
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
