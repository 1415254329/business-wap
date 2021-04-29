<template>
  <div v-loading="loading" class="app-container">
    <el-table  :data="list" class="table-consume-custom"
      header-cell-class-name="el-table-header-cell-custom" fit>
      <el-table-column align="center" label="发送内容">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>
      <el-table-column align="center" label="发送模式">
        <template slot-scope="scope">{{ scope.row.moldName }}</template>
      </el-table-column>
      <el-table-column align="center" label="当前进度">
        <template slot-scope="scope">{{ scope.row.schedule}}</template>
      </el-table-column>
      <el-table-column align="center" label="申请日期">
        <template slot-scope="scope">{{ scope.row.create_time }}</template>
      </el-table-column>
      <el-table-column align="center" label="发送时间" min-width="120">
        <template slot-scope="scope">{{ scope.row.send_time || '尚未发送，请耐性等待审核' }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      list: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      this.$api.common.getSendMessageList().then(res => {
        let moldMap = new Map([
          ['sms', '短信'],
          ['wechat', '微信']
        ])
        this.list = res.data ? res.data.map(v => {
          v.moldName = moldMap.get(v.mold)
          return v
        }) : []
        this.loading = false
      })
    }
  }
}

</script>

<style lang="less" scoped>

</style>
