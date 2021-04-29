<template>
  <div class="card">
    <div v-if="list.length" class="list">
      <div class="item" v-for="(item,index) in list" :key="index">
        <div class="title">店铺:{{item.store_name}}</div>
        <div @click="$router.push({
            path:'search',
            query:{
              id:item.id
            }
          })" class="bonus">提成记录</div>
      </div>
    </div>
    <div v-else class="empty">
      暂无任职店铺
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  computed: {
    token () {
      return this.$store.state.wx.token
    }
  },
  watch: {
    token () {
      if (this.token) {
        this.getList()
      }
    }
  },
  created () {
    if (this.token) {
      this.getList()
    }
  },
  methods: {
    getList () {
      this.$api.wx.getStaffList().then(res => {
        this.list = res.data.map(item => {
          return item.staff
        })
      })
    }
  }
}

</script>

<style lang="less" scoped>
  .card {
    padding: 18px;
    box-sizing: border-box;

    .list {
      @padding: 18px;

      .item {
        padding: @padding;
        display: flex;
        justify-content: space-between;
        align-items: center;

        box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.08);
        border-radius: 8px;

        &:first-child {
          ~.item {
            margin-top: 20px;
          }
        }

        .title {

        }

        .bonus {
          &:active {
            color: rgb(102, 203, 250);
          }

        }
      }
    }

    .empty {
      text-align: center;
      padding-top: 30px;
      font-size: 15px;
      font-weight: 300;
      color: rgba(0, 0, 0, 0.8);
    }
  }

</style>
