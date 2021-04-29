<template>
    <div v-loading="loading" class="app-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="发送内容" prop="content">
          <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item label="提示：">
          <p>该功能属于付费功能，请提交以后联系客服处理！电话：18968841953（微信同号）</p>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleMessageSend('form')">发送</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
function formIV () {
  return {
    mold: 'sms',
    content: '',
    mobile: 'member'
  }
}
export default {
  props: {
    messageMode: {
      type: String,
      default: () => 'sms'
    }
  },
  data () {
    return {
      loading: false,
      form: formIV(),
      rules: {
        // mobile: [{
        //   required: true,
        //   message: '发送对象不能为空',
        //   trigger: 'blur'
        // }],
        content: [{
          required: true,
          message: '发送内容不能为空',
          trigger: 'blur'
        }]
      },
      modeMap: new Map([
        ['短信群发', 'sms'],
        ['微信群发', 'wechat']
      ])
    }
  },
  watch: {
    messageMode (v) {
      this.form.mold = v
    }
  },
  created () {
    this.form.mold = this.messageMode
  },
  methods: {
    handleModeSelect (key, keyPath) {
      this.reset('form')
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 200)
      this.form = formIV()
      this.form.mold = this.modeMap.get(key)
    },
    handleMessageSend (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$api.common.sendMessage(this.form).then(res => {
            this.$Message.success('发送成功')
            this.form = formIV()
          })
        }
      })
    },
    reset (form) {
      this.$nextTick(() => {
        this.$refs[form].resetFields()
      })
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
