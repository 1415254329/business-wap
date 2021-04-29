<template>
  <div class="app-container">
    <el-table :data="[{}]" fit border>
      <el-table-column align="center" label="兑换积分">
        <template slot-scope="scope">
          <el-input v-model.number="form.integral" type="number" placeholder="请输入兑换积分" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="兑换余额">
        <template slot-scope="scope">
          <el-input v-model.number="form.balance" type="number" placeholder="请输入兑换余额" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="145">
        <template slot-scope="scope">
          <el-button @click="submit()" type="primary" size="small">立即兑换</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { parseTime } from '@/utils'
import { initOrderForm } from '@/utils/rule'
function formShape () {
  return {
    integral: '',
    balance: ''
  }
}
export default {
  props: {
    curMember: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      form: formShape(),
      orderForm: initOrderForm()
    }
  },
  created () {
    this.getLastOrderNo()
  },
  methods: {
    getLastOrderNo () {
      this.$api.business.getLastOrderNo().then(res => {
        this.lastOrderNo = res.data ? Number(res.data.order_no) : 0
        this.orderForm.order_no = this.lastOrderNo + 1
      })
    },
    submit () {
      if (!this.curMember.id) {
        this.$Message.info('请先选择会员')
        return
      } else if (!this.form.integral) {
        this.$Message.info('兑换积分不能为0')
        return
      } else if (!this.form.balance) {
        this.$Message.info('兑换余额不能为0')
        return
      }
      this.orderForm.alias = this.curMember.alias
      this.orderForm.phone = this.curMember.phone
      this.orderForm.gender = this.curMember.gender
      this.orderForm.member_id = this.curMember.id
      this.orderForm.integral = -this.form.integral
      this.orderForm.prestore_price = this.form.balance
      this.orderForm.order_time = parseTime(new Date())
      this.$api.business.addOrder(this.orderForm).then(res => {
        this.$Message.success('兑换成功')
        this.orderForm.order_no += 1
        this.$emit('order-success', {
          noPrint: true,
          memberRefresh: true
        })
        this.form = formShape()
      }, err => {
        console.log(err)
        this.$Notice.error({
          title: '错误',
          desc: '兑换失败',
          duration: 30
        })
        this.loading = false
      })
    }
  }
}

</script>

<style lang="less" scoped>
  .app-container {
    margin-top: 20px;
  }
</style>
