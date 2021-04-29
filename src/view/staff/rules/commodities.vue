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
    <Col span="6">
    <Card>
      <div>项目</div>
      <div class="menu">
        <div class="menu-level1">
          <div v-for="(item,index) in category" :key="index" class="menu-level1-item"
            :class="{'active':curCategoryId == item.id}" @click="categorySelect(item)">
            {{item.alias}}
          </div>
        </div>
        <div class="menu-level2">
          <div v-for="(item,index) in commodities[curCategoryId]" :key="index" class="menu-level2-item"
            :class="{'active':curCommodityId == item.id}" @click="commoditiesSelect(item)">
            {{item.alias}}
          </div>
        </div>
      </div>
    </Card>
    </Col>
    <Col span="8">
    <Card>
      <div>规则设置</div>
      <Form v-if="calculationRule[curCategoryId] && calculationRule[curCategoryId][curCommodityId]"
        :model="calculationRule[this.curCategoryId][this.curCommodityId]" :label-width="80" ref="calculationRule">
        <FormItem label="提成基数" class="radio-inside">
          <RadioGroup v-model="calculationRule[curCategoryId][curCommodityId].type">
            <Radio :label="1">实付</Radio>
            <Radio :label="2">原价</Radio>
          </RadioGroup>
        </FormItem>
        <Card class="mt">
          <p slot="title">提成</p>
          <p class="mt">指定</p>
          <Input v-model="calculationRule[curCategoryId][curCommodityId].commission.specified.value" type="number">
          <RadioGroup v-model="calculationRule[curCategoryId][curCommodityId].commission.specified.type" slot="prepend"
            class="radio-inside">
            <Radio :label="1">比例</Radio>
            <Radio :label="2">固定</Radio>
          </RadioGroup>
          </Input>
          <p class="mt">非指定</p>
          <Input v-model="calculationRule[curCategoryId][curCommodityId].commission.unspecified.value" type="number">
          <RadioGroup v-model="calculationRule[curCategoryId][curCommodityId].commission.unspecified.type"
            slot="prepend" class="radio-inside">
            <Radio :label="1">比例</Radio>
            <Radio :label="2">固定</Radio>
          </RadioGroup>
          </Input>
        </Card>
        <Card class="mt">
          <p slot="title">业绩</p>
          <p class="mt">指定</p>
          <Input v-model="calculationRule[curCategoryId][curCommodityId].perform.specified.value" type="number">
          <RadioGroup v-model="calculationRule[curCategoryId][curCommodityId].perform.specified.type" slot="prepend"
            class="radio-inside">
            <Radio :label="1">比例</Radio>
            <Radio :label="2">固定</Radio>
          </RadioGroup>
          </Input>
          <p class="mt">非指定</p>
          <Input v-model="calculationRule[curCategoryId][curCommodityId].perform.unspecified.value" type="number">
          <RadioGroup v-model="calculationRule[curCategoryId][curCommodityId].perform.unspecified.type" slot="prepend"
            class="radio-inside">
            <Radio :label="1">比例</Radio>
            <Radio :label="2">固定</Radio>
          </RadioGroup>
          </Input>
        </Card>
        <Card class="mt">
          <p slot="title">赠金业绩</p>
          <Input v-model="calculationRule[curCategoryId][curCommodityId].grants.value" type="number">
          <RadioGroup v-model="calculationRule[curCategoryId][curCommodityId].grants.type" slot="prepend"
            class="radio-inside">
            <Radio :label="1">比例</Radio>
            <Radio :label="2">固定</Radio>
          </RadioGroup>
          </Input>
        </Card>
        <Card class="mt">
          <p slot="title">成本</p>
          <p class="mt">指定</p>
          <Input v-model="calculationRule[curCategoryId][curCommodityId].cost.specified.value" type="number">
          <RadioGroup v-model="calculationRule[curCategoryId][curCommodityId].cost.specified.type" slot="prepend"
            class="radio-inside">
            <Radio :label="1">比例</Radio>
            <Radio :label="2">固定</Radio>
          </RadioGroup>
          </Input>
          <p class="mt">非指定</p>
          <Input v-model="calculationRule[curCategoryId][curCommodityId].cost.unspecified.value" type="number">
          <RadioGroup v-model="calculationRule[curCategoryId][curCommodityId].cost.unspecified.type" slot="prepend"
            class="radio-inside">
            <Radio :label="1">比例</Radio>
            <Radio :label="2">固定</Radio>
          </RadioGroup>
          </Input>
        </Card>
        <Card class="mt">
          <p slot="title">二次成本</p>
          <p class="mt">指定</p>
          <Input v-model="calculationRule[curCategoryId][curCommodityId].twice.specified.value" type="number">
          <RadioGroup v-model="calculationRule[curCategoryId][curCommodityId].twice.specified.type" slot="prepend"
            class="radio-inside">
            <Radio :label="1">比例</Radio>
            <Radio :label="2">固定</Radio>
          </RadioGroup>
          </Input>
          <p class="mt">非指定</p>
          <Input v-model="calculationRule[curCategoryId][curCommodityId].twice.unspecified.value" type="number">
          <RadioGroup v-model="calculationRule[curCategoryId][curCommodityId].twice.unspecified.type" slot="prepend"
            class="radio-inside">
            <Radio :label="1">比例</Radio>
            <Radio :label="2">固定</Radio>
          </RadioGroup>
          </Input>
        </Card>
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
  services,
  servicesItem
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
      curCategoryId: -1,
      category: [],
      curCommodityId: 'all',
      commodities: {},
      calculationRule: JSON.parse(JSON.stringify(services)),
      form: {
        position_id: '',
        source: 'tenant_commodity',
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
      if (!this.calculationRule[this.curCategoryId]) {
        this.calculationRule[this.curCategoryId] = {}
      }
      if (!this.calculationRule[this.curCategoryId][this.curProjectId]) {
        this.calculationRule[this.curCategoryId][this.curProjectId] = JSON.parse(JSON.stringify(servicesItem))
      }
    },
    memberKey () {
      if (this.form.position_id) {
        this.isRuleExist()
      }
    },
    curCategoryId () {
      if (!this.calculationRule[this.curCategoryId]) {
        this.calculationRule[this.curCategoryId] = {}
      }
      if (!this.calculationRule[this.curCategoryId][this.curProjectId]) {
        this.calculationRule[this.curCategoryId][this.curProjectId] = JSON.parse(JSON.stringify(servicesItem))
      }
    },
    curCommodityId () {
      if (!this.calculationRule[this.curCategoryId][this.curCommodityId]) {
        this.calculationRule[this.curCategoryId][this.curCommodityId] = JSON.parse(JSON.stringify(servicesItem))
      }
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
        this.allRules = res.data.tenant_commodity || {}
      })

      this.$api.common.getCategory().then((res) => {
        this.category = Object.values(res.data['tenant_commodity'] || {})
        this.curCategoryId = this.category[0] && this.category[0].id
      })
      this.$api.common.getCommodity().then((res) => {
        Object.keys(res.data).map(key => {
          res.data[key] = res.data[key] ? Object.values(res.data[key]).filter((val) => val.status === 0) : {}
        })
        this.commodities = res.data
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
    categorySelect (item) {
      this.curCategoryId = item.id
      this.curCommodityId = 'all'
    },
    commoditiesSelect (item) {
      this.curCommodityId = item.id
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
          this.calculationRule[this.curCategoryId] = {}
          this.calculationRule[this.curCategoryId][this.curCommodityId] = JSON.parse(JSON.stringify(servicesItem))
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
      if (!this.curCategoryId) {
        this.$Message.error('请先选择要修改项目大类')
        return
      }
      if (this.curCommodityId === 'all') {
        this.commodities[this.curCategoryId].forEach(v => {
          this.calculationRule[this.curCategoryId][v.id] = JSON.parse(JSON.stringify(this.calculationRule[this.curCategoryId]['all']))
        })
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
          let form = JSON.parse(JSON.stringify(this.form))
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
        this.allRules = res.data.tenant_commodity || {}
        this.positionSelected({
          id: this.form.position_id
        })
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

  .menu {
    margin-top: 10px;
    display: grid;
    grid-template-columns: 30% 60%;

    .common() {

      &-item {
        position: relative;
        margin-bottom: 5px;
        padding: 5px 15px;
        border-radius: 5px;
        transition: background .3s;
        overflow: hidden;

        &::before {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 8px;
          //   max-width: 10px;
          height: 100%;
          border-radius: 5px 0 0 5px;
          opacity: 0;
          transition: opacity .3s;
        }

        &:hover {
          cursor: pointer;

          &::before {
            opacity: 1;
          }
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    &-level1 {
      .common;
      background: rgba(0, 0, 0, 0.08);
      border-radius: 8px;

      &-item {
        &::before {
          background: rgba(45, 140, 240, 1);
        }

        &:hover {}
      }

      .active {
        color: white;
        background: rgba(45, 140, 240, 1);
      }
    }

    &-level2 {
      .common;
      padding-left: 10px;

      &-item {
        &::before {
          background: rgb(97, 162, 233);
        }

        &:hover {}
      }

      .active {
        color: white;
        background: rgb(97, 162, 233);
      }
    }
  }

</style>
