<template>
  <Card>
    <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns"
      @remove="remove" />
    <el-dialog :visible.sync="show" width="400px">
      <template slot="title">
        <h3>编辑分类</h3>
      </template>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="alias">
          <el-input v-model="form.alias" placeholder="请输入角色名称" />
        </el-form-item>
      </el-form>

      <div slot="footer" style="text-align:center" class="dialog-footer">
        <el-button type="primary" @click="submit('form')">提交</el-button>
        <el-button @click="reset('form')">重置</el-button>
      </div>
    </el-dialog>
  </Card>
</template>

<script>
import Tables from '_c/tables'
import {
  del_category
} from '../../api/user'
export default {
  components: {
    Tables
  },
  data () {
    return {
      pageType: 'edit',
      show: false,
      form: {
        id: '',
        alias: ''
      },
      rules: {
        account: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      tableData: [],
      columns: [{
        title: '分类名称',
        key: 'alias',
        align: 'center'
      },
      {
        title: '分类项目',
        key: 'tenant_commodity',
        align: 'center'
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h(
              'Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.editCategory(params.row)
                  }
                }
              },
              '编辑'
            ),
            h(
              'Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginLeft: '10px'
                },
                on: {
                  click: () => {
                    this.remove(params.index, params.row.id)
                  }
                }
              },
              '删除'
            )
          ])
        }
      }
      ]
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    getCategoryList () {
      this.$api.common.getCategory().then(res => {
        if (this.$route.params.type === 'services') {
          this.tableData = Object.values(res.data.tenant_project).filter(val => val.status !== 1)
        } else if (this.$route.params.type === 'commodities') {
          this.tableData = Object.values(res.data.tenant_commodity).filter(val => val.status !== 1)
        } else if (this.$route.params.type === 'meter') {
          this.tableData = Object.values(res.data.tenant_meter).filter(val => val.status !== 1)
        }
      })
    },
    remove (index, id) {
      let that = this
      that.$Modal.confirm({
        title: '信息',
        content: '是否确认删除？',
        onOk () {
          del_category(id).then((res) => {
            if (res.code === 0) {
              that.tableData.splice(index, 1)
              this.$Message.info('删除成功')
            }
          })
        }
      })
    },
    editCategory (item) {
      ({
        id: this.form.id,
        alias: this.form.alias,
        source: this.form.source,
        member_rule: this.form.member_rule,
        staff_rule: this.form.staff_rule,
        status: this.form.status
      } = item)
      this.show = true
    },
    submit (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.pageType === 'edit') {
            this.$api.business.editCategory(this.form.id, this.form).then(res => {
              this.show = false
              this.getCategoryList()
              this.$Message.success('编辑成功')
            })
          }
        }
      })
    },
    reset (form) {
      this.$nextTick(() => {
        this.$refs[form].resetFields()
      })
    }
  }
}

</script>

<style lang="less" scoped>
</style>
