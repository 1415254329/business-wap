<template>
  <div class="app-container">
    <el-table class="table-consume-custom" v-loading="listLoading"
      :data="list.slice((pageVar.page-1)*pageVar.pageSize,pageVar.page*pageVar.pageSize)"
      cell-class-name="bonusCellClass" fit border>
      <el-table-column align="center" label="会员姓名" width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.member.alias }}</template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">{{ scope.row.member.phone }}</template>
      </el-table-column>
      <el-table-column align="center" label="兑换时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.exchange_time }}</template>
      </el-table-column>
      <el-table-column align="center" label="兑换名称" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.self_alias }}</template>
      </el-table-column>
      <el-table-column align="center" label="兑换前积分" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.befor_integral }}</template>
      </el-table-column>
      <el-table-column align="center" label="消费积分" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.integral }}</template>
      </el-table-column>
      <el-table-column align="center" label="兑换后积分" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.after_integral }}</template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pageVar.page" :page-sizes="pageVar.pageSizes" :page-size="pageVar.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="pageVar.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>
<script>
import { parseTime } from '@/utils'
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
      this.getMemberList().then(list => {
        this.memberList = list || []
        this.getList()
      })
    },
    getMemberList () {
      return this.$api.common.getMemberList().then((res) => {
        return res.data
      })
    },
    getList () {
      let dataDiff = new Date(this.searchForm.end_time).getTime() - new Date(this.searchForm.start_time).getTime()
      if (!isNaN(dataDiff) && dataDiff > (3600 * 1000 * 24 * 31)) {
        this.$Message.info('日期范围不能大于1个月')
        return
      }

      this.listLoading = true

      this.$api.member.getMemberIntegralList(this.searchForm).then(res => {
        let list = res.data || []

        list.map(v => {
          this.memberList.some(mv => {
            if (mv.id === v.member_id) {
              v['member'] = mv
              return true
            }
          })
        })
        console.log(list)
        this.list = list
        this.pageVar.total = this.list.length
        this.listLoading = false
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
