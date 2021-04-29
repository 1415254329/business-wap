<template>
  <div class="app-container">
    <div class="func">
      <span>
        <el-button type="primary" size="medium" @click="showform">添加服务项目</el-button>
        <el-button type="primary" size="medium" @click="$router.push('classification/services')">分类管理</el-button>
      </span>
    </div>
    <el-table :data="list" class="table-consume-custom" header-cell-class-name="el-table-header-cell-custom" fit>
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">{{scope.row.serial_num}}</template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">{{scope.row.alias}}</template>
      </el-table-column>
      <el-table-column align="center" label="分类">
        <template slot-scope="scope">{{category[scope.row.category_id].alias || ''}}</template>
      </el-table-column>
      <el-table-column align="center" label="条形码">
        <template slot-scope="scope">{{scope.row.bar_code}}</template>
      </el-table-column>
      <el-table-column align="center" label="售价">
        <template slot-scope="scope">{{scope.row.sale_price}}</template>
      </el-table-column>
      <el-table-column align="center" label="会员价">
        <template slot-scope="scope">{{scope.row.member_price}}</template>
      </el-table-column>
      <el-table-column align="center" label="成本价">
        <template slot-scope="scope">{{scope.row.cost_price}}</template>
      </el-table-column>
      <el-table-column align="center" label="库存数">
        <template slot-scope="scope">{{scope.row.surplus_num}}</template>
      </el-table-column>
      <el-table-column align="center" label="折扣">
        <template slot-scope="scope">{{scope.row.discount}}</template>
      </el-table-column>
      <el-table-column align="center" label="只取服务折扣">
        <template slot-scope="scope">{{scope.row.discount_switch?'是':'否'}}</template>
      </el-table-column>
      <el-table-column align="center" label="特价">
        <template slot-scope="scope">{{scope.row.special_switch?'是':'否'}}</template>
      </el-table-column>
      <el-table-column align="center" label="是否会员价在折扣">
        <template slot-scope="scope">{{scope.row.again_member_switch?'是':'否'}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" show-overflow-tooltip width="250">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;">
            <el-button @click="handleChange(scope.row)" type="primary" size="small">修改</el-button>
            <el-button @click="handleDelete(scope.row)" type="danger" size="small">删除</el-button>
            <el-button @click="handleMemberRuleChange(scope.row)" type="success" size="small">会员折扣</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <Modal v-model="show" title="服务项目管理" :mask-closable="false" :closable="false">
      <Form :label-width="130">
        <FormItem label="编号:">
          <Input v-model="form.serial_num" type="number" placeholder="编号">
          </Input>
        </FormItem>
        <FormItem label="名称:">
          <Input v-model="form.alias" placeholder="名称" />
        </FormItem>
        <FormItem label="分类:">
          <Select v-model="form.category_str" filterable allow-create @on-create="createCategory">
            <template v-for="(item, i) in this.category">
              <Option :value="item.alias" :label="item.alias" :key="item.id">{{ item.alias }}</Option>
            </template>
          </Select>
        </FormItem>
        <FormItem label="售价:">
          <Input v-model="form.sale_price" type="number" placeholder="售价" />
        </FormItem>
        <FormItem label="会员价:">
          <Input v-model="form.member_price" type="number" placeholder="会员价" />
        </FormItem>
        <FormItem label="成本价:">
          <Input v-model="form.cost_price" type="number" placeholder="成本价" />
        </FormItem>
        <FormItem label="条形码:">
          <Input v-model="form.bar_code" placeholder="条形码" />
        </FormItem>
        <FormItem label="库存数:">
          <Input v-model="form.surplus_num" type="number" placeholder="库存数" />
        </FormItem>
        <FormItem label="折扣:">
          <Input v-model="form.discount" placeholder="折扣" />
        </FormItem>
        <FormItem label="回访日期(天):">
          <Input v-model="form.follow_time" placeholder="回访日期(天)" />
        </FormItem>
        <FormItem label="只取服务折扣:">
          <RadioGroup v-model="form.discount_switch">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="特价:">
          <RadioGroup v-model="form.special_switch">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否会员价再折扣:">
          <RadioGroup v-model="form.again_member_switch">
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

    <Modal v-model="memberRuleShow" :title="selectProjectName" :mask-closable=false :closable=false>
      <div class="member-level">
        <div v-if="Object.keys(oldRuleForm).length" class="list">
          <div class="item" v-for="(item,index) in memberRule" :key="index">
            <div class="title">{{item.alias}}：</div>
            <div class="input">
              <el-input type="number" v-model="oldRuleForm[item.id].ratio" :placeholder="oldRuleForm[item.id].type===0?'请填写折扣':'请填写金额'">
                <el-radio-group slot="prepend"  v-model="oldRuleForm[item.id].type" size="medium">
                  <el-radio :label="0">折扣</el-radio>
                  <el-radio :label="1">金额</el-radio>
                </el-radio-group>
              </el-input>
            </div>
          </div>
        </div>
        <div v-else>请先设置会员等级</div>
      </div>
      <div slot="footer">
        <Button type="warning" size="large" small @click="memberRuleShow = false">取消</Button>
        <Button type="success" size="large" small @click="ruleOk">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  edit_project,
  add_project,
  del_project
} from '../../api/user'

export default {
  name: 'project',
  data () {
    return {
      show: false,
      memberRuleShow: false,
      list: [],
      selectProject: {},
      selectProjectName: '',
      memberRule: null,
      // selectMemberRule: null,
      oldForm: {},
      form: {
        again_member_switch: 1,
        alias: null,
        bar_code: null,
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
        tenant_id: null,
        follow_time: 0
      },
      // ruleForm: {
      //   type: 0,
      //   ratio: null
      // },
      oldRuleForm: {},
      project: {},
      category: {}
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.$api.common.getCategory().then((res) => {
        this.category = res.data['tenant_project'] || {}
      }).then(() => {
        this.$api.common.getProject().then((res) => {
          this.project = res.data
          this.list = []
          Object.values(this.project).forEach((value) => {
            if (!value) return
            this.list = this.list.concat(value.filter((val) => val.status === 0))
          })
          this.memberRule = Object.values(JSON.parse(this.$store.getters.userInfo.member_rule))
        })
      })
    },
    handleMemberRuleChange (data) {
      this.selectProject = JSON.parse(JSON.stringify(data))
      this.selectProjectName = this.project[data.category_id].filter((val) => val.id === data.id)[0].alias
      if (data.member_rule !== null) {
        this.oldRuleForm = JSON.parse(data.member_rule)
      }
      this.memberRule.map(v => {
        if (!this.oldRuleForm[v.id]) {
          this.$set(this.oldRuleForm, v.id, {
            type: 0,
            ratio: ''
          })
        }
      })
      console.log(this.memberRule, this.oldRuleForm)
      this.memberRuleShow = true
    },
    // ruleCancel () {
    //   this.memberRuleShow = false
    //   this.ruleForm.type = 0
    //   this.ruleForm.ratio = null
    //   this.selectProject = null
    //   this.selectProjectName = null
    //   this.oldForm = null
    //   this.selectMemberRule = null
    // },
    // memberRuleChange (id) {
    //   this.selectMemberRule = id
    //   if (this.oldRuleForm.hasOwnProperty(id)) {
    //     this.ruleForm.type = this.oldRuleForm[id].type
    //     this.ruleForm.ratio = this.oldRuleForm[id].ratio
    //   } else {
    //     this.ruleForm.type = 0
    //     this.ruleForm.ratio = null
    //   }
    // },
    ruleOk () {
      let newRule = JSON.parse(JSON.stringify(this.oldRuleForm))
      // newRule[this.selectMemberRule] = JSON.parse(JSON.stringify(this.ruleForm))
      this.selectProject.member_rule = JSON.stringify(newRule)
      edit_project(this.selectProject, this.selectProject.id).then((res) => {
        this.$Message.info('操作成功')
        this.getList()
        this.memberRuleShow = false
      })
    },
    handleDelete (data) {
      let self = this
      this.$Modal.confirm({
        title: '信息',
        content: '是否确认删除？',
        onOk () {
          del_project(data.id).then((res) => {
            self.$Message.info('操作成功')
            self.getList()
          })
        }
      })
    },
    // 编辑
    handleChange (data) {
      data = JSON.parse(JSON.stringify(data))
      this.oldForm = data
      for (let key in this.form) {
        this.form[key] = data.hasOwnProperty(key) ? data[key] : null
      }
      this.form.category_str = this.category[this.form.category_id].alias
      this.show = true
    },
    createCategory (val) {
      this.form.category_str = val.toString()
      this.form.category_id = 0
      let id = Math.round(new Date() / 1000)
      this.category[id] = {
        id: id,
        alias: val
      }
    },
    showform () {
      this.clear()
      this.show = true
    },
    ok () {
      if (!this.form.discount) this.form.discount = 10
      let data = JSON.parse(JSON.stringify(this.form))
      if (this.form.id === null) {
        add_project(data).then((res) => {
          this.$Message.info('操作成功')
          this.getList()
          this.show = false
        })
      } else {
        data.old = this.oldForm
        edit_project(data, data.id).then((res) => {
          this.oldForm = {}
          this.$Message.info('操作成功')
          this.getList()
          this.show = false
        })
      }
      this.clear()
    },
    cancel () {
      this.clear()
      this.oldForm = {}
      this.show = false
    },
    clear () {
      this.form = {
        again_member_switch: 1,
        alias: null,
        bar_code: null,
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
        tenant_id: null,
        follow_time: 0
      }
    }
  }
}

</script>

<style lang="less" scoped>
  .ivu-form-item {
    margin-bottom: 5px;
  }

  .el-table {
    border: 1px solid rgba(0, 0, 0, 1);
    border-bottom: none;
  }

  .member-level {
    .list {
      .item {
        padding-right: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
          // width: 100px;
          // text-align: right;
        }

        .el-input {
          margin-left: 10px;
        }

        &:first-child {
          ~.item {
            margin-top: 10px;
          }
        }
      }
    }
  }

</style>
