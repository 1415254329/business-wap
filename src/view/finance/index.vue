<template>
  <div class="finance">
    <div class="finance-menu">
      <el-menu default-active="报表统计" @select="handleSelect">
        <el-menu-item index="报表统计">
          <i class="el-icon-menu"></i>
          <span slot="title">报表统计</span>
        </el-menu-item>
        <el-menu-item index="店铺每日报表">
          <i class="el-icon-menu"></i>
          <span slot="title">店铺每日报表</span>
        </el-menu-item>
        <el-menu-item index="店内利润报表">
          <i class="el-icon-menu"></i>
          <span slot="title">店内利润报表</span>
        </el-menu-item>
        <el-menu-item v-if="$store.getters.userInfo.master_id === 0" index="连锁报表统计">
          <i class="el-icon-menu"></i>
          <span slot="title">连锁报表统计</span>
        </el-menu-item>
        <el-menu-item index="跨店报表分析">
          <i class="el-icon-menu"></i>
          <span slot="title">跨店报表分析</span>
        </el-menu-item>
        <el-menu-item index="支付方式统计">
          <i class="el-icon-menu"></i>
          <span slot="title">支付方式统计</span>
        </el-menu-item>
        <el-menu-item index="分类销售额统计">
          <i class="el-icon-menu"></i>
          <span slot="title">分类销售额统计</span>
        </el-menu-item>
        <el-menu-item index="服务项目销售">
          <i class="el-icon-menu"></i>
          <span slot="title">服务项目销售</span>
        </el-menu-item>
        <el-menu-item index="商品销售数统计">
          <i class="el-icon-menu"></i>
          <span slot="title">商品销售数统计</span>
        </el-menu-item>
        <el-menu-item index="计次销售数统计">
          <i class="el-icon-menu"></i>
          <span slot="title">计次销售数统计</span>
        </el-menu-item>
        <el-menu-item index="订单统计">
          <i class="el-icon-menu"></i>
          <span slot="title">订单统计</span>
        </el-menu-item>
        <el-menu-item index="还款记录">
          <i class="el-icon-menu"></i>
          <span slot="title">还款记录</span>
        </el-menu-item>
        <el-menu-item index="撤单记录">
          <i class="el-icon-menu"></i>
          <span slot="title">撤单记录</span>
        </el-menu-item>
        <!-- <el-menu-item index="系统操作日志">
          <i class="el-icon-menu"></i>
          <span slot="title">系统操作日志</span>
        </el-menu-item> -->
      </el-menu>
    </div>
    <div class="finance-main">
      <component :is="componentName" />
    </div>
  </div>
</template>

<script>
import Report from './components/report'
import Payment from './components/payment'
import Category from './components/category'
import Commodity from './components/commodity'
import Service from './components/service'
import Meter from './components/meter'
import Order from './components/order'
import ShopReport from './components/shopReport'
import DebtBack from './components/debtBack'
import OrderDeleted from './components/orderDeleted'
import Logs from './components/logs'
import Across from './components/across'
import DailyReport from './components/dailyReport'
import ProfitReport from './components/profitReport'
export default {
  components: {
    Report,
    Payment,
    Category,
    Commodity,
    Service,
    Meter,
    Order,
    ShopReport,
    DebtBack,
    OrderDeleted,
    Logs,
    Across,
    DailyReport,
    ProfitReport
  },
  data () {
    return {
      componentName: 'Report',
      componentMap: new Map([
        ['报表统计', 'Report'],
        ['支付方式统计', 'Payment'],
        ['分类销售额统计', 'Category'],
        ['商品销售数统计', 'Commodity'],
        ['服务项目销售', 'Service'],
        ['计次销售数统计', 'Meter'],
        ['订单统计', 'Order'],
        ['连锁报表统计', 'ShopReport'],
        ['还款记录', 'DebtBack'],
        ['撤单记录', 'OrderDeleted'],
        ['系统操作日志', 'Logs'],
        ['跨店报表分析', 'Across'],
        ['店铺每日报表', 'DailyReport'], // TODO
        ['店内利润报表', 'ProfitReport'] // TODO
      ])
    }
  },
  created () {

  },
  methods: {
    handleSelect (key, keyPath) {
      this.componentName = this.componentMap.get(key)
    }
  }
}

</script>

<style lang="less" scoped>
  .finance {
    position: relative;
    padding: 15px;
    display: flex;

    &-menu {
      flex-shrink: 0;
      width: 200px;
    }

    &-main {
      margin-left: 10px;
      // flex-grow: 1;
      width: calc(~"100% - 210px");
    }
  }

</style>
