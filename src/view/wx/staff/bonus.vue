<template>
  <div class="bonus">
    <div class="list">
      <div v-for="(item,index) in list" :key="index" class="item">
          <div class="name">
              {{item.source_alias}}
          </div>
          <div class="info">
              <div class="time">{{item.order_time}}</div>
              <div class="bonu">
                  <div class="perf">业绩:{{item.performance_price}}</div>
                  <div class="divi">提成:{{item.dividends_price}}</div>
              </div>
          </div>
      </div>
    </div>
    <!-- <div v-else class="empty">暂无数据</div> -->
    <div class="stats">
        <div>业绩合计：{{Number(stats.performALL).toFixed(2)}}</div>
        <div>提成合计：{{Number(stats.commissionAll).toFixed(2)}}</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      stats: {
        performALL: 0,
        commissionAll: 0
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$api.wx.getStaffBonusList(this.$route.query.id, {
        start_time: this.$route.query.startTime + ' 00:00:00',
        end_time: this.$route.query.endTime + ' 23:59:59'
      }).then(res => {
        res.data.forEach(v => {
          this.stats.performALL += v.performance_price
          this.stats.commissionAll += v.dividends_price
        })
        this.list = res.data
      })
    }
  }
}

</script>
<style lang="less" scoped>
  .bonus {
    .list {
      .item {
        padding: 10px 0 10px 15px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(0,0,0,0.08);
        .name{
            // font-size: 15px;
        }
        .info{
            display: flex;
            color: rgba(0,0,0,0.5);
            .bonu{
                padding-left: 10px;
                width: 80px;
            }
        }
      }
    }
    .stats{
        margin-top: 5px;
        display: flex;
        font-size: 15px;
        >div{
            flex: 0 1 50%;
            text-align: center;
        }
    }

  }

</style>
