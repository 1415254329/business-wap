import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { Notification } from 'element-ui'
import { setToken, getToken, canTurnTo, setTitle } from '@/utils/auth'
import { getUserInfo } from '@/api/user'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

// const turnTo = (to, access, next) => {
//   if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
//   else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
// }

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()

  // 自定义title
  if (to.fullPath === '/business/buy/consume') {
    to.meta.title = '快速消费'
  } else if (to.fullPath === '/business/buy/good') {
    to.meta.title = '买单收银'
  } else if (to.fullPath === '/business/buy/integral') {
    to.meta.title = '积分兑换'
  }
  // console.log(store)

  if (token) {
    getUserInfo().then((res) => {
      store.commit('user/setUserInfo', res.data)
    })
  }
  if (to.name === homeName) {
    store.commit('setTagNavList', [store.state.app.homeRoute])
  }

  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页或在白名单中
    if (config.wxRoutes.includes(to.path)) {
      next()
    } else {
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      })
    }
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    // if (store.state.user.hasGetInfo) {
    //   turnTo(to, store.state.user.access, next)
    // } else {
    //   store.dispatch('getUserInfo').then(user => {
    //     console.log(user)
    //     // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
    //     turnTo(to, user.access, next)
    //   }).catch(() => {
    //     setToken('')
    //     next({
    //       name: 'login'
    //     })
    //   })
    // }
    let blackList = [
      '/directive/directive_page',
      '/staff/staff_page',
      '/finance',
      '/system/system_settings',
      '/store'
    ]
    if (store.state.user.userType === 'staff' && blackList.includes(to.path)) {
      Notification({
        type: 'error',
        title: '错误',
        message: '无访问权限',
        duration: 3000
      })
      iView.LoadingBar.finish()
    } else {
      next()
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
