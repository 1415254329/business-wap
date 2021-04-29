<template>
  <div>
    <div>
      <Card>
        <div style="float: right;width: 100%">
          <Button style="margin: 10px;" type="primary" @click="showPack">添加等级</Button>
        </div>
        <div>
          <tables ref="tables" v-model="tableData" :columns="columns" />
        </div>
      </Card>
    </div>
    <div v-if="packBox">
      <!--<Modal v-model="packBox" title="会员等级" @on-ok="ok" @on-cancel="cancel">-->
      <Modal v-model="packBox" title="会员等级" :mask-closable=false :closable=false>
        <Form :label-width="160">
          <FormItem label="编号:" v-show="false">
            <Input v-model="pack.id">
            </Input>
          </FormItem>
          <FormItem label="名称:">
            <Input v-model="pack.alias" placeholder="请输入名称...">
            </Input>
          </FormItem>
          <FormItem label="充值赠送积分（比例）:">
            <Input v-model="pack.prestore_integral" placeholder="充值赠送积分（比例）" />
          </FormItem>
          <FormItem label="消费积分（比例）:">
            <Input v-model="pack.consume_integral" placeholder="消费积分（比例）"> </Input>
          </FormItem>
          <FormItem label="快速消费折扣（比例）:">
            <Input v-model="pack.speedy" placeholder="快速消费折扣（比例）"> </Input>
          </FormItem>
          <FormItem label="服务折扣（比例）:">
            <Input v-model="pack.project" placeholder="服务折扣（比例）" />
          </FormItem>
          <FormItem label="商品折扣（比例）:">
            <Input v-model="pack.commodity" placeholder="商品折扣（比例）"> </Input>
          </FormItem>
          <FormItem label="最低充值金额:">
            <Input v-model="pack.min_prestore" placeholder="最低充值金额" />
          </FormItem>
          <FormItem label="赠金折扣比例">
            <Input v-model="pack.giving_switch" placeholder="为0则不打折" />
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

export default {
  name: 'member_rule',
  components: {
    Tables
  },
  data () {
    return {
      rule: {},
      oldPack: {},
      pack: {
        id: 0,
        alias: '',
        prestore_integral: 1,
        consume_integral: 1,
        commodity: 10,
        project: 10,
        speedy: 10,
        min_prestore: 0,
        giving_switch: 10
      },
      packBox: false,
      columns: [{
        title: '等级名称',
        key: 'alias',
        align: 'center',
        sortable: false
      },
      {
        title: '充值赠送积分（比例）',
        key: 'prestore_integral',
        align: 'center'
      },
      {
        title: '消费积分（比例）',
        key: 'consume_integral',
        align: 'center'
      },
      {
        title: '快速消费折扣（比例）',
        key: 'speedy',
        align: 'center'
        // width: 120
      },
      {
        title: '服务折扣（比例）',
        key: 'project',
        align: 'center'
      },
      {
        title: '商品折扣（比例）',
        key: 'commodity',
        align: 'center'
      },
      {
        title: '最低充值金额',
        key: 'min_prestore',
        align: 'center'
      },
      {
        title: '赠金是否参与折扣',
        key: 'giving_switch',
        align: 'center',
        // width: 150,
        render: (h, params) => {
          return h('span', params.row.giving_switch)
        }
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
        this.rule = JSON.parse(res.data.member_rule) || {}
        this.tableData = Object.values(this.rule)
      })
    },
    // 编辑
    edit (data) {
      this.pack.id = data.id
      this.pack.alias = data.alias
      this.pack.prestore_integral = data.prestore_integral
      this.pack.consume_integral = data.consume_integral
      this.pack.commodity = data.commodity
      this.pack.project = data.project
      this.pack.speedy = data.speedy
      this.pack.min_prestore = data.min_prestore
      this.pack.giving_switch = data.giving_switch
      this.oldPack = this.rule
      this.packBox = true
    },
    showPack () {
      // 新增
      let id = Math.round(new Date() / 1000)
      this.pack = {
        id: id,
        alias: '',
        prestore_integral: 1,
        consume_integral: 1,
        commodity: 10,
        project: 10,
        speedy: 10,
        min_prestore: 0,
        giving_switch: 10
      }
      this.oldPack = this.rule
      this.packBox = true
    },
    ok () {
      this.rule[this.pack.id] = this.pack
      this.$api.user.member_rule(JSON.stringify(this.rule), this.oldPack).then((res) => {
        this.$Message.info('操作成功')
        this.$api.user.getUserInfo().then((res) => {
          this.$store.commit('user/setUserInfo', res.data)
          this.tableData = Object.values(JSON.parse(res.data.member_rule))
          this.packBox = false
        })
      })
      this.pack = {
        id: 0,
        alias: '',
        prestore_integral: 1,
        consume_integral: 1,
        commodity: 10,
        project: 10,
        speedy: 10,
        min_prestore: 0,
        giving_switch: 10
      }
      this.packBox = false
    },
    cancel () {
      this.pack = {
        id: 0,
        alias: '',
        prestore_integral: 1,
        consume_integral: 1,
        commodity: 10,
        project: 10,
        speedy: 10,
        min_prestore: 0,
        giving_switch: 10
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
