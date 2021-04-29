<template>
    <input v-model="date" class="date-input" type="text" :name="uuidDom" :id="uuidDom" placeholder="选择开始日期" readonly="readonly">
</template>
<script>
import '@/assets/js/LCalendar'
import { parseTime } from '@/utils'
export default {
  props: {
    value: {
      default: () => ''
    }
  },
  data () {
    return {
      uuidDom: 'a' + Math.ceil(Math.random() * 1000000),
      date: ''
    }
  },
  watch: {
    date (v) {
      this.$emit('update:value', v)
    },
    dateP (v) {
      this.date = v
    }
  },
  created () {
    this.date = parseTime(this.value, '{y}-{m}-{d}')
  },
  mounted () {
    let calendar = new LCalendar()
    calendar.init({
      'trigger': `#${this.uuidDom}`,
      'type': 'date', // date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
      'minDate': (new Date().getFullYear() - 3) + '-' + 1 + '-' + 1,
      'maxDate': (new Date().getFullYear() + 3) + '-' + 12 + '-' + 31
    })
  }
}
</script>
<style lang="less">
@import "../../../assets/css/LCalendar.less";
.date-input{
    padding: 0px 10px;
    height: 40px;
    line-height: 40px;
    border:1px solid rgba(0,0,0,0.2);
    border-radius: 4px;
    box-sizing: border-box;
}
</style>
