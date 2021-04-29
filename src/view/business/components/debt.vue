<template>
  <div class="debt">
    <h3 class="title">还款</h3>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="订单日期" prop="repay_time">
        <el-date-picker class="custom" v-model="form.repay_time" type="datetime" placeholder="选择日期时间" align="right"
          :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="还款金额" prop="arrears_price">
        <el-input class="custom" v-model="form.arrears_price" type="number" placeholder="请输入还款金额" />
      </el-form-item>
      <el-form-item label="支付方式">
        <div class="payments">
          <div v-for="(item,index) in paymentList" :key="index">
            <el-input size="large" type="number" v-model="item.amount_price" class="input-commission">
              <span slot="prepend">{{ item.payment_name }}</span>
            </el-input>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div style="text-align:center">
      <el-button type="primary" @click="submit('form')">提交</el-button>
      <el-button @click="reset('form')">重置</el-button>
    </div>
  </div>
</template>
<script>
import {
  initPaymentList
} from '@/utils/rule'
import {
  parseTime
} from '@/utils'
export default {
  props: {
    curMember: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      paymentCache: {},
      paymentList: initPaymentList(),
      form: {
        arrears_price: '',
        memo: '',
        payments: '',
        repay_time: ''
      },
      rules: {
        arrears_price: [{
          required: true,
          message: '请输入还款金额',
          trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    'form.arrears_price' (v) {
      let find = this.paymentList.find(v => v.payment_name === '现金')
      find.amount_price = v
      this.paymentCache = JSON.parse(JSON.stringify(find))
    }
  },
  created () {
    this.watchPays()
  },
  methods: {
    watchPays () {
      let self = this
      let findCashPayment = this.paymentList.find(v => v.payment_name === '现金')
      this.paymentList.forEach((v, i, arr) => {
        if (['现金'].includes(v.payment_name)) {
          return
        }
        arr[i] = new Proxy(v, {
          set (obj, prop, value) {
            obj[prop] = value
            firstCompute()
            return true
          }
        })
      })

      function firstCompute () {
        let otherPrice
        otherPrice = self.paymentList.reduce((pre, cur) => {
          if (['现金'].includes(cur.payment_name)) {
            return pre
          }
          return pre + Number(cur.amount_price)
        }, 0)
        if (Object.keys(self.paymentCache).length) {
          if (self.paymentCache.amount_price - otherPrice < 0) {
            self.$Message.info('计算过后的值不能小于0，请自行手动修改')
          } else {
            findCashPayment.amount_price = Number(self.paymentCache.amount_price - otherPrice).toFixed(2)
          }
        }
      }
    },
    submit (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let priceSum = this.paymentList.reduce((pre, cur) => {
            return pre + (cur.amount_price ? Number(cur.amount_price) : 0)
          }, 0)
          if (priceSum !== Number(this.form.arrears_price)) {
            this.$Message.error('支付方式金额总和不等于还款金额')
            return
          }

          this.form.payments = JSON.stringify(this.paymentList.filter(v => v.amount_price))
          delete this.form.arrears_price
          if (!this.form.repay_time) {
            this.form.repay_time = parseTime(new Date())
          }
          this.$api.member.editMemberDebt(this.curMember.id, this.form).then(res => {
            // this.reset('form')
            // this.paymentCache = {}
            // this.paymentList.map(v => {
            //   if (v.amount_price) {
            //     v.amount_price = ''
            //   }
            // })
            this.$Message.success('还款成功')
            this.$emit('success')
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
  .debt {
    .title {
      margin-bottom: 20px;
    }
    .el-form{
        .custom{
            width: 260px;
        }
    }

    .payments {
      display: flex;
    }
  }

</style>
