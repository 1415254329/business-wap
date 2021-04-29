<template>
  <div class="add">
    <Card>
      <Form :model="memberForm" :label-width="125" :rules="ruleValidate" ref="memberForm" label-position="right"
        class="form">
        <div>
          <Form-item label="姓名" prop="alias">
            <Input v-model="memberForm.alias" placeholder="请输入姓名" />
          </Form-item>
          <Form-item label="姓名简拼">
            <Input v-model="memberForm.alias_spell" />
          </Form-item>
          <Form-item label="手机号码" prop="phone">
            <Input v-model="memberForm.phone" placeholder="请输入手机号" />
          </Form-item>
          <FormItem label="会员等级" prop="hierarchy">
            <Select v-model="memberForm.hierarchy" placeholder="请选择会员等级">
              <Option v-for="(item, index) in memberRuleList" :key="index" :value="item.id">
                {{ item.alias }}
              </Option>
            </Select>
          </FormItem>
          <Form-item label="会员生日">
            <el-date-picker v-model="birthday" type="date" size="small" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
            <!-- <Date-picker type="date" placeholder="选择日期" v-model="birthday">
            </Date-picker> -->
          </Form-item>
          <Form-item label="会员性别">
            <RadioGroup v-model="memberForm.gender">
              <Radio :label="0">女</Radio>
              <Radio :label="1">男</Radio>
              <Radio :label="2">保密</Radio>
            </RadioGroup>
          </Form-item>
          <Form-item label="备注">
            <Input v-model="memberForm.memo" placeholder="请输入备注" />
          </Form-item>
        </div>
        <div style="width: 40%">
          <Form-item label="卡号">
            <Input class="inum-w" v-model="memberForm.serial_num" />
          </Form-item>

          <Form-item label="消费密码">
            <Input class="inum-w" v-model="memberForm.password" />
          </Form-item>
          <Form-item label="介绍人">
            <Input class="inum-w" v-model="memberForm.introducer" />
          </Form-item>
          <Form-item label="会员注册时间">
            <DatePicker type="datetime" placeholder="订单日期" format="yyyy-MM-dd HH:mm:ss" v-model="regist_time" />
          </Form-item>
          <Form-item label="会员到期时间">
            <DatePicker type="datetime" placeholder="订单日期" format="yyyy-MM-dd HH:mm:ss" v-model="useful_date" />
          </Form-item>
          <!-- <Form-item label="是否扣除短信费用">
            <Switch v-model="memberForm.notify_fee_switch" size="large" true-value="1" false-value="0">
              <span slot="1">是</span>
              <span slot="0">否</span>
            </Switch>
          </Form-item> -->
          <Form-item label="是否发送信息提醒">
            <Switch v-model="memberForm.notify_switch" size="large" :true-value="1" :false-value="0">
              <span slot="1">是</span>
              <span slot="0">否</span>
            </Switch>
          </Form-item>
        </div>
      </Form>
      <div v-if="$route.params.id == 0">
        <!-- 开卡表  -->
        <el-table class="table-consume-custom" header-cell-class-name="el-table-header-cell-custom" :data="[{}]" fit
          border>
          <el-table-column align="center" label="开卡金额" width="100">
            <template slot-scope="scope">
              <Input v-model="orderForm.prestore_price" type="number" @mousewheel.native.prevent />
            </template>
          </el-table-column>
          <el-table-column align="center" label="赠送金额" width="100">
            <template slot-scope="scope">
              <Input v-model="orderForm.giving_price" type="number" @mousewheel.native.prevent />
            </template>
          </el-table-column>
          <el-table-column align="center" label="积分" width="100">
            <template slot-scope="scope">
              <Input v-model="orderForm.integral" type="number" @mousewheel.native.prevent />
            </template>
          </el-table-column>
          <!-- <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <div class="table-card-staff-header">
                <span>职员</span>
                <div class="btns">
                <Button v-if="bonusList.length<3" size="small" type="success" @click="addStaff">添加</Button>
                <Button v-if="bonusList.length>1" size="small" type="error" @click="removeStaff">删除</Button>
              </div>
              </div>
            </template>
          </el-table-column> -->
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
          <FormItem label="支付方式">
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
              <DatePicker type="datetime" placeholder="订单日期" format="yyyy-MM-dd HH:mm:ss" v-model="order_time"
                :readonly="$permissionFn.readOnly()" />
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
          <div class="row" style="justify-content:flex-start">
            <Form-item label="是否发送信息提醒">
              <Switch v-model="orderForm.notify" size="large" :true-value="1" :false-value="0">
                <span slot="1">是</span>
                <span slot="0">否</span>
              </Switch>
            </Form-item>
            <!-- <Form-item label="是否打印本单">
              <Switch v-model="printJudge" size="large" :true-value="1" :false-value="0" />
            </Form-item> -->
          </div>

        </Form>
      </div>

      <div class="row">
        <span style="color: red; font-size: 22px">{{$route.params.id == 0?`结算：${orderForm.prestore_price}`:''}}</span>
        <Button class="btn-confirm" type="primary" size="large" :loading="loading"
          @click="submit">{{loading?'提交中':'确定'}}</Button>
      </div>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import {
  getRoyalty
} from '../../api/common'
import {
  mapMutations
} from 'vuex'
import {
  parseTime
} from '@/utils'
import pinyin from 'pinyin'

import {
  initOrderForm,
  initBonusList,
  initPaymentList,
  card,
  calculate,
  initSMS
} from '@/utils/rule'
import Print from '@/utils/print'
// 后期使用该库提升json字符串转换性能
const fastJson = require('fast-json-stringify')

export default {
  components: {
    Tables
  },
  data () {
    return {
      // printJudge: false,
      loading: false,
      curMemberRule: {},
      memberRuleList: [], // 会员等级列表
      positionList: [], // 职位列表
      staffList: [], // 员工列表
      staffSortList: [], // 员工通过职位分类后列表
      ruleList: [],
      locationMap: [],
      regist_time: '',
      useful_date: '', // 会员到期时间(Date)
      lastOrderNo: 0,
      birthday: '',
      memberForm: {
        alias: '',
        alias_spell: '', // 简拼
        phone: '',
        birthday: '',
        gender: 0,
        memo: '', // 备注
        notify_fee_switch: 0,
        notify_switch: 1,
        password: '', // 消费密码
        serial_num: '', // 卡号
        hierarchy: '', // 会员等级
        introducer: '', // 推荐人
        regist_time: '',
        useful_date: '', // 会员到期时间(秒)
        tenant_staff_id: '' // 绑定员工工号
      },
      order_time: '',
      presentRule: {},
      orderForm: initOrderForm({
        consume_type: 4,
        is_new_member: 1
      }),
      bonusList: initBonusList('tenant_member', '开卡'),
      paymentCache: {},
      memberPaymentList: initPaymentList(),
      ruleValidate: {
        alias: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }],
        phone: [{
          pattern: /^1[3456789]\d{9}$/,
          message: '手机号码格式不正确',
          trigger: 'blur'
        }],
        hierarchy: [{
          required: true,
          message: '请选择会员等级',
          trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    'memberForm.alias' () {
      this.getSpell()
    },
    'memberForm.hierarchy' () {
      this.curMemberRule = this.memberRuleList.find(v => {
        return v.id === this.memberForm.hierarchy
      })
      this.pointCompute()
      this.bonusList.map(v => {
        this.matchRule(v)
      })
      this.computeAll()
    },
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
    },
    regist_time (v) {
      if (parseTime(v, '{h}:{i}:{s}') === '00:00:00') {
        this.regist_time = new Date(parseTime(v, '{y}-{m}-{d}') + ' ' + parseTime(new Date(), '{h}:{i}:{s}'))
      }
    },
    useful_date (v) {
      if (parseTime(v, '{h}:{i}:{s}') === '00:00:00') {
        this.useful_date = new Date(parseTime(v, '{y}-{m}-{d}') + ' ' + parseTime(new Date(), '{h}:{i}:{s}'))
      }
    }
    // 'bonusList': { 废弃
    //   handler (v, ov) {
    //     if (!this.memberForm.hierarchy) {
    //       return
    //     }
    //     // v.map((dv, di) => {
    //     //   console.log(dv, di, ov[di])
    //     //   if (dv.performance_price === ov[di].performance_price) {
    //     //     console.log('ok', dv, di)
    //     //   }
    //     // })
    //     this.compute()
    //   },
    //   deep: true
    // }
  },
  created () {
    if (Number(this.$route.params.id) !== 0) {
      this.$api.common.getMemberList().then((res) => {
        let members = res.data
        let memberForm = members.find((val) => val.id === Number(this.$route.params.id))
        this.memberForm = memberForm
        this.memberForm.hierarchy = Number(this.memberForm.hierarchy)

        this.birthday = this.memberForm.birthday != 0 ? this.memberForm.birthday : ''

        this.regist_time = this.memberForm.regist_time
        this.useful_date = this.memberForm.useful_date !== 0
          ? parseTime(this.memberForm.useful_date)
          : ''
      })
    } else {
      this.presentRule = this.$store.getters.userInfo.recharge_rule ? Object.values(JSON.parse(this.$store.getters
        .userInfo.recharge_rule)) : {}
      this.$api.business.getLastOrderNo().then(res => {
        this.lastOrderNo = res.data ? Number(res.data.order_no) : 0
        this.orderForm.order_no = this.lastOrderNo + 1
      })

      this.getRuleList()
      this.sortStaffListByPosition()
      this.watchBonus()

      this.memberPaymentList.splice(3, 0, {
        payment_name: '欠款',
        amount_price: ''
      })
      this.watchPays()
    }

    this.memberRuleList = this.$store.getters.userInfo.member_rule ? Object.values(JSON.parse(this.$store.getters
      .userInfo.member_rule)) : {}
  },
  methods: {
    ...mapMutations(['closeTag', 'backExistTag']),
    getRuleList () {
      getRoyalty().then((res) => {
        this.ruleList = res.data.tenant_member || {}
      })
    },
    sortStaffListByPosition () { // 获取职位列表 员工列表 并根据职位分类
      this.$api.common.getPosition().then(pres => {
        this.positionList = Object.values(pres.data).filter(v => v.status === 0)
        this.$api.common.getStaffList().then(sres => {
          this.staffList = Object.values(sres.data).filter(v => v.status === 0)
          sort.call(this)
        })
      })

      function sort () {
        this.staffSortList = JSON.parse(JSON.stringify(this.positionList))
        this.staffSortList.map(pv => {
          this.staffList.map(sv => {
            if (sv.position.hasOwnProperty(pv.id)) {
              !pv.staffList && (pv.staffList = [])
              pv.staffList.push(sv)
            }
          })
        })
      }
    },
    // addStaff () {
    //   this.bonusList.push(JSON.parse(JSON.stringify(this.bonusList[0])))
    // },
    // removeStaff () {
    //   this.bonusList.pop()
    // },
    chooseStaff (item, pItem, sItem, index) {
      if (!this.memberForm.hierarchy) {
        this.$Message.warning('请先选择会员等级')
        return
      }
      item.show_num = sItem.serial_num
      item.staff_id = sItem.id
      item.cur_position = sItem.position[pItem.id]
    },
    matchRule (v) { // 根据会员等级,职位匹配计算规则
      // 根据职位id获取规则
      if (Object.keys(v.cur_position).length) {
        let isChild = Boolean(v.cur_position.position_id)
        if (isChild && this.ruleList.hasOwnProperty(v.cur_position.position_id) && this.ruleList[v.cur_position
          .position_id].rule) {
          // 取副职业
          v.rule = JSON.parse(this.ruleList[v.cur_position.position_id].rule)
        } else if (this.ruleList.hasOwnProperty(v.cur_position.department_id) && this.ruleList[v.cur_position
          .department_id].rule) {
          // 取主职业
          v.rule = JSON.parse(this.ruleList[v.cur_position.department_id].rule)
        } else {
          this.$Message.warning(`50001:当前职位并未设置开卡规则，请手动输入提成及业绩`)
          v.rule = JSON.parse(JSON.stringify(card))
          return
        }

        // 根据会员等级精确规则
        if (v.rule[this.curMemberRule.id]) {
          v.rule = v.rule[this.curMemberRule.id]
        } else if (v.rule['all']) {
          v.rule = v.rule['all']
        } else {
          this.$Message.warning(`50002:当前职位并未设置对应会员开卡规则，请手动输入提成及业绩`)
          v.rule = JSON.parse(JSON.stringify(card))
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
      if (this.presentRule && this.presentRule.length) {
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
      } else {
        this.orderForm.giving_price = 0
      }
    },
    pointCompute () {
      if (Number(this.$route.params.id) === 0) {
        console.log(this.curMemberRule.prestore_integral)
        this.orderForm.integral = Number(this.curMemberRule.prestore_integral) ? Number(this.orderForm
          .prestore_price / this.curMemberRule.prestore_integral).toFixed(2) : 0
      }
    },
    watchBonus () {
      let self = this
      for (let i = 0; i <= 2; i++) {
        let data = JSON.parse(JSON.stringify(this.bonusList[0]))
        if (i === 0) {
          data.type = 'tenant_member'
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
                setTimeout(() => {
                  self.computeAll()
                })
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
      this.memberForm.birthday = this.birthday ? parseTime(this.birthday) : 0
      this.memberForm.regist_time = parseTime(this.regist_time ? this.regist_time : new Date(),
        '{y}-{m}-{d} {h}:{i}:{s}')
      // useful_date=>时间戳
      this.memberForm.useful_date = this.useful_date ? new Date(this.useful_date).getTime() : 0
      // 获取会员负责人，如果有的话
      if (this.locationMap[0] >= 0) {
        this.memberForm.tenant_staff_id = this.bonusList[this.locationMap[0]].staff_id
      }

      if (Number(this.$route.params.id) === 0) {
        if (Number(this.orderForm.prestore_price) < this.curMemberRule.min_prestore) {
          this.$Message.error(`当前会员最小充值额度为${this.curMemberRule.min_prestore}`)
          return
        }

        // if (this.orderForm.order_no <= this.lastOrderNo) {
        //   this.$Message.error('手工单号不能小于提供的预设单号')
        // return
        // }
        if (Number(this.orderForm.prestore_price) < 0) {
          this.$Message.error('充值金额不能小于零')
        }

        let paymentPrice = this.memberPaymentList.reduce((pre, cur) => {
          if (cur.amount_price) return pre + Number(cur.amount_price)
          return pre
        }, 0)
        if (paymentPrice !== Number(this.orderForm.prestore_price)) {
          this.$Message.error('支付方式金额总和与开余额额不一致')
        }

        this.$api.member.addMember(this.memberForm).then((res) => {
          this.orderForm.member_id = res.data.member_id
          if (!(Number(this.orderForm.prestore_price) + Number(this.orderForm.giving_price) + Number(this
            .orderForm.integral))) {
            this.$Notice.info({
              title: '提示',
              desc: '会员已创建,开卡订单未创建',
              duration: 30
            })
            this.jumpJudge(this.orderForm.member_id)
            return
          }
          this.loading = true
          this.bonusList = this.bonusList.filter(v => {
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
          this.memberPaymentList = this.memberPaymentList.filter(v => {
            if (!Number(v.amount_price)) {
              return false
            }
            if (v.payment_name === '免单') {
              this.orderForm.consume_type = 2
            }
            if (v.payment_name === '欠款') {
              this.orderForm.consume_type = 1
              this.orderForm.payment_arrears = Number(v.amount_price)
            }
            return true
          })

          this.orderForm.bonus = JSON.stringify(this.bonusList)
          this.orderForm.payments = JSON.stringify(this.memberPaymentList)
          this.orderForm.alias = this.memberForm.alias
          this.orderForm.phone = this.memberForm.phone
          this.orderForm.gender = this.memberForm.gender
          this.orderForm.order_time = parseTime(this.order_time !== '' ? this.order_time
            : new Date(),
          '{y}-{m}-{d} {h}:{i}:{s}')

          this.orderForm.bonus === '[]' && (this.orderForm.bonus = '')
          this.orderForm.payments === '[]' && (this.orderForm.payments = '')

          this.orderForm.gross_price = Number(this.orderForm.prestore_price)
          this.orderForm.profit_price = this.orderForm.gross_price

          let member = {
            alias: this.memberForm.alias
          }
          this.orderForm.notify_format = initSMS('card', member, this.orderForm)

          this.$api.business.addOrder(this.orderForm).then(res => {
            this.loading = false
            this.$Message.success('添加成功')
            this.handlePrint({
              type: 'card',
              order: this.orderForm
            })
            this.jumpJudge(this.orderForm.member_id)
          }, err => {
            console.log(err)
            this.$Notice.error({ // 严重错误提示（是否特定返回code码统一判断？）
              title: '错误',
              desc: '会员已创建,开卡订单创建失败',
              duration: 30
            })
            this.loading = false
          })
        }, err => {
          console.log(err)
          this.loading = false
        })
      } else {
        this.loading = false
        this.$api.member.editMember(this.memberForm).then((res) => {
          this.loading = false
          this.$Message.success('编辑成功')
          this.jumpJudge(this.memberForm.id)
        }, err => {
          console.log(err)
          this.loading = false
        })
      }
    },
    getSpell () {
      let pinyins = String(
        pinyin(this.memberForm.alias, {
          style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
          heteronym: true
        })
      )
      this.memberForm.alias_spell = pinyins.replace(/,/g, '')
    },
    jumpJudge (...rest) {
      if (Boolean(this.$route.query.needBackMemberId) && this.$route.query.fromPath) {
        this.backExistTag({
          cur: this.$route,
          to: {
            path: this.$route.query.fromPath,
            query: {
              backMemberId: rest[0]
            }
          }
        })
      } else {
        this.closeTag(this.$route)
      }
    },
    handlePrint (options) {
      if (!this.$store.state.print.setting.switch) {
        return
      }
      // if (!this.printJudge) {
      //   return
      // }
      if (!this.$store.state.print.isLodopLoad) {
        // this.$notify({
        //   type: 'error',
        //   message: '未检测到lodop服务，无法加载相关函数，请检查是否已安装C-Lodop',
        //   dutation: 3000
        // })
        return
      }
      let lodop = this.$getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'))
      let order = {
        type: options.type,
        orderTime: options.order.order_time,
        paymentList: options.order.payments ? JSON.parse(options.order.payments) : []
      }
      order.recharge = {
        deposit: options.order.prestore_price ? Number(options.order.prestore_price) : 0,
        present: options.order.giving_price ? Number(options.order.giving_price) : 0,
        actual: 0
      }
      order.recharge.actual = Number(order.recharge.deposit) + Number(order.recharge.present)
      order.result = {
        integral: Number(options.order.integral),
        balance: order.recharge.deposit
      }

      let printInstance = new Print(lodop, {
        name: this.$store.getters.userInfo.store_name,
        phone: this.$store.getters.userInfo.trade,
        addr: this.$store.getters.userInfo.addr
      })
      printInstance.createOrder({
        exist: true,
        name: this.memberForm.alias,
        cardNo: this.memberForm.serial_num,
        phone: this.memberForm.phone
      }, order)
      printInstance.setNum(Number(this.$store.state.print.setting.num))
      printInstance.print()
    }
  }
}
</script>

<style lang="less" scoped>
  .add {
    .ivu-card {
      padding-bottom: 20px;
    }
  }

  .inum-w {
    width: 40%;
  }

  .form {
    display: flex;
    justify-content: space-around;
  }

  .form1 {
    margin-top: 30px;
  }

  .input-commission {
    /* width: 100px; */
  }

  table,
  td {
    width: 200px;
    text-align: center;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
  }

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
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .btn-confirm {
    position: absolute;
    left: 285px;
  }
</style>
