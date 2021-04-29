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
    <el-table v-loading="listLoading" :data="list" class="table-consume-custom"
      header-cell-class-name="el-table-header-cell-custom" fit>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">{{ scope.row.member.alias }}</template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">{{ scope.row.member.phone }}</template>
      </el-table-column>
      <el-table-column align="center" label="余额">
        <template slot-scope="scope">{{ scope.row.member.balance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="上次消费时间">
        <template slot-scope="scope">{{ scope.row.order_time }}</template>
      </el-table-column>
      <el-table-column align="center" label="项目">
        <template slot-scope="scope">{{ scope.row.self_alias }}</template>
      </el-table-column>
      <el-table-column align="center" label="服务员工">
        <template slot-scope="scope">{{scope.row.staffListStr }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="90">
        <template slot-scope="scope">
            <el-button @click="handleStatusChange(scope.row)" type="primary" size="small" :disabled="Boolean(scope.row.follow_status)">
              {{Boolean(scope.row.follow_status)?'已回访':'未处理'}}
            </el-button>
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
      list: [],
      memberList: [],
      pickerOptions: {
        shortcuts: [{
          text: '明天',
          onClick (picker) {
            const start = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 00:00:00')
            const end = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 23:59:59')
            start.setTime(start.getTime() + 3600 * 1000 * 24 * 1)
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 1)
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
      this.init()
    }.bind(this))
  },
  methods: {
    init () {
      let dataDiff = new Date(this.searchForm.end_time).getTime() - new Date(this.searchForm.start_time).getTime()
      if (!isNaN(dataDiff) && dataDiff > (3600 * 1000 * 24 * 31)) {
        this.$Message.info('日期范围不能大于1个月')
        return
      }
      this.listLoading = true
      if (!this.memberList.length) {
        this.getMemberList().then(res => {
          this.memberList = Object.values(res.data)
          this.getList()
        })
      } else {
        this.getList()
      }
    },
    getList () {
      return this.$api.business.getProjectRevisitList(this.searchForm).then(res => {
        this.list = res.data && res.data.map(v => {
          v.member = this.memberList.find(mv => mv.id === v.member_id)
          v.staff.forEach(sv => {
            v.staffListStr = !v.staffListStr ? sv.staff_name : `${sv.staff_name},`
          })
          return v
        })
        this.listLoading = false
      })
    },
    getMemberList () {
      return this.$api.common.getMemberList(res => {
        return res
      })
    },
    handleStatusChange (item) {
      this.$api.business.projectRevisitChange(item.id).then(res => {
        this.$message.success('修改成功')
        item.follow_status = true
      })
    }
  }
}

</script>

<style lang="less" scoped>
  .store-item {
    display: flex;
    justify-content: space-between;
    width: 100%;

    >div {
      flex: 0 1 33.33%;
      text-align: center;
    }
  }

  /deep/.bonus-column-custom {
    padding: 0 0 !important;

    td,th {
      padding: 0 !important;
    }

    .cell {
      padding: 0 !important;
    }
  }

</style>
