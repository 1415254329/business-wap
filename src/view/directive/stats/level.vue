<template>
  <div class="app-container">
    <el-table class="table-consume-custom" v-loading="listLoading"
      :data="list.slice((pageVar.page-1)*pageVar.pageSize,pageVar.page*pageVar.pageSize)"
      cell-class-name="bonusCellClass" fit border>
      <el-table-column align="center" label="会员等级" width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.hierarchyName }}</template>
      </el-table-column>
      <el-table-column align="center" label="总数量">
        <template slot-scope="scope">{{ scope.row.count }}</template>
      </el-table-column>
      <el-table-column align="center" label="总欠款">
        <template slot-scope="scope">{{ scope.row.arrears_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="总余额">
        <template slot-scope="scope">{{ scope.row.balance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="总赠金" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.giving_price }}</template>
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
      listLoading: false,
      list: [],
      pageVar: {
        page: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [10, 20, 30, 40, 50]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$api.member.getMemberVisit().then(res => {
        this.list = res.data.hierarchy
        this.pageVar.total = this.list.length
        this.$api.user.getInfo().then((res) => {
          let memberRuleList = res.data.member_rule && Object.values(JSON.parse(res.data.member_rule))
          this.list.map((v, i) => {
            memberRuleList.some(rv => {
              if (rv.id == v.hierarchy) {
                v.hierarchyName = rv.alias
                return true
              }
            })
          })
          this.$forceUpdate()
        })
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
