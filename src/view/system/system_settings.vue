<template>
  <div class="system">
    <Row :gutter="20">
      <Col :xs="12" :md="4" :lg="8" v-for="(infor, i) in inforCardData" :key="`infor-${i}`"
             style="height: 120px; padding-bottom: 10px">
        <!-- <template v-if="infor.access"> -->
        <router-link :to="infor.path">
          <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
            <!-- <count-to :end="infor.count" count-class="count-style"/> -->
            <p class="count-style">{{ infor.title }}</p>
          </infor-card>
        </router-link>
        <!-- </template> -->
      </Col>
    </Row>
  </div>

</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'

export default {
  name: 'system_settings',
  components: {
    InforCard,
    CountTo
  },
  data () {
    return {
      inforCardData: [
        {
          title: '会员等级设置',
          icon: 'md-options',
          color: '#00196B',
          path: '/system/member_rule'
        },
        {
          title: '充值规则设置',
          icon: 'logo-yen',
          color: '#FF4E45',
          path: '/system/recharge_rule'
        },
        {
          title: '分店设置',
          icon: 'md-git-branch',
          color: '#FFF491',
          path: '/system/store'
        },
        {
          title: '服务项目设置',
          icon: 'ios-bookmarks',
          color: '#d0e6a5',
          path: '/system/project'
        },
        {
          title: '商品设置',
          icon: 'ios-cube',
          color: '#86e3ce',
          path: '/system/commodity'
        },
        {
          title: '计次服务设置',
          icon: 'md-pricetags',
          color: '#ffdd94',
          path: '/system/meter'
        },
        {
          title: '员工权限设置',
          icon: 'md-unlock',
          color: '#f4c983',
          path: '/system/staff/permission'
        },
        {
          title: '积分设置',
          icon: 'md-star',
          color: '#6ddccf',
          path: '/system/integral'
        },
        {
          title: '打印设置',
          icon: 'md-archive',
          color: '#fa897b',
          path: '/system/print'
        }
        // {
        //   title: '耗品设置',
        //   icon: 'md-archive',
        //   color: '#fa897b',
        //   path: '/system/wastage'
        // },
        // {
        //   title: '优惠券管理',
        //   icon: 'md-cash',
        //   color: '#ccabd8',
        //   path: '/system/coupon'
        // },
        // {
        //   title: '分类管理',
        //   icon: 'ios-book',
        //   color: '#f1c29e',
        //   path: '/system/classification'
        // }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.system{
  padding: 15px;
}
.count-style {
  font-size: 25px;
}
</style>
