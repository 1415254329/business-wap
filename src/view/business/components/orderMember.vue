<template>
  <div class="app-container">
    <div class="func">
      <div class="search">
        <el-date-picker v-model="dateDuring" type="daterange" :picker-options="pickerOptions" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" align="right" size="small"
          value-format="yyyy-MM-dd HH:mm:ss" />
        <el-button size="small" type="primary" @click="getList('normal')">搜索</el-button>
      </div>
    </div>
    <el-table class="table-consume-custom" v-loading="listLoading"
      :data="list.slice((pageVar.page-1)*pageVar.pageSize,pageVar.page*pageVar.pageSize)" :span-method="rowMerge"
      :cell-class-name="bonusCellClass" header-cell-class-name="el-table-header-cell-custom" fit>
      <el-table-column align="center" label="下单时间" width="120">
        <template slot-scope="scope">{{ scope.row.orderDate }}<br>{{ scope.row.orderTime }}</template>
      </el-table-column>
      <el-table-column align="center" label="单号" width="80">
        <template slot-scope="scope">{{ scope.row.order_no }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员资料" width="200">
        <template slot-scope="scope">
          <p>{{ `${scope.row.alias || '散客'}(${scope.row.gender?'男':'女'}客:${scope.row.body_count})` }}</p>
          <p>{{scope.row.phone }}</p>
          <p>({{scope.row.member_serial_num || '无卡号信息' }})</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="付款明细" width="100">
        <template slot-scope="scope">
          <p v-for="(item,index) in scope.row.payments" :key="index">
            {{`${item.payment_name}:${item.amount_price}`}}
          </p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="合计" width="100">
        <template slot-scope="scope">{{ scope.row.paymentSum }}</template>
      </el-table-column>
      <el-table-column align="center" label="付款前余额" width="100">
        <template slot-scope="scope">{{ scope.row.member_balance_befor_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="付款后余额" width="100">
        <template slot-scope="scope">{{ scope.row.member_balance_after_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="付款前赠金" width="100">
        <template slot-scope="scope">{{ scope.row.member_giving_befor_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="付款后赠金" width="100">
        <template slot-scope="scope">{{ scope.row.member_giving_after_price }}</template>
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
                    {{ `${['countBuyUse','countBoughtUse'].includes(item.type)?(item.good.employ_cardinal_price * Number(item.useTimes)):item.discountPriceAll}` }}
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
                  {{scope.row.paymentSum}}
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
export default {
  props: {
    show: {
      type: Boolean,
      default: () => false
    },
    memberId: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      dateDuring: '',
      searchForm: {
        start_time: '',
        end_time: '',
        memberId: ''
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
            start.setTime(start.getTime() - 3600 * 24 * 1000)
            end.setTime(end.getTime() - 3600 * 24 * 1000)
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
    memberId () {
      if (this.memberId) {
        this.searchForm.member_id = this.memberId
      }
    },
    show () {
      if (this.show) {
        this.getList()
      }
    }
  },
  created () {
    const start = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 00:00:00')
    const end = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 23:59:59')
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 183)
    this.dateDuring = [parseTime(start), parseTime(end)]

    setTimeout(function () {
      this.getList()
    }.bind(this))
  },
  methods: {
    getList () {
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
        return this.$api.business.getOrderList(this.searchForm).then(res => {
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
            }
            v.bonus.map(bv => {
              bv.staff = this.staffList.find(sv => Number(sv.id) === bv.staff_id)
            })
            return true
          })
          res.data.orders.map(v => {
            v.orderDate = parseTime(new Date(v.order_time), '{y}-{m}-{d}')
            v.orderTime = parseTime(new Date(v.order_time), '{h}:{i}:{s}')
          })
          // setTimeout(function () {
          //   this.listLoading = false
          // }.bind(this), 200)
          this.listLoading = false
          this.pageVar.total = this.list.length

          if (res.data.diff && res.data.diff.length) {
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
      if (columnIndex === 9) {
        return {
          colspan: 6,
          rowspan: 1
        }
      } else if (columnIndex > 9 && columnIndex < 15) {
        return [0, 0]
      }
    },
    bonusCellClass ({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 4) {
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
