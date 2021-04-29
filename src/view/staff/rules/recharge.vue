<template>
  <Row :gutter="16">
    <Col span="6">
    <Card>
      <div class="title">
        <span>职位</span>
        <span>当前选择:{{curPositionStr || '无'}}</span>
      </div>
      <el-tree ref="positions" :data="positions" node-key="id" @node-click="positionSelected"
        :expand-on-click-node="false" :props="{
            label:'alias',
            children:'positions'
          }">
      </el-tree>
    </Card>
    </Col>
    <Col span="4">
    <Card>
      <div>会员等级</div>
      <RadioGroup v-model="memberKey" type="button" vertical @on-change="memberSelect" class="radio-button-ver">
        <Radio label="all">全部不区分</Radio>
        <Radio label="normal">散客</Radio>
        <Radio :label="item.id" v-for="(item, index) in memberRule" :key="index">{{ item.alias }}</Radio>
      </RadioGroup>
    </Card>
    </Col>
    <Col span="4">
    <Card>
      <div>充值提成设置</div>
      <RadioGroup :value="curEmployeeNum" type="button" @on-change="setEmployeeNum" class="radio-button-ver">
        <Radio  :label="1">单人充值提成设置</Radio>
        <Radio  :label="2">两人充值提成设置</Radio>
        <Radio  :label="3">三人充值提成设置</Radio>
      </RadioGroup>
    </Card>
    </Col>
    <Col span="10">
    <Card>
      <div>规则设置</div>
      <Form :model="calculationRule" :label-width="80" ref="calculationRule">
        <FormItem label="计算类型" class="radio-inside">
          <RadioGroup v-model="calculationRule.type">
            <Radio :label="1">实付业绩</Radio>
          </RadioGroup>
        </FormItem>
        <div v-for="(item,index) in calculationRule[curEmployeeNum].employees" :key="index">
          <Card class="mt">
            <p slot="title">会员-({{index+1}}人提成)</p>
            <p class="mt">指定</p>
            <Input v-model="calculationRule[curEmployeeNum].employees[index].commission.specified.value" type="number">
            <RadioGroup v-model="calculationRule[curEmployeeNum].employees[index].commission.specified.type" slot="prepend"
              class="radio-inside">
              <Radio :label="1">比例</Radio>
              <Radio :label="2">固定</Radio>
            </RadioGroup>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="calculationRule[curEmployeeNum].employees[index].commission.unspecified.value" type="number">
            <RadioGroup v-model="calculationRule[curEmployeeNum].employees[index].commission.unspecified.type" slot="prepend"
              class="radio-inside">
              <Radio :label="1">比例</Radio>
              <Radio :label="2">固定</Radio>
            </RadioGroup>
            </Input>
          </Card>
          <Card class="mt">
            <p slot="title">会员-({{index+1}}人业绩)</p>
            <p class="mt">指定</p>
            <Input v-model="calculationRule[curEmployeeNum].employees[index].perform.specified.value" type="number">
            <RadioGroup v-model="calculationRule[curEmployeeNum].employees[index].perform.specified.type" slot="prepend"
              class="radio-inside">
              <Radio :label="1">比例</Radio>
              <Radio :label="2">固定</Radio>
            </RadioGroup>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="calculationRule[curEmployeeNum].employees[index].perform.unspecified.value" type="number">
            <RadioGroup v-model="calculationRule[curEmployeeNum].employees[index].perform.unspecified.type" slot="prepend"
              class="radio-inside">
              <Radio :label="1">比例</Radio>
              <Radio :label="2">固定</Radio>
            </RadioGroup>
            </Input>
          </Card>
          <Card class="mt">
            <p slot="title">会员-({{index+1}}人赠金业绩)</p>
            <Input v-model="calculationRule[curEmployeeNum].employees[index].grants.value" type="number">
            <RadioGroup v-model="calculationRule[curEmployeeNum].employees[index].grants.type" slot="prepend" class="radio-inside">
              <Radio :label="1">比例</Radio>
              <Radio :label="2">固定</Radio>
            </RadioGroup>
            </Input>
          </Card>
        </div>
        <div class="mt">
            <FormItem class="btn-wrapper">
              <Button type="primary" @click="saveRule('calculationRule')">保存</Button>
              <Button type="error" @click="handleDelete(curId)">删除</Button>
            </FormItem>
          </div>
      </Form>
    </Card>
    </Col>
  </Row>
</template>

<script>
import {
  card,
  cardItem
} from '@/utils/rule'

export default {
  data () {
    return {
      curId: 0,
      curRule: {},
      allRules: {},
      curPositionStr: '',
      positions: [],
      memberKey: 'all',
      memberRule: '',
      curEmployeeNum: 1,
      calculationRule: card,
      form: {
        position_id: '',
        source: 'tenant_deposit',
        rule: {}
      },
      treeIdCache: ''
    }
  },
  watch: {
    'form.position_id' () {
      if (this.memberKey) {
        this.isRuleExist()
      }
    },
    memberKey () {
      if (this.form.position_id) {
        this.isRuleExist()
      }
    },
    curEmployeeNum () {
      this.isRuleExist()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$api.common.getPosition().then((res) => {
        this.positions = Object.values(res.data).filter(v => v.status === 0)
        this.positions.map(v => {
          v.positions = Object.keys(v.positions).length ? Object.values(v.positions).filter(v => v.status === 0) : []
        })
      })

      this.memberRule = Object.values(JSON.parse(this.$store.getters.userInfo.member_rule))

      this.$api.user.getRules().then(res => {
        this.allRules = res.data.tenant_deposit || {}
      })
    },
    positionSelected (v) {
      this.setPositionId(v.id)
      let p = this.positions.find(pv => {
        return pv.positions.find(ppv => v.id === ppv.id)
      })
      let pid = p ? p.id : -1

      if (this.allRules[v.id]) {
        let rule = this.allRules[v.id]
        this.curId = rule.id
        if (rule.rule) {
          this.form.rule = JSON.parse(rule.rule) || {}
        } else {
          if (this.allRules[pid]) {
            let rule = this.allRules[pid]
            this.form.rule = JSON.parse(rule.rule) || {}
          }
        }
      } else {
        if (this.allRules[pid]) {
          let rule = this.allRules[pid]
          this.form.rule = JSON.parse(rule.rule) || {}
        } else {
          this.form.rule = {}
        }
      }
    },
    memberSelect (v) {
      this.memberKey = v
    },
    setEmployeeNum (num) {
      this.curEmployeeNum = num
      this.$forceUpdate()
    },
    setPositionId (id) {
      this.form.position_id = id
      this.positions.some(pv => {
        if (id === pv.id) {
          this.curPositionStr = pv.alias
          return true
        }
        let str = pv.alias
        pv.positions !== null && Object.values(pv.positions).some(ppv => {
          if (id === ppv.id) {
            str += `>${ppv.alias}`
            this.curPositionStr = str
            return true
          }
        })
      })
    },
    isRuleExist () {
      if (this.form.rule && this.form.rule[this.memberKey]) {
        this.calculationRule = this.form.rule[this.memberKey]
      } else {
        if (this.form.rule && this.form.rule['all']) {
          this.calculationRule = JSON.parse(JSON.stringify((this.form.rule['all'])))
        } else {
          // this.calculationRule.sex = 1
          // this.calculationRule.type = 1
          this.calculationRule[this.curEmployeeNum].employees = []
          for (let i = 0; i < this.curEmployeeNum; i++) {
            this.calculationRule[this.curEmployeeNum].employees.push(JSON.parse(JSON.stringify(cardItem)))
          }
        }
      }
    },
    saveRule (form) {
      if (!this.form.position_id) {
        this.$Message.error('请先选择要修改的职位')
        return
      }
      if (!this.memberKey) {
        this.$Message.error('请先选择要修改的会员等级')
        return
      }
      this.form.rule[this.memberKey] = this.calculationRule
      if (!this.allRules[this.form.position_id]) {
        this.handleSubmit(form)
      } else {
        this.handleEdit(form)
      }
    },

    // 提交
    handleSubmit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form))
          form.rule = JSON.stringify(form.rule)
          this.$api.user.add_royalty(form).then(res => {
            this.afterOperation()
            this.$Message.success('保存成功')
          })
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    // 修改提成规则
    handleEdit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let form = {
            ...this.form
          }
          form.rule = JSON.stringify(form.rule)
          this.$api.user.edit_royalty(this.curId, form).then(res => {
            this.afterOperation()
            this.$Message.success('保存成功')
          })
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    // 删除提成规则
    handleDelete (id) {
      let self = this
      this.$Modal.confirm({
        title: '信息',
        content: '是否确认删除?',
        onOk () {
          this.$api.user.del_royalty(id).then(res => {
            self.clear()
            this.$Message.success('删除成功')
          })
        }
      })
    },
    afterOperation () {
      this.$api.user.getRules().then(res => {
        this.allRules = res.data.tenant_deposit || {}
        this.positionSelected({ id: this.form.position_id })
        setTimeout(() => {
          this.isRuleExist()
        }, 0)
      })
    },
    clear () { // 重置页面状态
      this.init()
      this.$nextTick(() => {
        this.memberKey = 'all'
        this.form.position_id = ''
        this.form.rule = {}
        this.curPositionStr = ''
      })
    }
  }
}

</script>

<style lang="less" scoped>
  .radio-button-ver {
    display: flex;
    flex-direction: column;

    .ivu-radio-group-item {
      margin-top: 10px;
      margin-left: 10px;
      width: 90%;
    }
  }

  .mt {
    margin-top: 20px;
  }

  .title {
    display: flex;
    justify-content: space-between;

    span {
      &:last-child {
        color: #888;
      }
    }
  }

  //   .radio-inside {
  //     display: flex;
  //   }

  .btn-wrapper {
    display: flex;

    // justify-content: center;
    button {
      &:last-child {
        margin-left: 15px;
      }
    }
  }

</style>
