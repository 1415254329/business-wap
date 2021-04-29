<template>
  <div class="good">
    <Spin size="large" fix v-if="!isDataLoad"></Spin>
    <el-table class="table-consume-custom" header-cell-class-name="el-table-header-cell-custom" :data="goodList" fit
      border style="margin-top:0">
      <el-table-column align="center" label="编号" min-width="65">
        <template slot-scope="scope">
          <div class="id">
            <Input @on-focus="showGoods($event,scope)" @on-enter="searchGood($event,scope.row)"
              v-model="scope.row.good.serial_num" type="number" @mousewheel.native.prevent />
            <Icon v-if="goodList.length>2&& Object.keys(scope.row.good).length" @click="removeGood(scope.$index)"
              type="md-close-circle" />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" min-width="140">
        <template slot-scope="scope">
          <Input @on-enter="inputEnterJump($event)" v-model="scope.row.good.alias" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="原价" min-width="70">
        <template slot-scope="scope">
          <Input @on-enter="inputEnterJump($event)" v-model="scope.row.originalPrice" type="number"
            @mousewheel.native.prevent />
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量" min-width="50">
        <template slot-scope="scope">
          <Input @on-enter="inputEnterJump($event)" v-model="scope.row.qty" type="number" @mousewheel.native.prevent />
        </template>
      </el-table-column>
      <el-table-column align="center" label="折扣" min-width="50">
        <template slot-scope="scope">
          <Input @on-enter="inputEnterJump($event)" v-model="scope.row.discount" type="number"
            @mousewheel.native.prevent />
        </template>
      </el-table-column>
      <el-table-column align="center" label="折后价" min-width="70">
        <template slot-scope="scope">
          <Input @on-enter="inputEnterJump($event)" v-model="scope.row.discountPriceAll" type="number"
            @mousewheel.native.prevent />
        </template>
      </el-table-column>
      <el-table-column v-if="Object.keys(curMember).length" align="center" label="赠金" min-width="60">
        <template slot-scope="scope">
          <Input @on-enter="inputEnterJump($event)" v-model="scope.row.presentPrice" type="number"
            @mousewheel.native.prevent />
        </template>
      </el-table-column>
      <el-table-column v-for="(item,index) in staffSortList" :key="index" align="center" :label="item.alias">
        <el-table-column align="center" label="工号" min-width="60">
          <template v-if="scope.row.bonusList[index]" slot-scope="scope">
            <Poptip trigger="focus" placement="bottom" popper-class="poptip-staff" transfer>
              <Input @on-enter="searchStaff($event,scope.row.bonusList[index],item)"
                v-model="scope.row.bonusList[index].show_num" />
              <div slot="content" class="staffList">
                <div @click="chooseStaff(scope.row.bonusList[index],item,sItem)"
                  v-for="(sItem,sIndex) in item.staffList" :key="sIndex" class="staffList-item">
                  {{sItem.serial_num+' '+sItem.staff_name}}
                </div>
              </div>
            </Poptip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="指定" min-width="50">
          <template v-if="scope.row.bonusList[index]" slot-scope="scope">
            <Checkbox v-model="scope.row.bonusList[index].specified_switch"></Checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center" label="业绩" min-width="70">
          <template v-if="scope.row.bonusList[index]" slot-scope="scope">
            <Input @on-enter="inputEnterJump($event)" v-model="scope.row.bonusList[index].performance_price"
              type="number" @mousewheel.native.prevent />
          </template>
        </el-table-column>
        <el-table-column align="center" label="提成" min-width="70">
          <template v-if="scope.row.bonusList[index]" slot-scope="scope">
            <Input @on-enter="inputEnterJump($event)" v-model="scope.row.bonusList[index].dividends_price" type="number"
              @mousewheel.native.prevent />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <Form :model="orderForm" :label-width="80" ref="orderForm" label-position="right">
      <FormItem label="支付方式">
        <div class="paymentList">
          <div v-for="(item,index) in !Object.keys(curMember).length?paymentList:memberPaymentList" :key="index"
            class="paymentList-item">
            <Input size="large" @on-enter="inputEnterJump($event)" v-model="item.amount_price" class="input-commission">
            <span slot="prepend">{{ item.payment_name }}</span>
            </Input>
            <div v-if="item.payment_name === '赠金' && item.amount_price!==''" class="paymentList-item-notice">
              赠金折扣金额{{Number(result.presentPriceAll - result.discountPresentPriceAll).toFixed(2) }}
            </div>
          </div>
        </div>
      </FormItem>
      <div class="row-justify">
        <FormItem label="订单日期">
          <DatePicker type="datetime" @keyup.enter.native="inputEnterJump($event)" placeholder="订单日期"
            format="yyyy-MM-dd HH:mm:ss" v-model="order_time" :readonly="$permissionFn.readOnly()" />
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
        <span style="flex-shrink:0;color: red; font-size: 22px">{{`结算：${orderForm.gross_price}`}}</span>
        <Button class="btn-confirm" type="primary" size="large" :loading="loading"
          @click="submit">{{loading?'提交中':'立即结账'}}</Button>
      </div>
    </Form>
    <el-popover id="goodListPop" placement="bottom" trigger="manual" v-model="popGoodShow">
      <el-tabs v-model="curGoodType">
        <el-tab-pane label="项目" name="services">
          <div v-for="(cItem,sIndex) in projectList" :key="sIndex" class="chooseList-wrapper">
            <el-tooltip effect="dark" :content="cItem.alias" placement="bottom" :disabled="cItem.alias.length <= 10">
              <div class="title">{{cItem.alias}}</div>
            </el-tooltip>
            <div class="chooseList">
              <div @click="selectGood(item,cItem)" v-for="(item,index) in cItem.children" :key="index">
                <el-tooltip effect="dark" :content="`${item.serial_num} ${item.alias}`" placement="bottom"
                  :disabled="`${item.serial_num}${item.alias}`.length <= 15">
                  <div class="chooseList-item">
                    <span class="num">{{item.serial_num}}</span>
                    <span class="name">{{item.alias}}</span>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品" name="commodity">
          <div v-for="(cItem,sIndex) in commodityList" :key="sIndex" class="chooseList-wrapper">
            <el-tooltip effect="dark" :content="cItem.alias" placement="bottom" :disabled="cItem.alias.length <= 10">
              <div class="title">{{cItem.alias}}</div>
            </el-tooltip>
            <div class="chooseList">
              <div @click="selectGood(item,cItem)" v-for="(item,index) in cItem.children" :key="index">
                <el-tooltip effect="dark" :content="`${item.serial_num} ${item.alias}`" placement="bottom"
                  :disabled="`${item.serial_num}${item.alias}`.length <= 15">
                  <div class="chooseList-item">
                    <span class="num">{{item.serial_num}}</span>
                    <span class="name">{{item.alias}}</span>
                    </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 组件库样式有问题，无法根据子项动态改变宽度，弃用，可能是附带的切换动画要设定初始组件宽度，偏移宽度，所以出了冲突 -->
      <!-- <Tabs v-model="curGoodType">
        <TabPane label="项目" name="services">
          <div v-for="(cItem,sIndex) in projectList" :key="sIndex" class="chooseList-wrapper">
            <el-tooltip effect="dark" :content="cItem.alias" placement="bottom" :disabled="cItem.alias.length <= 10">
              <div class="title">{{cItem.alias}}</div>
            </el-tooltip>
            <div class="chooseList">
              <div @click="selectGood(item,cItem)" v-for="(item,index) in cItem.children" :key="index">
                <el-tooltip effect="dark" :content="`${item.serial_num} ${item.alias}`" placement="bottom"
                  :disabled="`${item.serial_num}${item.alias}`.length <= 15">
                  <div class="chooseList-item">{{`${item.serial_num} ${item.alias}`}}</div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane label="商品" name="commodity">
          <div v-for="(cItem,sIndex) in commodityList" :key="sIndex" class="chooseList-wrapper">
            <el-tooltip effect="dark" :content="cItem.alias" placement="bottom" :disabled="cItem.alias.length <= 10">
              <div class="title">{{cItem.alias}}</div>
            </el-tooltip>
            <div class="chooseList">
              <div @click="selectGood(item,cItem)" v-for="(item,index) in cItem.children" :key="index">
                <el-tooltip effect="dark" :content="`${item.serial_num} ${item.alias}`" placement="bottom"
                  :disabled="`${item.serial_num}${item.alias}`.length <= 15">
                  <div class="chooseList-item">{{`${item.serial_num} ${item.alias}`}}</div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs> -->
    </el-popover>
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
          尊敬的客人，您本次消费{{result.discountPriceAll}}元
        </span>
        <el-button @click="resultShow = false" type="primary">确认</el-button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  initOrderForm,
  initBonusList,
  initPaymentList,
  initGoodList,
  initGoodItem,
  calculate,
  goodPercent,
  caculateGood,
  initSMS
} from '@/utils/rule'
import {
  parseTime,
  messageChoke
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
    staffSortList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isDataLoad: false,
      loading: false,
      order_time: '',
      memberPwd: '',
      lastOrderNo: 0,
      orderForm: initOrderForm({
        consume_type: 0,
        body_count: 1,
        gender: 0
      }),
      bonusList: initBonusList(),
      paymentCache: {},
      paymentList: initPaymentList(),
      memberPaymentList: initPaymentList('member'),

      // 商品，服务项目
      categoryList: [],
      commodityList: [],
      projectList: [],
      goodList: initGoodList(),
      popGoodShow: false,
      curGoodIndex: 0,
      curGoodType: 'services',
      disableGoodsFn: '',

      messageChokeFn: '',
      inputList: [],

      // 结算结果
      resultShow: false,
      result: {}
    }
  },
  watch: {
    curMember () {
      this.goodList.map(v => {
        if (Object.keys(v.good).length) {
          v.bonusList.map(bv => {
            this.matchRule(bv, v.type, v.category.id, v.good.id)
          })
          this.computeGoodItem(v)
        }
      })
      this.orderForm.gender = this.curMember.gender === 1 ? 1 : 0
      this.getLastOrderNo()
    },
    staffSortList () { // 页面初始加载时监听创建goodList
      if (this.staffSortList.length) {
        this.initBonusListByPosition().then(() => {
          // this.goodList[0] = this.createGoodItem()
          // 调用set函数设置赋值数组触发视图刷新
          this.$set(this.goodList, 0, this.createGoodItem())
          this.isDataLoad = true
        })
      }
    },
    order_time (v) {
      if (parseTime(v, '{h}:{i}:{s}') === '00:00:00') {
        this.order_time = new Date(parseTime(v, '{y}-{m}-{d}') + ' ' + parseTime(new Date(), '{h}:{i}:{s}'))
      }
    }
  },
  created () {
    this.init()
    if (this.staffSortList) {
      this.initBonusListByPosition().then(() => {
        // this.goodList[0] = this.createGoodItem()
        // 调用set函数设置赋值数组触发视图刷新
        this.$set(this.goodList, 0, this.createGoodItem())
        this.isDataLoad = true
      })
    }
    if (Object.keys(this.curMember).length) {
      this.orderForm.gender = this.curMember.gender === 1 ? 1 : 0
    }

    this.watchPays()
  },
  methods: {
    init () {
      let p1 = this.getCategoryList()
      let p2 = this.getLastOrderNo()
      // this.isDataLoad = false
      // Promise.all([p1, p2]).then((result) => {
      //   // this.isDataLoad = true
      // }).catch((error) => {
      //   // this.isDataLoad = true
      //   console.log(error)
      // })
    },
    getCategoryList () {
      return this.$api.common.getCategory().then((res) => {
        this.categoryList = res.data || {}
        this.commodityList = this.categoryList.tenant_commodity || {}
        this.projectList = this.categoryList.tenant_project || {}
        this.$api.common.getCommodity().then((res) => {
          Object.keys(res.data).map(key => {
            res.data[key] = res.data[key] ? Object.values(res.data[key]).filter((val) => val.status ===
                0) : []
          })
          Object.keys(this.commodityList).map(key => {
            this.commodityList[key].children = res.data[key] || []
          })
          this.commodityList = Object.values(this.commodityList)
        })
        this.$api.common.getProject().then((res) => {
          Object.keys(res.data).map(key => {
            res.data[key] = res.data[key] ? Object.values(res.data[key]).filter((val) => val.status ===
                0) : []
          })
          Object.keys(this.projectList).map(key => {
            this.projectList[key].children = res.data[key] || []
          })
          this.projectList = Object.values(this.projectList)
        })
      })
    },
    getLastOrderNo () {
      return this.$api.business.getLastOrderNo().then(res => {
        this.lastOrderNo = res.data ? Number(res.data.order_no) : 0
        this.orderForm.order_no = this.lastOrderNo + 1
      })
    },
    initBonusListByPosition () {
      return new Promise(resolve => {
        this.staffSortList.map((v, i) => {
          if (i !== 0) {
            let data = JSON.parse(JSON.stringify(this.bonusList[0]))
            data.index = i + 1
            this.bonusList.push(data)
          }
        })
        resolve()
      })
    },
    createGoodItem () {
      let goodItem = initGoodItem()
      goodItem.bonusList = JSON.parse(JSON.stringify(this.bonusList))

      return this.watchGood(goodItem)
    },
    computeGoodItem (obj) {
      ({
        originalPrice: obj.originalPrice,
        discount: obj.discount,
        discountPrice: obj.discountPrice,
        originalPriceAll: obj.originalPriceAll,
        discountPriceAll: obj.discountPriceAll
      } = caculateGood({
        type: obj.type,
        num: obj.qty,
        good: obj.good,
        // member: this.curMember,
        memberRule: this.curMemberRule
      }))
    },
    computeGoodItemBoun (bonu, good) {
      if (!bonu.staff_id && !bonu.rule) {
        return
      }
      console.log({
        ...good
      }, {
        ...bonu
      })
      let rule = JSON.parse(JSON.stringify(bonu.rule))
      let result = calculate(rule,
        ((bonu.rule.type === 1) ? good.discountPriceAll : good.originalPriceAll) - good.presentPrice,
        good.presentPrice || 0,
        bonu.specified_switch)
      bonu.performance_price = result.pgSum
      bonu.dividends_price = result.commission
    },
    computePriceAll () {
      this.result.discountPriceAll = this.goodList.reduce((pre, cur) => {
        if (cur.discountPriceAll) {
          pre += Number(cur.discountPriceAll)
        }
        return pre
      }, 0)
      this.result.presentPriceAll = this.goodList.reduce((pre, cur) => {
        if (cur.presentPrice) {
          pre += Number(cur.presentPrice)
        }
        return pre
      }, 0)
      this.result.discountPresentPriceAll = this.goodList.reduce((pre, cur) => {
        if (cur.discountPresentPrice) {
          pre += Number(cur.discountPresentPrice)
        }
        return pre
      }, 0)
      this.result.discountPriceAll = (Number(this.result.discountPriceAll) - Number(this.result.presentPriceAll))
        .toFixed(2)
      if (!Object.keys(this.curMember).length) {
        this.paymentList.map(v => {
          if (v.amount_price) {
            v.amount_price = 0
          }
        })
        this.paymentList.find(v => v.payment_name === '现金').amount_price = this.result.discountPriceAll
        this.paymentCache = JSON.parse(JSON.stringify(this.paymentList.find(v => v.payment_name === '现金')))
      } else {
        this.memberPaymentList.map(v => {
          if (v.amount_price) {
            v.amount_price = 0
          }
        })
        this.memberPaymentList.find(v => v.payment_name === '余额').amount_price = this.result.discountPriceAll
        this.memberPaymentList.find(v => v.payment_name === '赠金').amount_price = this.result.discountPresentPriceAll
        this.paymentCache = JSON.parse(JSON.stringify(this.memberPaymentList.find(v => v.payment_name === '余额')))
      }
      if (Object.keys(this.curMember).length) {
        this.orderForm.integral = Number(this.curMemberRule.consume_integral) ? Number((this.result.discountPriceAll +
            this.result.presentPriceAll) / this.curMemberRule.consume_integral).toFixed(2) : 0
        this.$store.commit('business/setPoint', Number(this.orderForm.integral))
      }
      this.orderForm.gross_price = Number(this.result.discountPriceAll) + Number(this.result.discountPresentPriceAll)
    },
    matchRule (v, type, categoryId, goodId) { // 根据会员等级,职位匹配计算规则
      if (!this.messageChokeFn) {
        this.messageChokeFn = messageChoke()
      }
      let isCommodity = type === 'commodity'

      let ruleList = (isCommodity ? this.ruleList.tenant_commodity : this.ruleList.tenant_project) || {}
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
          this.messageChokeFn({
            type: 'warning',
            content: `50001:当前职位并未设置${isCommodity ? '商品' : '服务项目'}规则，请手动输入提成及业绩`
          })
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
            this.messageChokeFn({
              type: 'warning',
              content: `50002:当前职位并未设置散客${isCommodity ? '商品' : '服务项目'}规则，请手动输入提成及业绩`
            })
            v.rule = {}
            return
          }
        } else {
          if (v.rule[this.curMember.hierarchy]) {
            v.rule = v.rule[this.curMember.hierarchy]
          } else if (v.rule['all']) {
            v.rule = v.rule['all']
          } else {
            this.messageChokeFn({
              type: 'warning',
              content: `50003:当前职位并未设置会员${isCommodity ? '商品' : '服务项目'}规则，请手动输入提成及业绩`
            })
            v.rule = {}
            return
          }
        }
        if (!categoryId || !goodId) {
          // this.$Message.warning(`请先选择项目`)
          v.rule = {}
          return
        }
        // 匹配商品分类
        if (v.rule[categoryId]) {
          v.rule = v.rule[categoryId]
        } else {
          this.messageChokeFn({
            type: 'warning',
            content: `50004:当前职位并未设置${isCommodity ? '商品' : '服务项目'}规则，请手动输入提成及业绩`
          })
          v.rule = {}
          return
        }
        // 匹配商品
        if (v.rule[goodId]) {
          v.rule = v.rule[goodId]
        } else {
          this.messageChokeFn({
            type: 'warning',
            content: `50005:当前职位并未设置该${isCommodity ? '商品' : '服务项目'}规则，请手动输入提成及业绩`
          })
          v.rule = {}
        }
      }
    },
    watchGood (good) {
      let self = this
      good = new Proxy(good, {
        set (obj, prop, value, receiver) {
          obj[prop] = value
          if (prop === 'good') {
            obj.bonusList.map(v => {
              self.matchRule(v, obj.type, obj.category.id, obj.good.id)
              good.bonusList.forEach(v => {
                self.computeGoodItemBoun(v, good)
              })
            })
          }
          if (prop === 'qty') {
            computedItemPriceAll(obj)
            good.bonusList.forEach(v => {
              self.computeGoodItemBoun(v, good)
            })
          }
          if (prop === 'originalPrice') {
            obj.discountPrice = Number(obj.discount ? (obj.discount / goodPercent * obj.originalPrice) : obj
              .originalPrice).toFixed(2)
            computedItemPriceAll(obj)
            good.bonusList.forEach(v => {
              self.computeGoodItemBoun(v, good)
            })
          }
          if (prop === 'discount') {
            if (obj.originalPrice) {
              obj.discountPrice = Number(obj[prop] ? (obj[prop] / goodPercent * obj.originalPrice) : obj
                .originalPrice).toFixed(2)
            } else obj.discountPrice = ''
            computedItemPriceAll(obj)
            good.bonusList.forEach(v => {
              self.computeGoodItemBoun(v, good)
            })
          }
          // if (prop === 'discountPrice') {
          //   self.$nextTick(() => {
          //     self.computePriceAll()
          //   })
          //   self.computeGoodItemBounus(obj)
          // }
          if (prop === 'discountPriceAll') {
            self.$nextTick(() => {
              self.computePriceAll()
            })
            good.bonusList.forEach(v => {
              self.computeGoodItemBoun(v, good)
            })
          }
          if (prop === 'presentPrice') {
            if (Number(obj[prop]) > Number(obj.discountPriceAll)) {
              setTimeout(() => {
                obj.presentPrice = obj.discountPriceAll
                self.$nextTick(() => {
                  obj.discountPresentPrice = Number(Object.keys(self.curMemberRule).length
                    ? obj.presentPrice * self.curMemberRule.giving_switch / goodPercent
                    : obj.presentPrice).toFixed(2)
                  self.$nextTick(() => {
                    self.computePriceAll()
                    good.bonusList.forEach(v => {
                      self.computeGoodItemBoun(v, good)
                    })
                  })
                })
              })
              self.$Message.error('赠金不能大于折后价')
            } else {
              self.$nextTick(() => {
                obj.discountPresentPrice = Number(Object.keys(self.curMemberRule).length
                  ? obj.presentPrice * self.curMemberRule.giving_switch / goodPercent
                  : obj.presentPrice).toFixed(2)
                self.$nextTick(() => {
                  self.computePriceAll()
                  good.bonusList.forEach(v => {
                    self.computeGoodItemBoun(v, good)
                  })
                })
              })
            }
          }
          return true
        }
      })
      good.bonusList.forEach((v, i) => {
        good.bonusList[i] = new Proxy(v, {
          set (obj, prop, value, receiver) {
            obj[prop] = value
            if (prop === 'show_num') {
              if (obj.show_num === '') {
                obj.staff_id = ''
                obj.specified_switch = false
                obj.performance_price = ''
                obj.dividends_price = ''
                // self.computeGoodItemBoun(obj, good)
              }
            } else if (prop === 'staff_id' || prop === 'cur_position') {
              if (obj.staff_id && Object.keys(obj.cur_position).length) {
                self.matchRule(v, good.type, good.category.id, good.good.id)
                self.computeGoodItemBoun(obj, good)
                return true
              }
            } else if (prop === 'specified_switch') {
              self.computeGoodItemBoun(obj, good)
            } else if (prop === 'performance_price') {
              Object.keys(obj.rule).length && (obj.dividends_price = obj.performance_price ? calculate(JSON
                .parse(JSON
                  .stringify(obj.rule)),
              (obj.rule.type === 1) ? good.discountPrice : good.originalPrice,
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
      return good

      function computedItemPriceAll (obj) {
        obj.originalPriceAll = Number(obj.originalPrice * obj.qty).toFixed(2)
        obj.discountPriceAll = Number(obj.discountPrice * obj.qty).toFixed(2)
        obj.discountPresentPrice = Number(Object.keys(self.curMemberRule).length
          ? obj.presentPrice * self.curMemberRule.giving_switch / 100
          : obj.presentPrice).toFixed(2)
        self.$nextTick(() => {
          self.computePriceAll()
        })
      }
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
            console.log(self.paymentCache.amount_price, otherPrice, self.paymentCache.amount_price - otherPrice)
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
      // if (this.orderForm.order_no <= this.lastOrderNo) {
      //   this.$Message.error('手工单号不能小于提供的预设单号')
      //   return
      // }
      if ((Object.keys(this.curMember).length && this.curMember.password) && this.memberPwd !== this.curMember
        .password) {
        this.$Message.error('会员密码错误')
        return
      } else if (this.loading === true) { // button设置了loading状态，不会走这一步判断
        this.$Message.error('上一笔订单尚未提交完成，请稍后再试')
        return
      }

      // let discountPresentPriceDiff = this.result.presentPriceAll - this.result.discountPresentPriceAll
      let paymentPriceAll = this[payListStr].reduce((pre, cur) => {
        if (cur.payment_name === '余额') {
          this.orderForm.payment_balance = Number(cur.amount_price)
        }
        if (cur.payment_name === '赠金') {
          this.orderForm.payment_giving = Number(cur.amount_price)
        }
        if (cur.payment_name === '欠款') {
          this.orderForm.payment_arrears = Number(cur.amount_price)
        }
        return (pre += Number(cur.amount_price) || 0)
      }, 0)

      if (this.orderForm.gross_price < 0) {
        this.$Message.error('消费金额不能小于零')
        return
      } else if (paymentPriceAll !== this.orderForm.gross_price) {
        this.$Message.error('支付方式金额总和与消费金额不一致')
        return
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

      this.orderForm.profit_price = this.orderForm.gross_price - (this.goodList.reduce((pre, cur) => {
        if (cur.good.cost_price && cur.qty) pre += cur.good.cost_price * cur.qty
        return pre
      }, 0))

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

      this.orderForm.alias = this.curMember.alias || ''
      this.orderForm.phone = this.curMember.phone || ''
      this.orderForm.order_time = parseTime(this.order_time !== '' ? this.order_time : new Date(),
        '{y}-{m}-{d} {h}:{i}:{s}')

      this.orderForm.bonus = JSON.stringify(bonusListAggregate.call(this));
      ({
        commodity_surplus: this.orderForm.commodity_surplus,
        project_surplus: this.orderForm.project_surplus
      } = inventoryList.call(this))
      this.orderForm.shopping_cart = JSON.stringify(cartList.call(this))

      this.orderForm.payments === '[]' && (this.orderForm.payments = '')
      this.orderForm.bonus === '[]' && (this.orderForm.bonus = '')
      this.orderForm.commodity_surplus === '[]' && (this.orderForm.commodity_surplus = '')
      this.orderForm.project_surplus === '[]' && (this.orderForm.project_surplus = '')
      this.orderForm.shopping_cart === '[]' && (this.orderForm.shopping_cart = '')

      if (Object.keys(this.curMember).length) {
        this.orderForm.notify_format = initSMS('good', this.curMember,
          Object.assign({}, this.orderForm, {
            goodList: this.goodList
          }))
      }

      this.$api.business.addOrder(this.orderForm).then(res => {
        if (Object.keys(this.curMember).length) {
          this.result.type = 1;
          ({
            alias: this.result.name,
            phone: this.result.phone,
            balance_price: this.result.balance,
            serial_num: this.result.cardNo,
            arrears_price: this.result.debts
          } = this.curMember)
          this.result.balanceAfter = Number(this.result.balance - this.orderForm.payment_balance).toFixed(2)
          this.result.debtsAfter = Number(this.result.debts + this.orderForm.payment_arrears).toFixed(2)
          this.result.integralAfter = Number(this.curMember.integral) + Number(this.orderForm.integral)
        } else {
          this.result.type = 2
        }

        this.resultShow = true

        this.loading = false

        this.$emit('order-success', {
          memberRefresh: Boolean(Object.keys(this.curMember).length),
          type: 'good',
          order: this.orderForm,
          result: this.result
        })
        this.reset()
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

      function bonusListAggregate () {
        let bonusList = []
        this.goodList.map((v, i) => {
          bonusList = bonusList.concat(JSON.parse(JSON.stringify(v.bonusList.filter(v => {
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
          }))))
          // ABANDON reason:提成需要对应商品记录，故不做累加
          // gv.bonusList.map(bv => {
          //   if (!bv.staff_id) {
          //     return false
          //   }
          //   let findBonus = bonusList.find(v => v.source_alias === bv.source_alias && v.type === bv.type)
          //   if (findBonus) {
          //     findBonus.performance_price += Number(bv.performance_price)
          //     findBonus.dividends_price += Number(bv.dividends_price)
          //   } else {
          //     let cloneBv = JSON.parse(JSON.stringify(bv))
          //     delete cloneBv.rule
          //     delete cloneBv.cur_position
          //     delete cloneBv.index
          //     cloneBv.performance_price = Number(cloneBv.performance_price)
          //     cloneBv.dividends_price = Number(cloneBv.dividends_price)
          //     bonusList.push(cloneBv)
          //   }
          // })
        })
        return bonusList
      }

      function cartList () {
        let result = []
        this.goodList.map((v, i) => {
          if (!v.good.id) {
            return
          }
          let item = JSON.parse(JSON.stringify(v))
          delete item.bonusList
          result.push(item)
        })
        return result
      }

      function inventoryList () {
        let result = {
          commodity_surplus: [],
          project_surplus: []
        }
        this.goodList.map(v => {
          if (Object.keys(v.good).length && v.good.id) {
            if (v.type === 'commodity') {
              let findGood = result.commodity_surplus.find(fv => fv.self_id === v.good.id)
              if (findGood) {
                findGood.qty += Number(v.qty)
                findGood.price += Number(v.discountPriceAll)
              } else {
                result.commodity_surplus.push({
                  self_id: Number(v.good.id),
                  qty: Number(v.qty),
                  type: 'tenant_orders',
                  price: Number(v.discountPriceAll)
                })
              }
            } else {
              let findGood = result.project_surplus.find(fv => fv.self_id === v.good.id)
              if (findGood) {
                findGood.qty += Number(v.qty)
                findGood.price += Number(v.discountPriceAll)
              } else {
                result.project_surplus.push({
                  self_id: Number(v.good.id),
                  qty: Number(v.qty),
                  type: 'tenant_orders',
                  price: Number(v.discountPriceAll)
                })
              }
            }
          }
        })
        Object.keys(result).map(key => {
          result[key] = JSON.stringify(result[key])
        })
        return result
      }

      // function getBonusListSet () {
      //   // let staffIdSet = new Set()
      //   let bonusList = []
      //   this.goodList.map(v => {
      //     v.bonusList.map(bv => {
      //       if (bv.staff_id) {
      //         let bonu = bonusList.find(bsv => bsv.staff_id === bv.staff_id)
      //         if (bonu) {
      //           console.log('当前员工提成存在', bv)
      //           bonu.performance_price += Number(bv.performance_price)
      //           bonu.dividends_price += Number(bv.dividends_price)
      //         } else {
      //           delete bv.rule
      //           delete bv.cur_position
      //           delete bv.index
      //           bv.performance_price = Number(bv.performance_price)
      //           bv.dividends_price = Number(bv.dividends_price)
      //           bonusList.push(JSON.parse(JSON.stringify(bv)))
      //         }
      //       }
      //     })
      //   })
      //   console.log(bonusList)
      //   return bonusList
      // }
    },

    showGoods (e, scope) {
      this.curGoodIndex = scope.$index
      let curDom = e.srcElement
      let goodListPopDom = document.querySelector('#goodListPop')
      // console.log(curDom, goodListPopDom, getTop(curDom), getLeft(curDom))
      let top = getTop(curDom)
      let left = getLeft(curDom)

      goodListPopDom.style.top = `${top + curDom.offsetHeight + 10}px`
      goodListPopDom.style.left = `${left}px`
      this.popGoodShow = true

      if (this.disableGoodsFn) document.removeEventListener('click', this.disableGoodsFn)

      this.disableGoodsFn = this.disableGoods(curDom, goodListPopDom)

      function getTop (e) {
        var offset = e.offsetTop
        // 遍历至包含good类的dom层即可，即当前组件根节点
        if (e.classList.contains('good')) {
          return 0
        } else if (e.offsetParent != null) offset += getTop(e.offsetParent)
        return offset
      }

      function getLeft (e) {
        var offset = e.offsetLeft
        if (e.classList.contains('good')) {
          return 0
        } else if (e.offsetParent != null) offset += getLeft(e.offsetParent)
        return offset
      }
    },
    disableGoods (curDom, goodListPopDom) {
      let self = this

      function disable (e) {
        if (!e) {
          return
        }
        if (e.path.some(v => v === curDom) || e.path.some(v => v === goodListPopDom)) {
          return
        }
        self.popGoodShow = false
        document.removeEventListener('click', disable)
      }
      document.addEventListener('click', disable)
      return disable
    },
    selectGood (obj, cObj) {
      this.popGoodShow = false
      this.goodList[this.curGoodIndex].index = setGoodIndex.call(this)
      this.goodList[this.curGoodIndex].type = this.curGoodType
      this.goodList[this.curGoodIndex].category = cObj
      this.goodList[this.curGoodIndex].good = JSON.parse(JSON.stringify(obj))
      this.goodList[this.curGoodIndex].qty = 1
      this.goodList[this.curGoodIndex].bonusList.map(v => {
        v.type = this.curGoodType === 'commodity' ? 'tenant_commodity' : 'tenant_project'
        v.source_alias = obj.alias
        v.source_id = obj.id
        v.source_weight = this.goodList[this.curGoodIndex].index
      })
      this.computeGoodItem(this.goodList[this.curGoodIndex])

      if (!this.goodList.some(v => !Object.keys(v.good).length)) {
        this.goodList.push(this.createGoodItem())

        this.$nextTick(function () {
          this.inputList = Array.from(document.querySelector('.good').querySelectorAll(
            'input.ivu-input'))
        }.bind(this))
      }

      document.removeEventListener('click', this.disableGoodsFn)

      function setGoodIndex () {
        return (this.goodList.reduce((pre, cur) => {
          if (pre < cur.index) return cur.index
          return pre
        }, 0) + 1)
      }
    },
    searchGood (e, item) {
      let isCommodity = this.curGoodType === 'commodity'
      let goodList = isCommodity ? this.commodityList : this.projectList
      let goodId = item.good.serial_num
      if (!goodId) {
        this.popGoodShow = false
        document.removeEventListener('click', this.disableGoodsFn)
        this.inputEnterJump(e)
        return
      }
      if (!goodList.some(v => v.children.some(cv => {
        if (goodId == cv.serial_num) {
          this.selectGood(cv, v)
          return true
        }
      }))) {
        // this.goodList[this.curGoodIndex].type
        item.type = ''
        item.qty = ''
        item.good = {}
        this.computeGoodItem(this.goodList[this.curGoodIndex])
        this.$Message.error(`没有搜索到${isCommodity ? '商品' : '服务项目'}`)
      } else {
        this.inputEnterJump(e)
      }
    },
    removeGood (index) {
      this.computeGoodItem(this.goodList[index])
      this.goodList.splice(index, 1)
    },
    chooseStaff (item, pItem, sItem, index) {
      item.staff_id = sItem.id
      item.show_num = sItem.serial_num
      item.cur_position = sItem.position[pItem.id]
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
        this.inputList = Array.from(document.querySelector('.good').querySelectorAll('input.ivu-input'))
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
      this.goodList = initGoodList()
      this.$set(this.goodList, 0, this.createGoodItem())
      this.paymentCache = {}
      this.paymentList.map(v => {
        v.amount_price = 0
      })
      this.memberPaymentList.map(v => {
        v.amount_price = 0
      })
      this.orderForm = initOrderForm({
        consume_type: 0,
        body_count: 1,
        gender: 0
      })
      this.lastOrderNo++
      this.orderForm.order_no = this.lastOrderNo + 1
      this.order_time = ''
      this.memberPwd = ''
    }
  }
}
</script>
<style lang="less" scoped>
  .good {
    position: relative;

    .id {
      display: flex;
      align-items: center;

      .ivu-icon {
        // padding-left: 10px;
        transition: all .3s;

        &:hover {
          cursor: pointer;
          color: #ed4014;
        }
      }
    }

    // 消费通用样式
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

    /deep/.ks {
      display: flex;
      align-items: center;

      .ivu-radio-group {
        margin-left: 10px;
        display: flex;
      }
    }

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
