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
      :data="[stats]"  header-cell-class-name="el-table-header-cell-custom" fit>
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
        <template slot-scope="scope">{{ Number(scope.row.price - scope.row.meter_orders.price + scope.row.meter_employ.price).toFixed(2) }}</template>
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
        <template slot-scope="scope">{{ scope.row.repay[0].arrears_price || 0 }}</template>
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
      stats: {
        gender: {},
        member: {},
        new_member: {},
        sys_pay: {},
        repay: [{}],
        meter_employ: {},
        meter_orders: {}
      },
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
    }
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
    getList () {
      let dataDiff = new Date(this.searchForm.end_time).getTime() - new Date(this.searchForm.start_time).getTime()
      if (!isNaN(dataDiff) && dataDiff > (3600 * 1000 * 24 * 31)) {
        this.$Message.info('日期范围不能大于1个月')
        return
      }

      this.listLoading = true

      this.$api.business.getReportStats(this.searchForm).then(res => {
        res.data.gender = res.data.gender ? res.data.gender.reduce((pre, cur) => {
          if (cur.gender === '男') {
            pre['man'] = cur.qty
          } else if (cur.gender === '女') {
            pre['woman'] = cur.qty
          }
          return pre
        }, {}) : {}
        res.data.repay = res.data.repay || [{}]
        this.stats = res.data
        this.listLoading = false
      })
    }
  }
}

</script>

<style lang="less" scoped>

</style>
