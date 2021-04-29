<template>
  <div class="app-container">
    <el-form ref="form" :model="setting" label-width="100px">
      <el-form-item label="打印开关：" prop="old_password">
        <el-switch v-model="setting.switch">
      </el-switch>
      </el-form-item>
      <el-form-item label="打印份数：" prop="password">
        <el-input v-model="setting.num"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { keySync } from '@/utils'
export default {
  data () {
    return {
      setting: {
        switch: 0,
        num: 1
      }
    }
  },
  created () {
    keySync(this.setting, this.$store.getters.printSetting)
  },
  methods: {
    handleSave () {
      if (this.setting.switch && this.setting.num <= 0) {
        this.$message({
          type: 'error',
          message: '开启打印时，份数需要大于0'
        })
        return
      }
      this.$store.commit('print/setSetting', this.setting)
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    }
  }
}
</script>
