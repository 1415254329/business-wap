<template>
  <div>
    <Card>
      <div>
        <label>员工状态：</label>
        <Select v-model="status" style="width: 200px">
          <Option v-for="item in statusList" :value="item.id" :key="item.value">{{
              item.value
            }}
          </Option>
        </Select>
      </div>
      <router-link to="/staff/add_employee/0">
        <Button style="margin: 10px" type="primary">添加员工</Button>
      </router-link>
      <router-link to="/staff/depar_manager">
        <Button style="margin: 10px" type="primary">部门管理</Button>
      </router-link>
      <router-link to="/staff/position">
        <Button style="margin: 10px" type="primary">主/职位管理</Button>
      </router-link>
      <!-- <Button style="margin: 10px" type="primary">考勤排班</Button> -->
      <Poptip placement="bottom" width="400">
        <Button type="primary" style="margin: 10px">提成设置</Button>
        <div class="api" slot="content">
          <router-link to="/staff/rules/card">
            <div>开卡</div>
          </router-link>
          <router-link to="/staff/rules/recharge">
            <div>充值</div>
          </router-link>
          <router-link to="/staff/rules/speedy">
            <div>快速消费</div>
          </router-link>
          <router-link to="/staff/rules/services">
            <div>服务项目</div>
          </router-link>
          <router-link to="/staff/rules/commodities">
            <div>商品设置</div>
          </router-link>
          <router-link to="/staff/rules/count/buy">
            <div>计次购买</div>
          </router-link>
          <router-link to="/staff/rules/count/use">
            <div>计次使用</div>
          </router-link>
          <!-- <router-link to="/staff/rules/tenant_wastage">
            <div>耗品</div>
          </router-link> -->
        </div>
      </Poptip>
      <router-link to="/staff/commission_list/0">
        <Button style="margin: 10px" type="primary">提成列表</Button>
      </router-link>
      <router-link to="/staff/performance_rules">
        <!-- <Button style="margin: 10px" type="primary">业绩规则</Button> -->
      </router-link>
      <router-link to="/staff/survey">
        <Button style="margin: 10px" type="primary">提成概况</Button>
      </router-link>
      <Modal v-model="show" title="结算业绩" :footer-hide="true">
        <Form ref="formCustom" v-model="formCustom" :label-width="80">
          <FormItem label="员工姓名">
            <Input type="text" v-model="formCustom.name" disabled="disabled"/>
          </FormItem>
          <FormItem label="起始日期">
            <DatePicker type="date" :value="formCustom.value1" placeholder="请选择起始日期" style="width: 100%"/>
          </FormItem>
          <FormItem label="结束日期">
            <DatePicker type="date" :value="formCustom.value2" placeholder="请选择结束日期" style="width: 100%"/>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formCustom')">结算</Button>
            <Button @click="show = false" style="margin-left: 8px">取消</Button>
          </FormItem>
        </Form>
      </Modal>
      <tables ref="tables" editable searchable search-place="top" v-model="curStaffList" :columns="columns"/>
    </Card>
    <Modal v-model="staffCommissionShow" :footer-hide="true" width="1200px">
      <StaffCommission v-if="staffCommissionShow" :show="staffCommissionShow" :staffId="curStaffId"></StaffCommission>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import {
  update_staff,
  del_staff
} from '@/api/user'
import StaffCommission from './components/staffCommission'
export default {
  name: 'staff',
  components: {
    Tables,
    StaffCommission
  },
  data () {
    return {
      staffCommissionShow: false,
      curStaffId: 0,
      positions: {},
      staffList: [],
      curStaffList: [],
      group: [],
      columns: [
        {
          title: '员工工号',
          key: 'serial_num',
          align: 'center',
          sortable: true
        },
        {
          title: '员工姓名',
          key: 'staff_name',
          align: 'center'
        },
        // {
        //   title: '手机号',
        //   key: 'phone',
        //   align: 'center',
        //   width: 180
        // },
        {
          title: '登录账号',
          key: 'account',
          align: 'center',
          width: 180
        },
        // {
        //   title: '考勤编号',
        //   key: 'salary_num',
        //   align: 'center'
        // },
        {
          title: '部门',
          key: 'group_id',
          align: 'center',
          render: (h, params) => {
            let alias = this.group.filter((value) => {
              return value.id === params.row.group_id
            })[0] === undefined ? '' : this.group.filter((value) => {
                return value.id === params.row.group_id
              })[0].alias
            return h('slot', alias)
          }
        },
        {
          title: '员工职位',
          key: 'department',
          width: 150,
          align: 'center',
          render: (h, params) => {
            let str = []
            let positions = params.row.position
            Object.values(positions).map((val) => {
              let s = this.positions[val.department_id] && this.positions[val.department_id].alias + ' '
              val.position_id && this.positions[val.department_id] && (s += this.positions[val.department_id].positions[val.position_id].alias)
              str.push(s)
            })
            return h('slot', str.join('\n'))
          }
        },
        // {
        //   title: '系统登录',
        //   key: 'status',
        //   width: 150,
        //   align: 'center',
        //   render: (h, params) => {
        //     return h('div', [
        //       h('i-switch', {
        //         props: {
        //           size: 'large',
        //           value: params.row.login_status === 0
        //         },
        //         scopedSlots: {
        //           open: () => h('span', '允许'),
        //           close: () => h('span', '禁止')
        //         },
        //         on: {
        //           'on-change': (e) => {
        //           // this.clickCaozuo('change', params)
        //           // console.log(params);
        //             this.changeStatus(params.row, e)
        //           }
        //         }
        //       })
        //     ])
        //   }
        // },
        {
          title: '操作',
          key: 'action',
          width: 450,
          align: 'center',
          render: (h, params) => {
            if (this.status === 0) {
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
                        this.edit(params.row.id)
                      }
                    }
                  },
                  '编辑'
                ),
                h(
                  'Button', {
                    props: {
                      size: 'small',
                      type: 'info'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.show = true
                        this.formCustom.name = params.row.name
                        this.$router.push('/staff/commission_list/' + params.row.id)
                      }
                    }
                  },
                  '查看提成'
                ),
                h(
                  'Button', {
                    props: {
                      size: 'small',
                      type: 'info'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.curStaffId = params.row.id
                        this.staffCommissionShow = true
                      }
                    }
                  },
                  '提成汇总'
                ),
                // h(
                //   'Button', {
                //     props: {
                //       size: 'small',
                //       type: 'info'
                //     },
                //     style: {
                //       marginRight: '5px'
                //     },
                //     on: {
                //       click: () => {
                //         this.$router.push({
                //           name: 'look',
                //           params: {
                //             info: params
                //           }
                //         })
                //       }
                //     }
                //   },
                //   '查看已结业绩'
                // ),
                // h(
                //   'Button', {
                //     props: {
                //       size: 'small',
                //       type: 'info'
                //     },
                //     style: {
                //       marginRight: '5px'
                //     },
                //     on: {
                //       click: () => {
                //         this.$router.push({
                //           name: 'look_whole',
                //           params: {
                //             info: params
                //           }
                //         })
                //       }
                //     }
                //   },
                //   '查看全部提成'
                // ),
                h(
                  'Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.disableStaff(params.row.id, params.index)
                      }
                    }
                  },
                  '封禁'
                )
              ])
            } else if (this.status === 1) {
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
                        this.enableStaff(params.row, params.index)
                      }
                    }
                  },
                  '恢复'
                )
              ])
            } else {
              return []
            }
          }
        }
      ],
      statusList: [{
        id: 0,
        value: '正常'
      },
      {
        id: 1,
        value: '封禁'
      },
      {
        id: 2,
        value: '全部'
      }],
      status: 0,
      formCustom: [{
        name: '',
        value1: '',
        value2: ''
      }],
      show: false
    }
  },
  watch: {
    status (v) {
      switch (v) {
        case 0:
          this.curStaffList = this.staffList.filter(v => v.status === 0)
          break
        case 1:
          this.curStaffList = this.staffList.filter(v => v.status === 1)
          break
        case 2:
          this.curStaffList = this.staffList
          break
        default:break
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$api.common.getPosition().then((res) => {
        Object.keys(res.data).map(key => {
          if (res.data[key].status !== 0) {
            delete res.data[key]
          }
        })
        this.positions = res.data
      })
      this.$api.common.getGroup().then((res) => {
        this.group = res.data || []
      })
      this.$api.common.getStaffList().then((res) => {
        if (res.data) {
          this.staffList = Object.values(res.data)
          this.curStaffList = this.staffList.filter(v => v.status === 0)
        }
      })
    },
    // 编辑
    edit (id) {
      const route = {
        name: 'add_employee',
        params: {
          id
        }
      }
      this.$router.push(route)
      // this.$router.push({ name: "add_employee", params: { row: row } });
    },
    // 修改状态
    changeStatus (row, e) {
      let self = this
      row.login_status = e ? 0 : 1
      row.position = Object.values(row.position)
      update_staff(row).then((res) => {
        if (res.code === 0) {
          this.$Message.success('切换成功！')
          self.init()
        }
      })
    },
    enableStaff (item, index) { // 启用员工
      let staff = JSON.parse(JSON.stringify(item))
      let form = {};
      ({
        id: form.id,
        serial_num: form.serial_num,
        account: form.account,
        phone: form.phone,
        password: form.password,
        staff_name: form.staff_name,
        icon: form.icon,
        status: form.status,
        login_status: form.login_status,
        certificate: form.certificate,
        gender: form.gender,
        salary_num: form.salary_num,
        orders_permission: form.orders_permission,
        group_id: form.group_id
      } = staff)

      form.position = JSON.stringify(form.position)
      form.orders_permission === '[]' && (form.orders_permission = '')

      form.status = 0
      this.$api.user.update_staff(form).then(res => {
        this.$Message.success('恢复成功')
        this.curStaffList.splice(index, 1)
        this.$api.common.getStaffList().then((res) => {
          this.staffList = res.data ? Object.values(res.data) : []
        })
      })
    },
    disableStaff (id, index) {
      let self = this
      this.$Modal.confirm({
        title: '信息',
        content: '是否确认封禁员工？',
        onOk () {
          del_staff(id).then((res) => {
            self.curStaffList.splice(index, 1)
            self.$Message.info('删除成功')
            self.$api.common.getStaffList().then((res) => {
              self.staffList = res.data ? Object.values(res.data) : []
            })
          })
        }
      })
    },
    // 结算查询提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    }
    // 输入框输入事件
    // handleClear (e) {
    //   if (e.target.value === '') this.insideTableData = this.value
    //   else if (e.target.value.length > 2) ;
    // },
    // 状态选择
    // select (e) {
    //   const staff_list = JSON.parse(localStorage.getItem('staff_list'))
    //   if (e !== 2) {
    //     this.tableData = staff_list.filter((val) => val.status == e)
    //   } else {
    //     this.tableData = staff_list
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
.api div {
  font-size: 16px;
  cursor: pointer;
}
</style>
