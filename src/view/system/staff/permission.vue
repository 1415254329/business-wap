<template>
  <div class="app-container">
    <div class="func">
    </div>
    <el-table v-loading="listLoading"
      :data="list.slice((pageVar.page-1)*pageVar.pageSize,pageVar.page*pageVar.pageSize)" fit>
      <el-table-column align="center" label="员工编号" width="120">
        <template slot-scope="scope">{{ scope.row.serial_num }}</template>
      </el-table-column>
      <el-table-column align="center" label="员工姓名">
        <template slot-scope="scope">{{ scope.row.staff_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="权限列表">
        <template slot-scope="scope">{{ scope.row.pemissionFnStr }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleChange(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pageVar.page" :page-sizes="pageVar.pageSizes" :page-size="pageVar.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="pageVar.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
    <el-dialog :visible.sync="show" width="400px">
      <template slot="title">
        <h3>{{ '修改权限' }}</h3>
      </template>
      <el-form ref="form" :model="form">
        <el-form-item prop="permission">
          <el-tree ref="permissionTree" :data="permissionList" :default-checked-keys="form.operate_permission" node-key="id"
            class="filter-tree" show-checkbox />
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit('form')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  keySync
} from '@/utils'

export default {
  data () {
    return {
      show: false,
      listLoading: false,
      list: [],
      permissionList: this.$permissionFn.asyncFn,
      form: {
        id: '',
        operate_permission: []
      },
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
      this.$api.common.getStaffList().then(res => {
        this.list = Object.values(res.data).filter(v => v.status === 0).map(v => {
          v.pemissionFnStr = this.getFnStrList(v.operate_permission)
          return v
        })
        this.pageVar.total = this.list.length
      })
    },
    getFnStrList (list) {
      return list.map(v => {
        return this.$permissionFn.asyncFn.find(fv => fv.id === v).label
      }).toString()
    },
    async handleChange (staff) {
      this.show = true
      await keySync(this.form, staff)
      // show改为true之后，执行以下代码时dom尚未渲染出来，无法获取到该dom,采用default-key渲染
      // this.$refs.permissionTree.setCheckedKeys(this.form.operate_permission)
    },
    handleSubmit () {
      const checkedRouterKeys = this.$refs.permissionTree.getCheckedKeys()
      this.form.operate_permission = checkedRouterKeys
      this.$api.staff.permissionFnChange(this.form.id, this.form).then(res => {
        this.show = false
        let findStaff = this.list.find(v => v.id === this.form.id)
        findStaff.operate_permission = this.form.operate_permission
        findStaff.pemissionFnStr = this.getFnStrList(findStaff.operate_permission)
        this.$message.success('修改成功')
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
  .app-container {
    margin: 15px;
  }

</style>
