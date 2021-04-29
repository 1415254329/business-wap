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
      header-cell-class-name="el-table-header-cell-custom" fit>
      <el-table-column align="center" label="操作时间" width="155">
        <template slot-scope="scope">{{ scope.row.create_time }}</template>
      </el-table-column>
      <el-table-column align="center" label="用户类型" width="80">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>
      <el-table-column align="center" label="用户名称" width="120">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="详情">
        <el-table-column align="center" label="请求方法" width="80">
          <template slot-scope="scope">{{ scope.row.method }}</template>
        </el-table-column>
        <el-table-column align="center" label="请求路由" width="195">
          <template slot-scope="scope">{{ scope.row.url }}</template>
        </el-table-column>
        <el-table-column align="center" label="请求体" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.request }}</template>
        </el-table-column>
        <el-table-column align="center" label="响应体"  show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.response }}</template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageVar.page"
      :page-sizes="pageVar.pageSizes"
      :page-size="pageVar.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageVar.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
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
      list: [],
      staffList: [],
      pageVar: {
        page: 1,
        total: 0,
        pageSize: 20,
        pageSizes: [10, 20, 30, 40]
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

      let p1 = this.$store.dispatch('store/refreshStoreList')
      let p2 = this.$api.common.getStaffList()
      Promise.all([p1, p2])
        .then((result) => {
          this.staffList = result[1].data ? Object.values(result[1].data) : []
          this.$api.common.getLogs(this.searchForm).then(res => {
            res.data.map((v, i) => {
              if (v.business_role === 'user_tenant') {
                v.type = '商户'
                this.$store.dispatch('store/findStore', v.business_id).then(sv => {
                  v.name = sv.store_name
                  if (i === res.data.length - 1) this.list = res.data
                })
              } else if (v.business_role === 'tenant_staff') {
                v.type = '员工'
                this.staffList.some(sv => {
                  if (sv.id === v.business_id) {
                    v.name = sv.staff_name
                    return true
                  }
                })
              }
            })
            this.pageVar.total = res.data.length
            this.listLoading = false
          })
        }).catch((error) => {
          console.log(error)
        })
    },
    handleSizeChange (val) {
      this.pageVar.pageSize = val
      this.pageVar.page = 1
    },
    handleCurrentChange (val) {
      this.pageVar.page = val
    }
  }
}

</script>

<style lang="less" scoped>

</style>
