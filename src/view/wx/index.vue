<template>
  <div class="wx" v-loading="loading" element-loading-text="自动登录中">
    <router-view></router-view>
  </div>
</template>
<script>
import {
  uuid
} from '@/utils'
export default {
  data () {
    return {
      loading: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if (!this.$store.state.wx.openId) {
        this.getCode().then(res => {
          res && this.getAccess(res).then(res => {
            this.$store.commit('wx/setOpenId', res.data.openid)
            this.getBindInfo(res.data.openid)
          })
        })
      } else if (!this.$store.state.wx.info) {
        this.getBindInfo(this.$store.state.wx.openId)
      } else if (!this.$store.state.wx.token) {
        this.login(openId)
      }
    },
    getCode () {
      return getParam('code').then(res => {
        if (res) {
          return res
        } else {
          let state = uuid()
          window.location.href =
              `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5ceae484a5b167b5` +
              `&redirect_uri=${encodeURIComponent(this.$config.wxUrl + this.$route.path)}&response_type=code` +
              `&scope=snsapi_userinfo&state=${state}#wechat_redirect`
        }
      })

      function getParam (pname) {
        return new Promise(resolve => {
          var params = window.location.search.substr(1)
          var ArrParam = params.split('&')
          if (ArrParam.length === 1) {
            resolve(params.split('=')[1])
          } else {
            for (var i = 0; i < ArrParam.length; i++) {
              if (ArrParam[i].split('=')[0] === pname) {
                resolve(ArrParam[i].split('=')[1])
              }
            }
          }
        })
      }
    },
    getAccess (code) {
      return this.$api.wx.getAccess(code)
    },
    getBindInfo (openId) {
      this.$api.wx.getBindInfo(openId).then(res => {
        if (res.data.bind) {
          this.$store.commit('wx/setInfo', res.data.bind)
          if (!this.$store.state.wx.token) {
            this.login(openId)
          }
        } else if (this.$route.path !== '/wx/bind') {
          this.$router.replace('/wx/bind')
          this.$Message.success('微信未绑定手机号，请先绑定')
        }
      })
    },
    login (openid) {
      this.loading = true
      this.$api.wx.login(openid).then(res => {
        this.loading = false
        this.$Message.success('自动登录成功')
        this.$store.commit('wx/setToken', res.data)
      }, err => {
        this.loading = false
        console.log(err)
      })
    }
  }
}

</script>
<style lang="less" scoped>
.wx{
  height: 100vh;
  overflow: auto;
}
</style>
