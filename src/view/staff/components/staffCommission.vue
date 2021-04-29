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
    <div v-if="list.length" class="list">
        <div v-for="(item,index) in list" :key="index" class="item">
            名称：【{{item.source_alias}}】 提成：【{{item.dividends_price}}】 业绩：【{{item.performance_price}}】 数量：【{{item.count}}】
        </div>
    </div>
    <div v-else>
        暂无详情
    </div>
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
    staffId: {
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
        staff_id: ''
      },
      listLoading: false,
      list: [],
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
    staffId () {
      if (this.staffId) {
        this.searchForm.staff_id = this.staffId
      }
    },
    show () {
      this.getList()
    }
  },
  created () {
    if (this.staffId) {
      this.searchForm.staff_id = this.staffId
    }
    const start = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 00:00:00')
    const end = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 23:59:59')
    this.dateDuring = [parseTime(start), parseTime(end)]

    setTimeout(function () {
      this.getList()
    }.bind(this))
  },
  methods: {
    getList () {
      this.listLoading = true
      this.$api.staff.getBonus(this.searchForm).then(res => {
        this.list = res.data[0].detail || []
        this.listLoading = false
        // this.pageVar.total = this.list.length
      })
    },
    handleSizeChange (val) {
      this.pageVar.pageSize = val
      this.pageVar.page = 1
      // this.getList()
    },
    handleCurrentChange (val) {
      this.pageVar.page = val
      // this.getList()
    }
  }
}

</script>

<style lang="less" scoped>
  .app-container {
      margin-top: 30px;
    .list{
        .item{
            font-size: 20px;
            // font-weight: 600;
        }
    }
  }

</style>
