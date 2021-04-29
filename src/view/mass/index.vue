<template>
  <div class="mass">
    <div class="mass-menu">
      <el-menu default-active="短信群发"  @select="handleSelect">
        <el-menu-item index="短信群发">
          <i class="el-icon-menu"></i>
          <span slot="title">短信群发</span>
        </el-menu-item>
        <el-menu-item index="微信群发">
          <i class="el-icon-menu"></i>
          <span slot="title">微信群发</span>
        </el-menu-item>
        <el-menu-item index="发送记录">
          <i class="el-icon-menu"></i>
          <span slot="title">发送记录</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="mass-main">
      <components :is="componentName" :messageMode="messageMode" />
    </div>
  </div>
</template>

<script>
import Message from './components/message'
import Record from './components/record'
export default {
  components: {
    Message,
    Record
  },
  data () {
    return {
      messageMode: 'sms',
      componentName: 'Message',
      componentMap: new Map([
        ['短信群发', 'Message'],
        ['微信群发', 'Message'],
        ['发送记录', 'Record']
      ])
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      if (key === '短信群发') {
        this.messageMode = 'sms'
      } else if (key === '微信群发') {
        this.messageMode = 'wechat'
      }
      this.componentName = this.componentMap.get(key)
    }
  }
}
</script>

<style lang="less" scoped>
.mass {
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
