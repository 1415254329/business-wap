<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge>
        <!-- <Avatar :src="this.$store.getters.logo" /> -->
        <slot>&nbsp;{{$store.getters.storeName}}</slot>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown" />
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import {
  mapActions
} from 'vuex'
export default {
  name: 'User',
  data () {
    return {

    }
  },
  mounted () {
    // 如果本地缓存，每个页面都请求接口无意义，且没有必要
    // 如果不本地缓存，每个页面没必要请求不必要的接口
    // this.getStaffList().then((res) => {
    //   if (res.code === 0) {
    //     this.$store.commit('setStaff', res.data)
    //   }
    // })
    // this.getMembers().then((res) => {
    //   if (res.code === 0) {
    //     this.$store.commit('setMembers', res.data)
    //   }
    // })
    // this.getPosition().then((res) => {
    //   if (res.code === 0) {
    //     this.$store.commit('setPositions', res.data)
    //   }
    // })
    // this.getCommodity().then((res) => {
    //   if (res.code === 0) {
    //     this.$store.commit('setCommodity', res.data)
    //   }
    // })
    // this.getCategory().then((res) => {
    //   if (res.code === 0) {
    //     this.$store.commit('setCategory', res.data)
    //   }
    // })

  },
  methods: {
    ...mapActions('user', ['handleLogOut']),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.logout()
          break
        case 'message':
          this.message()
          break
      }
    }
  }
}
</script>
