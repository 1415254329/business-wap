<template>
  <div>
    <Card>
      <Button style="margin: 10px" type="primary" @click="add">新建部门</Button>
      <Modal v-model="box" title="部门管理" @on-ok="ok" @on-cancel="cancel">
        <Input v-model="pack.alias" placeholder="请输入部门名称"/>
      </Modal>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns"/>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { add_group, del_group, edit_group } from '../../api/user'

export default {
  name: 'depar_manager',
  components: {
    Tables
  },
  data () {
    return {
      box: false,
      pack: {
        id: null,
        alias: null
      },
      oldPack: null,
      columns: [
        // { title: '部门编号', key: 'id', align: 'center' },
        { title: '名称', key: 'alias', align: 'center' },
        {
          title: '操作',
          key: 'action',
          width: 450,
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
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row)
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
      let _this = this
      this.$api.common.getGroup().then((res) => {
        if (res.code === 0) {
          _this.tableData = Object.values(res.data).filter((val) => val.status === 0)
          console.log(_this.tableData)
        }
      })
    },
    // 创建部门
    ok () {
      let _this = this
      let data = JSON.parse(JSON.stringify(this.pack))
      this.cancel()
      if (data.id === null) {
        add_group(data.alias).then((res) => {
          if (res.code === 0) {
            _this.bumen_value = ''
            _this.init()
            _this.$Message.info('创建成功')
          } else {
            _this.$Message.info(res.message)
          }
        })
      } else {
        data.old = JSON.parse(JSON.stringify(this.oldPack))
        edit_group(data.id, data).then((res) => {
          if (res.code === 0) {
            _this.init()
            _this.$Message.info('创建成功')
          } else {
            _this.$Message.info(res.message)
          }
        })
      }
    },
    add () {
      this.pack.id = null
      this.pack.alias = null
      this.oldPack = null
      this.box = true
    },
    edit (data) {
      this.pack.id = data.id
      this.pack.alias = data.alias
      this.oldPack = JSON.parse(JSON.stringify(data))
      this.box = true
    },
    cancel () {
      this.pack.id = null
      this.pack.alias = null
    },
    remove (data) {
      let _this = this
      this.$Modal.confirm({
        title: '温馨提示',
        content: '是否确认删除该部门？',
        onOk () {
          del_group(data.id).then((res) => {
            if (res.code === 0) {
              _this.$Message.info('删除成功')
              _this.init()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
