<template>
  <div class="revisit">
    <div class="revisit-menu">
      <el-menu default-active="服务项目回访"  @select="handleSelect">
        <el-menu-item index="服务项目回访">
          <i class="el-icon-menu"></i>
          <span slot="title">服务项目回访</span>
        </el-menu-item>
        <el-menu-item  index="计次回访">
          <i class="el-icon-menu"></i>
          <span slot="title">计次回访</span>
        </el-menu-item>
        <el-menu-item  index="会员生日回访">
          <i class="el-icon-menu"></i>
          <span slot="title">会员生日回访</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="revisit-main">
      <component :is="componentName" />
    </div>
  </div>
</template>

<script>
import Project from './components/project'
import Meter from './components/meter'
import Birthday from './components/birthday'
export default {
  components: {
    Project,
    Meter,
    Birthday
  },
  data () {
    return {
      componentName: 'Project',
      componentMap: new Map([
        ['服务项目回访', 'Project'],
        ['计次回访', 'Meter'],
        ['会员生日回访', 'Birthday']
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
  .revisit {
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
