<template>
  <div v-if="showFullScreenBtn" class="refresh-btn-con">
    <Tooltip content="刷新" placement="bottom">
      <Icon @click.native="handleRefresh" type="md-refresh" :size="23"></Icon>
    </Tooltip>
  </div>
</template>

<script>
export default {
  name: 'Fullscreen',
  computed: {
    showFullScreenBtn () {
      return window.navigator.userAgent.indexOf('MSIE') < 0
    }
  },
  methods: {
    handleRefresh () {
      location.reload()
    }
  }
}
</script>

<style lang="less">
.refresh-btn-con .ivu-tooltip-rel{
  // height: 64px;
  // line-height: 56px;
  i{
    cursor: pointer;
  }
}
</style>
