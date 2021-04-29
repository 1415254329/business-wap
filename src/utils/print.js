import { parseTime, keySync } from './index'
/**
 *
 * @param {Object} order //订单信息
 */
export default function Print (LODOP, store = {}) {
  this.LODOP = LODOP
  this.store = {
    name: '',
    phone: '',
    addr: ''
  }
  keySync(this.store, store)
}

Print.prototype.createOrder = function (member = {}, order = {}) {
  var hPos = 15 // 小票上边距
  var pageWidth = 580 // 小票宽度
  var rowHeight = 18 // 小票行距
  var textRight = 65// 文本左边距

  this.member = {
    exist: 0,
    name: '',
    cardNo: '',
    phone: ''
  }

  let typeMap = new Map([
    ['card', 1],
    ['recharge', 2],
    ['consume', 3],
    ['good', 4],
    ['count', 5]
  ])
  this.order = {
    type: 1, // 1 开卡 2 充值 3 快速消费 4 服务/商品 5 计次
    orderTime: '',
    recharge: {
      deposit: '',
      present: '',
      actual: ''
    },
    consume: {
      originalPayment: ''
    },
    goodList: [],
    paymentList: [],
    result: {

    }
  }

  keySync(this.member, member)
  keySync(this.order, order)
  this.order.type = typeMap.get(order.type)

  // 初始化
  this.LODOP.SET_PRINT_PAGESIZE(3, pageWidth)
  this.LODOP.PRINT_INIT('订单信息')
  // 上边距往下移
  hPos += rowHeight
  this.LODOP.SET_PRINT_STYLE('FontSize', 12)
  this.LODOP.SET_PRINT_STYLE('Bold', 1)
  this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '店名:')
  this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, this.store.name)
  hPos += rowHeight
  this.LODOP.SET_PRINT_STYLE('FontSize', 10)
  this.LODOP.SET_PRINT_STYLE('Bold', 1)
  this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '联系电话:')
  this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, this.store.phone)
  hPos += rowHeight
  this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '地址:')
  this.LODOP.ADD_PRINT_TEXT(hPos, 35, pageWidth, rowHeight, this.store.addr)
  hPos += rowHeight
  this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '******************************')
  hPos += rowHeight
  this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '日期:')
  this.LODOP.ADD_PRINT_TEXT(hPos, textRight - 25, pageWidth, rowHeight, this.order.orderTime)
  hPos += rowHeight
  if (this.member.exist) {
    this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '会员姓名:')
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, this.member.name)
    hPos += rowHeight
    this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '卡号:')
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, this.member.cardNo)
    hPos += rowHeight
    this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '手机号:')
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, this.member.phone && this.member.phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2'))
    hPos += rowHeight
  } else {
    this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '散客')
    hPos += rowHeight
  }
  this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '******************************')
  hPos += rowHeight
  if ([1, 2].includes(this.order.type)) {
    this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '项目名称:')
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, this.order.type === 1 ? '会员开卡' : '会员充值')
    hPos += rowHeight
    this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '充值金额:')
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, Number(this.order.recharge.deposit).toFixed(2))
    hPos += rowHeight
    this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '赠送金额:')
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, Number(this.order.recharge.present).toFixed(2))
    hPos += rowHeight
    this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '到账金额:')
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, Number(this.order.recharge.actual).toFixed(2))
    hPos += rowHeight
  } else if (this.order.type === 3) {
    this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '项目名称:')
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, '快速消费')
    hPos += rowHeight
    this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '消费金额:')
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, Number(this.order.consume.originalPayment).toFixed(2))
    hPos += rowHeight
  } else if (this.order.type === 4) {
    this.order.goodList.map((v, i) => {
      this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '项目名称:')
      this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, v.good.alias)
      hPos += rowHeight
      this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '数量:')
      this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, Number(v.qty))
      hPos += rowHeight
      this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '价格:')
      this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, Number(v.originalPriceAll).toFixed(2))
      hPos += rowHeight
      this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '折后价:')
      this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, Number(v.discountPriceAll).toFixed(2))
      hPos += rowHeight
      if (i < this.order.goodList.length - 1) {
        this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '..............................')
        hPos += rowHeight
      }
    })
  } else if (this.order.type === 5) {
    this.order.goodList.map((v, i) => {
      if (v.type === 'count') {
        this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '计次名称:')
        this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, v.good.alias)
        hPos += rowHeight
        this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '次数:')
        this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, v.isInfinite ? '不限次数' : Number(v.qty))
        hPos += rowHeight
        this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '价格:')
        this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, Number(v.originalPriceAll).toFixed(2))
        hPos += rowHeight
        this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '折后价:')
        this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, Number(v.discountPriceAll).toFixed(2))
        hPos += rowHeight
      } else {
        this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '计次名称:')
        this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, v.good.alias)
        hPos += rowHeight
        this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '使用次数:')
        this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, Number(v.useTimes))
        hPos += rowHeight
        this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '剩余次数:')
        this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, v.isInfinite ? '不限次数' : Number(v.surp))
        hPos += rowHeight
      }

      if (i < this.order.goodList.length - 1) {
        this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '..............................')
        hPos += rowHeight
      }
    })
  }

  this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '******************************')
  hPos += rowHeight
  if ([3, 4, 5].includes(this.order.type)) {
    this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '实付金额:')
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, Number(this.order.result.payment).toFixed(2))
    hPos += rowHeight
  }
  if (this.member.exist) {
    this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '账户余额:')
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, Number(this.order.result.balance).toFixed(2))
    hPos += rowHeight
    this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '积分余额:')
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, Number(this.order.result.integral).toFixed(2))
    hPos += rowHeight
  }
  this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '支付方式:')
  this.order.paymentList.map(v => {
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, v.payment_name)
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight * 2, pageWidth, rowHeight, Number(v.amount_price).toFixed(2))
    hPos += rowHeight
  })
  if (!this.order.paymentList.length) {
    hPos += rowHeight
  }
  this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '******************************')
  hPos += rowHeight
  this.LODOP.ADD_PRINT_TEXT(hPos, 25, pageWidth, rowHeight, '谢谢惠顾,欢迎下次光临!')
  // 初始化打印页的规格
  this.LODOP.SET_PRINT_PAGESIZE(3, pageWidth, 45, '订单信息')
}
Print.prototype.createReport = function (reportList) {
  var hPos = 15 // 小票上边距
  var pageWidth = 580 // 小票宽度
  var rowHeight = 18 // 小票行距
  var textRight = 140// 文本左边距

  this.LODOP.SET_PRINT_PAGESIZE(3, pageWidth)
  this.LODOP.PRINT_INIT('报表信息')
  this.LODOP.SET_PRINT_STYLE('FontSize', 13)
  this.LODOP.SET_PRINT_STYLE('Bold', 1)
  this.LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, '今日报表')
  hPos += rowHeight
  hPos += rowHeight
  this.LODOP.SET_PRINT_STYLE('FontSize', 12)
  this.LODOP.SET_PRINT_STYLE('Bold', 1)
  this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '店名:')
  this.LODOP.ADD_PRINT_TEXT(hPos, 80, pageWidth, rowHeight, this.store.name)
  hPos += rowHeight
  this.LODOP.SET_PRINT_STYLE('FontSize', 10)
  this.LODOP.SET_PRINT_STYLE('Bold', 1)
  this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '联系电话:')
  this.LODOP.ADD_PRINT_TEXT(hPos, 60, pageWidth, rowHeight, this.store.phone)
  hPos += rowHeight
  this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '地址:')
  this.LODOP.ADD_PRINT_TEXT(hPos, 35, pageWidth, rowHeight, this.store.addr)
  hPos += rowHeight
  this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '日期:')
  this.LODOP.ADD_PRINT_TEXT(hPos, 50, pageWidth, rowHeight, parseTime(new Date()))
  hPos += rowHeight
  this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, '******************************')
  hPos += rowHeight
  this.LODOP.SET_PRINT_STYLE('FontSize', 10)
  this.LODOP.SET_PRINT_STYLE('Bold', 1)

  reportList.forEach((v, i) => {
    this.LODOP.ADD_PRINT_TEXT(hPos, 1, pageWidth, rowHeight, `${v.name}:`)
    this.LODOP.ADD_PRINT_TEXT(hPos, textRight, pageWidth, rowHeight, v.val)
    hPos += rowHeight
  })

  // 初始化打印页的规格
  this.LODOP.SET_PRINT_PAGESIZE(3, pageWidth, 45, '订单信息')
}

Print.prototype.print = function () {
  // this.LODOP.PREVIEW()
  this.LODOP.PRINT()
}

Print.prototype.setNum = function (num) {
  this.LODOP.SET_PRINT_COPIES(num)
}
