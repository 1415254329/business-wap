<template>
  <div class="app-container">
    <div class="func">
      <div class="search">
        <el-date-picker v-model="dateDuring" type="daterange" :picker-options="pickerOptions" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" align="right" size="small"
          value-format="yyyy-MM-dd HH:mm:ss" :readonly="$permissionFn.readOnly()"/>
        <el-select v-model="userType" placeholder="用户类型" size="small" clearable>
          <el-option v-for="item in userTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <member-search :showText="true" @selected="handleMemberSelect"/>
        <!-- <el-input v-model="memberId" size="small" placeholder="请输入会员id" type="number" @mousewheel.native.prevent /> -->
        <el-select v-model="orderType" placeholder="订单类型" size="small" clearable>
          <el-option v-for="item in orderTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button size="small" type="primary" @click="getList('normal')">搜索</el-button>
      </div>
    </div>
    <div class="func">
      <div class="search">
        <el-input v-model="searchForm.start_order_no" size="small" placeholder="起始单号" style="margin-right:0"
          type="number" @mousewheel.native.prevent />
        <span style="padding: 0 8px">至</span>
        <el-input v-model="searchForm.end_order_no" size="small" placeholder="结束单号" type="number"
          @mousewheel.native.prevent />
        <el-button size="small" type="primary" @click="getList('orderNo')">手工单号查询</el-button>
      </div>
    </div>
    <div v-if="Object.keys(orderStats).length" class="orderStats">
      <p>
        订单总数:
        <span v-if="searchForm.member_id === -1">{{orderStats.member.count}}</span>
        <span v-else-if="searchForm.member_id === 0">{{orderStats.tourist.count}}</span>
        <span v-else>{{orderStats.report.count}}</span>
        (消费订单：
        <span v-if="searchForm.member_id === -1">{{orderStats.member.count - orderStats.member.deposit_count - orderStats.member.new_count}}</span>
        <span v-else-if="searchForm.member_id === 0">{{orderStats.tourist.count}}</span>
        <span v-else>{{orderStats.report.count - orderStats.member.deposit_count - orderStats.member.new_count}}</span>，
        充值订单：
        <span v-if="searchForm.member_id === 0">0</span>
        <span v-else>{{orderStats.member.deposit_count}}</span>，
        开卡订单：
        <span v-if="searchForm.member_id === 0">0</span>
        <span v-else>{{orderStats.member.new_count}}</span>)</p>
      <p>会员开卡:
        <span v-if="searchForm.member_id === 0">0</span>
        <span v-else>{{orderStats.member.new.prestore_price}}</span>
        <span v-if="orderStats.member.new_payments.length && searchForm.member_id !== 0">
          （<span v-for="(item,index) in orderStats.member.new_payments" :key="index">
            {{`${item.payment_name} ${item.amount_price}`}}
            <span v-if="index<orderStats.member.new_payments.length-1">，</span>
          </span>）
        </span>
      </p>
      <p>会员充值:
        <span v-if="searchForm.member_id === 0">0</span>
        <span v-else>{{orderStats.member.general.prestore_price}}</span>
        <span v-if="orderStats.member.deposit_payments.length && searchForm.member_id !== 0">
          （<span v-for="(item,index) in orderStats.member.deposit_payments" :key="index">
            {{`${item.payment_name} ${item.amount_price}`}}
            <span v-if="index<orderStats.member.deposit_payments.length-1">，</span>
          </span>）
        </span>
      </p>
      <p>消费订单:
        <span v-if="searchForm.member_id === -1">
          {{orderStats.member.total -
          orderStats.member.general.giving_price -
          orderStats.member.general.prestore_price -
          orderStats.member.new.giving_price -
          orderStats.member.new.prestore_price
          }}</span>
        <span v-else-if="searchForm.member_id === 0">{{orderStats.tourist.total}}</span>
        <span v-else>{{orderStats.report.consumePrice}}</span>
        <span v-if="orderStats.report.consume_payments.length && searchForm.member_id === ''">
          （<span v-for="(item,index) in orderStats.report.consume_payments" :key="index">
            {{`${item.payment_name} ${item.amount_price}`}}
            <span v-if="index<orderStats.report.consume_payments.length-1">，</span>
          </span>）
        </span>
      </p>
      <p>总体统计:现金总业绩:
        <span v-if="searchForm.member_id === -1">{{orderStats.member.total -
          orderStats.member.general.giving_price -
          orderStats.member.general.prestore_price -
          orderStats.member.new.giving_price -
          orderStats.member.new.prestore_price
          }}</span>
        <span v-else-if="searchForm.member_id === 0">{{orderStats.tourist.total}}</span>
        <span v-else>{{orderStats.report.business}}</span>，
        会员耗卡：
        <span v-if="searchForm.member_id === 0">0</span>
        <span
          v-else>{{orderStats.report.sys_pay.payment_balance || 0 + orderStats.report.sys_pay.giving_price || 0}}</span>，
        散客金额：
        <span v-if="searchForm.member_id === -1">0</span>
        <span v-else-if="searchForm.member_id === 0">{{orderStats.tourist.total}}</span>
        <span v-else>{{orderStats.tourist.total}}</span>
      </p>
      <p v-if="searchForm.member_id === ''">支付方式:
        <span v-if="orderStats.report.payments.length">
          <span v-for="(item,index) in orderStats.report.payments" :key="index">
            {{`${item.payment_name} ${item.amount_price}`}}
            <span v-if="index<orderStats.report.payments.length-1">，</span>
          </span>
        </span>
        <span v-else>暂无信息</span>
      </p>
    </div>
    <el-table class="table-consume-custom" v-loading="listLoading"
      :data="list.slice((pageVar.page-1)*pageVar.pageSize,pageVar.page*pageVar.pageSize)" :span-method="rowMerge"
      :cell-class-name="bonusCellClass" header-cell-class-name="el-table-header-cell-custom" fit>
      <el-table-column align="center" label="下单时间" width="120">
        <template slot-scope="scope">{{ scope.row.orderDate }}<br>{{ scope.row.orderTime }}</template>
      </el-table-column>
      <el-table-column align="center" label="单号" min-width="100">
        <template slot-scope="scope">{{ scope.row.order_no }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员资料" width="200">
        <template slot-scope="scope">
          <p>{{ `${scope.row.alias || '散客'}(${scope.row.gender?'男':'女'}客:${scope.row.body_count})` }}</p>
          <p>{{scope.row.phone }}</p>
          <p>({{scope.row.member_serial_num || '无卡号信息' }})</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="付款明细" min-width="100">
        <template slot-scope="scope">
          <p v-for="(item,index) in scope.row.payments" :key="index">
            {{`${item.payment_name}:${item.amount_price}`}}
          </p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="合计" min-width="60">
        <template slot-scope="scope">{{ scope.row.paymentSum }}</template>
      </el-table-column>
      <el-table-column align="center" label="项目明细" class-name="bonus-column-custom">
        <el-table-column align="center" label="消费项目">
          <template slot-scope="scope">
            <div class="bonus">
              <div v-if="scope.row.shopping_cart.length">
                <div v-for="(item,index) in scope.row.shopping_cart" :key="index" class="bonus-item">
                  <div class="name">
                    {{item.good.alias}}
                    <br>
                    (原价:{{item.good.sale_price}})
                    <br>
                    <span v-if="['countBuyUse','countBoughtUse'].includes(item.type)">
                      <br>{{`(使用${item.useTimes}次)`}}
                    </span>
                  </div>
                  <div class="perform">
                    {{ `${['countBuyUse','countBoughtUse'].includes(item.type)?(item.good.employ_cardinal_price *Number(item.useTimes)):item.discountPriceAll}` }}
                  </div>
                  <div class="staffList">
                    <div v-for="(bItem,bIndex) in item.bonusList" :key="bIndex" class="staffList-item">
                      <div class="staffList-item-name">{{ bItem.staff.staff_name }}</div>
                      <div class="staffList-item-isSpecial">
                        {{ bItem.specified_switch?'是':'否' }}
                      </div>
                      <div class="staffList-item-perform">
                        {{ bItem.performance_price }}
                      </div>
                      <div class="staffList-item-commission">
                        {{ bItem.dividends_price }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="bonus-item">
                <div class="name">
                  <span v-if="scope.row.is_new_member">
                    开卡
                  </span>
                  <span v-else-if="(scope.row.prestore_price || scope.row.giving_price) &&scope.row.integral>=0">
                    充值
                  </span>
                  <span v-else-if="!(scope.row.prestore_price || scope.row.giving_price) && scope.row.integral>0 && !scope.row.gross_price">
                    积分充值{{scope.row.integral}}
                  </span>
                  <span v-else-if="scope.row.integral<0 && !scope.row.gross_price">
                    积分消费{{-scope.row.integral}}兑换{{scope.row.prestore_price}}元
                  </span>
                  <span v-else>
                    快速消费
                  </span>
                  <span v-if="(scope.row.is_new_member || scope.row.prestore_price || scope.row.giving_price)&& scope.row.giving_price > 0">
                    <br>(赠金:{{scope.row.giving_price}})
                  </span>
                </div>
                <div class="perform">
                  <span>
                    {{scope.row.paymentSum}}
                  </span>
                </div>
                <div class="staffList">
                  <div v-for="(bItem,bIndex) in scope.row.bonus" :key="bIndex" class="staffList-item">
                    <div class="staffList-item-name">{{ bItem.staff.staff_name }}</div>
                    <div class="staffList-item-isSpecial">
                      {{ bItem.specified_switch?'是':'否' }}
                    </div>
                    <div class="staffList-item-perform">
                      {{ bItem.performance_price }}
                    </div>
                    <div class="staffList-item-commission">
                      {{ bItem.dividends_price }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="消费业绩">
        </el-table-column>
        <el-table-column align="center" label="员工信息">
        </el-table-column>
        <el-table-column align="center" label="是否指定">
        </el-table-column>
        <el-table-column align="center" label="员工业绩">
        </el-table-column>
        <el-table-column align="center" label="员工提成">
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="备注" width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.memo }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="145">
        <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handlePrint(scope.row)">打印</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row.id)">撤单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pageVar.page" :page-sizes="pageVar.pageSizes" :page-size="pageVar.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="pageVar.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>
<script>
import {
  parseTime
} from '@/utils'
import MemberSearch from './components/memberSearch'
import Print from '@/utils/print'
export default {
  components: {
    MemberSearch
  },
  data () {
    return {
      dateDuring: '',
      userType: '',
      memberId: '',
      searchForm: {
        start_time: '',
        end_time: '',
        member_id: '',
        is_new_member: '',
        deposit_status: '',
        start_order_no: '',
        end_order_no: ''
      },
      orderStats: {
        member: {
          general: {},
          new: {},
          payments: [],
          new_payments: [],
          deposit_payments: []
        },
        tourist: {
          payments: []
        },
        report: {
          sys_pay: {},
          consume_payments: [],
          payments: []
        }
      },
      listLoading: false,
      list: [],
      staffList: [],
      pickerOptions: {
        shortcuts: [{
          text: '昨天',
          onClick (picker) {
            const start = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 00:00:00')
            const end = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 23:59:59')
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick (picker) {
            const start = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 00:00:00')
            const end = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 23:59:59')
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const start = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 00:00:00')
            const end = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 23:59:59')
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      userTypeList: [{
        label: '全部',
        value: ''
      }, {
        label: '会员',
        value: -1
      }, {
        label: '散客',
        value: 0
      }],
      orderType: -1,
      orderTypeList: [
        {
          label: '全部',
          value: -1
        }, {
          label: '消费订单',
          value: 1
        }, {
          label: '开卡订单',
          value: 2
        }, {
          label: '充值订单',
          value: 3
        }],
      pageVar: {
        page: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [10, 20, 30, 40, 50]
      }
    }
  },
  watch: {
    dateDuring () {
      if (this.dateDuring && this.dateDuring.length) {
        this.searchForm.start_time = parseTime(this.dateDuring[0], '{y}-{m}-{d}') + ' 00:00:00'
        this.searchForm.end_time = parseTime(this.dateDuring[1], '{y}-{m}-{d}') + ' 23:59:59'
      } else {
        this.searchForm.start_time = ''
        this.searchForm.end_time = ''
      }
    },
    orderType (v) {
      switch (v) {
        case 1 :
          this.searchForm.is_new_member = ''
          this.searchForm.deposit_status = 0
          break
        case 2 :
          this.searchForm.is_new_member = 1
          this.searchForm.deposit_status = ''
          break
        case 3 :
          this.searchForm.is_new_member = ''
          this.searchForm.deposit_status = 1
          break
        default:
          this.searchForm.is_new_member = ''
          this.searchForm.deposit_status = ''
          break
      }
    }
    // userType (v) {
    //   if (v === 1) {
    //     this.searchForm.member_id = ''
    //   } else if (v === 2) {
    //     this.searchForm.member_id = -1
    //   } else if (v === 3) {
    //     this.searchForm.member_id = 0
    //   } else {
    //     this.searchForm.member_id = ''
    //   }
    //   console.log(this.searchForm.member_id)
    // }
  },
  created () {
    this.dateDuring = [
      parseTime(new Date(), '{y}-{m}-{d}') + ' 00:00:00',
      parseTime(new Date(), '{y}-{m}-{d}') + ' 23:59:59'
    ]
    setTimeout(function () {
      this.getList()
    }.bind(this))
  },
  methods: {
    getList (type = '') {
      let form = {}
      if (type === 'orderNo') {
        if (Number(this.searchForm.end_order_no) < Number(this.searchForm.start_order_no)) {
          this.$Message.info('起始单号不能大于结束单号')
          return
        }
        if (this.searchForm.end_order_no - this.searchForm.start_order_no > 500) {
          this.$Message.info('单号范围不能超过500')
          return
        }
        ({
          start_order_no: form.start_order_no,
          end_order_no: form.end_order_no
        } = this.searchForm)
        this.orderStats = {}
      } else {
        let dataDiff = new Date(this.searchForm.end_time).getTime() - new Date(this.searchForm.start_time).getTime()
        if (!isNaN(dataDiff) && dataDiff > (3600 * 1000 * 24 * 31)) {
          this.$Message.info('日期范围不能大于1个月')
          return
        }
        this.searchForm.member_id = this.userType;
        ({
          start_time: form.start_time,
          end_time: form.end_time,
          userType: form.userType,
          member_id: form.member_id,
          is_new_member: form.is_new_member,
          deposit_status: form.deposit_status
        } = this.searchForm)
        if (this.memberId) {
          form.member_id = this.memberId
        }
        if (form.member_id <= 0 && [-1, ''].includes(this.orderType)) {
          getOrderStats.call(this)
        }
        if (form.member_id > 0 || this.orderType >= 0) {
          this.orderStats = {}
        }
      }
      this.listLoading = true
      const cbMap = new Map([
        ['services', 'tenant_project'],
        ['commodity', 'tenant_commodity'],
        ['count', 'tenant_meter'],
        ['countBuyUse', 'tenant_meter_employ'],
        ['countBoughtUse', 'tenant_meter_employ']
      ])

      if (this.staffList.length) {
        getOrderList.call(this)
      } else {
        getStaffList.call(this).then(() => {
          getOrderList.call(this)
        })
      }

      function getStaffList () {
        return this.$api.common.getStaffList().then(res => {
          this.staffList = Object.values(res.data)
        })
      }

      function getOrderList () {
        return this.$api.business.getOrderList(form).then(res => {
          !res.data.orders && (res.data.orders = [])
          this.list = res.data.orders.filter(v => {
            if (v.obsolete_status === 1) {
              return false
            }
            v.paymentSum = v.payments ? v.payments.reduce((pre, cur) => {
              return pre + cur.amount_price
            }, 0) : ''
            if (!v.bonus) v.bonus = []
            if (v.shopping_cart) {
              v.shopping_cart = JSON.parse(v.shopping_cart)
              v.shopping_cart.map(sv => {
                !sv.bonusList && (sv.bonusList = [])
                let bonuType = cbMap.get(sv.type)

                if (bonuType) {
                  v.bonus.map(bv => {
                    if (bv.type === bonuType && Number(sv.index) === Number(bv.source_weight)) {
                      sv.bonusList.push(bv)
                    }
                  })
                }
              })
              // ABANDON reason：tenant_meter_employ对应两种goodType
              // v.bonus.map(bv => {
              //   let goodType = bcMap.get(bv.type)
              //   if (goodType) {
              //     let findGood = v.shopping_cart.find(cv => (cv.type === goodType && Number(cv.index) ===
              //         Number(bv.source_weight)))
              //     if (findGood) {
              //       !findGood.bonusList && (findGood.bonusList = [])
              //       findGood.bonusList.push(bv)
              //     }
              //   } else {
              //     throw new Error('未匹配到商品', goodType, bv)
              //   }
              // })
            }

            v.bonus.map(bv => {
              bv.staff = this.staffList.find(sv => {
                return Number(sv.id) === bv.staff_id
              })
              if (!bv.staff) {
                throw new Error('有一笔提成未匹配到员工', bv)
              }
            })

            return true
          })

          res.data.orders.map(v => {
            v.orderDate = parseTime(new Date(v.order_time), '{y}-{m}-{d}')
            v.orderTime = parseTime(new Date(v.order_time), '{h}:{i}:{s}')
          })
          this.listLoading = false
          this.pageVar.total = this.list.length

          if (res.data.diff && res.data.diff.length) {
            res.data.diff.sort((a, b) => a - b)
            let orderNoStr = res.data.diff.reduce((pre, cur) => {
              if (!pre) return cur
              return pre + ',' + cur
            }, '')
            this.$alert(`不存在的单号:${orderNoStr}`, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      }

      function getOrderStats () {
        let statsForm = {
          start_time: form.start_time,
          end_time: form.end_time
        }
        return this.$api.business.getOrderStats(statsForm).then(res => {
          res.data.member.new_payments = res.data.member.new_payments || []
          res.data.member.deposit_payments = res.data.member.deposit_payments || []
          res.data.tourist.payments = res.data.tourist.payments || []
          res.data.report.gender = res.data.report.gender || []
          res.data.report.consume_payments = res.data.report.consume_payments || []
          res.data.report.payments = res.data.report.payments || []

          let l1 = JSON.parse(JSON.stringify(res.data.member.new_payments))
          let l2 = JSON.parse(JSON.stringify(res.data.member.deposit_payments))
          l2.map(v => {
            let findItem = l1.find(dv => dv.payment_name === v.payment_name)
            if (findItem) findItem.amount_price += v.amount_price
            else l1.push(v)
          })
          res.data.member.payments = l1

          res.data.report.consumePrice = res.data.report.consume_payments.reduce((pre, cur) => {
            return pre + cur.amount_price
          }, 0)
          res.data.report.consumePrice = Number(res.data.report.consumePrice).toFixed(2)

          if (form.member_id === -1) {

          } else if (form.member_id === 0) {

          }
          this.orderStats = res.data
        })
      }
    },
    handleDel (id) {
      this.$confirm('是否确认撤单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.business.delOrder(id).then(res => {
          this.$message({
            type: 'success',
            message: '撤单成功!'
          })
          this.list.splice(this.list.findIndex(v => v.id === id), 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤单'
        })
      })
    },
    handlePrint (item) {
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
      // console.log(item)
      // return
      let type
      if (item.shopping_cart.length) {
        if (['services', 'commodity'].includes(item.shopping_cart[0].type)) {
          type = 'good'
        } else {
          type = 'count'
        }
      } else if (item.is_new_member) {
        type = 'card'
      } else if ((item.prestore_price || item.giving_price) && item.integral >= 0) {
        type = 'recharge'
      } else {
        type = 'consume'
      }
      let lodop = this.$getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'))

      let order = {
        type: type,
        orderTime: item.order_time,
        paymentList: item.payments || [],
        result: {
          payment: '',
          balance: ''
        }
      }
      if (['card', 'recharge'].includes(order.type)) {
        order.recharge = {
          deposit: item.prestore_price ? Number(item.prestore_price) : 0,
          present: item.giving_price ? Number(item.giving_price) : 0,
          actual: 0
        }
        order.recharge.actual = Number(order.recharge.deposit) + Number(order.recharge.present)
        order.result.balance = item.member_balance_after_price
      } else if (order.type === 'consume') {
        order.consume = {
          originalPayment: Number(item.gross_price)
        }
      } else if (order.type === 'good') {
        order.goodList = item.shopping_cart
      } else if (order.type === 'count') {
        order.goodList = item.shopping_cart
      }
      order.result.payment = item.payments ? item.payments.reduce((pre, cur) => {
        return pre + Number(cur.amount_price)
      }, 0) : 0
      order.result.balance = item.member_balance_after_price ? Number(item.member_balance_after_price) : 0
      order.result.integral = item.member_integral_after ? Number(item.member_integral_after) : 0

      let printInstance = new Print(lodop, {
        name: this.$store.getters.userInfo.store_name,
        phone: this.$store.getters.userInfo.trade,
        addr: this.$store.getters.userInfo.addr
      })
      printInstance.createOrder({
        exist: Boolean(item.member_id),
        name: item.alias,
        cardNo: item.member_serial_num,
        phone: item.phone
      }, order)
      printInstance.setNum(Number(this.$store.state.print.setting.num))
      printInstance.print()
    },
    handleMemberSelect (item) {
      this.memberId = item.id
    },
    handleSizeChange (val) {
      this.pageVar.pageSize = val
      this.pageVar.page = 1
      // this.getList()
    },
    handleCurrentChange (val) {
      this.pageVar.page = val
      // this.getList()
    },
    rowMerge ({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 5) {
        return {
          colspan: 6,
          rowspan: 1
        }
      } else if (columnIndex > 5 && columnIndex < 11) {
        return [0, 0]
      }
    },
    bonusCellClass ({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 5) {
        return 'bonus-column-custom'
      }
    }
  }
}

</script>

<style lang="less" scoped>
  .app-container {
    ::v-deep.el-tabs {
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
    }

    .func {
      .el-date-editor {
        margin-right: 20px;
      }
    }

    /deep/.bonus-column-custom {
      padding: 0 0 !important;

      td,
      th {
        padding: 0 !important;
      }

      .cell {
        padding: 0 !important;
      }
    }

    /deep/.el-table td {
      padding: 0;
    }

    .bonus {
      &-item {
        padding: 5px 0;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);

        div {}

        .name {
          padding: 0 10px;
          flex: 1 0 calc(100% / 7);
        }

        .perform {
          padding: 0 10px;
          flex: 1 0 calc(100% / 7);
        }

        .staffList {
          flex: 4 0 calc(100% / 7 * 4);

          &-item {
            // padding: 0 10px;
            display: flex;

            div {
              flex: 1 0 calc(100% / 4);
            }
          }
        }

        &:last-child {
          border-bottom: 0;
        }
      }

    }

    .btns-operation {
      .el-button {
        padding: 5px 10px;
      }
    }
  }

</style>

<style lang="less">
.el-message-box{
  width: auto !important;
  max-width: 750px;
  .el-message-box__message{
    p {
      word-break: break-all !important;
    }
  }
}
</style>
