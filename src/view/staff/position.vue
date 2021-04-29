<template>
  <div>
    <Card>
      <Tree :data="data5" :render="renderContent"></Tree>
    </Card>
    <div v-if="box">
      <Modal v-model="box" title="请输入名称">
        <Input v-model="boxValue" placeholder="请输入名称..." style="width: 300px"/>
        <div slot="footer">
          <Button type="warning" size="large" small @click="cancel">取消</Button>
          <Button type="success" size="large" small @click="ok">确认</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import {
  position,
  edit_position,
  del_position
} from '../../api/user'

export default {
  data () {
    return {
      box: false,
      boxValue: '',
      boxPid: 0,
      editState: false,
      positionList: {},
      data5: [{
        title: '主/职位',
        expand: true,
        render: (h, { root, node, data }) => {
          return h('span', {
            style: {
              display: 'inline-block',
              lineHeight: '1.6rem',
              width: '100%',
              cursor: 'pointer'
            }
          }, [
            h('span', [
              h('Icon', {
                props: {
                  type: 'ios-folder-outline'
                },
                style: {
                  marginRight: '8px'
                }
              }),
              h('span', data.title)
            ]),
            h('span', {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
              }
            }, [
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'ios-add'
                  // type: 'primary'
                }),
                style: {
                  marginRight: '8px',
                  marginLeft: '8px',
                  borderRadius: '50%',
                  width: '1.5rem',
                  lineHeight: '0',
                  padding: '0',
                  height: '1.4rem'
                  // display: `${!data.expand ? 'none' : 'blcok'}`
                },
                on: {
                  click: () => {
                    this.box = true
                    this.boxPid = 0
                    // this.append(data)
                  }
                }
              })
            ])
          ])
        },
        // render: (h, {root,node,data}) => {
        //   return h(
        //     'span', {
        //       style: {
        //         display: 'inline-block',
        //         width: '100%'
        //       }
        //     },
        //     [h('span', data.title)],
        //     [
        //       h('Button', {
        //         props: Object.assign({}, this.buttonProps, {
        //           icon: 'ios-add',
        //           type: 'primary'
        //         }),
        //         style: {
        //           width: '64px'
        //         },
        //         on: {
        //           click: () => { this.append(data) }
        //         }
        //       })
        //     ]
        //   )
        // },
        children: []
      }],
      buttonProps: {
        type: 'default',
        size: 'small'
      },
      // 输入框要修改的内容
      inputContent: '',
      // 修改前的TreeNode名称
      oldName: ''
    }
  },
  mounted () {
    this.render()
  },
  methods: {
    render () {
      if (!Object.values(this.positionList).length) {
        this.$api.common.getPosition().then((res) => {
          this.positionList = res.data
          this.render()
        })
      }
      let arr_new = Object.values(this.positionList).filter(val => val.status === 0).map((val, key) => {
        return {
          pid: val.pid,
          alias: val.alias,
          id: val.id,
          expand: !!(val.pid === 0 || val.pid === ''),
          status: val.status,
          children: val.positions == null ? [] : Object.values(val.positions).filter(val => val.status === 0)
        }
      })
      this.data5[0].children = arr_new
    },
    ok () {
      if (this.boxValue === '') {
        this.$Message.error('名称不能为空')
        return false
      }
      this.box = false
      position(this.boxValue, this.boxPid).then((res) => {
        this.$Message.info('创建成功')
        this.$api.common.getPosition().then((res) => {
          this.positionList = res.data
          this.render()
        })
      })
      this.box = false
    },
    cancel () {
      this.box = false
      this.boxValue = ''
      this.boxPid = 0
    },
    // 树渲染逻辑
    renderContent (h, {
      root,
      node,
      data
    }) {
      if (node.parent === 0) {
        return h(
          'span', {
            class: 'hhhaha',
            style: {
              display: 'inline-block',
              lineHeight: '1.6rem',
              width: '100%',
              cursor: 'pointer'
            },
            on: {
              click: () => {
                // 点击Tree节点触发
                data.editState ? '' : this.handleClickTreeNode(data)
              }
            }
          },
          [
            h('span', [
              h('Icon', {
                props: {
                  type: `${
                    data.children == undefined || data.children.length == 0
                      ? 'md-document'
                      : 'ios-folder'
                  }`
                },
                style: {
                  marginRight: '8px'
                }
              }),
              h(`${data.editState ? '' : 'span'}`, data.alias),
              h(`${data.editState ? 'input' : ''}`, {
                attrs: {
                  value: `${data.editState ? data.alias : ''}`,
                  autofocus: 'true'
                },
                style: {
                  width: '12rem',
                  cursor: 'auto'
                },
                on: {
                  change: (event) => {
                    this.inputContent = event.target.value
                  }
                }
              })
            ]),
            // 增删改按钮部分
            h(
              `${data.editState ? '' : 'span'}`, {
                class: 'btnNone',
                style: {
                  marginLeft: '1rem'
                }
              },
              [
                // 操作按钮部分
                // 编辑按钮
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-brush-outline'
                  }),
                  style: {
                    marginRight: '8px',
                    borderRadius: '50%',
                    width: '1.5rem',
                    lineHeight: '0',
                    padding: '0',
                    height: '1.4rem'
                  },
                  on: {
                    click: () => {
                      this.editTree(data)
                    }
                  }
                }),
                // 添加按钮
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-add'
                  }),
                  style: {
                    marginRight: '8px',
                    borderRadius: '50%',
                    width: '1.5rem',
                    lineHeight: '0',
                    padding: '0',
                    height: '1.4rem',
                    display: `${!data.expand ? 'none' : 'blcok'}`
                  },
                  on: {
                    click: () => {
                      this.box = true
                      this.boxPid = data.id
                      // this.append(data)
                    }
                  }
                }),
                // 删除按钮
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-remove'
                  }),
                  style: {
                    marginRight: '8px',
                    borderRadius: '50%',
                    width: '1.5rem',
                    padding: '0',
                    lineHeight: '0',
                    height: '1.4rem'
                    // display: `${data.expand ? 'none' : 'block'}`
                  },
                  on: {
                    click: () => {
                      this.remove(root, node, data)
                    }
                  }
                })
              ]
            ),
            // 确认/取消修改部分
            h(
              `${data.editState ? 'span' : ''}`, {
                style: {
                  marginLeft: '.5rem'
                }
              },
              [
                // 确认按钮
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'md-checkmark'
                  }),
                  style: {
                    // marginRight: '8px',
                    border: 0,
                    background: 'rgba(0,0,0,0)',
                    fontSize: '1.3rem',
                    outline: 'none'
                  },
                  on: {
                    click: (event) => {
                      this.confirmTheChange(data)
                    }
                  }
                }),
                // 取消按钮
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'md-close'
                  }),
                  style: {
                    border: '0',
                    background: 'rgba(0,0,0,0)',
                    fontSize: '1.3rem',
                    outline: 'none'
                  },
                  on: {
                    click: () => {
                      this.CancelChange(data)
                    }
                  }
                })
              ]
            )
          ]
        )
      } else {
        return h(
          'span', {
            class: 'hhhaha',
            style: {
              display: 'inline-block',
              lineHeight: '1.6rem',
              width: '100%',
              cursor: 'pointer'
            },
            on: {
              click: () => {
                // 点击Tree节点触发
                data.editState ? '' : this.handleClickTreeNode(data)
              }
            }
          },
          [
            h('span', [
              h('Icon', {
                props: {
                  type: `${
                    data.children == undefined || data.children.length == 0
                      ? 'md-document'
                      : 'ios-folder'
                  }`
                },
                style: {
                  marginRight: '8px'
                }
              }),
              h(`${data.editState ? '' : 'span'}`, data.alias),
              h(`${data.editState ? 'input' : ''}`, {
                attrs: {
                  value: `${data.editState ? data.alias : ''}`,
                  autofocus: 'true'
                },
                style: {
                  width: '12rem',
                  cursor: 'auto'
                },
                on: {
                  change: (event) => {
                    this.inputContent = event.target.value
                  }
                }
              })
            ]),
            // 增删改按钮部分
            h(
              `${data.editState ? '' : 'span'}`, {
                class: 'btnNone',
                style: {
                  marginLeft: '1rem'
                }
              },
              [
                // 操作按钮部分
                // 编辑按钮
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-brush-outline'
                  }),
                  style: {
                    marginRight: '8px',
                    borderRadius: '50%',
                    width: '1.5rem',
                    lineHeight: '0',
                    padding: '0',
                    height: '1.4rem'
                  },
                  on: {
                    click: () => {
                      this.editTree(data)
                    }
                  }
                }),
                // 添加按钮
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-add'
                  }),
                  style: {
                    marginRight: '8px',
                    borderRadius: '50%',
                    width: '1.5rem',
                    lineHeight: '0',
                    padding: '0',
                    height: '1.4rem',
                    display: `${!data.expand ? 'none' : 'blcok'}`
                  },
                  on: {
                    click: () => {
                      this.append(data)
                    }
                  }
                }),
                // 删除按钮
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-remove'
                  }),
                  style: {
                    marginRight: '8px',
                    borderRadius: '50%',
                    width: '1.5rem',
                    padding: '0',
                    lineHeight: '0',
                    height: '1.4rem',
                    display: `${data.expand ? 'none' : 'blcok'}`
                  },
                  on: {
                    click: () => {
                      this.remove(root, node, data)
                    }
                  }
                })
              ]
            ),
            // 确认/取消修改部分
            h(
              `${data.editState ? 'span' : ''}`, {
                style: {
                  marginLeft: '.5rem'
                }
              },
              [
                // 确认按钮
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'md-checkmark'
                  }),
                  style: {
                    // marginRight: '8px',
                    border: 0,
                    background: 'rgba(0,0,0,0)',
                    fontSize: '1.3rem',
                    outline: 'none'
                  },
                  on: {
                    click: (event) => {
                      this.confirmTheChange(data)
                    }
                  }
                }),
                // 取消按钮
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'md-close'
                  }),
                  style: {
                    border: '0',
                    background: 'rgba(0,0,0,0)',
                    fontSize: '1.3rem',
                    outline: 'none'
                  },
                  on: {
                    click: () => {
                      this.CancelChange(data)
                    }
                  }
                })
              ]
            )
          ]
        )
      }
    },
    // 控制Tree当前状态函数
    setStates (data) {
      var editState = data.editState
      if (editState) {
        this.$set(data, 'editState', false)
      } else {
        this.$set(data, 'editState', true)
      }
    },
    // Tree修改按钮
    editTree (data) {
      event.stopPropagation()
      this.inputContent = data.alias
      this.oldName = data.alias
      this.setStates(data)
    },
    // 添加按钮
    append (data, alias) {
      event.stopPropagation()
      let children = data.children || []
      position(alias, data.id).then((res) => {
        if (res.code === 0) {
          children.push({
            alias: alias,
            expand: !!(data.children.pid === 0 || data.children.pid === '')
          })
        }
      })

      this.$set(data, 'children', children)
    },
    // 删除按钮
    remove (root, node, data) {
      // let _this = this
      event.stopPropagation()
      this.$Modal.confirm({
        title: '提示',
        content: `您确定删除 “${data.alias}” 吗？`,
        onOk: () => {
          if (data.children && data.children.length) {
            this.$Message.error('存在子职位，无法删除')
            return
          }
          del_position(data.id, data.alias, data.pid).then((res) => {
            // const parentKey = root.find((el) => el === node).parent
            // const parent = root.find((el) => el.nodeKey === parentKey).node
            // const index = parent.children.indexOf(data)
            // parent.children.splice(index, 1)
            this.positionList = {}
            this.render()
            this.$Message.info('删除成功')
          })
        }
      })
    },
    // 确认修改树节点
    confirmTheChange (data) {
      console.log(data)
      if (!this.inputContent) {
        this.$Notice.warning({
          title: '当前输入有误'
        })
      } else {
        if (this.oldName !== this.inputContent) {
          this.$Modal.confirm({
            title: '提示',
            content: `您确定将  “${this.oldName}”  重命名为 “ ${this.inputContent} ” 吗？`,
            onOk: () => {
              edit_position(data.id, this.inputContent, data.pid).then(
                (res) => {
                  data.alias = this.inputContent
                  this.$Message.info('修改成功')
                }
              )
            }
          })
          this.setStates(data)
        } else {
          this.setStates(data)
        }
      }
    },
    // 取消修改树节点
    CancelChange (data) {
      this.setStates(data)
    },
    // 点击Tree节点触发
    handleClickTreeNode (data) {
      console.log(data)
    }
  }
}
</script>

<style lang="less" scoped>
.btnNone {
  display: none;
}

/* .hhhaha:hover{color:aqua} */
.hhhaha:hover .btnNone {
  display: inline-block;
}

.hhhaha:hover {
  font-weight: 600;
  color: #275cd4;
}

.ivu-tree ul li {
  list-style: none;
  /* margin: 8px 0; */
  padding: 0;
  white-space: nowrap;
  outline: none;
}
</style>
