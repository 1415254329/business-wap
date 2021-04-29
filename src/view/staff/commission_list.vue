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
      cell-class-name="bonusCellClass" header-cell-class-name="el-table-header-cell-custom" show-summary
      :summary-method="totalSum" fit border>
      <el-table-column align="center" label="提成时间" width="120">
        <template slot-scope="scope">{{ scope.row.order_time }}</template>
      </el-table-column>
      <el-table-column align="center" label="员工姓名">
        <template slot-scope="scope">{{ scope.row.staff_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="提成类型">
        <template slot-scope="scope">{{ scope.row.typeStr }}</template>
      </el-table-column>
      <el-table-column align="center" label="提成商品名称">
        <template slot-scope="scope">{{ scope.row.source_alias }}</template>
      </el-table-column>
      <el-table-column align="center" label="业绩(元)">
        <template slot-scope="scope">{{ scope.row.performance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="提成(元)">
        <template slot-scope="scope">{{ scope.row.dividends_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="是否指定">
        <template slot-scope="scope">{{ scope.row.specified_switch ? '是':'否' }}</template>
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
        end_time: '',
        staff_id: ''
      },
      staffList: [],
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
    },
    '$route': {
      handler () {
        const start = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 00:00:00')
        const end = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 23:59:59')
        this.dateDuring = [parseTime(start), parseTime(end)]

        if (this.$route.params.id) {
          this.searchForm.staff_id = this.$route.params.id
        }

        setTimeout(function () {
          this.getList()
        }.bind(this))
      },
      deep: true
    }
  },
  created () {
    const start = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 00:00:00')
    const end = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 23:59:59')
    this.dateDuring = [parseTime(start), parseTime(end)]

    if (this.$route.params.id) {
      this.searchForm.staff_id = this.$route.params.id
    }

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
      this.$api.common.getStaffList().then(res => {
        this.staffList = Object.values(res.data)
        this.$api.business.getBonus(this.searchForm).then(res => {
          res.data = res.data || []
          res.data.map(v => {
            switch (v.type) {
              case 'tenant_commodity':
                v.typeStr = '商品'
                break
              case 'tenant_project':
                v.typeStr = '服务项目'
                break
              case 'tenant_meter':
                v.typeStr = '计次商品'
                break
              case 'tenant_meter_employ':
                v.typeStr = '计次使用'
                break
              case 'tenant_speedy':
                v.typeStr = '快速消费'
                break
              case 'tenant_member':
                v.typeStr = '开卡'
                break
              case 'tenant_prestore':
                v.typeStr = '充值'
                break
              default:
                break
            }
            this.staffList.map(sv => {
              if (sv.id === v.staff_id) {
                v.staff_name = sv.staff_name
              }
            })
          })
          this.list = res.data
          this.listLoading = false
          this.pageVar.total = this.list.length
        })
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
        [4, 'performance_price'],
        [5, 'dividends_price']
      ])
      let result = []

      columns.forEach((v, i) => {
        if (i === 0) {
          result[i] = '合计'
        } else {
          result[i] = 0
        }
        if (computeMap.has(i)) {
          console.log(result[i])
          data.map(v => {
            result[i] += Number(v[computeMap.get(i)])
          })
          result[i] = result[i].toFixed(2)
        }
      })

      // 弃用,使用map管理需要计算的字段
      // data.map(v => {
      //   result[4] += Number(v['performance_price'])
      //   result[5] += Number(v['dividends_price'])
      // })
      return result
    }
  }
}

</script>

<style lang="less" scoped>
</style>
