const getDefaultState = () => {
  return {
    stats: {}
  }
}
const state = getDefaultState()

const mutations = {
  setStats (state, data) {
    state.stats = data
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
