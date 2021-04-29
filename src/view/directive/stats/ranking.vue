<template>
  <div class="app-container">
    <el-tabs v-model="tabIndex">
      <el-tab-pane label="余额排行" name="1"></el-tab-pane>
      <el-tab-pane label="累计充值金额排行" name="2"></el-tab-pane>
      <el-tab-pane label="到店次数排行" name="3"></el-tab-pane>
      <el-tab-pane label="累计支付排行" name="4"></el-tab-pane>
    </el-tabs>
    <el-table class="table-consume-custom" v-loading="listLoading"
      :data="curList.slice((pageVar.page-1)*pageVar.pageSize,pageVar.page*pageVar.pageSize)"
      cell-class-name="bonusCellClass" fit border>
      <el-table-column align="center" label="会员姓名" width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.alias }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员等级">
        <template slot-scope="scope">{{ scope.row.hierarchyName }}</template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column align="center" label="余额" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.balance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="累计充值金额">
        <template slot-scope="scope">{{ scope.row.cumsum_balance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="到店次数">
        <template slot-scope="scope">{{ scope.row.cumsum_num }}</template>
      </el-table-column>
      <el-table-column align="center" label="消费金额">
        <template slot-scope="scope">{{ scope.row.cumsum_pay_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="最后一次到店时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.update_time}}</template>
      </el-table-column>

    </el-table>
    <el-pagination :current-page="pageVar.page" :page-sizes="pageVar.pageSizes" :page-size="pageVar.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="pageVar.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      memberRuleList: [],
      tabIndex: '1',
      allList: {},
      listLoading: false,
      curList: [],
      pageVar: {
        page: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50]
      }
    }
  },
  watch: {
    tabIndex (v) {
      switch (v) {
        case '1':
          this.curList = this.allList.rank.balance || []
          break
        case '2':
          this.curList = this.allList.rank.cumsum_balance || []
          break
        case '3':
          this.curList = this.allList.rank.cumsum_num || []
          break
        case '4':
          this.curList = this.allList.rank.cumsum_pay || []
          break
        default:
          break
      }
      this.matchMemberName()
      this.pageVar.total = this.curList.length
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      this.listLoading = true
      this.$api.member.getMemberVisit().then(res => {
        this.allList = res.data
        this.curList = this.allList.rank.balance
        this.pageVar.total = this.curList.length
        this.listLoading = false
        this.$api.user.getInfo().then((res) => {
          this.memberRuleList = res.data.member_rule && Object.values(JSON.parse(res.data.member_rule))
          this.matchMemberName()
        })
      })
    },
    matchMemberName () {
      this.curList.map((v, i) => {
        this.memberRuleList.some(rv => {
          if (rv.id == v.hierarchy) {
            v.hierarchyName = rv.alias
            return true
          }
        })
      })
      this.$forceUpdate()
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
