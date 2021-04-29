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
      :cell-class-name="bonusCellClass" header-cell-class-name="el-table-header-cell-custom" fit border>
      <el-table-column align="center" label="还款日期" width="120">
        <template slot-scope="scope">{{ scope.row.repay_time }}</template>
      </el-table-column>
      <el-table-column align="center" label="还款方式" >
        <template slot-scope="scope">{{ scope.row.payment_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="还款金额">
        <template slot-scope="scope">{{ scope.row.arrears_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="还款前欠款金额" >
        <template slot-scope="scope">{{ scope.row.arrears_before_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="还款后欠款金额">
        <template slot-scope="scope">{{ scope.row.arrears_after_price }}</template>
      </el-table-column>
            <el-table-column align="center" label="备注" show-overflow-tooltip>
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

      this.$api.member.getMemberDebt(this.searchForm).then(res => {
        !res.data && (res.data = [])
        this.list = res.data.filter(v => v.status === 0)
        this.listLoading = false
        this.pageVar.total = this.list.length
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
            padding: 0 10px;
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
