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
      :data="list.slice((pageVar.page-1)*pageVar.pageSize,pageVar.page*pageVar.pageSize)"
      cell-class-name="bonusCellClass" header-cell-class-name="el-table-header-cell-custom"
      show-summary :summary-method="totalSum" fit border>
      <el-table-column align="center" label="员工姓名" width="120">
        <template slot-scope="scope">{{ scope.row.staff_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="总订单">
        <template slot-scope="scope">{{ scope.row.total.count }}</template>
      </el-table-column>
      <el-table-column align="center" label="总提成">
        <template slot-scope="scope">{{ scope.row.total.dividends_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="总业绩">
        <template slot-scope="scope">{{ scope.row.total.performance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员提成">
        <template slot-scope="scope">{{ scope.row.member_pay[0].dividends_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员业绩">
        <template slot-scope="scope">{{ scope.row.member_pay[0].performance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="游客提成">
        <template slot-scope="scope">{{ scope.row.tourist.dividends_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="游客业绩">
        <template slot-scope="scope">{{ scope.row.tourist.performance_price }}</template>
      </el-table-column>
            <el-table-column align="center" label="开卡提成">
        <template slot-scope="scope">{{ scope.row.member.dividends_price}}</template>
      </el-table-column>
      <el-table-column align="center" label="开卡业绩">
        <template slot-scope="scope">{{ scope.row.member.performance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="充值提成">
        <template slot-scope="scope">{{ scope.row.deposit.dividends_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="充值业绩">
        <template slot-scope="scope">{{ scope.row.deposit.performance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="指定单数">
        <template slot-scope="scope">{{ scope.row.specified.specified.count }}</template>
      </el-table-column>
      <el-table-column align="center" label="指定提成">
        <template slot-scope="scope">{{ scope.row.specified.specified.dividends_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="指定业绩">
        <template slot-scope="scope">{{ scope.row.specified.specified.performance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="非指定单数">
        <template slot-scope="scope">{{ scope.row.specified.unspecified.count }}</template>
      </el-table-column>
      <el-table-column align="center" label="非指定提成">
        <template slot-scope="scope">{{ scope.row.specified.unspecified.dividends_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="非指定业绩">
        <template slot-scope="scope">{{ scope.row.specified.unspecified.performance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="男客提成">
        <template slot-scope="scope">{{ scope.row.gender.men.dividends_price }}</template>
      </el-table-column>
       <el-table-column align="center" label="男客业绩">
        <template slot-scope="scope">{{ scope.row.gender.men.performance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="女客提成">
        <template slot-scope="scope">{{ scope.row.gender.women.dividends_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="女客业绩">
        <template slot-scope="scope">{{ scope.row.gender.women.performance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="服务提成">
        <template
          slot-scope="scope">{{ scope.row.project.member.dividends_price + scope.row.project.tourist.dividends_price  }}</template>
      </el-table-column>
      <el-table-column align="center" label="服务业绩">
        <template
          slot-scope="scope">{{ scope.row.project.member.performance_price + scope.row.project.tourist.performance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="商品提成">
        <template
          slot-scope="scope">{{ scope.row.commodity.member.dividends_price + scope.row.commodity.tourist.dividends_price  }}</template>
      </el-table-column>
      <el-table-column align="center" label="商品业绩">
        <template
          slot-scope="scope">{{ scope.row.commodity.member.performance_price + scope.row.commodity.tourist.performance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="计次购买提成">
        <template slot-scope="scope">{{ scope.row.meter.meter.dividends_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="计次购买业绩">
        <template slot-scope="scope">{{ scope.row.meter.meter.performance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="计次使用提成">
        <template slot-scope="scope">{{ scope.row.meter.employ.dividends_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="计次使用业绩">
        <template slot-scope="scope">{{ scope.row.meter.employ.performance_price }}</template>
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
  data () {
    return {
      dateDuring: '',
      searchForm: {
        start_time: '',
        end_time: ''
      },
      list: [],
      listLoading: false,
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
    }
  },
  created () {
    const start = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 00:00:00')
    const end = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 23:59:59')
    this.dateDuring = [parseTime(start), parseTime(end)]
    setTimeout(function () {
      this.getList()
    }.bind(this))
  },
  methods: {
    getList () {
      let dataDiff = new Date(this.searchForm.end_time).getTime() - new Date(this.searchForm.start_time).getTime()
      if (!isNaN(dataDiff) && dataDiff > 3600 * 1000 * 24 * 31) {
        this.$Message.info('日期范围不能大于1个月')
        return
      }
      this.listLoading = true
      this.$api.staff.getBonus(this.searchForm).then(res => {
        this.list = res.data
        this.listLoading = false
        this.pageVar.total = this.list.length
      })
    },
    handleSizeChange (val) {
      this.pageVar.pageSize = val
      this.pageVar.page = 1
    },
    handleCurrentChange (val) {
      this.pageVar.page = val
    },
    totalSum ({ columns, data }) {
      const computeMap = new Map([
        [1, (obj) => resolve(obj, 'total', 'count')],
        [2, (obj) => resolve(obj, 'total', 'dividends_price')],
        [3, (obj) => resolve(obj, 'total', 'performance_price')],
        [4, (obj) => resolve(obj, 'member_pay', 0, 'dividends_price')],
        [5, (obj) => resolve(obj, 'member_pay', 0, 'performance_price')],
        [6, (obj) => resolve(obj, 'tourist', 'dividends_price')],
        [7, (obj) => resolve(obj, 'tourist', 'performance_price')],
        [8, (obj) => resolve(obj, 'member', 'dividends_price')],
        [9, (obj) => resolve(obj, 'member', 'performance_price')],
        [10, (obj) => resolve(obj, 'deposit', 'dividends_price')],
        [11, (obj) => resolve(obj, 'deposit', 'performance_price')],
        [12, (obj) => resolve(obj, 'specified', 'specified', 'count')],
        [13, (obj) => resolve(obj, 'specified', 'specified', 'dividends_price')],
        [14, (obj) => resolve(obj, 'specified', 'specified', 'performance_price')],
        [15, (obj) => resolve(obj, 'specified', 'unspecified', 'count')],
        [16, (obj) => resolve(obj, 'specified', 'unspecified', 'dividends_price')],
        [17, (obj) => resolve(obj, 'specified', 'unspecified', 'performance_price')],
        [18, (obj) => resolve(obj, 'gender', 'men', 'dividends_price')],
        [19, (obj) => resolve(obj, 'gender', 'men', 'performance_price')],
        [20, (obj) => resolve(obj, 'gender', 'women', 'dividends_price')],
        [21, (obj) => resolve(obj, 'gender', 'women', 'performance_price')],
        [22, (obj) => resolve(obj, 'project', 'member', 'dividends_price') + resolve(obj, 'project', 'tourist', 'dividends_price')],
        [23, (obj) => resolve(obj, 'project', 'member', 'performance_price') + resolve(obj, 'project', 'tourist', 'performance_price')],
        [24, (obj) => resolve(obj, 'commodity', 'member', 'dividends_price') + resolve(obj, 'commodity', 'tourist', 'dividends_price')],
        [25, (obj) => resolve(obj, 'commodity', 'member', 'performance_price') + resolve(obj, 'commodity', 'tourist', 'performance_price')],
        [26, (obj) => resolve(obj, 'meter', 'meter', 'dividends_price')],
        [27, (obj) => resolve(obj, 'meter', 'meter', 'performance_price')],
        [28, (obj) => resolve(obj, 'meter', 'employ', 'dividends_price')],
        [29, (obj) => resolve(obj, 'meter', 'employ', 'performance_price')]
      ])
      let result = []

      columns.forEach((v, i) => {
        if (i === 0) {
          result[i] = '合计'
        } else {
          result[i] = 0
        }
        if (computeMap.has(i)) {
          data.map(v => {
            result[i] += Number(computeMap.get(i)(v))
          })
          result[i] = result[i].toFixed(2)
        }
      })

      // 解决嵌套取值问题
      function resolve (...rest) {
        let cur = rest[0][rest[1]]
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

<style lang="less" scoped>
</style>
