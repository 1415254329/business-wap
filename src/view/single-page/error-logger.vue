<template>
  <div>
    <Button @click="exportData" type="primary" style="margin: 0 10px 10px 0;">导出日志记录</Button>
    <Table ref="table" :columns="columns" :data="errorList"></Table>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { addLog } from '../../api/common'
export default {
  name: 'error_logger_page',
  data () {
    return {
      errorList: [],
      columns: [
        {
          key: 'client_ip',
          title: '请求IP'
        },
        {
          key: 'business_role',
          title: '操作人员',
          render: (h, { row }) => {
            console.log({ row })
          }
        },
        {
          key: 'uri',
          title: '请求url'
        },
        {
          key: 'method',
          title: '请求方式'
        },
        {
          key: 'response',
          title: '请求参数'
        },
        {
          key: 'response',
          title: '响应结果'
        },
        {
          key: 'response_code',
          title: '响应结果状态码'
        },

        {
          key: 'create_time',
          title: '请求时间'
        }
      ]
    }
  },
  methods: {
    exportData () {
      this.$refs.table.exportCsv({
        filename: '错误日志.csv'
      })
    }
  },
  mounted () {
    addLog(20).then(res => {
      if (res.code == 0) {
        this.errorList = res.data
      } else {
        this.$Message.info(res.message)
      }
    })
  }
}
</script>

<style lang="less" scoped>

</style>
