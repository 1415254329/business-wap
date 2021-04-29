<template>
  <div class="app-container">
    <el-table :data="list.slice((pageVar.page-1)*pageVar.pageSize,pageVar.page*pageVar.pageSize)"
      v-loading="listLoading" fit border>
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">{{ scope.row.alias }}</template>
      </el-table-column>
      <el-table-column align="center" label="兑换积分">
        <template slot-scope="scope">{{scope.row.integral}}</template>
      </el-table-column>
      <el-table-column align="center" label="兑换数量">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.num" type="number" placeholder="请输入兑换数量" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="兑换所需积分">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.integralAll" type="number" placeholder="请输入兑换所需积分" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="145">
        <template slot-scope="scope">
          <el-button @click="handleBeforeSubmit(scope.row)" type="primary" size="small">立即兑换</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pageVar.page" :page-sizes="pageVar.pageSizes" :page-size="pageVar.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="pageVar.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>
<script>
import {
  parseTime
} from '@/utils'
export default {
  props: {
    curMember: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      listLoading: false,
      form: {},
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
        this.list = (res.data && res.data.filter(v => {
          if (v.status === 0) {
            v.num = 1
            v.integralAll = v.integral
            return true
          }
        })) || []
        this.list.forEach((v, i, arr) => {
          arr[i] = new Proxy(v, {
            set (obj, prop, value) {
              obj[prop] = value
              if (prop === 'num') {
                obj.integralAll = obj.num * obj.integral
              }
              return true
            }
          })
        })
        this.pageVar.total = this.list.length
      })
    },
    handleBeforeSubmit (item) {
      if (!this.curMember.id) {
        this.$Message.info('请先选择会员')
        return
      } else if (!item.num) {
        this.$Message.info('兑换商品数量不能为零')
        return
      }

      this.$alert('是否确认兑换该商品？' +
      '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
      '提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
        callback: action => {
          if (action === 'confirm') {
            this.submit(item)
          }
        }
      })
    },
    submit (item) {
      this.form = {
        exchange_time: parseTime(new Date()),
        surplus: JSON.stringify([{
          qty: item.num,
          self_id: item.id,
          self_alias: item.alias,
          integral: item.integralAll
        }])
      }
      this.$api.business.integralExchange(this.curMember.id, this.form).then(res => {
        this.$Message.success('兑换成功')
        this.$emit('order-success', {
          noPrint: true,
          memberRefresh: true
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
  .app-container {
    margin-top: 20px;
  }
</style>
