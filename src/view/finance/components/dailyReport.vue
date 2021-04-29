<template>
  <div class="app-container">
    <div class="func">
      <div class="search">
        <el-date-picker v-model="dateDuring" type="daterange" :picker-options="pickerOptions" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" align="right" size="small" value-format="yyyy-MM-dd" />
        <el-button size="small" type="primary" @click="getList('normal')">搜索</el-button>
      </div>
    </div>
    <el-table class="table-consume-custom" v-loading="listLoading" :data="stats"
      header-cell-class-name="el-table-header-cell-custom" show-summary :summary-method="totalSum" fit>
      <el-table-column align="center" label="日期" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column align="center" label="营业收入" width="120">
        <template slot-scope="scope">{{ scope.row.business }}</template>
      </el-table-column>
      <el-table-column align="center" label="订单总数" min-width="100">
        <template slot-scope="scope">{{ scope.row.count }}</template>
      </el-table-column>
      <el-table-column align="center" label="男客数" width="120">
        <template slot-scope="scope">{{ scope.row.gender.man || 0 }}</template>
      </el-table-column>
      <el-table-column align="center" label="女客数" min-width="100">
        <template slot-scope="scope">{{ scope.row.gender.woman || 0}}</template>
      </el-table-column>
      <el-table-column align="center" label="游客单数" width="120">
        <template slot-scope="scope">{{ scope.row.tourist_count }}</template>
      </el-table-column>
      <el-table-column align="center" label="游客总额" min-width="100">
        <template slot-scope="scope">{{ scope.row.tourist_peice }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员单数" width="100">
        <template slot-scope="scope">{{ scope.row.member_count }}</template>
      </el-table-column>
      <el-table-column align="center" label="新会员开卡数" min-width="105">
        <template slot-scope="scope">{{ scope.row.new_member_count }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员开卡充值" min-width="105">
        <template slot-scope="scope">{{ scope.row.new_member.prestore_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员开卡赠金" min-width="105">
        <template slot-scope="scope">{{ scope.row.new_member.giving_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员充值金额" min-width="105">
        <template slot-scope="scope">{{ scope.row.member.prestore_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员充值赠金" min-width="105">
        <template slot-scope="scope">{{ scope.row.member.giving_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="订单消费总额" min-width="105">
        <template slot-scope="scope">{{ scope.row.price }}</template>
      </el-table-column>
      <el-table-column align="center" label="店内消耗总额" min-width="105">
        <template slot-scope="scope">{{scope.row.costPrice}}</template>
      </el-table-column>
      <el-table-column align="center" label="余额消耗总额" min-width="105">
        <template slot-scope="scope">{{ scope.row.sys_pay.payment_balance }}</template>
      </el-table-column>
      <el-table-column align="center" label="计次使用总额" min-width="105">
        <template slot-scope="scope">{{ scope.row.meter_employ.price }}</template>
      </el-table-column>
      <el-table-column align="center" label="计次消费总额" min-width="105">
        <template slot-scope="scope">{{ scope.row.meter_orders.price }}</template>
      </el-table-column>
      <el-table-column align="center" label="赠金消耗总额" min-width="105">
        <template slot-scope="scope">{{ scope.row.sys_pay.payment_giving }}</template>
      </el-table-column>
      <el-table-column align="center" label="欠款订单总额" min-width="105">
        <template slot-scope="scope">{{ scope.row.await }}</template>
      </el-table-column>
      <el-table-column align="center" label="免单订单总额" min-width="105">
        <template slot-scope="scope">{{ scope.row.free }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员现金金额" min-width="105">
        <template slot-scope="scope">{{ scope.row.member_cash }}</template>
      </el-table-column>
      <el-table-column align="center" label="还款金额" min-width="100">
        <template slot-scope="scope">{{ scope.row.repay[0].arrears_price }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  parseTime
} from '@/utils'

export default {
  data () {
    return {
      dateDuring: '',
      searchForm: {
        start_time: '',
        end_time: ''
      },
      listLoading: false,
      stats: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const start = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}'))
            const end = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}'))
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const start = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}'))
            const end = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}'))
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  watch: {
    dateDuring () {
      if (this.dateDuring && this.dateDuring.length) {
        this.searchForm.start_time = parseTime(this.dateDuring[0], '{y}-{m}-{d}')
        this.searchForm.end_time = parseTime(this.dateDuring[1], '{y}-{m}-{d}')
      } else {
        this.searchForm.start_time = ''
        this.searchForm.end_time = ''
      }
    }
  },
  created () {
    this.dateDuring = [
      parseTime(new Date().getTime() - 6 * 3600 * 24 * 1000, '{y}-{m}-{d}'),
      parseTime(new Date(), '{y}-{m}-{d}')
    ]
    setTimeout(function () {
      this.getList()
    }.bind(this))
  },
  methods: {
    getList () {
      let dataDiff = new Date(this.searchForm.end_time).getTime() - new Date(this.searchForm.start_time).getTime()
      if (!isNaN(dataDiff) && dataDiff > (3600 * 1000 * 24 * 31)) {
        this.$Message.info('日期范围不能大于1个月')
        return
      }

      this.listLoading = true

      this.$api.business.getDailyReportStats(this.searchForm).then(res => {
        this.stats = res.data && Object.keys(res.data).map(k => {
          res.data[k].gender = res.data[k].gender ? res.data[k].gender.reduce((pre, cur) => {
            if (cur.gender === '男') {
              pre['man'] = cur.qty
            } else if (cur.gender === '女') {
              pre['woman'] = cur.qty
            }
            return pre
          }, {}) : {}
          res.data[k].repay = res.data[k].repay || [{
            arrears_price: 0
          }]
          res.data[k].costPrice = Number(res.data[k].price - res.data[k].meter_orders.price + res.data[k]
            .meter_employ.price).toFixed(2)
          return {
            date: k,
            ...res.data[k]
          }
        })
        console.log(this.stats)

        this.listLoading = false
      })
    },
    totalSum ({
      columns,
      data
    }) {
      const computeMap = new Map([
        [1, (obj) => resolve(obj, 'business')],
        [2, (obj) => resolve(obj, 'count')],
        [3, (obj) => resolve(obj, 'gender', 'man')],
        [4, (obj) => resolve(obj, 'gender', 'woman')],
        [5, (obj) => resolve(obj, 'tourist_count')],
        [6, (obj) => resolve(obj, 'tourist_peice')],
        [7, (obj) => resolve(obj, 'member_count')],
        [8, (obj) => resolve(obj, 'new_member_count')],
        [9, (obj) => resolve(obj, 'new_member', 'prestore_price')],
        [10, (obj) => resolve(obj, 'new_member', 'giving_price')],
        [11, (obj) => resolve(obj, 'member', 'prestore_price')],
        [12, (obj) => resolve(obj, 'member', 'giving_price')],
        [13, (obj) => resolve(obj, 'price')],
        [14, (obj) => resolve(obj, 'costPrice')],
        [15, (obj) => resolve(obj, 'sys_pay', 'payment_balance')],
        [16, (obj) => resolve(obj, 'meter_employ', 'price')],
        [17, (obj) => resolve(obj, 'meter_orders', 'price')],
        [18, (obj) => resolve(obj, 'sys_pay', 'payment_giving')],
        [19, (obj) => resolve(obj, 'await')],
        [20, (obj) => resolve(obj, 'free')],
        [21, (obj) => resolve(obj, 'member_cash')],
        [22, (obj) => resolve(obj, 'repay', 0, 'arrears_price')]
      ])
      let result = []

      columns.forEach((v, i) => {
        if (i === 0) {
          result[i] = '合计'
          return
        } else {
          result[i] = 0
        }
        if (computeMap.has(i)) {
          if (i === 11) {
            result[i] = data.reduce((pre, cur) => {
              let price = cur.payments ? cur.payments.reduce((pre, cur) => {
                return pre + Number(cur.amount_price)
              }, 0) : 0
              return pre + price
            }, 0)
          } else {
            data.map(v => {
              result[i] += Number(computeMap.get(i)(v))
            })
          }
        }
        result[i] = Number(result[i]).toFixed(2)
      })

      // 解决嵌套取值问题
      function resolve (...rest) {
        let cur = rest[0][rest[1]] || 0
        if (rest[2] !== undefined) {
          rest.splice(0, 2)
          return resolve.apply(this, [cur, ...rest])
        }
        return cur
      }
      return result
    }
  }
}
</script>
