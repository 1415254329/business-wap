import axios from 'axios'
import router from '@/router'
import config from '@/config'
import { getToken, clearToken } from '@/utils/auth'
import { Message } from 'element-ui'

// import { Spin } from 'iview'
// const addErrorLog = errorInfo => {
//   const { statusText, status, request: { responseURL } } = errorInfo
//   let info = {
//     type: 'ajax',
//     code: status,
//     mes: statusText,
//     url: responseURL
//   }
//   if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
// }

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        Authorization: getToken(),
        os: 'web'
      }
    }

    return config
  }

  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      if (config.data || config.params) {
        config.data = filterParams(config.data || config.params)
      }

      return config
    }, error => {
      return Promise.reject(error)
    })

    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)

      if (res.data && res.data.code !== 0) {
        if (res.data.code === 401) {
          clearToken()
          if (config.wxRoutes.includes(router.currentRoute.path)) return
          router.push({
            name: 'login'
          })
        }
        Message.error({
          message: res.data.message
        })
        return Promise.reject(res.data.message)
      } else {
        return res.data
      }
    }, error => {
      this.destroy(url)

      console.log('err' + error) // for debug
      Message.error({
        message: error.message
      })
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create({
      timeout: 30000 // 超时
    })
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest

function filterParams (data) { // 不传空字符串的参数
  Object.keys(data).map(key => {
    if (data[key] === '') {
      delete data[key]
    }
  })
  return data
}
