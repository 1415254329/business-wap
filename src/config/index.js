export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '商管家',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: 'http://127.0.0.1:8199',
    pro: 'https://business.haswallow.com'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  },
  appId: 'wx5ceae484a5b167b5',
  appSecret: 'ff36e8b523ffc31cac4aa979dcc47e9a',
  // https://www.wangwentehappy.tk/wx/bind
  // https://business.haswallow.com/wx/bind
  wxUrl: 'https://business.haswallow.com',
  wxRoutes: [
    '/wx/bind',
    '/wx/member/card',
    '/wx/member/search',
    '/wx/member/record',
    '/wx/staff/store',
    '/wx/staff/search',
    '/wx/staff/bonus'
  ]
}
