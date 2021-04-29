<template>
  <div>
    <div>
      <Card>
        <Button style="margin: 10px;" type="primary" @click="showPack">添加耗品</Button>
        <div>
          <tables ref="tables" v-model="tableData" :columns="columns"/>
        </div>
      </Card>
    </div>
    <div v-if="packBox">
      <!--      <Modal v-model="packBox" title="会员等级" @on-ok="ok" @on-cancel="cancel">-->
      <Modal v-model="packBox" title="耗品管理" :mask-closable=false :closable=false>
        <Form :label-width="130">
          <FormItem label="编号:">
            <Input v-model="pack.serial_num" type="number" placeholder="编号"/>
          </FormItem>
          <FormItem label="名称:">
            <Input v-model="pack.alias" placeholder="名称"/>
          </FormItem>
          <FormItem label="基数:">
            <Input v-model="pack.cardinal_num" type="number" placeholder="基数"/>
          </FormItem>
          <FormItem label="单位:">
            <Input v-model="pack.unit" placeholder="单位"/>
          </FormItem>
          <FormItem label="备注">
            <Input v-model="pack.memo"  placeholder="备注"/>
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
  edit_wastage,
  add_wastage,
  del_wastage
} from '../../api/user'

export default {
  name: 'wastage',
  components: {
    Tables
  },
  data () {
    return {
      wastage: {},
      oldPack: {},
      pack: {
        alias: null,
        serial_num: null,
        id: null,
        master_id: null,
        unit: null,
        cardinal_num: null,
        memo: null,
        status: null,
        tenant_id: null
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
          title: '单位',
          key: 'unit',
          align: 'center'
        },
        {
          title: '基数',
          key: 'cardinal_num',
          align: 'center'
        },
        {
          title: '备注',
          key: 'memo',
          align: 'center'
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
      this.$api.common.getWastage().then((res) => {
        if (res.code === 0) {
          this.wastage = res.data
          this.tableData = this.wastage.filter((val) => val.status === 0)
          // this.tableData = data
        }
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
      this.packBox = true
    },
    showPack () {
      this.clear()
      this.packBox = true
    },
    ok () {
      let _this = this
      let data = JSON.parse(JSON.stringify(this.pack))
      if (this.pack.id === null) {
        add_wastage(data).then((res) => {
          if (res.code === 0) {
            _this.$Message.info('操作成功')
            _this.init()
            _this.packBox = false
          }
        })
      } else {
        data.old = _this.oldPack
        edit_wastage(data, data.id).then((res) => {
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
