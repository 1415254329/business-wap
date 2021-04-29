<template>
  <div class="home">
    <Row class="router-btns" :gutter="20">
      <Col :xs="12" :md="4" :lg="8" v-for="(infor, i) in inforCardData" :key="`infor-${i}`"
        style="height: 120px; padding-bottom: 10px">
      <!-- <template v-if="infor.access"> -->
      <router-link :to="infor.path">
         <infor-card v-if="infor.name&&infor.name ==='contact'"  shadow :color="infor.color" :icon="infor.icon" :icon-size="36" class="contact">
          <p v-html="infor.title"></p>
        </infor-card>
        <infor-card v-else  shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <p class="count-style">{{ infor.title }}</p>
        </infor-card>
      </router-link>
      <!-- </template> -->
      </Col>
    </Row>
    <div class="orderReport">
      <p class="title">今日报表</p>
      <ul class="list">
        <li class="list-item" v-for="(item,index) in reportList" :key="index">
          {{item.name}}：
          <span>{{item.val}}</span>
        </li>
      </ul>
      <el-button @click="handlePrint()" class="paper" type="primary" size="small">打印</el-button>
    </div>
    <object id="LODOP_OB" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width=0 height=0>
      <embed id="LODOP_EM" type="application/x-print-lodop" width=0 height=0 pluginspage="install_lodop.exe"></embed>
    </object>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import {
  parseTime
} from '@/utils'
import Print from '@/utils/print'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo
  },
  data () {
    return {
      inforCardData: [{
        title: '快速消费',
        icon: 'md-card',
        color: '#19be6b',
        path: '/business/buy/consume'
      },
      {
        title: '买单收银',
        icon: 'md-cart',
        color: '#f56a79',
        path: '/business/buy/good'
      },
      {
        title: '积分兑换',
        icon: 'md-share',
        color: '#ed3f14',
        path: '/business/buy/integral'
      },
      {
        title: '会员管理',
        icon: 'md-person-add',
        color: '#2d8cf0',
        path: '/directive/directive_page'
      },
      {
        title: '员工管理',
        icon: 'ios-albums',
        color: '#ff9900',
        path: '/staff/staff_page'
      },
      {
        title: '财务报表',
        icon: 'md-stats',
        color: '#fb743e',
        path: '/finance'
      },
      {
        title: '店内收支',
        icon: 'md-cash',
        color: '#28527a',
        path: '/flow'
      },
      {
        title: '信息群发',
        icon: 'md-mail',
        color: '#78c4d4',
        path: '/mass'
      },
      {
        title: '会员回访',
        icon: 'md-call',
        color: '#9A66E4',
        path: '/revisit'
      },
      {
        title: '系统设置',
        icon: 'md-settings',
        color: '#6ddccf',
        path: '/system/system_settings'
      },
      // {
      //   title: `信息余:${store.getters.userInfo.sms_surplus_num === -1 ? '不限' : (store.getters.userInfo.sms_surplus_num + '条')}`,
      //   icon: 'md-chatbubbles',
      //   color: '#E46CBB',
      //   path: ''
      // },
      
      {
        title: '我的商铺',
        icon: 'md-appstore',
        color: '#e45826',
        path: '/store'
      }, 
      {
        title: '我的预约',
        icon: 'logo-snapchat',
        color: '#6ddccf',
        path: '/scheduled'
      },{
        name: 'contact',
        title: `<p>服务电话：0577—88932925</p><p>售后客服QQ：1804928364</p>`,
        icon: 'md-chatbubbles',
        color: '#E46CBB',
        path: ''
      }],
      reportList: []
      // orderReport: {
      //   gender: {},
      //   member: {},
      //   new_member: {},
      //   sys_pay: {},
      //   repay: [{}],
      //   meter_employ: {},
      //   meter_orders: {}
      // }
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.getReportStats()
  },
  methods: {
    getReportStats () {
      let startTime = parseTime(new Date(), '{y}-{m}-{d}') + ' 00:00:00'
      let endTime = parseTime((new Date().getTime() + 3600 * 24 * 1000), '{y}-{m}-{d}') + ' 00:00:00'
      this.$api.business.getReportStats(Object.assign({}, {
        start_time: startTime,
        end_time: endTime
      })).then(res => {
        res.data.gender = res.data.gender ? res.data.gender.reduce((pre, cur) => {
          if (cur.gender === '男') {
            pre['man'] = cur.qty
          } else if (cur.gender === '女') {
            pre['woman'] = cur.qty
          }
          return pre
        }, {}) : {}
        res.data.repay = res.data.repay || [{}]
        this.reportList = [{
          name: '营业收入',
          val: res.data.business
        }, {
          name: '订单总数',
          val: res.data.count
        }, {
          name: '男客数',
          val: res.data.gender.man || 0
        }, {
          name: '女客数',
          val: res.data.gender.woman || 0
        }, {
          name: '游客单数',
          val: res.data.tourist_count
        }, {
          name: '游客总额',
          val: res.data.tourist_peice
        }, {
          name: '会员单数',
          val: res.data.member_count
        }, {
          name: '新会员开卡数',
          val: res.data.new_member_count
        }, {
          name: '会员开卡充值',
          val: res.data.new_member.prestore_price
        }, {
          name: '会员开卡赠金',
          val: res.data.new_member.giving_price
        }, {
          name: '会员充值金额',
          val: res.data.member.prestore_price
        }, {
          name: '会员充值赠金',
          val: res.data.member.giving_price
        }, {
          name: '会员现金总额',
          val: res.data.member_cash
        }, {
          name: '订单消费总额',
          val: res.data.price
        }, {
          name: '店内消耗总额',
          val: Number(res.data.price - res.data.meter_orders.price + res.data.meter_employ.price).toFixed(2)
        }, {
          name: '余额消耗总额',
          val: res.data.sys_pay.payment_balance
        }, {
          name: '计次使用总额',
          val: res.data.meter_employ.price
        }, {
          name: '计次消费总额',
          val: res.data.meter_orders.price
        }, {
          name: '赠金消耗总额',
          val: res.data.sys_pay.payment_giving
        }, {
          name: '欠款订单总额',
          val: res.data.await
        }, {
          name: '免单订单总额',
          val: res.data.free
        }, {
          name: '还款金额',
          val: res.data.repay[0].arrears_price || 0
        }]
      })
    },
    handlePrint (options) {
      if (!this.$store.state.print.setting.switch) {
        return
      }
      if (!this.$store.state.print.isLodopLoad) {
        return
      }
      let lodop = this.$getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'))

      let printInstance = new Print(lodop, {
        name: this.userInfo.store_name,
        phone: this.userInfo.trade,
        addr: this.userInfo.addr
      })
      printInstance.createReport(this.reportList)
      printInstance.setNum(Number(this.$store.state.print.setting.num))
      printInstance.print()
    }
  }
}

</script>

<style lang="less">
  .home {
    padding: 15px;
    display: flex;
    .router-btns{
      flex-grow: 1;
    }
    /deep/.contact{
      .count-style{
        font-size: 14px;
      }

    }
  }
  .orderReport{
    position: relative;
    margin-left: 10px;
    padding: 10px 0 30px 0 ;
    min-width: 350px;
    max-width: 400px;
    background: white;
    // border: 1px solid #666666;
    border-radius: 8px;

    transition: all .4s;
    .title{
      text-align: center;
      padding: 0 20px;
      font-size: 20px;
      font-weight: 700;
    }
    ul{

      margin-top: 10px;
      list-style: none;
      line-height: 25px;
      li{
        @grey:rgba(0,0,0,0.6);
        @grey-hover:rgba(163,198,241,0.4);
        display: flex;
        align-items: center;
        position: relative;
        padding: 8px 20px;
        color: @grey;
        span{
          margin-left: 10px;
          font-size: 16px;
          color: black;
        }
        &:hover{
          background-color: @grey-hover;
        }
        &::before{
          display: block;
          margin-right: 10px;
          width: 0.5em;
          height: 0.5em;
          background: @grey;
          border-radius: 50%;
          content: '';
        }
      }
    }
    .paper{
      position: absolute;
      right: 10px;
      bottom: 5px;
    }

    &:hover{
      // transform: translateY(-1%);
      box-shadow: 0px 0px 8px 2px rgba(0,0,0,0.08);
    }
  }

  .count-style {
    font-size: 25px;
  }
</style>
