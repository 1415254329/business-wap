import Vue from 'vue'
import Vuex from 'vuex'

import app from './module/app'
import permission from './module/permission'
import user from './module/user'
import store from './module/store'
import member from './module/member'
import business from './module/business'
import print from './module/print'
import wx from './module/wx'

import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    app,
    permission,
    user,
    store,
    member,
    business,
    print,
    wx
  },
  getters
})
