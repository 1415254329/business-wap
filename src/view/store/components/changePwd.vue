<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="旧密码：" prop="old_password">
        <el-input v-model="form.old_password" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="password">
        <el-input v-model="form.password" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="密码确认：" prop="passwordAgain">
        <el-input v-model="form.passwordAgain" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item>
    <el-button type="primary" @click="submit('form')">确认</el-button>
    <el-button @click="reset('form')">重置</el-button>
  </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value === '') {
        callback(new Error('密码最小长度为6位，请重新输入!'))
      } else {
        callback()
      }
    }
    const validatePasswordAgain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        old_password: '',
        password: '',
        passwordAgain: ''
      },
      rules: {
        old_password: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
        passwordAgain: [{ required: true, validator: validatePasswordAgain, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$api.store.editPassword(this.form).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.reset('form')
          })
        }
      })
    },
    reset (form) {
      this.$nextTick(() => {
        this.$refs[form].resetFields()
      })
    }
  }
}

</script>
<style lang="less" scoped>
.app-container{
    .el-input{
        width: 200px;
    }
    .el-button{
        margin-left: 20px;
    }
}
</style>
