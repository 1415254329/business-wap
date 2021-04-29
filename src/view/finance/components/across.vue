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
    <el-table class="table-consume-custom" v-loading="listLoading" :data="list" :span-method="rowMerge"
      header-cell-class-name="el-table-header-cell-custom" :cell-class-name="bonusCellClass" fit>
      <el-table-column align="center" label="店名" width="120">
        <template slot-scope="scope">{{ scope.row.store_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="跨店">
        <el-table-column align="center" label="店名">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.statistics" :key="index" class="store-item">
              <div class="store">
                {{item.store_name}}
              </div>
              <div class="balance">
                {{item.consume.balance}}
              </div>
              <div class="giving">
                {{item.consume.giving}}
              </div>
              <div class="consume">
                {{item.prestore}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="余额">
          <template slot-scope="scope">{{ scope.row.store_name }}</template>
        </el-table-column>
        <el-table-column align="center" label="赠金">
          <template slot-scope="scope">{{ scope.row.store_name }}</template>
        </el-table-column>
        <el-table-column align="center" label="充值金额">
          <template slot-scope="scope">{{ scope.row.store_name }}</template>
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
      list: [],
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

      this.$api.business.getAcrossReportStats(this.searchForm).then(res => {
        this.list = res.data
        this.listLoading = false
      })
    },
    rowMerge ({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 1) {
        return {
          colspan: 4,
          rowspan: 1
        }
      } else if (columnIndex > 1) {
        return [0, 0]
      }
    },
    bonusCellClass ({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 1) {
        return 'bonus-column-custom'
      }
    }
  }
}

</script>

<style lang="less" scoped>
  .store-item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    >div{
      flex: 0 1 33.33%;
      text-align: center;
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
</style>
