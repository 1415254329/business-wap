import store from '@/store'

export function initOrderForm (custom = {}) {
  let form = {
    member_id: '', // 否 int 会员编号
    payment_arrears: '', // 否 float64 订单欠款支付金额
    payment_balance: '', // 否 float64 订单余额支付部分
    payment_giving: '', // 否 float64 订单赠金支付部分
    payment_integral: '', // 否 int 订单积分支付部分
    order_no: '', // 是 int 订单号
    ignore_order_no: 0, // 是否忽略手工单号重复验证:1=不验证,0=验证
    shopping_cart: '', // 是 json 购物车(快速消费填空对象)
    consume_type: '', // 否 int (消费类型:0=正常消费,1=欠款,2=免单,3=积分商城) => 自定义:0 消费 1 开卡 2 充值 3 积分商城
    system_calculate: '', // 是 json 系统计算结果备份系统计算结果备份
    gross_price: '', // 否 float64 总金额
    profit_price: '', // 否 float64 总利润
    integral: '', // 否 int 赠与积分
    prestore_price: '', // 否 float64 充值金额
    giving_price: '', // 否 float64 赠金
    arrears_price: '', // 否 float64 欠款还款金额
    alias: '', // 否 string 名称(会员取会员名称)
    phone: '', // 否 string 名称(会员去会员手机号)
    gender: '', // 否 int 性别:0=女,1=男
    payments: '', // 否 json 支付方式
    coupones: '', // 否 json 优惠券使用信息
    commodity_surplus: '', // 否 json 商品扣库存
    meter_oredes: '', // 否 json 计次服务子订单
    meter_combo_oredes: '', // 否 json 计次服务套餐子订单
    order_time: '', // 是 date 订单日期-Y-m-d H:i:s
    memo: '', // 否 string 备注-255字
    is_new_member: 0, // 否 int 开卡订单标识:0=否(默认),1=是
    notify: 1, // 否 int 是否发送消费通知:0=否,1=是
    notify_format: '', // 否 json 通知信息
    bonus: '', // 否 json 提成列表
    body_count: ''
  }
  keySync(form, custom)
  return form
}

export function initBonusList (type = '', source = '') {
  return [{
    type: type, // tenant_commodity tenant_project
    staff_id: '', // 员工编号
    performance_price: '', // 业绩
    dividends_price: '', // 提成
    specified_switch: 0,
    source_id: 0,
    source_alias: source,
    source_weight: 0,
    index: 1,
    show_num: '',
    cur_position: {},
    rule: '' // 当前所选职位职员所在位置计算规则
  }]
}

export function initGoodList () {
  return [initGoodItem()]
}

export function initGoodItem () {
  return {
    type: '', // commodity 商品  services 服务 count 计次
    category: {},
    good: {},
    originalPrice: '',
    qty: '',
    discount: '',
    discountPrice: '',
    presentPrice: '',
    discountPresentPrice: '',
    bonusList: initBonusList()
  }
}

export function initPaymentList (type = 'normal') {
  let paymentList = [{
    payment_name: '现金',
    amount_price: ''
  }, {
    payment_name: '微信',
    amount_price: ''
  }, {
    payment_name: '支付宝',
    amount_price: ''
  }, {
    payment_name: '银联',
    amount_price: ''
  }, {
    payment_name: 'pos',
    amount_price: ''
  }, {
    payment_name: '免单',
    amount_price: ''
  }, {
    payment_name: '收钱吧',
    amount_price: ''
  }, {
    payment_name: '美团',
    amount_price: ''
  }, {
    payment_name: '其他',
    amount_price: ''
  }]

  if (type === 'member') {
    let memberPaymentList = JSON.parse(JSON.stringify(paymentList))
    memberPaymentList.splice(0, 0, {
      payment_name: '余额',
      amount_price: ''
    }, {
      payment_name: '赠金',
      amount_price: ''
    }, {
      payment_name: '欠款',
      amount_price: ''
    }, {
      payment_name: '积分',
      amount_price: ''
    })
    return memberPaymentList
  } else {
    return paymentList
  }
}

export const consume = { // 快速计算
  type: 1, // 计算类型 1 实收 2 原价
  commission: { // 提成
    specified: {
      type: 1, // 计算方式 1 比例 2 固定
      value: 0
    },
    unspecified: {
      type: 1,
      value: 0
    }
  },
  perform: { // 业绩
    specified: {
      type: 1,
      value: 0
    },
    unspecified: {
      type: 1,
      value: 0
    }
  },
  grants: { // 赠金业绩
    type: 1,
    value: 0
  },
  cost: { // 成本
    specified: {
      type: 1,
      value: 0
    },
    unspecified: {
      type: 1,
      value: 0
    }
  },
  twice: { // 二次成本
    specified: {
      type: 1,
      value: 0
    },
    unspecified: {
      type: 1,
      value: 0
    }
  }
}

export const cardItem = {
  commission: { // 提成
    specified: {
      type: 1, // 计算方式 1 比例 2 固定
      value: 0
    },
    unspecified: {
      type: 1,
      value: 0
    }
  },
  perform: { // 业绩
    specified: {
      type: 1,
      value: 0
    },
    unspecified: {
      type: 1,
      value: 0
    }
  },
  grants: { // 赠金业绩
    type: 1,
    value: 0
  }
}

export const card = { // 开卡 充值
  1: {
    // sex: 1, // 性别 1 不区分 2 男 3 女 弃用
    type: 1, // 计算类型 1 实收 2 原价
    employees: [JSON.parse(JSON.stringify(cardItem))] // 子项 => cardItem
  },
  2: {
    type: 1,
    employees: [JSON.parse(JSON.stringify(cardItem)), JSON.parse(JSON.stringify(cardItem))]
  },
  3: {
    type: 1,
    employees: [JSON.parse(JSON.stringify(cardItem)), JSON.parse(JSON.stringify(cardItem)), JSON.parse(JSON.stringify(cardItem))]
  }
}
export const servicesItem = {
  type: 1, // 提成基数 1 实付 2 原价
  commission: { // 提成
    specified: {
      type: 1, // 计算方式 1 比例 2 固定
      value: 0
    },
    unspecified: {
      type: 1,
      value: 0
    }
  },
  perform: { // 业绩
    specified: {
      type: 1,
      value: 0
    },
    unspecified: {
      type: 1,
      value: 0
    }
  },
  grants: { // 赠金业绩
    type: 1,
    value: 0
  },
  cost: { // 成本
    specified: {
      type: 1,
      value: 0
    },
    unspecified: {
      type: 1,
      value: 0
    }
  },
  twice: { // 二次成本
    specified: {
      type: 1,
      value: 0
    },
    unspecified: {
      type: 1,
      value: 0
    }
  }
}

export const services = { // 服务项目 商品 计次
  // 对象 键=>项目id 值 => servicesItem
}

// 根据规则计算成本，二次成本，业绩，赠金业绩，提成
/**
*@params rule 规则
*@params amount 金额
*@params present 赠金 选填
*@params isSpecify 是否指定 选填
*@params option 配置
                assign 指定
                custom 初始返回值自定义 选填 (一旦传入相应key，该值就不再被计算)
*/
export function calculate (rule, amount, present = 0, isSpecify = false, option = {}) {
  let percent = 100 // 提成计算规则百分比比例配置
  const calculateMap = new Map([
    ['commission', commissionCalculate],
    ['perform', performCalculate],
    ['grants', grantsCalculate],
    ['pgSum', pgSumCalculate],
    ['cost', costCalculate],
    ['twice', twiceCalculate]
  ])
  Object.keys(rule).map(key => {
    rule[key].value && (rule[key].value = Number(rule[key].value))
    if (['type', 'grants'].includes(key)) return
    rule[key] = isSpecify ? rule[key].specified : rule[key].unspecified
  })
  let result = {
    cost: 0,
    twice: 0,
    perform: 0,
    grants: 0,
    pgSum: 0,
    commission: 0
  }
  option.custom && keySync(result, option.custom)
  if (option.assign) {
    calculateMap.get(option.assign)(rule[option.assign], result)
    return result
  }
  Object.keys(result).forEach(key => { // 根据result键值映射顺序计算各值
    if (result[key]) {
      return
    }
    if (option.custom && option.custom.hasOwnProperty(key)) { // 不计算存在的键值对
      return
    }
    if (key === 'pgSum') { // 计算不在规则中的key
      calculateMap.get(key)(result)
    }

    if (!rule.hasOwnProperty(key)) {
      return
    } else if (!(rule[key].type === 1 || rule[key].type === 2)) {
      throw new Error(`错误类型值r.type：${r.type}`)
    } else if (!rule[key].value) {
      return
    }
    calculateMap.get(key)(rule[key], result)
  })

  Object.keys(result).map(k => {
    result[k] = Number(result[k]).toFixed(2)
  })

  console.log('提成:', result)
  return result

  function commissionCalculate (r, result) {
    let base = result.pgSum || (amount - result.cost - result.twice) || 0
    if (r.type === 1) {
      result.commission = base * r.value / percent
    } else if (r.type === 2) {
      result.commission = Number(r.value)
    }
  }

  function pgSumCalculate (result) {
    result.pgSum = result.perform + result.grants
  }

  function performCalculate (r, result) {
    let base = amount - result.cost - result.twice
    if (r.type === 1) {
      result.perform = base * r.value / percent
    } else if (r.type === 2) {
      result.perform = Number(r.value)
    }
  }

  function grantsCalculate (r, result) {
    if (r.type === 1) {
      result.grants = present * r.value / percent
    } else if (r.type === 2) {
      result.grants = Number(r.value)
    }
  }

  function costCalculate (r, result) {
    if (r.type === 1) {
      result.cost = amount * r.value / percent
    } else if (r.type === 2) {
      result.cost = Number(r.value)
    }
  }

  function twiceCalculate (r, result) {
    if (r.type === 1) {
      result.twice = (amount - result.cost) * r.value / percent
    } else if (r.type === 2) {
      result.twice = Number(r.value)
    }
  }
}

export const goodPercent = 10 // 商品折扣百分比比例配置,与提成做区分
// 商品，服务项目,计次计算
export function caculateGood (options) {
  let opts = {
    type: 'commodity',
    num: 0, // 数量
    price: 0, // 原价
    memberPrice: 0, // 会员价
    cost: 0, // 成本
    onlyDiscountByGood: 0, // 是否只取商品折扣
    isSpecial: 0, // 是否特价
    recoup: 0, // 是否再折扣
    discount: 1, // 商品折扣
    memberDiscount: 1,
    good: {},
    memberRule: {}
  }

  keySync(opts, options)

  let isMember = Boolean(Object.keys(opts.memberRule).length);

  ({
    sale_price: opts.price,
    member_price: opts.memberPrice,
    cost_price: opts.cost,
    discount_switch: opts.onlyDiscountByGood,
    special_switch: opts.isSpecial,
    again_member_switch: opts.recoup,
    discount: opts.discount
  } = opts.good)
  opts.discount /= goodPercent

  if (isMember) {
    switch (opts.type) {
      case 'commodity':
        opts.memberDiscount = Number(opts.memberRule.commodity) / goodPercent
        break
      case 'services':
        opts.memberDiscount = Number(opts.memberRule.project) / goodPercent
        break
      case 'count':
        opts.memberDiscount = Number(opts.memberRule.project) / goodPercent
        break
      default:
        break
    }
  }

  let result = {
    type: -1, // 1 特价 2 只取商品折扣 3 会员价再折扣
    originalPrice: 0, // 单价
    discount: 10,
    discountPrice: 0, // 应付单价
    originalPriceAll: 0, // 应收总价
    discountPriceAll: 0 // 实收总价
  }

  if (!opts.type) {
    return result
  }

  let isGoodMemberRuleExist = false
  let curGoodMemberRule = {}
  if (isMember && opts.type === 'services') {
    if (opts.good.member_rule) {
      let goodMemberRule = JSON.parse(opts.good.member_rule)
      isGoodMemberRuleExist = goodMemberRule[opts.memberRule.id]
      curGoodMemberRule = goodMemberRule[opts.memberRule.id]
    }
  }
  result.originalPrice = (isMember && opts.type !== 'count') ? opts.memberPrice : opts.price

  if (opts.type === 'count') {
    if (!opts.good.special_switch && isMember) {
      result.discount = opts.memberDiscount
      result.discountPrice = result.originalPrice * result.discount
    } else {
      result.discount = 1
      result.discountPrice = result.originalPrice
    }
  } else if (isGoodMemberRuleExist) {
    // 0 比例 1固值
    if (Number(curGoodMemberRule.type) === 1) {
      result.discount = 1
      result.discountPrice = Number(curGoodMemberRule.ratio)
    } else {
      result.discount = Number(curGoodMemberRule.ratio) / goodPercent
      result.discountPrice = result.originalPrice * result.discount
    }
  } else {
    if (opts.onlyDiscountByGood) {
      result.type = 2
      result.discount = opts.discount
      result.discountPrice = result.originalPrice * result.discount
    } else if (opts.recoup) {
      result.type = 3
      result.discount = opts.discount * (opts.memberDiscount || 1)
      result.discountPrice = result.originalPrice * result.discount
    } else { // opts.isSpecial
      result.type = 1
      result.discount = opts.discount
      result.discountPrice = result.originalPrice
    }
  }
  result.originalPriceAll = result.originalPrice * opts.num
  result.discountPriceAll = result.discountPrice * opts.num
  Object.keys(result).forEach(key => {
    if (key !== 'discount') {
      result[key] = Number(result[key]).toFixed(2)
    } else {
      result[key] = Number(result[key] * 10).toFixed(1)
    }
  })

  console.log('价格:', opts, result)

  return result
}

function keySync (o1, o2) {
  Object.keys(o2).map(key => {
    if (o1.hasOwnProperty(key)) {
      o1[key] = o2[key]
    }
  })
}
/**
*@params type 初始化的消息类型 card recharge consume good count
*@params data 需要的数据
*/
export function initSMS (type = '', member, data) {
  let merchant = store.getters.userInfo

  let goodStr = ''
  if (['good', 'count'].includes(type)) {
    let result = []
    data.goodList && data.goodList.map(v => {
      if (Object.keys(v.good).length && v.good.id) {
        let findGood = result.find(rv => rv.id === v.good.id)
        if (findGood) {
          findGood.qty += Number(v.qty)
          findGood.price += Number(v.discountPriceAll)
        } else {
          result.push({
            id: v.good.id,
            name: v.good.alias,
            qty: Number(v.qty),
            price: Number(v.discountPriceAll)
          })
        }
      }
    })
    result.map((v, i) => {
      goodStr += `${v.name}(数量：${v.qty}，价格：${v.price})${i === result.length - 1 ? '' : ','}`
    })
  }
  let sms = {
    lable: (type === 'card' || type === 'recharge') ? '充值' : '消费',
    sms: {
      title: `${merchant.sms_title}`,
      remake: `${merchant.sms_remake}`
    },
    wechat: {
      first: goodStr,
      remake: `${merchant.sms_remake} ${merchant.telephone}`
    }
  }
  if (type === 'count') {
    sms.sms.meter = goodStr
  }
  if (type === 'card') {
    sms.wechat.first = `开卡 ${data.gross_price}元`
  } else if (type === 'recharge') {
    sms.wechat.first = `充值 ${data.gross_price}元`
  } else if (type === 'consume') {
    sms.wechat.first = `快速消费 ${data.gross_price}元`
  }
  return sms
}
