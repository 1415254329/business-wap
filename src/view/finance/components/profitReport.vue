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
      <el-table-column align="center" label="店内利润" width="120">
        <template slot-scope="scope">{{ scope.row.profits }}</template>
      </el-table-column>
      <el-table-column align="center" label="营业收入" min-width="100">
        <template slot-scope="scope">{{ scope.row.business }}</template>
      </el-table-column>
      <el-table-column align="center" label="还款金额" width="120">
        <template slot-scope="scope">{{ scope.row.repay }}</template>
      </el-table-column>
      <el-table-column align="center" label="店内收入" min-width="100">
        <template slot-scope="scope">{{ scope.row.disburse_in}}</template>
      </el-table-column>
      <el-table-column align="center" label="店内支出" width="120">
        <template slot-scope="scope">{{ scope.row.disburse_out }}</template>
      </el-table-column>
      <el-table-column align="center" label="项目成本" min-width="100">
        <template slot-scope="scope">{{ scope.row.project_cost }}</template>
      </el-table-column>
      <el-table-column align="center" label="商品成本" width="100">
        <template slot-scope="scope">{{ scope.row.commodity_cost }}</template>
      </el-table-column>
      <el-table-column align="center" label="计次成本" min-width="105">
        <template slot-scope="scope">{{ scope.row.meter_cost }}</template>
      </el-table-column>
      <el-table-column align="center" label="员工工资" width="105">
        <template slot-scope="scope">{{ scope.row.salary }}</template>
      </el-table-column>
      <el-table-column align="center" label="欠款金额" min-width="105">
        <template slot-scope="scope">{{ scope.row.payment_arrears }}</template>
      </el-table-column>
      <el-table-column align="center" label="支付方式" >
        <el-table-column v-for="(item,index) in paymentList" :key="index" align="center" :label="item" min-width="100">
          <template slot-scope="scope">{{scope.row.paymentsMap.get(item)}}</template>
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
      stats: [],
      paymentList: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const start = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}'))
            const end = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}'))
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
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

      this.$api.business.getProfitReportStats(this.searchForm).then(res => {
        this.stats = res.data && Object.keys(res.data).map(k => {
          if (!res.data[k].paymentsMap) {
            res.data[k].paymentsMap = new Map()
          }
          res.data[k].payments && res.data[k].payments.forEach(v => {
            res.data[k].paymentsMap.set(v.payment_name, v.amount_price)
            if (!this.paymentList.includes(v.payment_name)) {
              this.paymentList.push(v.payment_name)
            }
          })
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
        [1, (obj) => resolve(obj, 'profits')],
        [2, (obj) => resolve(obj, 'business')],
        [3, (obj) => resolve(obj, 'repay')],
        [4, (obj) => resolve(obj, 'disburse_in')],
        [5, (obj) => resolve(obj, 'disburse_out')],
        [6, (obj) => resolve(obj, 'project_cost')],
        [7, (obj) => resolve(obj, 'commodity_cost')],
        [8, (obj) => resolve(obj, 'meter_cost')],
        [9, (obj) => resolve(obj, 'salary')],
        [10, (obj) => resolve(obj, 'payment_arrears')]
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
          data.map(dv => {
            result[i] += Number(computeMap.get(i)(dv))
          })
        } else {
          // 根据现有支付方式动态计算支付方式合计
          data.map(dv => {
            result[i] += dv.paymentsMap.get(v.label) || 0
          })
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
