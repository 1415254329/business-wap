<template>
  <div class="app-container">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordConfirm">
          <el-input v-model="form.passwordConfirm" placeholder="请确认密码" />
        </el-form-item>
        <el-form-item label="商铺名称" prop="store_name">
          <el-input v-model="form.store_name" placeholder="请输入商铺名称" />
        </el-form-item>
        <el-form-item class="footer">
            <el-button type="primary" @click="submit('form')">创建</el-button>
            <el-button @click="reset('form')">重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
import {
  mapMutations
} from 'vuex'
import { checkPhone } from '@/utils/validate'
export default {
  data () {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      }
      if (checkPhone(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value === '') {
        callback(new Error('密码最小长度为6位，请重新输入!'))
      } else {
        callback()
      }
    }
    const validateAgainPassword = (rule, value, callback) => {
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
        account: '',
        phone: '',
        password: '',
        passwordConfirm: '',
        store_name: ''
      },
      listLoading: false,
      list: [],
      staffList: [],
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        password: [{ required: true, validator: validatePassword }],
        passwordConfirm: [{ required: true, validator: validateAgainPassword }],
        store_name: [{ required: true, message: '请输入商铺名称', trigger: 'blur' }]
      },
      pageVar: {
        page: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [10, 20, 30, 40, 50]
      }
    }
  },
  methods: {
    ...mapMutations(['closeTag']),
    submit (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$api.store.createSubStore(this.form).then(res => {
            this.$Message.success('创建成功')
            this.closeTag(this.$route)
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
  .app-container {
      .el-form {
          width: 400px;
          margin: 0 auto;
      }
  }
</style>
