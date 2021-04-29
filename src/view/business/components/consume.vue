<template>
  <div class="consume">
    <el-table class="table-consume-custom" header-cell-class-name="el-table-header-cell-custom" :data="[{}]" fit border>
      <el-table-column align="center" label="消费金额" min-width="80">
        <template slot-scope="scope">
          <Input @on-enter="inputEnterJump($event)" v-model="originalPrice" type="number" @mousewheel.native.prevent />
        </template>
      </el-table-column>
      <el-table-column align="center" label="折扣" min-width="70">
        <template slot-scope="scope">
          <Input @on-enter="inputEnterJump($event)" v-model="discount" type="number" @mousewheel.native.prevent />
        </template>
      </el-table-column>
      <el-table-column align="center" label="折后价" min-width="80">
        <template slot-scope="scope">
          <Input @on-enter="inputEnterJump($event)" v-model="discountPrice" type="number" @mousewheel.native.prevent />
        </template>
      </el-table-column>
      <el-table-column v-if="Object.keys(curMember).length" align="center" label="赠金" min-width="80">
        <template slot-scope="scope">
          <Input @on-enter="inputEnterJump($event)" v-model="presentPrice" type="number" @mousewheel.native.prevent />
        </template>
      </el-table-column>
      <el-table-column v-for="(item,index) in staffSortList" :key="index" align="center" :label="item.alias">
        <el-table-column align="center" label="工号" width="80">
          <template slot-scope="scope">
            <Poptip trigger="focus" placement="bottom" popper-class="poptip-staff" transfer>
              <Input @on-enter="searchStaff($event,bonusList[index],item)" v-model="bonusList[index].show_num"
                placeholder="请选择" />
              <div slot="content" class="staffList">
                <div @click="chooseStaff(bonusList[index],item,sItem)" v-for="(sItem,sIndex) in item.staffList"
                  :key="sIndex" class="staffList-item">
                  {{sItem.serial_num + ' ' + sItem.staff_name}}
                </div>
              </div>
            </Poptip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="指定" width="50">
          <template slot-scope="scope">
            <Checkbox v-model="bonusList[index].specified_switch"></Checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center" label="业绩">
          <template slot-scope="scope">
            <Input @on-enter="inputEnterJump($event)" v-model="bonusList[index].performance_price" type="number"
              @mousewheel.native.prevent />
          </template>
        </el-table-column>
        <el-table-column align="center" label="提成">
          <template slot-scope="scope">
            <Input @on-enter="inputEnterJump($event)" v-model="bonusList[index].dividends_price" type="number"
              @mousewheel.native.prevent />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <Form :model="orderForm" :label-width="80" ref="orderForm" label-position="right">
      <FormItem label="支付方式">
        <div class="paymentList">
          <div v-for="(item,index) in !Object.keys(curMember).length?paymentList:memberPaymentList" :key="index" class="paymentList-item">
              <Input size="large" @on-enter="inputEnterJump($event)" v-model="item.amount_price"
                class="input-commission">
              <span slot="prepend">{{ item.payment_name }}</span>
              </Input>
              <div v-if="item.payment_name === '赠金' && item.amount_price!==''" class="paymentList-item-notice">
                赠金折扣金额{{Number(presentPrice - discountPresentPrice).toFixed(2) }}
              </div>
          </div>
        </div>
      </FormItem>
      <div class="row-justify">
        <FormItem label="订单日期">
          <DatePicker type="datetime" @keyup.enter.native="inputEnterJump($event)" placeholder="订单日期"
            format="yyyy-MM-dd HH:mm:ss" v-model="order_time" :readonly="$permissionFn.readOnly()"/>
        </FormItem>
        <div style="display:flex;align-items:center">
          <FormItem label="手工单号">
            <Input @on-enter="inputEnterJump($event)" v-model="orderForm.order_no" placeholder="请输入手工单号" type="number"
              @mousewheel.native.prevent />
          </FormItem>
          <Form-item label="手工单号是否重复">
            <Switch v-model="orderForm.ignore_order_no" :true-value="1" :false-value="0">
              <span slot="1">是</span>
              <span slot="0">否</span>
            </Switch>
          </Form-item>
        </div>
        <FormItem label="积分" v-if="Object.keys(curMember).length">
          <Input @on-enter="inputEnterJump($event)" v-model="orderForm.integral" placeholder="请输入积分" type="number"
            @mousewheel.native.prevent />
        </FormItem>
        <FormItem label="会员密码" v-if="Object.keys(curMember).length">
          <Input @on-enter="inputEnterJump($event)" v-model="memberPwd" placeholder="请输入会员密码" type="number"
            @mousewheel.native.prevent />
        </FormItem>
        <Form-item label="备注">
          <Input v-model="orderForm.memo" @on-enter="inputEnterJump($event)" placeholder="请输入备注" />
        </Form-item>
      </div>
      <div class="row">
        <FormItem label="客数">
          <div class="ks">
            <Input @on-enter="inputEnterJump($event)" v-model="orderForm.body_count" style="width:210px" type="number"
              @mousewheel.native.prevent />
            <RadioGroup v-model="orderForm.gender" slot="prepend" class="radio-inside">
              <Radio :label="0">女</Radio>
              <Radio :label="1">男</Radio>
            </RadioGroup>
          </div>
        </FormItem>
        <Form-item label="是否发送信息提醒">
          <Switch v-model="orderForm.notify" :true-value="1" :false-value="0">
            <span slot="1">是</span>
            <span slot="0">否</span>
          </Switch>
        </Form-item>
      </div>
      <div class="row">
        <span style="flex-shrink:0;color: red; font-size: 22px">
          {{`结算：${ Number(Number(discountPrice) - (Number(presentPrice) -  Number(discountPresentPrice))).toFixed(2)}`}}
        </span>
        <Button class="btn-confirm" type="primary" size="large" :loading="loading"
          @click="submit">{{loading?'提交中':'立即结账'}}</Button>
      </div>
    </Form>
    <Spin size="large" fix v-if="!isDataLoad"></Spin>
    <Modal v-model="resultShow" width="600px" footer-hide>
      <div class="modal-result">
        <Icon type="md-checkmark-circle-outline" />
        <span class="title">结算成功</span>
        <ul v-if="result.type == 1" class="detail">
          <li>
            <span>会员姓名：</span>
            <span>{{result.name }}</span>
          </li>
          <li>
            <span>手机号：</span>
            <span>{{result.phone  || "未填写手机号"}}</span>
          </li>
          <li>
            <span>卡号：</span>
            <span>{{result.cardNo || "未填写卡号"}}</span>
          </li>
          <li>
            <span>结算前余额：</span>
            <span>{{result.balance}}</span>
          </li>
          <li>
            <span>结算后余额：</span>
            <span>{{result.balanceAfter}}</span>
          </li>
          <li>
            <span>欠款：</span>
            <span>{{result.debtsAfter}}</span>
          </li>
        </ul>
        <span v-else style="margin-top:20px;font-size:16px">
          尊敬的客人，您本次消费{{result.payment}}元
        </span>
        <el-button @click="resultShow = false" type="primary">确认</el-button>
      </div>
    </Modal>
  </div>
</template>

<script>
// 消费通用导入
import {
  parseTime
} from '@/utils'
import {
  initOrderForm,
  initBonusList,
  initPaymentList,
  calculate,
  initSMS
} from '@/utils/rule'

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
    staffSortList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isDataLoad: false,
      percent: 10,
      originalPrice: '',
      discount: '',
      discountPrice: '',
      presentPrice: '',
      discountPresentPrice: '',
      loading: false,
      order_time: '',
      memberPwd: '',
      lastOrderNo: 0,
      orderForm: initOrderForm({
        consume_type: 0,
        body_count: 1,
        gender: 0
      }),
      bonusList: initBonusList('tenant_speedy', '快速消费'),
      paymentCache: {},
      paymentList: initPaymentList(),
      memberPaymentList: initPaymentList('member'),

      resultShow: false,
      result: {},

      inputList: []
    }
  },
  watch: {
    curMember () {
      //  ABANDON reason:支付方式列表需动态监听改变第一个支付方式的值，该方式无法全部监听到
      // let isMemberPayExist = this.paymentList.findIndex(v => {
      //   return v.payment_name === '余额'
      // })
      // isMemberPayExist === -1 && this.paymentList.splice(0, 0, {
      //   payment_name: '余额',
      //   amount_price: ''
      // }, {
      //   payment_name: '赠金',
      //   amount_price: ''
      // }, {
      //   payment_name: '欠款',
      //   amount_price: ''
      // })
      this.orderForm.gender = this.curMember.gender === 1 ? 1 : 0
      this.getLastOrderNo()
    },
    curMemberRule () {
      this.discount = this.curMemberRule.speedy
      this.discountPresentPrice = Number(Object.keys(this.curMemberRule).length
        ? this.presentPrice * Number(this.curMemberRule.giving_switch) / 10
        : this.presentPrice).toFixed(2)
    },
    originalPrice (v) {
      this.discountPrice = Number(this.discount ? (this.discount / this.percent * this.originalPrice) : this
        .originalPrice).toFixed(2)
    },
    discount (v) {
      if (this.originalPrice) {
        this.discountPrice = Number(v ? (v / this.percent * this.originalPrice) : this
          .originalPrice).toFixed(2)
      } else this.discountPrice = ''
    },
    discountPrice (v) {
      Object.keys(this.curMemberRule).length && this.pointCompute()
      this.bonusList.forEach(v => {
        this.computeBonu(v)
      })
      setTimeout(() => {
        this.computePaymentList()
      })
    },
    presentPrice (v) {
      if (Number(v) > Number(this.discountPrice)) {
        this.presentPrice = this.discountPrice
        this.$Message.error('赠金金额不能大于折后价')
        return
      }
      this.discountPresentPrice = Number(Object.keys(this.curMemberRule).length
        ? Number(this.presentPrice) * Number(this.curMemberRule.giving_switch) / 10
        : this.presentPrice).toFixed(2)
      this.bonusList.forEach(v => {
        this.computeBonu(v)
      })
      setTimeout(() => {
        this.computePaymentList()
      })
    },
    staffSortList () {
      if (this.staffSortList.length) {
        this.staffSortList.map((v, i) => {
          if (i !== 0) {
            let data = JSON.parse(JSON.stringify(this.bonusList[0]))
            data.index = i + 1
            this.bonusList.push(data)
          }
        })
        this.watchBonus()
        this.isDataLoad = true
      }
    },
    order_time (v) {
      if (parseTime(v, '{h}:{i}:{s}') === '00:00:00') {
        this.order_time = new Date(parseTime(v, '{y}-{m}-{d}') + ' ' + parseTime(new Date(), '{h}:{i}:{s}'))
      }
    }
  },
  created () {
    this.getLastOrderNo()
    if (this.staffSortList) {
      this.staffSortList.map((v, i) => {
        if (i !== 0) {
          let data = JSON.parse(JSON.stringify(this.bonusList[0]))
          data.index = i + 1
          this.bonusList.push(data)
        }
      })
      this.watchBonus()
      this.isDataLoad = true
    }
    this.watchPays()
  },
  methods: {
    getLastOrderNo () {
      this.$api.business.getLastOrderNo().then(res => {
        this.lastOrderNo = res.data ? Number(res.data.order_no) : 0
        this.orderForm.order_no = this.lastOrderNo + 1
      })
    },
    chooseStaff (item, pItem, sItem, index) {
      item.staff_id = sItem.id
      item.show_num = sItem.serial_num
      item.cur_position = sItem.position[pItem.id]
    },
    matchRule (v) { // 根据会员等级,职位匹配计算规则
      let ruleList = this.ruleList.tenant_speedy || {}
      // 根据职位id获取规则
      if (Object.keys(v.cur_position).length) {
        let isChild = Boolean(v.cur_position.position_id)
        if (isChild && ruleList.hasOwnProperty(v.cur_position.position_id) && ruleList[v.cur_position.position_id]
          .rule) {
          // 取副职业
          v.rule = JSON.parse(ruleList[v.cur_position.position_id].rule)
        } else if (ruleList.hasOwnProperty(v.cur_position.department_id) && ruleList[v.cur_position.department_id]
          .rule) {
          // 取主职业
          v.rule = JSON.parse(ruleList[v.cur_position.department_id].rule)
        } else {
          this.$Message.warning(`50001:当前职位并未设置消费规则，请手动输入提成及业绩`)
          v.rule = {}
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
            v.rule = {}
          }
        } else {
          if (v.rule[this.curMember.hierarchy]) {
            v.rule = v.rule[this.curMember.hierarchy]
          } else if (v.rule['all']) {
            v.rule = v.rule['all']
          } else {
            this.$Message.warning(`50003:当前职位并未设置对应会员消费规则，请手动输入提成及业绩`)
            v.rule = {}
          }
        }
      }
    },
    computeBonu (bonu) {
      if (!bonu.staff_id && !bonu.rule) {
        return
      }
      let rule = JSON.parse(JSON.stringify(bonu.rule))
      let result = calculate(rule,
        ((bonu.rule.type === 1) ? this.discountPrice : this.originalPrice) - this.presentPrice,
        this.discountPresentPrice,
        bonu.specified_switch)
      bonu.performance_price = result.pgSum
      bonu.dividends_price = result.commission
    },
    computePaymentList () {
      if (!Object.keys(this.curMember).length) {
        this.paymentList.map(v => {
          if (v.payment_name === '现金') {
            v.amount_price = this.discountPrice - this.presentPrice
          } else if (v.amount_price) {
            v.amount_price = 0
          }
        })
        this.paymentCache = JSON.parse(JSON.stringify(this.paymentList.find(v => v.payment_name === '现金')))
      } else {
        this.memberPaymentList.map(v => {
          if (v.payment_name === '余额') {
            v.amount_price = this.discountPrice - this.presentPrice
          } else if (v.payment_name === '赠金') {
            v.amount_price = this.discountPresentPrice
          } else if (v.amount_price) {
            v.amount_price = 0
          }
        })
        this.paymentCache = JSON.parse(JSON.stringify(this.memberPaymentList.find(v => v.payment_name === '余额')))
      }
    },
    pointCompute () {
      this.orderForm.integral = Number(this.curMemberRule.consume_integral) ? Number(this.discountPrice / this.curMemberRule.consume_integral).toFixed(2) : 0
      this.$store.commit('business/setPoint', Number(this.orderForm.integral))
    },
    watchBonus () {
      let self = this
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
                // self.computeBonu(v)
              }
            } else if (prop === 'staff_id' || prop === 'cur_position') {
              if (obj.staff_id && Object.keys(obj.cur_position).length) {
                self.matchRule(obj)
                self.computeBonu(v)
                return true
              }
            } else if (prop === 'specified_switch') {
              self.computeBonu(v)
            } else if (prop === 'performance_price') {
              Object.keys(obj.rule).length && (obj.dividends_price = obj.performance_price ? calculate(JSON
                .parse(JSON
                  .stringify(obj.rule)),
              (obj.rule.type === 1) ? this.discountPrice : this.originalPrice,
              0,
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
      let findCashPayment = this.paymentList.find(v => v.payment_name === '现金')
      let findBalancePayment = this.memberPaymentList.find(v => v.payment_name === '余额')
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
      this.memberPaymentList.forEach((v, i, arr) => {
        if (['余额', '赠金'].includes(v.payment_name)) {
          return
        }
        arr[i] = new Proxy(v, {
          set (obj, prop, value) {
            obj[prop] = value
            firstCompute()
            if (obj.payment_name === '积分') {
              pointCompute(value)
            }
            return true
          }
        })
      })

      function firstCompute () {
        let otherPrice
        if (!Object.keys(self.curMember).length) {
          otherPrice = self.paymentList.reduce((pre, cur) => {
            if (['现金'].includes(cur.payment_name)) {
              return pre
            }
            return pre + Number(cur.amount_price)
          }, 0)
        } else {
          otherPrice = self.memberPaymentList.reduce((pre, cur) => {
            if (['余额', '赠金'].includes(cur.payment_name)) {
              return pre
            }
            return pre + Number(cur.amount_price)
          }, 0)
        }
        if (Object.keys(self.paymentCache).length) {
          if (self.paymentCache.amount_price - otherPrice < 0) {
            self.$Message.info('计算过后的值不能小于0，请自行手动修改')
          } else {
            if (!Object.keys(self.curMember).length) {
              findCashPayment.amount_price = Number(self.paymentCache.amount_price - otherPrice).toFixed(2)
            } else {
              findBalancePayment.amount_price = Number(self.paymentCache.amount_price - otherPrice).toFixed(2)
            }
          }
        }
      }
      function pointCompute (v) {
        self.orderForm.integral = Number(self.$store.state.business.pointCache - v).toFixed(2)
      }
    },
    submit () {
      let payListStr = !Object.keys(this.curMember).length ? 'paymentList' : 'memberPaymentList'
      //  if (this.orderForm.order_no <= this.lastOrderNo) {
      //   this.$Message.error('手工单号不能小于提供的预设单号')
      //   return
      // }
      let diffPresentPrice = Number(this.presentPrice - this.discountPresentPrice).toFixed(2)
      if (Number(this.originalPrice) < 0) {
        this.$Message.error('消费金额不能小于零')
        return
      } else if ((Object.keys(this.curMember).length && this.curMember.password) && this.memberPwd !== this.curMember
        .password) {
        this.$Message.error('会员密码错误')
        return
      } else if (this.loading === true) {
        this.$Message.error('上一笔订单尚未提交完成，请稍后再试')
        return
      } else {
        let sum = this[payListStr].reduce((pre, cur) => {
          if (cur.amount_price) return pre + Number(cur.amount_price)
          return pre
        }, 0)
        if (sum !== Number(this.discountPrice) - diffPresentPrice) {
          this.$Message.error('支付方式金额总和与消费金额不一致')
          return
        }
      }
      if (Object.keys(this.curMember).length) {
        this.memberPaymentList.forEach(v => {
          if (v.payment_name === '余额') {
            this.orderForm.payment_balance = Number(v.amount_price)
          }
          if (v.payment_name === '赠金') {
            this.orderForm.payment_giving = Number(v.amount_price)
          }
          if (v.payment_name === '欠款') {
            this.orderForm.payment_arrears = Number(v.amount_price)
          }
        })
      }
      if (Object.keys(this.curMember).length) {
        this.orderForm.member_id = this.curMember.id || ''
        if (this.orderForm.payment_balance > this.curMember.balance_price) {
          this.$Message.error('支付失败：支付卡金大于余额')
          return
        }
        if (this.orderForm.payment_giving > this.curMember.giving_price) {
          this.$Message.error('支付失败：支付赠金大于赠金余额')
          return
        }
      }

      this.loading = true
      this.orderForm.bonus = JSON.parse(JSON.stringify(this.bonusList))
      this.orderForm.bonus = this.orderForm.bonus.filter(v => {
        if (!v.staff_id) {
          return false
        }
        let dividendsCache = v.dividends_price
        v.performance_price = v.performance_price || 0
        v.dividends_price = dividendsCache
        delete v.show_num
        delete v.rule
        // delete v.cur_position
        delete v.index
        return true
      })
      this.orderForm.bonus = JSON.stringify(this.orderForm.bonus)
      this.orderForm.bonus === '[]' && (this.orderForm.bonus = '')
      this.orderForm.payments = JSON.stringify(this[payListStr].filter(v => {
        if (!Number(v.amount_price)) {
          return false
        }
        if (v.payment_name === '免单') {
          this.orderForm.consume_type = 2
        }
        if (v.payment_name === '欠款') {
          this.orderForm.consume_type = 1
        }
        return true
      }))
      this.orderForm.payments === '[]' && (this.orderForm.payments = '')

      this.orderForm.alias = this.curMember.alias || ''
      this.orderForm.phone = this.curMember.phone || ''
      this.orderForm.gross_price = Number(this.discountPrice)
      this.orderForm.profit_price = Number(this.discountPrice) - diffPresentPrice
      this.orderForm.order_time = parseTime(this.order_time !== '' ? this.order_time : new Date(),
        '{y}-{m}-{d} {h}:{i}:{s}')

      if (Object.keys(this.curMember).length) {
        this.orderForm.notify_format = initSMS('consume', this.curMember, this.orderForm)
      }
      this.$api.business.addOrder(this.orderForm).then(res => {
        if (Object.keys(this.curMember).length) {
          this.result.type = 1;
          ({
            alias: this.result.name,
            phone: this.result.phone,
            serial_num: this.result.cardNo,
            balance_price: this.result.balance,
            arrears_price: this.result.debts
          } = this.curMember)
          this.result.balanceAfter = Number(this.result.balance - this.orderForm.payment_balance).toFixed(2)
          this.result.debtsAfter = Number(this.result.debts + this.orderForm.payment_arrears).toFixed(2)
          this.result.integralAfter = Number(this.curMember.integral) + Number(this.orderForm.integral)
        } else {
          this.result.type = 2
          this.result.payment = this.discountPrice
        }
        this.result.originalPayment = Number(this.originalPrice)

        this.resultShow = true
        this.$emit('order-success', {
          memberRefresh: Boolean(Object.keys(this.curMember).length),
          type: 'consume',
          order: this.orderForm,
          result: this.result
        })
        this.reset()

        this.loading = false

        // this.closeTag(this.$route)
      }, err => {
        console.log(err)
        this.$Notice.error({ // 严重错误提示（是否特定返回code码统一判断？）
          title: '错误',
          desc: '订单创建失败',
          duration: 30
        })
        this.loading = false
      })
    },
    searchStaff (e, item, pItem) {
      let staff = pItem.staffList.find(v => item.show_num == v.serial_num)
      if (!item.show_num) {
        this.inputEnterJump(e)
        return
      }
      if (staff) {
        item.staff_id = staff.id
        item.cur_position = staff.position[pItem.id]
        this.inputEnterJump(e)
      } else {
        item.staff_id = ''
        item.show_id = ''
        item.cur_position = {}
        item.rule = {}
        this.$Message.error('没有搜索到员工')
      }
    },
    inputEnterJump (e) {
      if (!this.inputList.length) {
        this.inputList = Array.from(document.querySelectorAll('input.ivu-input'))
      }
      let curInput = e.srcElement
      this.inputList.some((v, i) => {
        if (i === this.inputList.length - 1) {
          this.submit()
        } else if (curInput == v) {
          this.inputList[i + 1].focus()
          return true
        }
      })
    },
    reset () {
      this.orderForm = initOrderForm({
        consume_type: 0,
        body_count: 1,
        gender: 0
      })
      this.paymentCache = {}
      this.paymentList.map(v => {
        v.amount_price = 0
      })
      this.memberPaymentList.map(v => {
        v.amount_price = 0
      })
      this.bonusList.map(v => {
        v.staff_id = ''
        v.show_num = ''
        v.cur_position = {}
        v.rule = ''
      })
      this.lastOrderNo++
      this.orderForm.order_no = this.lastOrderNo + 1
      this.originalPrice = ''
      this.discount = ''
      this.discountPrice = ''
      this.presentPrice = ''
      this.discountPresentPrice = ''
      this.order_time = ''
      this.memberPwd = ''
    }
  }
}

</script>

<style lang="less" scoped>
  .consume {
    .radioGroup-special {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .table-card-staff-header {
      span {
        text-align: center;
      }

      .btns {
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);

        button {
          margin-left: 10px;

          &:first-child {
            margin-left: 0px;
          }
        }
      }
    }

    .row {
      display: flex;
      align-items: center;
    }

    .row-justify {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .btn-confirm {
      position: absolute;
      left: 285px;
    }

    /deep/.ks {
      display: flex;
      align-items: center;

      .ivu-radio-group {
        margin-left: 10px;
        display: flex;
      }
    }

    .paymentList {
      display: flex;

      // min-width: 1000px;
      &-item {
        position: relative;

        // width: 100px;
        &-notice {
          position: absolute;
          white-space: nowrap;
          bottom: -1.5em;
          font-size: 0.75em;
          line-height: 1em;
          color: rgb(255, 128, 119);

          &:hover {
            cursor: default;
          }
        }
      }
    }
  }

  /deep/ .ivu-modal-footer {
    padding: 0;
  }

  .modal-result {
    padding: 20px 0 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .ivu-icon {
      margin: 20px 0;
      font-size: 150px;
      color: rgba(25, 190, 107, 1);
    }

    .title {
      font-size: 24px;
      font-weight: 700;
    }

    .detail {
      margin-top: 20px;
      list-style: none;

      li {
        line-height: 28px;

        span {
          font-size: 16px;

          &:first-child {
            display: inline-block;
            text-align: right;
            width: 100px;
          }
        }
      }
    }

    .el-button {
      align-self: flex-end;
    }
  }

</style>
