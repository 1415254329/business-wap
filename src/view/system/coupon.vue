<template>
  <div>
    <div>
      <Card>
        <Button style="margin: 10px;" type="primary" @click="showPack">添加优惠券</Button>
        <div>
          <tables ref="tables" v-model="tableData" :columns="columns"/>
        </div>
      </Card>
    </div>
    <div v-if="packBox">
      <!--      <Modal v-model="packBox" title="会员等级" @on-ok="ok" @on-cancel="cancel">-->
      <Modal v-model="packBox" title="计次管理" :mask-closable=false :closable=false>
        <Form :label-width="130">
          <FormItem label="名称:">
            <Input v-model="pack.alias" placeholder="名称"/>
          </FormItem>
          <FormItem label="数量:">
            <Input v-model="pack.num" type="number" placeholder="不限数量填写-1"/>
          </FormItem>
          <FormItem label="限制金额:">
            <Input v-model="pack.restrain_price" type="number" placeholder="不限制金额填写0"/>
          </FormItem>
          <FormItem label="有效期类型:">
            <RadioGroup v-model="pack.type">
              <Radio :label="1">日期</Radio>
              <Radio :label="0">天</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="天:" v-if="pack.type===0">
            <Input v-model="pack.days" type="number" placeholder="不限有效期填写-1"/>
          </FormItem>
          <FormItem label="日期:" v-if="pack.type===1">
            <DatePicker v-model="pack.days" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期" type="datetime"
                        :clearable="true" style="width:300px"/>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="warning" size="large" small @click="cancel">取消</Button>
          <Button type="success" size="large" small @click="ok">确认</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import Tables from '_c/tables'
import {
  edit_coupon,
  add_coupon,
  del_coupon
} from '../../api/user'
import { getDate, getTimestamp } from '@/utils'

export default {
  name: 'coupon',
  components: {
    Tables
  },
  data () {
    return {
      coupon: {},
      category: {},
      oldPack: {},
      pack: {
        id: null,
        tenant_id: null,
        master_id: null,
        alias: null,
        num: null,
        restrain_price: null,
        type: null,
        days: null
      },
      packBox: false,
      columns: [
        {
          title: '名称',
          key: 'alias',
          align: 'center',
          sortable: false
        },

        {
          title: '数量',
          key: 'num',
          align: 'center',
          render: (h, params) => {
            if (params.row.num === -1) {
              return h('span', '不限')
            }
            return h('span', params.row.num)
          }
        },
        {
          title: '限制金额',
          key: 'restrain_price',
          align: 'center',
          render: (h, params) => {
            if (params.row.restrain_price === 0) {
              return h('span', '不限')
            }
            return h('span', params.row.restrain_price)
          }
        },
        {
          title: '有效期类型',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            if (params.row.type === 0) {
              return h('span', '天')
            }
            return h('span', '日期')
          }
        },
        {
          title: '有效期',
          key: 'days',
          align: 'center',
          render: (h, params) => {
            if (params.row.type === 0) {
              if (params.row.days === -1) {
                return h('span', '不限')
              }
              return h('span', params.row.days + '天')
            }
            return h('span', getDate(params.row.days, 'year'))
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delete(params.row)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      tableData: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$api.common.getCoupon().then((res) => {
        if (res.code === 0) {
          this.coupon = res.data
          this.tableData = this.coupon.filter((val) => val.status === 0)
        }
      })
    },
    delete (data) {
      let _this = this
      _this.$Modal.confirm({
        title: '信息',
        content: '是否确认删除？',
        onOk () {
          del_coupon(data.id).then((res) => {
            if (res.code === 0) {
              _this.$Message.info('操作成功')
              _this.init()
            }
          })
        }
      })
    },
    // 编辑
    edit (data) {
      data = JSON.parse(JSON.stringify(data))
      this.oldPack = data
      for (let key in this.pack) {
        this.pack[key] = data.hasOwnProperty(key) ? data[key] : null
      }
      this.packBox = true
    },
    showPack () {
      this.clear()
      this.packBox = true
    },
    ok () {
      let _this = this
      let data = JSON.parse(JSON.stringify(this.pack))
      if (data.type === 1) {
        data.days = getTimestamp(data.days)
      }
      if (this.pack.id === null) {
        add_coupon(data).then((res) => {
          if (res.code === 0) {
            _this.$Message.info('操作成功')
            _this.init()
            _this.packBox = false
          }
        })
      } else {
        data.old = _this.oldPack
        edit_coupon(data, data.id).then((res) => {
          if (res.code === 0) {
            _this.oldPack = {}
            _this.$Message.info('操作成功')
            _this.init()
            _this.packBox = false
          }
        })
      }
      this.clear()
    },
    cancel () {
      this.clear()
      this.oldPack = {}
      this.packBox = false
    },
    clear () {
      for (let key in this.pack) {
        this.pack[key] = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.api div {
  font-size: 16px;
  cursor: pointer;
}

.ivu-form-item {
  margin-bottom: 5px;
}
</style>
