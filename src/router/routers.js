import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/scheduled',
    meta: {
      icon: 'md-cloud-upload',
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [{
      path: '',
      meta: {
        icon: 'md-cloud-upload',
        title: '我的预约'
      },
      component: () => import('@/view/scheduled')
    }]
  },
  {
    path: '/',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/error_store',
    name: 'error_store',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'error_store_page',
        name: 'error_store_page',
        meta: {
          icon: 'ios-bug',
          title: '日志'
        },
        component: () => import('@/view/error-store/error-store.vue')
      }
    ]
  },
  {
    path: '/error_logger',
    name: 'error_logger',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'error_logger_page',
        name: 'error_logger_page',
        meta: {
          icon: 'ios-bug',
          title: '错误收集'
        },
        component: () => import('@/view/single-page/error-logger.vue')
      }
    ]
  },
  {
    path: '/business',
    name: 'business',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'buy/:type', // consume good
        name: 'buy',
        meta: {
          icon: 'md-pause',
          title: '买单收银'
        },
        component: () => import('@/view/business/buy.vue')
      },
      {
        path: 'order',
        name: 'order',
        meta: {
          icon: 'md-pause',
          title: '订单管理'
        },
        component: () => import('@/view/business/order.vue')
      }
    ]
  },
  {
    path: '/finance',
    meta: {
      icon: 'md-cloud-upload',
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: '',
        name: 'FinanceList',
        meta: {
          icon: 'ios-document',
          title: '财务报表'
        },
        component: () => import('@/view/finance')
      }
    ]
  },
  {
    path: '/mass',
    redirect: '/mass/message/sms',
    meta: {
      icon: 'md-cloud-upload',
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: '',
        name: 'RevisitList',
        meta: {
          icon: 'ios-document',
          title: '消息群发'
        },
        component: () => import('@/view/mass')
      }
    ]
  },
  {
    path: '/flow',
    meta: {
      icon: 'md-cloud-upload',
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: '',
        meta: {
          icon: 'ios-document',
          title: '店铺收支'
        },
        component: () => import('@/view/flow/flow')
      }
    ]
  },
  {
    path: '/revisit',
    meta: {
      icon: 'md-cloud-upload',
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: '',
        name: 'RevisitList',
        meta: {
          icon: 'ios-document',
          title: '回访统计'
        },
        component: () => import('@/view/revisit')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'md-cloud-upload',
      title: '系统设置'
    },
    component: Main,
    children: [
      {
        path: 'system_settings',
        name: 'system_settings',
        meta: {
          icon: 'ios-document',
          title: '系统设置'
        },
        component: () => import('@/view/system/system_settings.vue')
      },
      {
        path: 'member_rule',
        name: 'member_rule',
        meta: {
          icon: 'md-options',
          title: '会员等级设置'
        },
        component: () => import('@/view/system/member_rule.vue')
      },
      {
        path: 'recharge_rule',
        name: 'recharge_rule',
        meta: {
          icon: 'logo-bitcoin',
          title: '充值规则设置',
          hideInMenu: true
        },
        component: () => import('@/view/system/recharge_rule.vue')
      },
      {
        path: 'integral',
        name: 'Integral',
        meta: {
          icon: 'ios-hammer',
          title: '积分设置'
        },
        component: () => import('@/view/system/integral.vue')
      },
      {
        path: 'store',
        meta: {
          icon: 'logo-bitcoin',
          hideInMenu: true
        },
        component: () => import('@/view/system/store/index.vue'),
        children: [
          {
            path: '',
            name: 'list',
            meta: {
              icon: 'ios-cube',
              title: '商户管理'
            },
            component: () => import('@/view/system/store/list.vue')
          },
          {
            path: 'add',
            name: 'StoreAdd',
            meta: {
              icon: 'ios-cube',
              title: '添加商户'
            },
            component: () => import('@/view/system/store/add.vue')
          }
        ]
      },
      {
        path: 'staff',
        meta: {
          icon: 'logo-bitcoin',
          hideInMenu: true
        },
        component: () => import('@/view/system/staff'),
        children: [
          {
            path: 'permission',
            name: 'list',
            meta: {
              icon: 'ios-cube',
              title: '员工操作权限管理'
            },
            component: () => import('@/view/system/staff/permission.vue')
          }
        ]
      },
      {
        path: 'commodity',
        name: 'commodity',
        meta: {
          icon: 'ios-cube',
          title: '商品管理',
          hideInMenu: true
        },
        component: () => import('@/view/system/commodity.vue')
      },
      {
        path: 'project',
        name: 'project',
        meta: {
          icon: 'ios-bookmarks',
          title: '服务项目管理',
          hideInMenu: true
        },
        component: () => import('@/view/system/project.vue')
      },
      {
        path: 'meter',
        name: 'meter',
        meta: {
          icon: 'md-pricetags',
          title: '计次管理',
          hideInMenu: true
        },
        component: () => import('@/view/system/meter.vue')
      },
      {
        path: 'print',
        name: 'print',
        meta: {
          icon: 'md-pricetags',
          title: '打印设置',
          hideInMenu: true
        },
        component: () => import('@/view/system/print.vue')
      },
      // {
      //   path: 'wastage',
      //   name: 'wastage',
      //   meta: {
      //     icon: 'md-archive',
      //     title: '耗品管理',
      //     hideInMenu: true
      //   },
      //   component: () => import('@/view/system/wastage.vue')
      // },
      // {
      //   path: 'coupon',
      //   name: 'coupon',
      //   meta: {
      //     icon: 'md-cash',
      //     title: '优惠券管理',
      //     hideInMenu: true
      //   },
      //   component: () => import('@/view/system/coupon.vue')
      // },
      {
        path: 'classification/:type',
        name: 'classification',
        meta: {
          icon: 'ios-document',
          title: '项目分类'
        },
        component: () => import('@/view/system/classification.vue')
      }, {
        path: 'discount_setting',
        name: 'discount_setting',
        meta: {
          icon: 'ios-document',
          title: '服务项目折扣设置'
        },
        component: () => import('@/view/system/discount_setting.vue')
      },
      {
        path: 'staff',
        meta: {
          icon: 'logo-bitcoin',
          hideInMenu: true
        },
        component: () => import('@/view/system/staff'),
        children: [{
          path: '',
          meta: {
            icon: 'ios-cube',
            title: '权限管理'
          },
          component: () => import('@/view/system/staff/permission.vue')
        }]
      }
    ]
  },
  {
    path: '/staff',
    name: 'staff',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'staff_page',
        name: 'staff_page',
        meta: {
          icon: 'ios-hammer',
          title: '员工管理'
        },
        component: () => import('@/view/staff/staff.vue')
      },
      {
        path: 'depar_manager',
        name: 'depar_manager',
        meta: {
          icon: 'ios-navigate',
          title: '部门管理',
          hideInBread: true,
          hideInMenu: true
        },
        component: () => import('@/view/staff/depar_manager.vue')
      }, {
        path: 'add_employee/:id',
        name: 'add_employee',
        meta: {
          icon: 'md-flower',
          title: '员工操作',
          hideInBread: true,
          hideInMenu: true
        },
        component: () => import('@/view/staff/add_employee.vue')
      },
      {
        path: 'position',
        name: 'position',
        meta: {
          icon: 'ios-navigate',
          title: '职位管理',
          hideInBread: true,
          hideInMenu: true
        },
        component: () => import('@/view/staff/position.vue')
      },
      // {
      //   path: 'rules/test',
      //   name: 'ruletest',
      //   meta: {
      //     icon: 'ios-hammer',
      //     title: '提成模板'
      //   },
      //   component: () => import('@/view/staff/rules/commodities.vue')
      // },
      {
        path: 'rules/speedy',
        name: 'speedy',
        meta: {
          icon: 'ios-hammer',
          title: '快速消费规则设置'
        },
        component: () => import('@/view/staff/rules/speedy.vue')
      },
      {
        path: 'rules/card',
        name: 'card',
        meta: {
          icon: 'ios-hammer',
          title: '开卡规则设置'
        },
        component: () => import('@/view/staff/rules/card.vue')
      },
      {
        path: 'rules/recharge',
        name: 'recharge',
        meta: {
          icon: 'ios-hammer',
          title: '充值规则设置'
        },
        component: () => import('@/view/staff/rules/recharge.vue')
      },
      {
        path: 'rules/services',
        name: 'services',
        meta: {
          icon: 'ios-hammer',
          title: '服务项目规则设置'
        },
        component: () => import('@/view/staff/rules/services.vue')
      },
      {
        path: 'rules/commodities',
        name: 'commodities',
        meta: {
          icon: 'ios-hammer',
          title: '商品规则设置'
        },
        component: () => import('@/view/staff/rules/commodities.vue')
      },
      {
        path: 'rules/count/buy',
        name: 'countBuy',
        meta: {
          icon: 'ios-hammer',
          title: '计次购买规则设置'
        },
        component: () => import('@/view/staff/rules/countBuy.vue')
      },
      {
        path: 'rules/count/use',
        name: 'countUse',
        meta: {
          icon: 'ios-hammer',
          title: '计次使用规则设置'
        },
        component: () => import('@/view/staff/rules/countUse.vue')
      },
      {
        path: 'commission_list/:id',
        name: 'commission_list',
        meta: {
          icon: 'ios-navigate',
          title: '提成列表',
          hideInBread: true,
          hideInMenu: true
        },
        component: () => import('@/view/staff/commission_list.vue')
      },
      {
        path: 'survey',
        name: 'survey',
        meta: {
          icon: 'ios-navigate',
          title: '提成概况',
          hideInBread: true,
          hideInMenu: true
        },
        component: () => import('@/view/staff/survey.vue')
      },
      {
        path: 'performance_rules',
        name: 'performance_rules',
        meta: {
          icon: 'ios-navigate',
          title: '业绩规则',
          hideInBread: true,
          hideInMenu: true
        },
        component: () => import('@/view/staff/performance_rules.vue')
      },
      {
        path: 'look',
        name: 'look',
        meta: {
          icon: 'ios-navigate',
          title: '查看已结提成',
          hideInBread: true,
          hideInMenu: true
        },
        component: () => import('@/view/staff/look.vue')
      },
      {
        path: 'look_whole',
        name: 'look_whole',
        meta: {
          icon: 'ios-navigate',
          title: '查看提成',
          hideInBread: true,
          hideInMenu: true
        },
        component: () => import('@/view/staff/look_whole.vue')
      }
    ]
  },
  {
    path: '/directive',
    name: 'directive',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'directive_page',
        name: 'directive_page',
        meta: {
          icon: 'ios-navigate',
          title: '会员管理'
        },
        component: () => import('@/view/directive/directive.vue')
      },
      {
        path: 'add/:id',
        name: 'add',
        meta: {
          icon: 'ios-navigate',
          title: '添加会员',
          hideInBread: true,
          hideInMenu: true
        },
        component: () => import('@/view/directive/add.vue')
      },
      {
        path: 'stats',
        name: 'stats',
        meta: {
          // icon: 'ios-navigate',
          // title: '会员到店分析',
          hideInBread: true,
          hideInMenu: true
        },
        component: () => import('@/view/directive/stats/index.vue'),
        children: [{
          path: 'visit',
          name: 'visit',
          meta: {
            icon: 'ios-navigate',
            title: '会员到店分析'
          },
          component: () => import('@/view/directive/stats/visit.vue')
        },
        {
          path: 'ranking',
          name: 'ranking',
          meta: {
            icon: 'ios-navigate',
            title: '排行榜'
          },
          component: () => import('@/view/directive/stats/ranking.vue')
        },
        {
          path: 'debt',
          name: 'debt',
          meta: {
            icon: 'ios-navigate',
            title: '欠款会员列表'
          },
          component: () => import('@/view/directive/stats/debt.vue')
        }, {
          path: 'level',
          name: 'level',
          meta: {
            icon: 'ios-navigate',
            title: '会员等级分析'
          },
          component: () => import('@/view/directive/stats/level.vue')
        }]
      }
    ]
  },
  {
    path: '/store',
    meta: {
      icon: 'md-cloud-upload',
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [{
      path: '',
      meta: {
        icon: 'md-cloud-upload',
        title: '我的商户'
      },
      component: () => import('@/view/store')
    }]
  },

  {
    path: '/wx',
    name: 'WX',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/wx/index.vue'),
    children: [{
      path: 'bind',
      name: 'WXBind',
      meta: {
        hideInMenu: true
      },
      component: () => import('@/view/wx/bind.vue')
    },
    {
      path: 'member',
      name: 'WXMember',
      meta: {
        hideInMenu: true
      },
      component: () => import('@/view/wx/member'),
      children: [{
        path: 'card',
        name: 'WXMemberCard',
        meta: {
          hideInMenu: true
        },
        component: () => import('@/view/wx/member/card.vue')
      }, {
        path: 'search',
        name: 'WXMemberSearch',
        meta: {
          hideInMenu: true
        },
        component: () => import('@/view/wx/member/search.vue')
      }, {
        path: 'record',
        name: 'WXMemberRecord',
        meta: {
          hideInMenu: true
        },
        component: () => import('@/view/wx/member/record.vue')
      }]
    }, {
      path: 'staff',
      name: 'WXMember',
      meta: {
        hideInMenu: true
      },
      component: () => import('@/view/wx/staff'),
      children: [{
        path: 'store',
        name: 'WXStaffStore',
        meta: {
          hideInMenu: true
        },
        component: () => import('@/view/wx/staff/store.vue')
      }, {
        path: 'search',
        name: 'WXStaffSearch',
        meta: {
          hideInMenu: true
        },
        component: () => import('@/view/wx/staff/search.vue')
      }, {
        path: 'bonus',
        name: 'WXStaffBonus',
        meta: {
          hideInMenu: true
        },
        component: () => import('@/view/wx/staff/bonus.vue')
      }]
    }]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
