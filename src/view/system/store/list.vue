<template>
  <div class="app-container">
    <div class="func">
      <el-button size="small" type="primary" @click="$router.push('/system/store/add')">添加商户</el-button>
    </div>
    <el-table class="table-consume-custom"
     :data="list.slice((pageVar.page-1)*pageVar.pageSize,pageVar.page*pageVar.pageSize)" fit border>
      <el-table-column align="center" label="账号">
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">{{ scope.row.store_name }}</template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleAgree(scope.row.id)">调班</el-button>
          <el-button type="danger" size="small" @click="handleRefuse(scope.row.id)">拒绝</el-button>
        </template>
      </el-table-column> -->
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
export default {
  data () {
    return {
      list: [],
      pageVar: {
        page: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$api.store.getStoreList().then(res => {
        this.list = res.data
        this.pageVar.total = this.list.length
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
