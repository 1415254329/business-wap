<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="店铺名称：">
        <el-input v-model="form.store_name" readonly></el-input>
      </el-form-item>
      <el-form-item label="到期时间：">
        <el-input v-model="form.expiresFormat" readonly></el-input>
      </el-form-item>
      <el-form-item label="门店号码：">
        <el-input v-model="form.trade" :readonly="!(changeFieldIndex===1)"></el-input>
        <el-button v-if="!(changeFieldIndex===1)" @click="changeField(1)">
            <i class="el-icon-edit"></i>
        </el-button>
        <el-button v-else @click="handleEdit()" type="success">
            <i class="el-icon-check"></i>
        </el-button>
      </el-form-item>
      <el-form-item label="负责人电话：">
        <el-input v-model="form.phone" readonly></el-input>
      </el-form-item>
      <el-form-item label="店铺地址：">
        <el-input v-model="form.addr" :readonly="!(changeFieldIndex===2)"></el-input>
        <el-button v-if="!(changeFieldIndex===2)" @click="changeField(2)">
            <i class="el-icon-edit"></i>
        </el-button>
        <el-button v-else @click="handleEdit()" type="success">
            <i class="el-icon-check"></i>
        </el-button>
      </el-form-item>
      <el-form-item label="店铺电话：" >
        <el-input v-model="form.telephone" :readonly="!(changeFieldIndex===3)"></el-input>
        <el-button v-if="!(changeFieldIndex===3)" @click="changeField(3)">
            <i class="el-icon-edit"></i>
        </el-button>
        <el-button v-else @click="handleEdit()" type="success">
            <i class="el-icon-check"></i>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { parseTime, formatTime, keySync } from '@/utils'
export default {
  data () {
    return {
      changeFieldIndex: 0, // 1 行业 2 地址 3 联系电话
      form: {
        store_name: '',
        expire_time: '',
        expiresFormat: '', // 展示字段
        trade: '',
        phone: '',
        addr: '',
        telephone: '',
        logo: '', // 不能缺少字段,提交需要带上
        member_notify_fee: '' // 不能缺少字段,提交需要带上
      }
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      this.$api.store.getStoreDetail().then(res => {
        res.data.expiresFormat = res.data.expire_time ? parseTime(res.data.expire_time) : '不限期'
        keySync(this.form, res.data)
      })
    },
    changeField (index) {
      this.changeFieldIndex = index
    },
    handleEdit () {
    //   ABANDON reason:字段全部必填。。。
    //   let form = {}
    //   if (this.changeFieldIndex === 1) {
    //     form.trade = this.form.trade
    //   } else if (this.changeFieldIndex === 2) {
    //     form.addr = this.form.addr
    //   } else if (this.changeFieldIndex === 3) {
    //     form.telephone = this.form.telephone
    //   }
    // this.submit(form)
      this.submit(this.form)
    },
    submit (form) {
      this.$api.store.editStoreDetail(form).then(res => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.changeFieldIndex = 0
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
