<template>
  <div class="auth">
    <div class="form">
      <div class="form-item">
        <el-input type="number" v-model="form.phone" placeholder="请输入手机号" round/>
      </div>
      <div class="form-footer">
        <el-button @click="bind" type="primary" round>绑定</el-button>
        <el-button @click="unBinding" type="primary" plain round>取消绑定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { checkPhone } from '@/utils/validate'
import { clearToken } from '@/utils/auth'
export default {
  data () {
    return {
      form: {
        phone: '',
        openId: ''
      }
    }
  },
  computed: {
    openId () {
      return this.$store.state.wx.openId
    },
    info () {
      return this.$store.state.wx.info
    }
  },
  watch: {
    openId () {
      this.form.openId = this.$store.state.wx.openId
    },
    info () {
      this.form.phone = this.info.phone
    }
  },
  created () {
    if (this.openId) {
      this.form.openId = this.$store.state.wx.openId
    }
    if (this.info) {
      this.form.phone = this.info.phone
    }
  },
  methods: {
    bind () {
      if (!checkPhone(this.form.phone)) {
        this.$Message.info('手机号格式错误')
        return
      }
      this.$api.wx.bind(this.form).then(res => {
        this.$Message.success('绑定成功')
      })
    },
    unBinding () {
      this.$api.wx.unBind(this.form.openId).then(res => {
        localStorage.removeItem('openId')
        localStorage.removeItem('WXInfo')
        clearToken()
        this.$Message.success('解绑成功')
        this.form.phone = ''
      })
    }
  }
}

</script>

<style lang="less" scoped>
.auth {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .form {
    position: relative;
    z-index: 1;
    width: 70vw;

    &-item {
      margin-bottom: 30px;

      /deep/ .el-input {
        border-radius: 20px;

        .el-input__inner {
          border-radius: 40px;
        }
      }
    }

    &-footer {
      .el-button {
        margin-left: 0;
        margin-bottom: 20px;
        width: 100%;
      }
    }
  }
}
</style>
