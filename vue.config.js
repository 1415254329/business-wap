const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}
const IS_PROD = 'production'.includes(process.env.NODE_ENV)

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : '/'
const port = process.env.port || process.env.npm_config_port || 9528

module.exports = {
  baseUrl: BASE_URL,
  assetsDir: 'assets',
  lintOnSave: false,
  productionSourceMap: false,
  css: {
    extract: IS_PROD, // css分离,不支持HMR
    sourceMap: !IS_PROD,
    loaderOptions: {
      less: {
        prependData: '@import "@a/css/frame.less";'
      }
    }
  },
  devServer: {
    port: port,
    https: false,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    }
    // proxy: {
    //   '/api': {
    //     target: 'https://business.haswallow.com'
    //   }
    // }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@a', resolve('src/assets'))
      .set('_c', resolve('src/components'))
    config.module
      .rule('vue')
      .use('iview')
      .loader('iview-loader')
      .options({
        prefix: false
      })
  },
  configureWebpack: (config) => {
    if (IS_PROD) {
      // 生产环境配置...
      config.mode = 'production'
      // vuecli默认引入依赖terser，在这个基础上直接添加属性即可
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
      // 配置splitChunks, 将公用组件，样式等等提取出来,减少打包体积
      config.optimization.splitChunks = {
        cacheGroups: {
          common: {
            name: 'common',
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            reuseExistingChunk: true,
            enforce: true
          },
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'initial',
            priority: 2,
            reuseExistingChunk: true,
            enforce: true
          },
          elementUI: {
            name: 'elementui',
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            chunks: 'all',
            priority: 3,
            reuseExistingChunk: true,
            enforce: true
          },
          iview: {
            name: 'iview',
            test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
            chunks: 'all',
            priority: 4,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
    }
  }
}
