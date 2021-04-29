import Vue from 'vue'
import store from '@/store'

Vue.directive('permission', {
  bind: function (el, binding) {
    if (store.state.user.userType === 'store') return
    if (!store.state.permission.currentFn.includes(binding.value)) {
      el.disabled = 'disabled'
      !el.classList.contains('is-disabled') && el.classList.add('is-disabled')
    }
  }
})

export const permissionFn = { // 功能权限
  // 通用权限
  generalFn: [],
  // 可配置权限
  asyncFn: [{
    id: 1,
    label: '会员注册'
  },
  {
    id: 2,
    label: '会员编辑'
  },
  {
    id: 3,
    label: '会员充值'
  }],
  // 只读
  readOnly: () => ['staff'].includes(store.state.user.userType)
}
