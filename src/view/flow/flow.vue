<template>
  <div class="app-container">
    <div class="func">
      <div class="search">
        <el-date-picker v-model="dateDuring" type="daterange" :picker-options="pickerOptions" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" align="right" size="small"
          value-format="yyyy-MM-dd HH:mm:ss" />
        <el-select v-model="type" placeholder="类型" size="small" clearable>
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button size="small" type="primary" @click="getList()">搜索</el-button>
      </div>
      <el-button size="small" type="primary" @click="handleCreate()">添加收支</el-button>
    </div>
    <el-table v-loading="listLoading"
      :data="curList.slice((pageVar.page-1)*pageVar.pageSize,pageVar.page*pageVar.pageSize)" fit>
      <el-table-column align="center" label="日期" width="150">
        <template slot-scope="scope">{{ scope.row.disburse_time }}</template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">{{ scope.row.type?'收入':'支出' }}</template>
      </el-table-column>
      <el-table-column align="center" label="金额">
        <template slot-scope="scope">{{ scope.row.money }}</template>
      </el-table-column>
      <el-table-column align="center" label="备注" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.memo }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button @click="handleChange(scope.row)" type="primary" size="small">修改</el-button>
          <el-button @click="handleDelete(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <div class="sum">合计：{{sum}}元</div>
      <el-pagination :current-page="pageVar.page" :page-sizes="pageVar.pageSizes" :page-size="pageVar.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="pageVar.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog :visible.sync="show" width="400px">
      <template slot="title">
        <h3>{{formType===1?'添加收支记录':'修改收支记录'}}</h3>
      </template>
      <div class="main">
        <el-form ref="form" :rules="rules" :model="form" label-width="110px">
          <el-form-item label="日期" prop="disburse_time">
            <el-date-picker v-model="form.disburse_time" type="datetime" value-format="yyyy-MM-dd hh:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio :label="0">支出</el-radio>
              <el-radio :label="1">收入</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="金额" prop="money">
            <el-input v-model="form.money" type="number" placeholder="请输入金额" />
          </el-form-item>
          <el-form-item label="备注" prop="integral">
            <el-input v-model="form.memo" placeholder="请输入备注" />
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
import {
  parseTime,
  keySync
} from '@/utils'

function formShape () {
  return {
    id: '',
    disburse_time: '',
    type: 0,
    money: '',
    memo: ''
  }
}
export default {
  data () {
    return {
      show: false,
      dateDuring: '',
      searchForm: {
        start_time: '',
        end_time: '',
        memberId: ''
      },
      formType: 1,
      form: formShape(),
      rules: {
        type: [{
          required: true,
          message: '类型不能为空',
          trigger: 'blur'
        }],
        disburse_time: [{
          required: true,
          message: '日期不能为空',
          trigger: 'blur'
        }],
        money: [{
          required: true,
          message: '金额不能为空',
          trigger: 'blur'
        }]
      },
      listLoading: false,
      list: [],
      curList: [],
      type: '',
      typeList: [{
        label: '全部',
        value: ''
      }, {
        label: '支出',
        value: 1
      }, {
        label: '收入',
        value: 2
      }],
      pickerOptions: {
        shortcuts: [{
          text: '昨天',
          onClick (picker) {
            const start = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 00:00:00')
            const end = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 23:59:59')
            start.setTime(start.getTime() - 3600 * 24 * 1000)
            end.setTime(end.getTime() - 3600 * 24 * 1000)
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
      pageVar: {
        page: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [10, 20, 30, 40, 50]
      }
    }
  },
  watch: {
    type () {
      this.getFilterList()
    },
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
  computed: {
    sum () {
      console.log(1, this.curList)
      return this.curList.reduce((pre, cur) => {
        console.log(2, pre)
        if (cur.type === 0) return pre - cur.money
        else if (cur.type === 1) return pre + cur.money
        else return pre
      }, 0)
    }
  },
  created () {
    const start = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 00:00:00')
    const end = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 23:59:59')
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 31)
    this.dateDuring = [parseTime(start), parseTime(end)]

    setTimeout(function () {
      this.getList()
    }.bind(this))
  },
  methods: {
    getFilterList () {
      this.curList = this.list.filter(v => {
        if (this.type === 1) return v.type === 0
        else if (this.type === 2) return v.type === 1
        else return true
      })
      this.listLoading = false
      this.pageVar.total = this.list.length
    },
    getList () {
      this.listLoading = true
      this.$api.business.getCashFlowList(this.searchForm).then(res => {
        !res.data && (res.data = [])
        this.list = res.data
        this.getFilterList()
      })
    },
    handleCreate () {
      this.formType = 1
      this.show = true
      this.form = formShape()
      this.reset('form', 2)
    },
    handleChange (item) {
      this.formType = 2
      this.show = true
      keySync(this.form, item)
      this.reset('form', 2)
    },
    handleDelete (item) {
      this.$api.business.deleteCashFlow(item.id).then(res => {
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
            this.$api.business.createCashFlow(this.form).then(res => {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.show = false
              this.getList()
            })
          } else if (this.formType === 2) {
            this.$api.business.changeCashFlow(this.form).then(res => {
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
    reset (form, type = 1) {
      if (type === 1) {
        return this.$nextTick(() => {
          console.log('reset')
          this.$refs[form].resetFields()
        })
      } else if (type === 2) {
        return this.$nextTick(() => {
          console.log('reset')
          this.$refs[form].clearValidate()
        })
      }
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

    .func {
      .el-select {
        margin-left: 10px;
      }
    }

    .footer {
      position: relative;
      .sum {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }
  }

</style>
