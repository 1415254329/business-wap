<template>
  <Card>
      <div class="search-con search-con-top">
      <!-- <Select v-model="searchKey" class="search-col">
        <Option v-for="item in columns" v-if="item.key !== 'handle'" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
      </Select> -->
      <label>选择日期 ：</label>
        <DatePicker :value="value2" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"/>
        <Button type="primary" style="margin:0 10px">查询</Button>
    </div>
    <tables
      ref="tables"
      editable
      searchable
      search-place="top"
      v-model="tableData"
      :columns="columns"
      show-summary
    />
  </Card>
</template>

<script>
import Tables from '_c/tables'
export default {
  name: 'look_whole',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        { title: '订单时间', key: 'name', align: 'center' },
        { title: '单号', key: 'name', align: 'center' },
        { title: '提成类型', key: 'name', align: 'center' },
        { title: '商品名称', key: 'name', align: 'center' },
        { title: '业绩(元)', key: 'name', align: 'center' },
        { title: '提成(元)', key: 'name', align: 'center' },
        { title: '是否指定', key: 'name', align: 'center' },
        { title: '操作人', key: 'name', align: 'center' }
      ],
      date: '',
      tableData: [],
      value2: ['2016-01-01', '2016-02-15']
    }
  },
  methods: {
    // 搜搜
    handleSearch () {
      this.insideTableData = this.value.filter(item => item[this.searchKey].indexOf(this.searchValue) > -1)
    },
    // 输入框输入事件
    handleClear (e) {
      if (e.target.value === '') this.insideTableData = this.value
      else if (e.target.value.length > 2) ;
    }
  }
}
</script>

<style lang="less" scoped>
</style>
