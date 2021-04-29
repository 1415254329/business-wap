temp
<template>
  <div class="app-container">
    <el-table class="table-consume-custom"
      :data="list.slice((pageVar.page-1)*pageVar.pageSize,pageVar.page*pageVar.pageSize)"
       header-cell-class-name="el-table-header-cell-custom" fit border>
      <el-table-column align="center" label="使用时间" width="155">
        <template slot-scope="scope">{{ scope.row.order_time }}</template>
      </el-table-column>
      <el-table-column align="center" label="计次名称" show-overflow-tooltip>
        <template slot-scope="scope">{{ data.alias }}</template>
      </el-table-column>
      <el-table-column align="center" label="使用次数" >
        <template slot-scope="scope">{{ scope.row.employ_num }}</template>
      </el-table-column>
            <el-table-column align="center" label="剩余使用次数" >
        <template slot-scope="scope">{{ (detail.validity_num == 0) ? '不限次数':scope.row.surplus_num }}</template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pageVar.page" :page-sizes="pageVar.pageSizes" :page-size="pageVar.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="pageVar.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      detail: '',
      list: [],
      pageVar: {
        page: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [10, 20, 30, 40, 50]
      }
    }
  },
  watch: {
    data: {
      handler () {
        this.detail = this.data
        this.list = this.data.employs
        console.log(this.data)
        this.pageVar.total = this.list.length
      },
      deep: true
    }
  },
  methods: {
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
