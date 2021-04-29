<template>
  <div class="store">
    <div class="store-menu">
      <el-menu default-active="商户信息" @select="handleSelect">
        <el-menu-item index="商户信息">
          <i class="el-icon-menu"></i>
          <span slot="title">商户信息</span>
        </el-menu-item>
        <el-menu-item index="修改密码">
          <i class="el-icon-menu"></i>
          <span slot="title">修改密码</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="store-main">
      <component :is="componentName"/>
    </div>
  </div>
</template>

<script>
import Detail from './components/detail'
import ChangePwd from './components/changePwd'
export default {
  components: {
    Detail,
    ChangePwd
  },
  data () {
    return {
      componentName: 'Detail',
      componentMap: new Map([
        ['商户信息', 'Detail'],
        ['修改密码', 'ChangePwd']
      ])
    }
  },
  created () {

  },
  methods: {
    handleSelect (key) {
      this.componentName = this.componentMap.get(key)
    }
  }
}

</script>

<style lang="less" scoped>
  .store {
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
