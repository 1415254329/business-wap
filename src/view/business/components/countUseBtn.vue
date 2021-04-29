<template>
  <el-popover placement="bottom" trigger="click" v-model="listShow">
    <el-badge slot="reference" :value="list.length" :hidden="!list.length" class="item">
      <el-button  @click="handleListShow()" size="medium" type="primary">
        计次使用
      </el-button>
    </el-badge>
    <el-table :data="list.slice((pageVar.page-1)*pageVar.pageSize,pageVar.page*pageVar.pageSize)" style="width: 100%">
      <el-table-column align="center" label="购买日期" width="150">
        <template slot-scope="scope">{{scope.row.order_time}}</template>
      </el-table-column>
      <el-table-column align="center" label="名称" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.alias}}</template>
      </el-table-column>
      <el-table-column align="center" label="总次数" show-overflow-tooltip>
        <template slot-scope="scope">{{  (scope.row.validity_num == 0) ?'无限次数':scope.row.validity_num}}</template>
      </el-table-column>
      <el-table-column align="center" label="剩余次数" show-overflow-tooltip>
        <template slot-scope="scope">{{ (scope.row.validity_num == 0)?'无限次数':(scope.row.validity_num - scope.row.uses_num) }}</template>
      </el-table-column>
      <el-table-column align="center" label="单次业绩" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.employ_cardinal_price}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" show-overflow-tooltip width="90">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;">
            <el-link @click="handleUse(scope.row)" type="primary">使用</el-link>
            <el-link @click="handleView(scope.row)" type="success">查看</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pageVar.page" :page-sizes="pageVar.pageSizes" :page-size="pageVar.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="pageVar.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </el-popover>
</template>
<script>
export default {
  props: {
    // curPage: {
    //   type: String,
    //   default: () => 'count'
    // },
    // curMember: {
    //   type: Object,
    //   default: () => {}
    // },
    list: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    return {
      listShow: false,
      // curList: []
      pageVar: {
        page: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50]
      }
    }
  },
  watch: {
    // curMember () {
    //   this.getCurList()
    // },
    // list () {
    //   this.getCurList()
    // }
    list () {
      this.pageVar.total = this.list.length
    }
  },
  methods: {
    // getCurList () {
    //   if (Object.keys(this.curMember).length) {
    //     this.curList = this.list.filter(v => v.member_id === this.curMember.id)
    //   } else {
    //     this.curList = []
    //   }
    // },
    handleListShow () {
      if (this.listShow) {
        this.listShow = false
        return
      }
      // this.getCurList()
      this.listShow = true
    },
    handleUse (item) {
      if (this.$store.getters.countBoughtUseList.some(v => v.id === item.id)) {
        this.$Message.info('使用列表中已存在该项目')
        return
      }
      this.listShow = false
      this.$store.commit('business/setCountBoughtUseList', this.$store.getters.countBoughtUseList.concat([item]))
      this.$emit('use')
    },
    handleView (item) {
      if (!(item.employs && item.employs.length)) {
        this.$Message.info('该计次没有使用记录')
        return
      }
      this.listShow = false
      this.$emit('view', item)
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
.el-pagination {
    padding: 10px 0;
    text-align: center;
  }
</style>
