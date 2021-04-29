<template>
  <div>
    <div>
      <Card>
        <div style="display: flex">
          <Button style="margin: 10px;" type="primary" @click="showPack">添加计次</Button>
          <Button style="margin: 10px;" type="primary" @click="$router.push('classification/meter')">分类管理</Button>
        </div>
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
          <FormItem label="分类:">
            <Select v-model="pack.category_str" filterable allow-create @on-create="createCategory">
              <template v-for="(item, i) in this.category">
                <Option :value="item.alias" :label="item.alias" :key="item.id">{{ item.alias }}</Option>
              </template>
            </Select>
          </FormItem>
          <FormItem label="售价:">
            <Input v-model="pack.sale_price" type="number" placeholder="售价"/>
          </FormItem>
          <FormItem label="成本价:">
            <Input v-model="pack.cost_price" type="number" placeholder="成本价"/>
          </FormItem>
          <FormItem label="有效期(天):">
            <Input v-model="pack.validity_time" type="number" placeholder="填0代表不限有效期"/>
          </FormItem>
          <FormItem label="次数:">
            <Input v-model="pack.validity_num" type="number" placeholder="填0代表不限制次数"/>
          </FormItem>
          <FormItem label="单次使用业绩:">
            <Input v-model="pack.employ_cardinal_price" type="number" placeholder="单次使用业绩"/>
          </FormItem>
          <FormItem label="回访日期(天):">
          <Input v-model="pack.follow_time" placeholder="回访日期(天)" />
        </FormItem>
          <FormItem label="特价:">
            <RadioGroup v-model="pack.special_switch">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
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
  edit_meter,
  add_meter,
  del_meter
} from '../../api/user'

export default {
  name: 'meters',
  components: {
    Tables
  },
  data () {
    return {
      meter: {},
      category: {},
      oldPack: {},
      pack: {
        alias: null,
        category_str: null,
        category_id: null,
        cost_price: null,
        id: null,
        master_id: null,
        sale_price: null,
        validity_time: null,
        validity_num: null,
        employ_cardinal_price: '',
        special_switch: 1,
        status: null,
        tenant_id: null,
        follow_time: 0
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
          title: '分类',
          key: 'category_id',
          align: 'center',
          render: (h, params) => {
            if (params.row.category_id === 0) {
              return h('span', '')
            }
            return h('span', this.category[params.row.category_id].alias || '')
          }
        },
        {
          title: '售价',
          key: 'sale_price',
          align: 'center'
        },
        {
          title: '成本价',
          key: 'cost_price',
          align: 'center'
        },
        {
          title: '有效期(天)',
          key: 'validity_time',
          align: 'center',
          render: (h, params) => {
            if (params.row.validity_time === 0) {
              return h('span', '不限期')
            }
            return h('span', params.row.validity_time)
          }
        },
        {
          title: '次数',
          key: 'validity_num',
          align: 'center',
          render: (h, params) => {
            if (params.row.validity_num === 0) {
              return h('span', '不限')
            }
            return h('span', params.row.validity_num)
          }
        },
        {
          title: '特价',
          key: 'special_switch',
          align: 'center',
          render: (h, params) => {
            switch (params.row.special_switch) {
              case 1:
                return h('span', '是')
              case 0:
                return h('span', '否')
            }
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
      // 强制请求顺序
      this.$api.common.getCategory().then((res) => {
        this.category = res.data['tenant_meter'] === undefined ? null : res.data['tenant_meter']
      }).then(() => {
        this.$api.common.getMeter().then((res) => {
          this.meter = res.data
          let data = []
          Object.values(this.meter).forEach((value) => {
            if (value == null) {
              return
            }
            Object.values(value).filter((val) => val.status === 0).forEach((v) => {
              data.push(v)
            })
          })
          this.tableData = data
        })
      })
    },
    delete (data) {
      let _this = this
      _this.$Modal.confirm({
        title: '信息',
        content: '是否确认删除？',
        onOk () {
          del_meter(data.id).then((res) => {
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
      this.pack.category_str = this.category[this.pack.category_id].alias
      this.packBox = true
    },
    createCategory (val) {
      if (!this.category) this.category = {}
      this.pack.category_str = val.toString()
      this.pack.category_id = 0
      let id = Math.round(new Date() / 1000)
      this.category[id] = {
        id: id,
        alias: val
      }
    },
    showPack () {
      this.clear()
      this.packBox = true
    },
    ok () {
      let _this = this
      if (!this.pack.validity_time) this.pack.validity_time = 0
      let data = JSON.parse(JSON.stringify(this.pack))
      if (this.pack.id === null) {
        add_meter(data).then((res) => {
          if (res.code === 0) {
            _this.$Message.info('操作成功')
            _this.init()
            _this.packBox = false
          }
        })
      } else {
        data.old = _this.oldPack
        edit_meter(data, data.id).then((res) => {
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
      // 建议使用构造函数，或者表单reset
      this.pack = {
        alias: null,
        category_str: null,
        category_id: null,
        cost_price: null,
        id: null,
        master_id: null,
        sale_price: null,
        validity_time: null,
        validity_num: null,
        employ_cardinal_price: '',
        special_switch: 1,
        status: null,
        tenant_id: null,
        follow_time: 0
      }
      // for (let key in this.pack) {
      //   this.pack[key] = null
      // }
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
