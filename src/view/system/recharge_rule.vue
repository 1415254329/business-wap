<template>
  <div>
    <div>
      <Card>
        <div style="float: right;width: 100%">
          <Button style="margin: 10px" type="primary" @click="showPack">添加规则</Button>
        </div>
        <div>
          <tables ref="tables" v-model="tableData" :columns="columns"/>
        </div>
      </Card>
    </div>
    <div v-if="packBox">
      <!--      <Modal v-model="packBox" title="会员等级" @on-ok="ok" @on-cancel="cancel">-->
      <Modal v-model="packBox" title="充值规则" :mask-closable=false :closable=false>
        <Form :label-width="160">
          <FormItem label="充值金额:">
            <Input v-model="pack.price" type="number" placeholder="充值金额...">
            </Input>
          </FormItem>
          <FormItem label="赠送金额:">
            <Input v-model="pack.giving_price" type="number" placeholder="赠送金额"/>
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
  recharge_rule
} from '../../api/user'

export default {
  name: 'recharge_rule',
  components: {
    Tables
  },
  data () {
    return {
      rule: {},
      pack: {
        price: null,
        giving_price: null
      },
      packBox: false,
      columns: [
        {
          title: '充值金额',
          key: 'price',
          align: 'center',
          sortable: false
        },
        {
          title: '赠送金额',
          key: 'giving_price',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          // width: 450,
          align: 'center',
          render: (h, params) => {
            return h('div', [
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
                      this.delete(params.row.price)
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
      this.$api.user.getUserInfo().then((res) => {
        this.rule = JSON.parse(res.data.recharge_rule)
        this.rule = this.rule ? this.rule : {}
        this.tableData = Object.values(this.rule)
      })
    },
    // 删除
    delete (price) {
      let _this = this
      let old = JSON.parse(JSON.stringify(this.rule))
      _this.$Modal.confirm({
        title: '信息',
        content: '是否确认删除？',
        onOk () {
          delete _this.rule[price]
          recharge_rule(JSON.stringify(_this.rule), old).then((res) => {
            if (res.code === 0) {
              _this.$Message.info('操作成功')
              _this.$api.user.getUserInfo().then((res) => {
                if (res.code === 0) {
                  _this.$store.commit('user/setUserInfo', res.data)
                  _this.tableData = Object.values(JSON.parse(res.data.recharge_rule))
                }
              })
            }
          })
        }
      })
    },
    showPack () {
      this.pack = {
        price: null,
        giving_price: null
      }
      this.packBox = true
    },
    ok () {
      let _this = this
      let old = JSON.parse(JSON.stringify(this.rule))
      this.rule[this.pack.price] = this.pack
      this.pack = {
        price: 0,
        giving_price: 0
      }
      recharge_rule(JSON.stringify(this.rule), old).then((res) => {
        if (res.code === 0) {
          _this.$Message.info('操作成功')
          _this.$api.user.getUserInfo().then((res) => {
            if (res.code === 0) {
              _this.$store.commit('user/setUserInfo', res.data)
              _this.tableData = Object.values(JSON.parse(res.data.recharge_rule))
              _this.packBox = false
            }
          })
        }
      })
      this.packBox = false
    },
    cancel () {
      this.pack = {
        price: null,
        giving_price: null
      }
      this.packBox = false
    }
  }
}
</script>

<style lang="less" scoped>
.api div {
  font-size: 16px;
  cursor: pointer;
}
</style>
