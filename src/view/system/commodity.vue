<template>
  <div>
    <div>
      <Card>
        <div style="display: flex">
          <Button style="margin: 10px;" type="primary" @click="showPack">添加商品</Button>
          <Button style="margin: 10px;" type="primary" @click="$router.push('classification/commodities')">分类管理</Button>
        </div>
        <div>
          <tables ref="tables" v-model="tableData" :columns="columns"/>
        </div>
      </Card>
    </div>
    <div v-if="packBox">
      <!-- <Modal v-model="packBox" title="会员等级" @on-ok="ok" @on-cancel="cancel">-->
      <Modal v-model="packBox" title="商品管理" :mask-closable=false :closable=false>
        <Form :label-width="130">
          <FormItem label="编号:">
            <Input v-model="pack.serial_num" type="number" placeholder="编号">
            </Input>
          </FormItem>
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
          <FormItem label="批发价:">
            <Input v-model="pack.bulk_price" type="number" placeholder="批发价"/>
          </FormItem>
          <FormItem label="会员价:">
            <Input v-model="pack.member_price" type="number" placeholder="会员价"/>
          </FormItem>
          <FormItem label="成本价:">
            <Input v-model="pack.cost_price" type="number" placeholder="成本价"/>
          </FormItem>
          <FormItem label="条形码:">
            <Input v-model="pack.bar_code" placeholder="条形码"/>
          </FormItem>
          <FormItem label="库存数:">
            <Input v-model="pack.surplus_num" type="number" placeholder="库存数"/>
          </FormItem>
          <FormItem label="库存警告数:">
            <Input v-model="pack.surplus_warn_num" type="number" placeholder="库存警告数"/>
          </FormItem>
          <FormItem label="单位:">
            <Input v-model="pack.unit" placeholder="计量单位"/>
          </FormItem>
          <FormItem label="折扣:">
            <Input v-model="pack.discount" placeholder="折扣"/>
          </FormItem>
          <FormItem label="只取商品折扣:">
            <RadioGroup v-model="pack.discount_switch">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="特价:">
            <RadioGroup v-model="pack.special_switch">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否会员价再折扣:">
            <RadioGroup v-model="pack.again_member_switch">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <div style="font-size:12px">说明：特价选择是，其它折扣全为否则特价生效</div>
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
  edit_commodity,
  add_commodity,
  del_commodity
} from '../../api/user'

export default {
  name: 'commodity',
  components: {
    Tables
  },
  data () {
    return {
      commodity: {},
      category: {},
      oldPack: {},
      pack: {
        again_member_switch: 1,
        alias: null,
        bar_code: null,
        bulk_price: null,
        category_str: null,
        category_id: null,
        cost_price: null,
        discount: null,
        discount_switch: 0,
        id: null,
        master_id: null,
        member_price: null,
        sale_price: null,
        serial_num: null,
        special_switch: 0,
        status: null,
        surplus_num: null,
        surplus_warn_num: null,
        tenant_id: null,
        unit: null
      },
      packBox: false,
      columns: [
        {
          title: '编号',
          key: 'serial_num',
          align: 'center',
          sortable: false
        },
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
          title: '条形码',
          key: 'bar_code',
          align: 'center'
        },
        {
          title: '售价',
          key: 'sale_price',
          align: 'center'
        },
        {
          title: '批发价',
          key: 'bulk_price',
          align: 'center'
        },
        {
          title: '会员价',
          key: 'member_price',
          align: 'center'
        },
        {
          title: '成本价',
          key: 'cost_price',
          align: 'center'
        },
        {
          title: '库存数',
          key: 'surplus_num',
          align: 'center'
        },
        {
          title: '单位',
          key: 'unit',
          align: 'center'
        },
        {
          title: '折扣',
          key: 'discount',
          align: 'center'
        },
        {
          title: '只取商品折扣',
          key: 'discount_switch',
          align: 'center',
          render: (h, params) => {
            switch (params.row.discount_switch) {
              case 1:
                return h('span', '是')
              case 0:
                return h('span', '否')
            }
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
          title: '是否会员价再折扣',
          key: 'again_member_switch',
          align: 'center',
          render: (h, params) => {
            switch (params.row.again_member_switch) {
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
        this.category = res.data['tenant_commodity'] || {}
      }).then(() => {
        this.$api.common.getCommodity().then((res) => {
          this.commodity = res.data
          let data = []
          Object.values(this.commodity).forEach((value) => {
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
          del_commodity(data.id).then((res) => {
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
      if (!this.pack.discount) this.pack.discount = 10
      let data = JSON.parse(JSON.stringify(this.pack))

      if (this.pack.id === null) {
        add_commodity(data).then((res) => {
          if (res.code === 0) {
            _this.$Message.info('操作成功')
            _this.init()
            _this.packBox = false
          }
        })
      } else {
        data.old = _this.oldPack
        edit_commodity(data, data.id).then((res) => {
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
      this.pack = {
        again_member_switch: 1,
        alias: null,
        bar_code: null,
        bulk_price: null,
        category_str: null,
        category_id: null,
        cost_price: null,
        discount: null,
        discount_switch: 0,
        id: null,
        master_id: null,
        member_price: null,
        sale_price: null,
        serial_num: null,
        special_switch: 0,
        status: null,
        surplus_num: null,
        surplus_warn_num: null,
        tenant_id: null,
        unit: null
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
