const getDefaultState = () => {
  return {
    currentFn: []
  }
}

const state = getDefaultState()

const actions = {

}

const mutations = {
  setCurrentFn (state, data) {
    state.currentFn = data
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
