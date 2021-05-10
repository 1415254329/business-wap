<template>
  <div class="consume">
    <Card class="info">
      <div class="row">
        <member-search :memberList="memberList" @selected="handleMemberSelect" class="search-member" >
          <template slot="prepend">
            会员搜索
          </template>
          <el-button slot="suffix" size="medium" type="primary" icon="el-icon-search"></el-button>
        </member-search>
        <el-button v-permission="2" @click="()=>{
            if(Object.keys(curMember).length){
              $router.push({
                path:`/directive/add/${curMember.id}`,
                query:{
                  needBackMemberId:'true', //刷新后query获取为字符串，防止刷新后数据不一致，导致路由标签列表新开标签
                  fromPath:$route.path
                }
              })
            } else {
              $Message.error('请先选择会员')
            }
          }" type="primary" size="medium">修改会员</el-button>
        <el-button @click="()=>{
          if(!Object.keys(curMember).length){
            $Message.error('请先选择会员')
          } else {
            orderShow=true
          }
        }" type="primary" size="medium">交易记录</el-button>
        <el-button v-permission="1" @click="$router.push({
                path:'/directive/add/0',
                query:{
                  needBackMemberId:'true',
                  fromPath:$route.path
                }
              })" type="primary" size="medium">注册会员</el-button>
        <el-button v-permission="3" type="primary" @click="()=>{
          if(!Object.keys(curMember).length){
            $Message.error('请先选择会员')
          } else {
            rechargeShow = true
          }
        }" size="medium">会员充值</el-button>
        <count-use-btn v-if="!['consume','integral'].includes($route.params.type)" @use="handleCountUse"
          @view="handleCountView" :list="memberCountList">
        </count-use-btn>
        <el-button @click="$router.push('/business/order')" type="primary" size="medium">订单管理</el-button>
        <!-- <div style="margin-left:20px;display:flex;align-items:center">
          <span>是否打印：</span>
          <el-switch v-model="printJudge" inactive-color="#ff4949">
          </el-switch>
        </div> -->
      </div>
      <el-table class="table-member-custom" header-cell-class-name="el-table-header-cell-custom" :data="[curMember]" fit
        border style="margin-bottom:0">
        <el-table-column align="center" label="姓名" show-overflow-tooltip width="100">
          <template slot-scope="scope">{{scope.row.alias}}</template>
        </el-table-column>
        <el-table-column align="center" label="卡号" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.serial_num}}</template>
        </el-table-column>
        <el-table-column align="center" label="手机号" show-overflow-tooltip min-width="100">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column align="center" label="等级" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.hierarchyName}}</template>
        </el-table-column>
        <el-table-column align="center" label="余额" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color:red;">
              {{scope.row.balance_price}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="赠金" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.giving_price}}</template>
        </el-table-column>
        <el-table-column align="center" label="备注" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.memo}}</template>
        </el-table-column>
        <el-table-column align="center" label="欠款" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.arrears_price}}</template>
        </el-table-column>
        <el-table-column align="center" label="积分" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.integral}}</template>
        </el-table-column>
        <!-- <el-table-column align="center" label="上次消费时间">
          <template slot-scope="scope">{{scope.row.update_time}}</template>
        </el-table-column> -->
        <el-table-column align="center" label="累计充值" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.cumsum_balance_price}}</template>
        </el-table-column>
        <el-table-column align="center" label="累计消费" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.cumsum_pay_price}}</template>
        </el-table-column>
        <el-table-column align="center" label="来源" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.origin}}</template>
        </el-table-column>
        <el-table-column align="center" label="距今到店(天)" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.arrivalInterval}}</template>
        </el-table-column>
        <el-table-column align="center" label="微信绑定" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.wechat_bind_status!==1?"":"是"}}</template>
        </el-table-column>
      </el-table>
      <Tabs v-if="$route.params.type === 'good'" v-model="componentName">
        <TabPane label="服务/商品消费" name="good"></TabPane>
        <TabPane label="计次购买" name="count"></TabPane>
      </Tabs>
      <Tabs v-if="$route.params.type === 'integral'" v-model="componentName">
        <TabPane label="积分商城" name="integral"></TabPane>
        <TabPane label="积分兑现" name="integralExchange"></TabPane>
        <TabPane label="积分换礼列表" name="integralRecord"></TabPane>
      </Tabs>
      <component @order-success="orderSuccess" :is="componentName" :curMember="curMember" :curMemberRule="curMemberRule"
        :ruleList="ruleList" :positionList="positionList" :staffList="staffList" :staffSortList="staffSortList" />
    </Card>
    <Modal v-model="rechargeShow" width="1200px">
      <!-- 传入通用变量 -->
      <Recharge v-if="rechargeShow" @success="rechargeSuccess" :ruleList="rechargeRuleList" :curMember="curMember"
        :curMemberRule="curMemberRule" :memberRuleList="memberRuleList" :positionList="positionList"
        :staffList="staffList" :staffSortList="staffSortList" :presentRule="presentRule" />
      <span slot="footer"></span>
    </Modal>
    <Modal v-model="orderShow" width="90%">
      <OrderMember :show="orderShow" :memberId="curMember.id" />
      <span slot="footer"></span>
    </Modal>
    <Modal v-model="debtShow" width="1200px" :styles="{marginTop:'10%'}">
      <Debt v-if="debtShow" :curMember="curMember" @success="debtSuccess" />
      <span slot="footer"></span>
    </Modal>
    <Modal v-model="countUseShow" width="1200px" :styles="{marginTop:'10%'}">
      <CountUseView :data="countUseViewData" />
      <span slot="footer"></span>
    </Modal>
  </div>
</template>

<script>
// 消费通用导入
import {
  mapMutations
} from 'vuex'
import Print from '@/utils/print'
import MemberSearch from './components/memberSearch'
import CountUseBtn from './components/countUseBtn.vue'
import Consume from './components/consume'
import Good from './components/good'
import Count from './components/count'
import Recharge from './components/recharge'
import OrderMember from './components/orderMember'
import Debt from './components/debt'
import CountUseView from './components/countUseView'
import Integral from './components/integral'
import IntegralExchange from './components/integralExchange'
import IntegralRecord from './components/integralRecord'
import {
  parseTime
} from '@/utils'
export default {
  components: {
    MemberSearch,
    CountUseBtn,
    Consume,
    Good,
    Count,
    Integral,
    IntegralExchange,
    IntegralRecord,
    Recharge,
    OrderMember,
    Debt,
    CountUseView
  },
  data () {
    return {
      // 会员
      curMember: {},
      memberList: [],
      orderShow: false,
      debtShow: false,

      // 组件
      componentName: '',

      // 充值变量
      rechargeShow: false,
      rechargeRuleList: {},

      // 消费通用变量
      ruleList: {},
      curMemberRule: {},
      presentRule: [],
      memberRuleList: [], // 会员等级列表
      positionList: [], // 职位列表
      staffList: [], // 员工列表
      staffSortList: [], // 员工通过职位分类后列表

      // 计次使用变量
      countUseShow: false,
      countUseViewData: {},
      memberCountList: []

      // 打印
      // printJudge: false
    }
  },
  watch: {
    curMember () {
      if (Object.keys(this.curMember).length) {
        this.getMemberCountList()
      } else {
        this.memberCountList = []
      }
    },
    componentName (v, ov) {
      if (v === 'count' && !Object.keys(this.curMember).length) {
        this.$nextTick(function () {
          this.componentName = ov
        }.bind(this))
        this.$Message.info('计次消费为会员消费方式，请先选择会员')
      }
    },
    $route: {
      handler () {
        // if (this.$route.params.type === 'consume') {
        //   this.componentName = 'consume'
        // } else if (this.$route.params.type === 'good') {
        //   this.componentName = 'good'
        // } else {
        //   this.componentName = 'integral'
        // }
        this.componentName = this.$route.params.type
      },
      deep: true
    }
  },
  created () {
    this.componentName = this.$route.params.type
    this.init();
  },
  methods: {
    ...mapMutations(['closeTag']),
    init () {
      this.getMemberList().then(() => {
        this.getMemberRuleList().then(() => {
          if (this.$route.query.backMemberId) {
            let findMember = this.memberList.find(v => v.id === Number(this.$route.query.backMemberId))
            findMember && this.handleMemberSelect(findMember)
          }
        })
      })
      this.getRuleList()
      this.sortStaffListByPosition()
      // this.getMemberCountList()
    },
    getMemberList () {
      return this.$api.common.getMemberList().then((res) => {
        this.memberList = res.data ? Object.values(res.data).filter((val) => val.status === 0) : []
      })
    },
    getMemberRuleList () {
      return this.$api.user.getInfo().then((res) => {
        this.memberRuleList = res.data.member_rule ? Object.values(JSON.parse(res.data.member_rule)) : {}
        this.presentRule = res.data.recharge_rule ? Object.values(JSON.parse(res.data.recharge_rule)) : {}
      })
    },
    getRuleList () {
      this.$api.common.getRoyalty().then((res) => {
        this.ruleList = res.data || {}
        this.rechargeRuleList = res.data.tenant_deposit || {}
      })
    },
    getMemberCountList () {
      this.$api.member.getMemberCountList({
        member_id: this.curMember.id
      }).then(res => {
        this.memberCountList = res.data || []
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
    handleMemberSelect (item, showDebt = true) {
      if (item.useful_date) {
        new Date().getTime() > item.useful_date && this.$Message.info('会员已过期')
      }
      this.$store.dispatch('store/findStore', item.tenant_id)
        .then((v) => {
          item.origin = v && v.store_name

          this.curMemberRule = this.memberRuleList.find(v => {
            if (v.id == item.hierarchy) {
              item.hierarchyName = v.alias
              return true
            }
          })
          // 只做天数计算
          let now = new Date(parseTime(new Date(), '{y}-{m}-{d}'))
          let before = new Date(parseTime(item.update_time, '{y}-{m}-{d}'))
          item.arrivalInterval = (now - before) / 1000 / 3600 / 24
          this.curMember = item

          if (item.arrears_price > 0 && showDebt) {
            this.debtShow = true
          }
        })
    },
    handleCountUse (item) {
      if (this.componentName === 'good') {
        this.componentName = 'count'
      }
    },
    handleCountView (item) {
      this.countUseViewData = item
      this.countUseShow = true
    },
    rechargeSuccess (data) {
      this.rechargeShow = false
      this.getMemberList().then((res) => {
        if (Object.keys(this.curMember).length) {
          let find = this.memberList.find(v => v.id === this.curMember.id)
          this.handleMemberSelect(find)
        }
      })
      this.handlePrint(data)
    },
    debtSuccess () {
      this.debtShow = false
      this.getMemberList().then((res) => {
        if (Object.keys(this.curMember).length) {
          let find = this.memberList.find(v => v.id === this.curMember.id)
          this.handleMemberSelect(find, false)
        }
      })
    },
    orderSuccess (opt) {
      if (opt && opt.memberRefresh) {
        this.getMemberList()
      }

      if (!opt.noPrint) {
        this.handlePrint({
          type: opt.type,
          order: opt.order,
          result: opt.result
        })
      }

      this.curMember = {}
      this.curMemberRule = {}
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
        paymentList: options.order.payments ? JSON.parse(options.order.payments) : [],
        result: {
          payment: '',
          balance: '',
          integral: ''
        }
      }
      if (['card', 'recharge'].includes(options.type)) {
        order.recharge = {
          deposit: options.order.prestore_price ? Number(options.order.prestore_price) : 0,
          present: options.order.giving_price ? Number(options.order.giving_price) : 0,
          actual: 0
        }
        order.recharge.actual = Number(order.recharge.deposit) + Number(order.recharge.present)
        order.result.balance = Number(this.curMember.balance_price) + order.recharge.deposit
        order.result.integral = Number(this.curMember.integral) + Number(options.order.integral)
      } else if (options.type === 'consume') {
        order.consume = {
          originalPayment: Number(options.order.gross_price)
        }
        order.result.balance = options.result.balanceAfter ? Number(options.result.balanceAfter) : 0
        order.result.integral = options.result.integralAfter ? Number(options.result.integralAfter) : 0
      } else if (options.type === 'good') {
        order.goodList = JSON.parse(options.order.shopping_cart)
        order.result.balance = options.result.balanceAfter ? Number(options.result.balanceAfter) : 0
        order.result.integral = options.result.integralAfter ? Number(options.result.integralAfter) : 0
      } else if (options.type === 'count') {
        order.goodList = JSON.parse(options.order.shopping_cart)
        order.result.balance = options.result.balanceAfter ? Number(options.result.balanceAfter) : 0
        order.result.integral = options.result.integralAfter ? Number(options.result.integralAfter) : 0
      }
      order.result.payment = order.paymentList ? order.paymentList.reduce((pre, cur) => {
        return pre + Number(cur.amount_price)
      }, 0) : 0

      let printInstance = new Print(lodop, {
        name: this.$store.getters.userInfo.store_name,
        phone: this.$store.getters.userInfo.trade,
        addr: this.$store.getters.userInfo.addr
      })
      printInstance.createOrder({
        exist: Boolean(Object.keys(this.curMember).length),
        name: this.curMember.alias,
        cardNo: this.curMember.serial_num,
        phone: this.curMember.phone
      }, order)
      printInstance.setNum(Number(this.$store.state.print.setting.num))
      printInstance.print()
    }
  }
}

</script>

<style lang="less" scoped>
  .consume {
    position: relative;

    .info {
      background-color: rgb(248, 248, 248);

      .row {
        display: flex;
        align-items: center;

        /deep/ .search {
          &-member {
            .el-input {
              .el-input-group__prepend {
                color: white;
                background: linear-gradient(to bottom, rgba(88, 176, 88, .8) 0%, rgba(88, 176, 88, 1) 50%, rgba(88, 176, 88, .8) 100%);
              }
            }

            .el-input__suffix {
              right: 0;
              height: 36px;
            }
          }
        }

        .el-input {
          width: 300px;
        }

        .el-button {
          margin-left: 20px;
        }

        /deep/.el-popover__reference-wrapper {
          margin-left: 20px;
        }
      }

      .el-table {
        margin-top: 20px;
      }
    }

    /deep/.ivu-tabs-bar {
      margin-bottom: 0 !important;
    }

  }

  /deep/ .ivu-modal-footer {
    padding: 0;
  }

  // .ivu-tabs {
  //   max-width: 580px;
  // }

</style>
