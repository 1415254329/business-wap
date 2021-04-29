import { getStoreList } from '@/api/business'

const getDefaultState = () => {
  return {
    storeList: ''
  }
}
const state = getDefaultState()

const mutations = {
  setStoreList (state, data) {
    state.storeList = data || []
  }
}

const actions = {
  // 目前设定存储机制(之前架构过于混乱，不做变更)
  // 在页面周期当中若有变更直接重新调用该action函数刷新列表或者自己操作调用mutation变更列表
  refreshStoreList ({ commit }) {
    return new Promise((resolve, reject) => {
      getStoreList().then(res => {
        state.storeList = res.data || []
        resolve(res.data)
      })
    })
  },
  /**
   * @param id 商户id
   */
  findStore ({ state, commit }, id) {
    return new Promise(resolve => {
      isStoreListExist(state.storeList, commit).then(() => {
        resolve(state.storeList.find(v => {
          return v.id === id
        }))
      })
    })
  }
}

const getters = {

}

function isStoreListExist (l, commit) {
  return new Promise((resolve, reject) => {
    if (!l) {
      getStoreList().then(res => {
        commit('setStoreList', res.data)
        resolve()
      })
    } else {
      resolve()
    }
  })
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
