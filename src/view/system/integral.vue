<template>
  <div class="app-container">
    <div class="func">
      <el-button size="small" type="primary" @click="handleAdd()">添加</el-button>
    </div>
    <el-table class="table-consume-custom"
     :data="list.slice((pageVar.page-1)*pageVar.pageSize,pageVar.page*pageVar.pageSize)" fit border>
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">{{ scope.row.alias }}</template>
      </el-table-column>
      <el-table-column align="center" label="兑换所需积分">
        <template slot-scope="scope">{{ scope.row.integral }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="145">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="handleDel(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
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
    <el-dialog :visible.sync="show" width="400px">
      <template slot="title">
        <h3>{{formType===1?'添加积分设置':'编辑积分设置'}}</h3>
      </template>
      <div class="main">
        <el-form ref="form" :rules="rules" :model="form" label-width="110px">
          <el-form-item  label="名称" prop="alias">
            <el-input v-model="form.alias"  placeholder="请输入名称" />
          </el-form-item>
          <el-form-item  label="兑换所需积分" prop="integral">
            <el-input v-model="form.integral" type="number" placeholder="请输入兑换所需积分" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align:center" class="dialog-footer">
        <el-button type="primary" @click="submit('form')">提交</el-button>
        <el-button @click="reset('form')">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
function formShape () {
  return {
    id: '',
    alias: '',
    integral: ''
  }
}
export default {
  data () {
    return {
      show: false,
      formType: 1,
      form: formShape(),
      rules: {
        alias: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        integral: [{ required: true, message: '兑换所需积分不能为空', trigger: 'blur' }]
      },
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
      this.$api.common.getIntegral().then(res => {
        this.list = (res.data && res.data.filter(v => v.status === 0)) || []
        this.pageVar.total = this.list.length
      })
    },
    handleAdd () {
      this.show = true
      this.formType = 1
      this.form = formShape()
    },
    handleEdit (item) {
      this.show = true
      this.formType = 2;
      ({
        id: this.form.id,
        alias: this.form.alias,
        integral: this.form.integral
      } = item)
    },
    handleDel (item) {
      this.$api.user.delIntegral(item.id).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.show = false
        this.list.splice(this.list.findIndex(v => v.id === item.id), 1)
      })
    },
    submit (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.formType === 1) {
            this.$api.user.addIntegral(this.form).then(res => {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.show = false
              this.getList()
            })
          } else if (this.formType === 2) {
            this.$api.user.editIntegral(this.form).then(res => {
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
              this.show = false
              this.getList()
            })
          }
        }
      })
    },
    reset (form) {
      this.$nextTick(() => {
        this.$refs[form].resetFields()
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
