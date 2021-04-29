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
    <el-table class="table-consume-custom" v-loading="listLoading" :data="[stats]"
      header-cell-class-name="el-table-header-cell-custom" fit>
      <el-table-column align="center" label="订单数量明细">
        <el-table-column align="center" label="订单总数">
          <template slot-scope="scope">{{ scope.row.report.count }}</template>
        </el-table-column>
        <el-table-column align="center" label="消费订单">
          <template slot-scope="scope">{{ scope.row.report.count - scope.row.member.deposit_count - scope.row.member.new_count }}</template>
        </el-table-column>
        <el-table-column align="center" label="开卡订单">
          <template slot-scope="scope">{{ scope.row.member.new_count}}</template>
        </el-table-column>
        <el-table-column align="center" label="充值订单">
          <template slot-scope="scope">{{ scope.row.member.deposit_count }}</template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="会员开卡">
        <template slot-scope="scope">{{ scope.row.member.new.prestore_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员充值">
        <template slot-scope="scope">{{ scope.row.member.general.prestore_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="消费金额">
        <template slot-scope="scope">{{ scope.row.report.consumePrice }}</template>
      </el-table-column>
      <el-table-column align="center" label="总体统计">
        <el-table-column align="center" label="现金总业绩" min-width="100">
        <template slot-scope="scope">{{ scope.row.report.business }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员耗卡">
        <template slot-scope="scope">{{ scope.row.report.sys_pay.payment_balance || 0 + scope.row.report.sys_pay.giving_price || 0 }}</template>
      </el-table-column>
      <el-table-column align="center" label="散客金额">
        <template slot-scope="scope">{{ scope.row.tourist.total }}</template>
      </el-table-column>
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
        tourist: {},
        member: {
          new: {},
          general: {}
        },
        report: {
          sys_pay: {}
        }
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

      this.$api.business.getOrderStats(this.searchForm).then(res => {
        res.data.member.new_payments = res.data.member.new_payments || []
        res.data.member.deposit_payments = res.data.member.deposit_payments || []
        res.data.tourist.payments = res.data.tourist.payments || []
        res.data.report.gender = res.data.report.gender || []
        res.data.report.consume_payments = res.data.report.consume_payments || []
        res.data.report.payments = res.data.report.payments || []

        res.data.report.consumePrice = res.data.report.consume_payments.reduce((pre, cur) => {
          return pre + cur.amount_price
        }, 0)

        this.stats = res.data
        this.listLoading = false
      })
    }
  }
}

</script>

<style lang="less" scoped>

</style>
