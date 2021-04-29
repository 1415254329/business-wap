<template>
  <div class="search">
    <div class="dataRange">
      <data-picker :value.sync="startTime" />
      <span>至</span>
      <data-picker :value.sync="endTime" />
    </div>
    <el-button @click="$router.push({
      path:'record',
      query:{
        id:$route.query.id,
        startTime:startTime,
        endTime:endTime
      }
    })" type="primary" size="medium">查询</el-button>
  </div>
</template>
<script>
import DataPicker from '../components/dataPicker'
import {
  parseTime
} from '@/utils'
export default {
  components: {
    DataPicker
  },
  data () {
    return {
      startTime: '',
      endTime: ''
    }
  },
  created () {
    this.startTime = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}'))
    this.endTime = new Date(parseTime(new Date().getTime(), '{y}-{m}-{d}'))
    this.startTime.setTime(this.startTime.getTime() - 3600 * 1000 * 24 * 183)
  }
}

</script>
<style lang="less" scoped>
  .search {
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .dataRange {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      input {
        flex-shrink: 0;
        width: 45%;
      }

      span {
        padding: 0 5px;
      }
    }

    .el-button {
      margin-top: 20px;
      width: 80%;
    }
  }

</style>
