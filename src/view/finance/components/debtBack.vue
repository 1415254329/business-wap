<template>
  <div class="app-container">
    <div class="func">
      <div class="search">
        <el-select v-model="status" placeholder="请选择" :disabled="listLoading">
        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
        <el-date-picker v-model="dateDuring" type="daterange" :picker-options="pickerOptions" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" align="right" size="small"
          value-format="yyyy-MM-dd HH:mm:ss" />
        <el-button size="small" type="primary" @click="getList('normal')">搜索</el-button>
      </div>
    </div>
    <el-table class="table-consume-custom" v-loading="listLoading" :data="curStats"
      header-cell-class-name="el-table-header-cell-custom" fit>
      <el-table-column align="center" label="还款时间" min-width="100">
        <template slot-scope="scope">{{ scope.row.repay_time }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员名称" width="120">
        <template slot-scope="scope">{{ scope.row.memberName }}</template>
      </el-table-column>
      <el-table-column align="center" label="手机号" min-width="100">
        <template slot-scope="scope">{{ scope.row.memberPhone }}</template>
      </el-table-column>
      <el-table-column align="center" label="支付方式" width="120">
        <template slot-scope="scope">{{ scope.row.payment_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="还款金额" width="120">
        <template slot-scope="scope">{{ scope.row.arrears_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="还款后欠款" width="120">
        <template slot-scope="scope">{{ scope.row.arrears_after_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 0" @click="handleDelete(scope.row,scope.$index)" type="danger" size="small">撤单</el-button>
        </template>
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
      curStats: [],
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
      },
      status: 0,
      statusList: [{
        value: 0,
        label: '正常'
      },
      {
        value: 1,
        label: '封禁'
      },
      {
        value: 2,
        label: '全部'
      }]
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
    status (v) {
      switch (v) {
        case 0:
          this.curStats = this.stats.filter(v => v.status === 0)
          break
        case 1:
          this.curStats = this.stats.filter(v => v.status === 2)
          break
        case 2:
          this.curStats = this.stats
          break
        default:break
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
    getMemberList () {
      return this.$api.common.getMemberList().then((res) => {
        return (res.data ? Object.values(res.data) : [])
      })
    },
    getList () {
      let dataDiff = new Date(this.searchForm.end_time).getTime() - new Date(this.searchForm.start_time).getTime()
      if (!isNaN(dataDiff) && dataDiff > (3600 * 1000 * 24 * 31)) {
        this.$Message.info('日期范围不能大于1个月')
        return
      }

      this.listLoading = true

      this.$api.member.getMemberDebt(this.searchForm).then(res => {
        this.getMemberList().then(list => {
          res.data && res.data.map(v => {
            list.map(lv => {
              if (v.member_id === lv.id) {
                v.memberName = lv.alias
                v.memberPhone = lv.phone
              }
            })
          })
          this.stats = res.data || []
          this.curStats = this.stats.filter(v => v.status === 0)
        })

        this.listLoading = false
      })
    },
    handleDelete (item, index) {
      this.$api.member.delMemberDebt(item.id).then(res => {
        this.$Message.success('撤单成功')
        item.status = 2
        this.curStats.splice(index, 1)
      })
    }
  }
}

</script>

<style lang="less" scoped>

</style>
