// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'view-design'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import 'view-design/dist/styles/iview.css'
import { permissionFn } from '@/utils/permission'
import getLodop from '@/libs/lodop'

// 按需引入element组件
// import {
//   Cascader,
//   Tree,
//   Table,
//   TableColumn,
//   Autocomplete,
//   Button,
//   Input,
//   Popover,
//   DatePicker,
//   Pagination
// } from 'element-ui'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// api引入
import api from './api'

// element组件注册
// Vue.use(Cascader)
// Vue.use(Tree)
// Vue.use(Table)
// Vue.use(TableColumn)
// Vue.use(Autocomplete)
// Vue.use(Button)
// Vue.use(Input)
// Vue.use(Popover)
// Vue.use(DatePicker)
// Vue.use(Pagination)
// Vue.locale('zh-cn', ELEMENT.lang.zhCN)
Vue.use(elementUI, {
  i18n: function (path, options) {
    let value = i18n.t(path, options)
    if (value !== null && value !== undefined) {
      return value
    }
    return ''
  }
})

// 挂载
Vue.prototype.$api = api
Vue.prototype.$permissionFn = permissionFn
Vue.prototype.$getLodop = getLodop

// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: function(path, options) {
    let value = i18n.t(path, options)
    if (value !== null && value !== undefined) {
      return value
    }
    return ''
  }
})

Vue.use(TreeTable)
Vue.use(VOrgTree)

/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
