<template>
  <Row :gutter="16">
    <Col span="6">
      <Card>
        <div>职位列表</div>
        <div class="list">
          <Scroll>
            <RadioGroup v-model="button1" type="button" vertical class="button">
              <Radio label="设计师"></Radio>
            </RadioGroup>
          </Scroll>
          <Scroll>
            <RadioGroup v-model="button2" type="button" vertical class="button">
              <Radio label="初级"></Radio>
              <Radio label="中级"></Radio>
              <Radio label="高级"></Radio>
            </RadioGroup>
          </Scroll>
        </div>
      </Card>
    </Col>
    <Col span="10">
      <Card>
        <div>规则设置</div>
        <Form :model="formItem" :label-width="80" ref="formItem">
          <FormItem label="性别">
            <RadioGroup v-model="formItem.sex">
              <Radio label="buqufen">不区分</Radio>
              <Radio label="man">男</Radio>
              <Radio label="woman">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="计算类型">
            <RadioGroup v-model="formItem.type">
              <Radio label="落段">落段</Radio>
              <Radio label="逐段">逐段</Radio>
            </RadioGroup>
          </FormItem>
          <div>区间设置</div>
          <div style="display:flex;margin:10px 0" v-for="item in list" :key="item">
          <Input v-model="formItem.section_1" type="number">
            <span slot="prepend">区间一</span>
            <Button slot="append">元</Button>
          </Input>
          <Input v-model="formItem.section_2" type="number">
            <span slot="prepend">区间二</span>
            <Button slot="append">元</Button>
          </Input>
          <Input v-model="formItem.commission" type="number">
            <span slot="prepend">业绩提成</span>
            <Button slot="append">%</Button>
          </Input>
          </div>
          <Button type="primary" @click="add">增加区间</Button>
        </Form>
      </Card>
    </Col>
  </Row>
</template>

<script>
export default {
  name: 'performance_rules',
  data () {
    return {
      button1: '设计师',
      button2: '初级',
      formItem: {
        sex: 'buqufen',
        type: '落段',
        section_1: '',
        section_2: '',
        commission: ''
      },
      list: []
    }
  },
  methods: {
    add () {
      this.list.push(this.list[0])
    }
  }
}
</script>

<style lang="less" scoped>
.list {
  display: flex;
}
</style>
