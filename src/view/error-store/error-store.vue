<template>
  <div>
    <Card>
      iview-admin会自动将你程序中的错误收集起来，你可以将错误日志发给后端保存起来。如果你不需要这个功能，将'./src/config/index.js'里的plugin的'error-store'属性删掉即可。
      另外在开发环境下，你程序中的错误都会被收集起来，这样可能不利于你排查错误，你可以将'./src/config/index.js'的'error-store'的'developmentOff'设为true。
      如果你只是想收集错误日志，不希望登录用户看到错误日志，你可以不提供查看日志的入口，只需将'./src/config/index.js'的'error-store'的'showInHeader'设为false。
    </Card>
  </div>
</template>

<script>
export default {
  name: 'error_store_page',
  methods: {
    click () {
      console.log(admin)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
