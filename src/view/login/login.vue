<template>
  <div class="login">
    <h2 class="title">玄鸟Haswallow</h2>
    <div class="login-con">
      <div class="login-container">
        <div class="login-container-header">商管家</div>
        <login-form class="login-container-content"
            @on-success-valid="handleSubmit"
            @register="reg"></login-form>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'

export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions('user', ['handleLogin']),
    handleSubmit ({ account, password, loginType }) {
      let form = {
        account: account,
        password: password
      }
      this.$store.commit('user/setPassword', password)
      if (loginType === 1) {
        this.handleLogin(Object.assign({}, form, { type: 'store' })).then((res) => {
          this.$Message.info('登录成功！')
          this.$router.push({ name: this.$config.homeName })
        })
      } else if (loginType === 2) {
        if (this.$store.getters.userInfo) {
          ({
            id: form['tenant_id'],
            master_id: form['master_id']
          } = this.$store.getters.userInfo)
        }

        this.handleLogin(Object.assign({}, form, { type: 'staff' })).then((res) => {
          this.$Message.info('登录成功！')
          this.$router.push({ name: this.$config.homeName })
        })
      }
    },
    reg ({ account, phone, password, store_name }) {
      this.$api.user.register({ account, phone, password, store_name }).then((res) => {
        if (res.code === 0) {
          this.$Modal.info({
            content: '注册成功！请前往登录',
            onOk () {
              location.href = ''
            }
          })
        } else {
          this.$Message.info(res.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./login.less";
</style>
