<template>
  <Row>
    <Col :span="8">
      <Card>
        <slot v-for="(value,key) in project">
          {{ category[key].alias }}<br/>
          <RadioGroup v-model="selectMeter" type="button" class="button" @on-change="MeterChange">
            <Radio :label="item.id" v-for="item in value" :key="item.id">{{ item.alias }}</Radio>
          </RadioGroup>
        </slot>
      </Card>
    </Col>
    <Col :span="8">
      <Card>
        <div>会员等级</div>
        <RadioGroup v-model="selectMemberRule" type="button" class="button" @on-change="MemberRuleChange">
          <Radio :label="item.id" v-for="item in member_rule" :key="item.id">{{ item.alias }}</Radio>
        </RadioGroup>
      </Card>
    </Col>
    <Col :span="8">
      <Card>
        <div>
          <RadioGroup v-model="pack.type">
            <Radio :label="0">折扣</Radio>
            <Radio :label="1">金额</Radio>
          </RadioGroup>
          <template v-if="pack.type===0">
            <div>折扣</div>
            <Input type="number" v-model="pack.ratio" placeholder="请填写折扣"/>
          </template>
          <template v-if="pack.type===1">
            <div>金额</div>
            <Input type="number" v-model="pack.ratio" placeholder="请填写金额"/>
          </template>
        </div>
        <br/>
        <div>
          <Button type="primary" @click="submit">确定</Button>
        </div>
      </Card>

    </Col>
  </Row>
</template>

<script>
import { getInfo } from '../../api/user'

export default {
  name: 'discount_setting',
  data () {
    return {
      selectMeter: null,
      selectMemberRule: null,
      pack: {
        type: 0,
        ratio: null
      },
      rule: {},
      project: null,
      member_rule: null,
      category: null
    }
  },
  mounted () {
    let _this = this
    // 获取会员等级
    getInfo().then((res) => {
      if (res.code === 0) {
        _this.member_rule = JSON.parse(res.data.member_rule)
      }
    }).then(() => {
      this.$api.common.getCategory().then((res) => {
        if (res.code === 0) {
          _this.category = res.data['tenant_project'] === undefined ? null : res.data['tenant_project']
        }
      }).then(() => {
        // 获取计次项目
        _this.$api.common.getProject().then((res) => {
          if (res.code === 0) {
            _this.project = res.data
          }
        })
      })
    })
  },
  methods: {
    // 分类发生改变时获取对应的折扣信息
    MeterChange (value) {
      this.selectMeter = value
      this.change()
    },
    MemberRuleChange (value) {
      this.selectMemberRule = value
      this.change()
    },
    change () {

    },
    // 保存
    submit () {
      // if (this.discount == '' || this.name == '') {
      //   this.$Message.error('请填写完整再进行保存！')
      // } else {
      //   //保存服务项目折扣规则
      //   const member_rule = JSON.stringify({name: this.name, discount: this.discount});
      //   edit_category(this.list[this.alias].alias, 'tenant_project', member_rule, {}, this.list[this.alias].id, '').then(res => {
      //     if (res.code == 0) {
      //       this.$Message.success('保存成功！')
      //     }
      //   })
      // }
    }
  }
}
</script>

<style lang="less" scoped>
.button {
  width: 100%;
}

.button .ivu-radio-wrapper {
  width: 100%;
  border-radius: 5px;
  margin: 5px 0;
}
</style>
