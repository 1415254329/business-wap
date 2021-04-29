<template>
  <div v-if="regs === 1">
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
      <FormItem prop="account">
        <Input v-model="form.account" placeholder="请输入账号">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
        </Input>
      </FormItem>
      <FormItem>
        <Button @click="handleSubmit" type="primary" long>登录</Button>
      </FormItem>
      <FormItem >
        <div class="footer">
        <el-radio-group v-model="loginType" class="choostType">
          <el-radio :label="1">商户</el-radio>
          <el-radio v-if="$store.getters.userInfo" :label="2">员工</el-radio>
        </el-radio-group>
        <span class="login-tip" @click="forgotShow = true">找回密码</span>
        <span class="login-tip" @click="reg(2)">立即注册</span>
        </div>
        </FormItem>
    </Form>
    <Modal v-model="forgotShow" className="forgotForm" width="450">
      <Form ref="forgotForm" :model="forgotForm" @keydown.enter.native="handleForgot">
      <FormItem prop="account">
        <Input v-model="forgotForm.account" placeholder="请输入手机号" />
      </FormItem>
      <FormItem>
        <Button @click="handleForgot" type="primary" long>确认</Button>
      </FormItem>
    </Form>
      <div slot="footer"/>
    </Modal>
  </div>
  <div v-else>
    <Form ref="reg_form" :model="reg_form" :rules="rules" @keydown.enter.native="handleSubmit">
      <FormItem prop="account">
        <Input v-model="reg_form.account" placeholder="请输入账号">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
        </Input>
      </FormItem>
      <FormItem prop="phone">
        <Input v-model="reg_form.phone" placeholder="请输入手机号" :maxlength="11" type="number">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
        </Input>
      </FormItem>
      <FormItem prop="store_name">
        <Input v-model="reg_form.store_name" placeholder="请输入商户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="reg_form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
        </Input>
      </FormItem>
      <FormItem prop="password2">
        <Input type="password" v-model="reg_form.password2" placeholder="请再次确认密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
        </Input>
      </FormItem>
      <FormItem>
        <Button @click="register" type="primary" long>注册</Button>
      </FormItem>
      <span class="login-tip" @click="reg(1)">立即登录</span>
    </Form>
  </div>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    passwordRules: {
      type: Array,
      default: () => {

      }
    },
    passwordRules2: {
      type: Array,
      default: () => {
        return [

        ]
      }
    },
    shopName: {
      type: Array,
      default: () => {
        return [

        ]
      }
    },
    account: {
      type: Array,
      default: () => {
        return []
      }
    },
    phoneRules: {
      type: Array,
      default: () => {
        return [{
          required: true,
          message: '手机号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^1[3456789]\d{9}$/,
          message: '手机号码格式不正确',
          trigger: 'blur',
          max: 11
        }
        ]
      }
    }
  },
  data () {
    return {
      loginType: 1,
      // 登录数据
      form: {
        account: '',
        password: ''
      },
      // 注册数据
      reg_form: {
        phone: '',
        store_name: '',
        password: '',
        password2: '',
        account: ''
      },
      forgotForm: {
        account: ''
      },
      forgotShow: false,
      regs: 1
    }
  },
  computed: {
    rules () {
      return {
        phone: this.phoneRules,
        store_name: this.store_name,
        password: this.passwordRules,
        password2: this.passwordRules2,
        account: this.account
      }
    }
  },
  methods: {
    // 登录
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            account: this.form.account,
            password: this.form.password,
            loginType: this.loginType
          })
        } else {
          this.$Message.info('请填写完整')
        }
      })
    },
    // 注册
    register () {
      this.$refs.reg_form.validate((valid) => {
        if (valid) {
          if (this.reg_form.password != this.reg_form.password2) {
            this.$Message.info('两次密码不一致！')
          } else {
            this.$emit('register', {
              phone: this.reg_form.phone,
              password: this.reg_form.password,
              store_name: this.reg_form.store_name,
              account: this.reg_form.account
            })
          }
        } else {
          this.$Message.info('请填写完整')
        }
      })
    },
    handleForgot () {
      this.$api.user.forgotPWD(this.forgotForm).then(res => {
        this.forgotShow = false
        this.$Message.success('提交成功')
      })
    },
    reg (e) {
      if (e === 1) {
        this.$refs.reg_form.resetFields()
      } else if (e === 2) {
        this.$refs.loginForm.resetFields()
      }

      this.regs = e
    }
  }
}

</script>

<style lang="less" scoped>
/deep/.forgotForm{
  .ivu-modal-body{
    padding-top: 60px;
  }
  .ivu-modal-footer{
    display: none;
  }
}
.footer{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
/deep/ .choostType{
    .el-radio__label{
      color: white !important;
    }
    .el-radio__input.is-checked+.el-radio__label{
      color: white !important;
    }
}
</style>
