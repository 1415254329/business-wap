<template>
  <div class="el-table-custom">
    <!-- 开卡表  -->
    <el-table class="table-consume-custom"  header-cell-class-name="el-table-header-cell-custom" :data="[{}]" fit border>
      <el-table-column align="center" label="充值金额" min-width="80">
        <template slot-scope="scope">
          <Input v-model="orderForm.prestore_price" type="number" @mousewheel.native.prevent />
        </template>
      </el-table-column>
      <el-table-column align="center" label="赠送金额" min-width="80">
        <template slot-scope="scope">
          <Input v-model="orderForm.giving_price" type="number" @mousewheel.native.prevent />
        </template>
      </el-table-column>
      <el-table-column align="center" label="积分" min-width="80">
        <template slot-scope="scope">
          <Input v-model="orderForm.integral" type="number" @mousewheel.native.prevent />
        </template>
      </el-table-column>
      <el-table-column v-for="(item,index) in bonusList" :key="index" align="center" :label="`提成人${index+1}`">
          <el-table-column align="center" label="工号" width="80">
            <template slot-scope="scope">
              <Poptip trigger="focus" placement="bottom" popper-class="poptip-staff" transfer>
                <Input v-model="item.show_num" placeholder="请选择" />
                <div slot="content" class="positionList">
                  <div v-for="(pItem,pIndex) in staffSortList" :key="pIndex" class="positionList-item">
                    <span class="title">{{pItem.alias}}：</span>
                    <div class="staffList">
                      <div @click="chooseStaff(item,pItem,sItem)" v-for="(sItem,sIndex) in pItem.staffList"
                        :key="sIndex" class="staffList-item">
                        {{sItem.serial_num+' '+sItem.staff_name}}
                      </div>
                    </div>
                  </div>
                </div>
              </Poptip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="指定" width="50">
            <template slot-scope="scope">
              <Checkbox v-model="item.specified_switch"></Checkbox>
            </template>
          </el-table-column>
          <el-table-column align="center" label="业绩">
            <template slot-scope="scope">
              <Input v-model="item.performance_price" type="number" @mousewheel.native.prevent />
            </template>
          </el-table-column>
          <el-table-column align="center" label="提成">
            <template slot-scope="scope">
              <Input v-model="item.dividends_price" type="number" @mousewheel.native.prevent />
            </template>
          </el-table-column>
        </el-table-column>
    </el-table>
    <Form :model="orderForm" :label-width="80" ref="orderForm" label-position="right">
      <FormItem label="支付方式" style="margin-top:25px">
        <div v-for="(item,index) in memberPaymentList" :key="index">
          <Col span="2">
          <Input size="large" v-model="item.amount_price" class="input-commission">
          <span slot="prepend">{{ item.payment_name }}</span>
          </Input>
          </Col>
        </div>
      </FormItem>
      <div class="row">
        <FormItem label="订单日期">
          <DatePicker type="datetime" placeholder="订单日期" v-model="order_time" format="yyyy-MM-dd HH:mm:ss"
          :readonly="$permissionFn.readOnly()"/>
        </FormItem>
        <div style="display:flex;align-items:center">
          <FormItem label="手工单号">
            <Input size="large" v-model="orderForm.order_no" type="number" @mousewheel.native.prevent />
          </FormItem>
          <Form-item label="手工单号是否重复">
            <Switch v-model="orderForm.ignore_order_no" :true-value="1" :false-value="0">
              <span slot="1">是</span>
              <span slot="0">否</span>
            </Switch>
          </Form-item>
        </div>
        <Form-item label="备注">
          <Input v-model="orderForm.memo" placeholder="请输入备注" />
        </Form-item>
      </div>
      <div class="row">
        <Form-item label="是否发送信息提醒">
          <Switch v-model="orderForm.notify" size="large" :true-value="1" :false-value="0">
            <span slot="1">是</span>
            <span slot="0">否</span>
          </Switch>
        </Form-item>
      </div>
    </Form>
    <div class="row" style="justify-content:space-between;">
      <span style="color: red; font-size: 22px">{{`结算：${orderForm.prestore_price}`}}</span>
      <Button class="btn-confirm" type="primary" size="large" :loading="loading" @click="submit">{{loading?'提交中':'确定'}}</Button>
    </div>
  </div>
</template>

<script>
import {
  initOrderForm,
  initBonusList,
  initPaymentList,
  card,
  calculate,
  initSMS
} from '@/utils/rule'

import {
  parseTime
} from '@/utils'

export default {
  props: {
    ruleList: {
      type: Object,
      default: () => {}
    },
    curMember: {
      type: Object,
      default: () => {}
    },
    curMemberRule: {
      type: Object,
      default: () => {}
    },
    presentRule: {
      type: Array,
      default: () => []
    },
    memberRuleList: {
      type: Array,
      default: () => []
    },
    positionList: {
      type: Array,
      default: () => []
    },
    staffList: {
      type: Array,
      default: () => []
    },
    staffSortList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loading: false,
      locationMap: [],
      lastOrderNo: 0,
      order_time: '',
      orderForm: initOrderForm({
        consume_type: 5
      }),
      bonusList: initBonusList('tenant_prestore', '充值'),
      paymentCache: {},
      memberPaymentList: initPaymentList()
    }
  },
  watch: {
    'orderForm.prestore_price' (v) {
      this.memberPaymentList[0].amount_price = v
      this.paymentCache = JSON.parse(JSON.stringify(this.memberPaymentList.find(v => v.payment_name === '现金')))
      this.computeAll()
      Object.keys(this.curMemberRule).length && this.pointCompute()
      this.presentCompute()
    },
    'orderForm.giving_price' () {
      this.computeAll()
    },
    order_time (v) {
      if (parseTime(v, '{h}:{i}:{s}') === '00:00:00') {
        this.order_time = new Date(parseTime(v, '{y}-{m}-{d}') + ' ' + parseTime(new Date(), '{h}:{i}:{s}'))
      }
    }
  },
  created () {
    this.$api.business.getLastOrderNo().then(res => {
      this.lastOrderNo = res.data ? Number(res.data.order_no) : 0
      this.orderForm.order_no = this.lastOrderNo + 1
    })
    this.watchBonus()
    this.memberPaymentList.splice(3, 0, {
      payment_name: '欠款',
      amount_price: ''
    })
    this.watchPays()
  },
  methods: {
    chooseStaff (item, pItem, sItem, index) {
      item.staff_id = sItem.id
      item.show_num = sItem.serial_num
      item.cur_position = sItem.position[pItem.id]
    },
    matchRule (v) { // 根据会员等级,职位匹配计算规则
      // 根据职位id获取规则
      if (Object.keys(v.cur_position).length) {
        let isChild = Boolean(v.cur_position.position_id)
        if (isChild && this.ruleList.hasOwnProperty(v.cur_position.position_id) && this.ruleList[v.cur_position.position_id].rule) {
          // 取副职业
          v.rule = JSON.parse(this.ruleList[v.cur_position.position_id].rule)
        } else if (this.ruleList.hasOwnProperty(v.cur_position.department_id) && this.ruleList[v.cur_position.department_id].rule) {
          // 取主职业
          v.rule = JSON.parse(this.ruleList[v.cur_position.department_id].rule)
        } else {
          this.$Message.warning(`50001:当前职位并未设置开卡规则，请手动输入提成及业绩`)
          v.rule = JSON.parse(JSON.stringify(card))
          return
        }

        // 根据会员等级精确规则
        if (!this.curMember.hierarchy) {
          if (v.rule['normal']) {
            v.rule = v.rule['normal']
          } else if (v.rule['all']) {
            v.rule = v.rule['all']
          } else {
            this.$Message.warning(`50002:当前职位并未设置散客消费规则，请手动输入提成及业绩`)
            v.rule = JSON.parse(JSON.stringify(card))
          }
        } else {
          if (v.rule[this.curMember.hierarchy]) {
            v.rule = v.rule[this.curMember.hierarchy]
          } else if (v.rule['all']) {
            v.rule = v.rule['all']
          } else {
            this.$Message.warning(`50003:当前职位并未设置对应会员消费规则，请手动输入提成及业绩`)
            v.rule = JSON.parse(JSON.stringify(card))
          }
        }
      }
    },
    getLocationMap () { // 获取当前位置映射
      this.locationMap = []
      this.bonusList.forEach((v, i) => {
        if (v.staff_id) {
          this.locationMap.push(i)
        }
      })
    },
    computeAll () {
      this.locationMap.forEach((v, i) => {
        if (!this.bonusList[v].staff_id) return
        let rule = JSON.parse(JSON.stringify(this.bonusList[v].rule[this.locationMap.length].employees[i]))
        let result = calculate(rule,
          this.orderForm.prestore_price,
          this.orderForm.giving_price,
          this.bonusList[v].specified_switch)
        this.bonusList[v].performance_price = result.pgSum
        this.bonusList[v].dividends_price = result.commission
      })
    },
    presentCompute () {
      if (this.presentRule.length) {
        let curIndex = -1
        this.presentRule.forEach((v, i, arr) => {
          if (this.orderForm.prestore_price >= Number(v.price)) {
            if (curIndex >= 0) {
              Number(arr[curIndex].price) < Number(v.price) && (curIndex = i)
            } else {
              curIndex = i
            }
          }
        })
        if (curIndex >= 0) {
          this.orderForm.giving_price = Number(this.presentRule[curIndex].giving_price)
        } else {
          this.orderForm.giving_price = 0
        }
      }
    },
    pointCompute () {
      this.orderForm.integral = Number(this.curMemberRule.prestore_integral) ? Number(this.orderForm.prestore_price / this.curMemberRule.prestore_integral).toFixed(2) : 0
    },
    watchBonus () {
      let self = this

      for (let i = 0; i <= 2; i++) {
        let data = JSON.parse(JSON.stringify(this.bonusList[0]))
        if (i === 0) {
          data.type = 'tenant_deposit'
        } else {
          data.index = i + 1
          this.bonusList.push(data)
        }
      }

      this.bonusList.forEach((v, i) => {
        this.bonusList[i] = new Proxy(v, {
          set (obj, prop, value, receiver) {
            obj[prop] = value
            if (prop === 'show_num') {
              if (obj.show_num === '') {
                obj.staff_id = ''
                obj.specified_switch = false
                obj.performance_price = ''
                obj.dividends_price = ''
                self.computeAll()
              }
            } else if (prop === 'staff_id' || prop === 'cur_position') {
              self.getLocationMap()
              if (obj.staff_id && Object.keys(obj.cur_position).length) {
                self.matchRule(obj)
                self.computeAll()
                return true
              }
            } else if (prop === 'specified_switch') {
              self.computeAll()
            } else if (prop === 'performance_price') {
              let num = self.locationMap.length
              let pos = self.bonusList.findIndex(v => v === self.bonusList[i]) // 在orderForm中的位置
              let realPos = self.locationMap.indexOf(pos)
              realPos >= 0 && (obj.dividends_price = obj.performance_price ? calculate(JSON.parse(JSON
                .stringify(obj.rule[num].employees[realPos])),
              self.orderForm.prestore_price,
              self.orderForm.giving_price,
              obj.specified_switch,
              Object.assign({}, {
                assign: 'commission',
                custom: {
                  pgSum: obj.performance_price
                }
              })).commission : 0)
            }
            return true
          }
        })
      })
    },
    watchPays () {
      let self = this
      let findCashPayment = this.memberPaymentList.find(v => v.payment_name === '现金')
      this.memberPaymentList.forEach((v, i, arr) => {
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
        otherPrice = self.memberPaymentList.reduce((pre, cur) => {
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
    submit () {
      // if (!(this.orderForm.prestore_price + this.orderForm.giving_price)) {
      //   this.$Message.error('充值金额不能为零')
      //   return
      // } else
      // if (this.orderForm.order_no <= this.lastOrderNo) {
      //   this.$Message.error('手工单号不能小于提供的预设单号')
      //   return
      // }

      this.loading = true

      let paymentPrice = this.memberPaymentList.reduce((pre, cur) => {
        if (cur.amount_price) return pre + Number(cur.amount_price)
        return pre
      }, 0)
      if (paymentPrice !== Number(this.orderForm.prestore_price)) {
        this.$Message.error('支付方式金额总和与充值金额不一致')
        this.loading = false
        return
      }

      this.bonusList.map(v => {
        delete v.rule
        // delete v.cur_position
        delete v.index
      })
      this.orderForm.member_id = this.curMember.id
      this.orderForm.bonus = JSON.stringify(this.bonusList.filter(v => {
        if (!v.staff_id) {
          return false
        }
        delete v.show_num
        delete v.rule
        // delete v.cur_position
        delete v.index
        return true
      }))
      this.orderForm.payments = JSON.stringify(this.memberPaymentList.filter(v => {
        if (!Number(v.amount_price)) {
          return false
        }
        if (v.payment_name === '免单') {
          this.orderForm.consume_type = 2
        }
        if (v.payment_name === '欠款') {
          this.orderForm.payment_arrears = Number(v.amount_price)
          this.orderForm.consume_type = 1
        }
        return true
      }))
      this.orderForm.order_time = parseTime(this.order_time !== ''
        ? this.order_time
        : new Date())

      this.orderForm.bonus === '[]' && (this.orderForm.bonus = '')
      this.orderForm.payments === '[]' && (this.orderForm.payments = '')

      this.orderForm.alias = this.curMember.alias || ''
      this.orderForm.phone = this.curMember.phone || ''
      this.orderForm.gender = this.curMember.gender || 0
      this.orderForm.gross_price = Number(this.orderForm.prestore_price)
      this.orderForm.profit_price = this.orderForm.gross_price

      if (Object.keys(this.curMember).length) {
        this.orderForm.notify_format = initSMS('recharge', this.curMember, this.orderForm)
      }
      this.$api.business.addOrder(this.orderForm).then(res => {
        this.loading = false
        this.$emit('success', {
          type: 'recharge',
          order: this.orderForm
        })
        this.$Message.success('充值成功')
      }, err => {
        console.log(err)
        this.$Notice.error({ // 严重错误提示（是否特定返回code码统一判断？）
          title: '错误',
          desc: '充值失败',
          duration: 30
        })
        this.loading = false
      })
    }
  }
}

</script>

<style lang="less" scoped>
  .row {
    margin: 10px 0;
    display: flex;
    align-items: center;
    width: 100%;
  }
      .btn-confirm{
        position:absolute;
        left: 285px;
      }

</style>
