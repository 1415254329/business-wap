<template>
  <Card>
    <Form :model="formItem" :label-width="100" :rules="ruleValidate" ref="formItem" label-position="left">
      <Form-item label="员工工号" prop="serial_num">
        <Input v-model="formItem.serial_num" placeholder="请输入员工工号"/>
      </Form-item>
      <Form-item label="员工姓名">
        <Input v-model="formItem.staff_name" placeholder="请输入员工姓名"/>
      </Form-item>
      <Form-item label="性别">
        <RadioGroup v-model="formItem.gender">
          <Radio :label="1">男</Radio>
          <Radio :label="0">女</Radio>
        </RadioGroup>
      </Form-item>
      <!--    <FormItem label="员工状态" prop="grade">
        <Select v-model="formItem.status">
          <Option :value="0">正常</Option>
          <Option :value="1">封禁</Option>
        </Select>
      </FormItem> -->
      <Form-item label="是否允许登录">
        <RadioGroup v-model="formItem.login_status">
          <Radio :label="1">否</Radio>
          <Radio :label="0">是</Radio>
        </RadioGroup>
      </Form-item>
      <Form-item label="手机号">
        <Input size="large" placeholder="请输入手机号" class="inum-w" v-model="formItem.phone"/>
      </Form-item>
      <Form-item label="证件号">
        <Input size="large" placeholder="请输入员工证件号" class="inum-w" v-model="formItem.certificate"/>
      </Form-item>
      <Form-item label="登录账号">
        <Input size="large" class="inum-w" v-model="formItem.account"/>
      </Form-item>
      <!-- <Form-item label="考勤卡号">
        <Input size="large" class="inum-w" v-model="formItem.salary_num"/>
      </Form-item> -->
      <Form-item label="部门">
        <Select v-model="formItem.group_id">
          <!-- <Option :value="0" :label="item.alias" @click.native="getMoreParams(item.id, '', i, item.pid)">{{ item.alias }}</Option> -->
          <!--如果是编辑 需要回显数据  根据员工的position去判定选中-->
          <template v-for="option in this.group">
            <Option :value="option.id" :label="option.alias" :key="option.id">{{ option.alias }}</Option>
          </template>
          <Option value="0" label="移除" key="0" @click.native="removeGroup">移除</Option>
        </Select>

        <!--        <Input size="large" class="inum-w" v-model="formItem.group_id"/>-->
      </Form-item>

      <FormItem label="职位">
        <el-cascader ref="position" :options="list" v-model="positionSelected" :props="{  multiple: true,checkStrictly: true,value:'id',label:'alias' }" @change="positionChange" size="small" clearable></el-cascader>
        <!-- <Option :value="0" :label="item.alias" @click.native="getMoreParams(item.id, '', i, item.pid)">{{ item.alias }}</Option> -->
        <!--如果是编辑 需要回显数据  根据员工的position去判定选中-->

        <!-- <template v-for="(item, i) in list">

          <span>{{ item.alias }}</span>
          <Select v-if="formItem.position.hasOwnProperty(item.id)" v-model="formItem.position[item.id].position_id">

            <template v-for="(option, index) in item.children">
              <Option :value="option.id" :label="option.alias" :key="option.id"
                      @click.native="getMoreParams(item.id, option.id, i)">{{ option.alias }}
              </Option>
            </template>
            <Option value="-1" label="移除" key="-1" @click.native="getMoreParams(item.id,-1, -1)">移除</Option>
          </Select>

          <Select v-else>

            <template v-for="(option, index) in item.children">
              <Option :value="option.id" :label="option.alias" :key="option.id"
                      @click.native="getMoreParams(item.id, option.id, i)">{{ option.alias }}
              </Option>
            </template>
          </Select>

        </template> -->

      </FormItem>
      <Form-item label="登录密码">
        <Input size="large" class="inum-w" v-model="formItem.password"/>
      </Form-item>
      <!-- <FormItem label="员工权限">
        <CheckboxGroup v-model="permission">
          <Checkbox
            :label="item.mark"
            v-for="(item, index) in permission_list"
            :key="index"
            >{{ item.alias }}</Checkbox
          >
        </CheckboxGroup>
      </FormItem> -->
      <!-- <FormItem label="是否扣除助理提成">
        <RadioGroup v-model="formItem.assist_rule">
          <Radio :label="1">否</Radio>
          <Radio :label="0">是</Radio>
        </RadioGroup>
      </FormItem> -->
      <FormItem>
        <Button type="primary" @click="handleSubmit('formItem')">确定</Button>
        <!-- <Button style="margin-left: 8px" @click="handleReset('formItem')"
          >重置</Button
        > -->
      </FormItem>
    </Form>
  </Card>
</template>

<script>
import {
  staff,
  update_staff
} from '../../api/user'
import {
  mapMutations
} from 'vuex'

export default {
  name: 'add',
  data () {
    return {
      test: 6,
      permission_list: [],
      list: [],
      positionSelected: [],
      group: null,
      formItem: {
        permission: [],
        orders_permission: [],
        serial_num: '',
        phone: '',
        account: '', // 账号
        password: '',
        gender: 0,
        assist_rule: 1,
        login_status: 0,
        certificate: '',
        status: 0,
        salary_num: '',
        staff_name: '', // 员工姓名
        position: [], // 提交的职位列表
        group_id: 0
      },
      ruleValidate: {
        serial_num: [{
          required: true,
          message: '请输入员工工号',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted () {
    // 获取职位信息
    // let position = this.$store.getters['positions'](0)
    // let arr_new = Object.values(position)
    //   .filter((val) => val.status !== 1)
    //   .map((val, key) => {
    //     return {
    //       pid: val.pid,
    //       alias: val.alias,
    //       id: val.id,
    //       status: val.status,
    //       children: Object.values(val.positions) == null
    //         ? []
    //         : Object.values(val.positions).filter((val) => val.status !== 1)
    //     }
    //   })
    // this.list = arr_new
    this.getPositionList()
    if (this.$route.params.id > 0) {
      this.getDetail()
    }
  },
  methods: {
    ...mapMutations(['closeTag']),
    getDetail () {
      this.$api.common.getStaffList().then(res => {
        this.formItem = Object.values(res.data).find(v => v.id === Number(this.$route.params.id))
        this.formItem.old = JSON.parse(JSON.stringify(this.formItem))
        Object.values(this.formItem.position).map(v => {
          let data = []
          v.department_id && data.push(v.department_id)
          v.position_id && data.push(v.position_id)
          this.positionSelected.push(data)
        })
      })
    },
    getPositionList () {
      this.$api.common.getPosition().then((res) => {
        this.list = Object.values(res.data)
          .filter((val) => val.status !== 1)
          .map((val, key) => {
            return Object.assign({
              pid: val.pid,
              alias: val.alias,
              id: val.id,
              status: val.status
            }, (val.positions.length ? {} : {
                children: Object.values(val.positions).filter((val) => val.status !== 1)
              }))
          })
        // this.positions = res.data
      }).then(() => {
        this.$api.common.getGroup().then((res) => {
          this.group = res.data
        })
      })
    },
    positionChange () {
      this.positionSelected.map((v, index) => {
        if (v.length === 1) {
          isChildrenExist(v[0], this.positionSelected) && this.positionSelected.splice(index, 1)
          this.$refs.position.panel.clearCheckedNodes()
        }
      })
      function isChildrenExist (val, tree) { // 查询是否存在子节点
        if (typeof val !== 'number') {
          console.log('父节点查询错误:传入数据格式错误')
          return
        }
        return tree.some((v, index) => {
          if (v.indexOf(val) !== -1 && v.length > 1) {
            return true
          }
        })
      }
    },
    handleSubmit (name) {
      // 处理职位列表数据
      this.formItem.position = []
      this.positionSelected.map(v => {
        this.formItem.position.push({
          department_id: v[0],
          position_id: v[1] ? v[1] : 0
        })
      })
      this.$refs[name].validate((valid) => {
        if (valid) {
          // this.formItem.position = Object.values(this.formItem.position)
          if (this.$route.params.id > 0) {
            // 编辑
            update_staff(this.formItem).then((res) => {
              this.$Message.success('编辑成功!')
              // this.$store.commit('setStaff', '')
              localStorage.removeItem('staff_list')
              this.closeTag(this.$route)
            })
          } else {
            // 添加
            staff(this.formItem).then((res) => {
              this.$Message.success('添加成功!')
              // this.$store.commit('setStaff', '')
              localStorage.removeItem('staff_list')
              this.closeTag(this.$route)
            })
          }
        } else {
          this.$Message.error('请填写完整后再进行提交!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    removeGroup () {
      this.formItem.group_id = 0
    }
    // 职位选择,保存到数组
    // getMoreParams (department_id, position_id, index) {
    //   if (position_id === -1) {
    //     delete this.formItem.position[department_id]
    //   } else {
    //     this.formItem.position[department_id] = {
    //       department_id: department_id,
    //       position_id: position_id
    //     }
    //   }
    // },
    // change (e) {
    //   this.list.map((val) => val.children).map()
    //   e.map((data) => {
    //     if (val.id == data) {
    //       this.formItem.position.splice(1, 1)
    //     }
    //   })
    // }
  }
}

</script>

<style lang="less" scoped>
  .inum-w {
    width: 100%;
  }
  .el-cascader{
    width: 100%;
  }

</style>
