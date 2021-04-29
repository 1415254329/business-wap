<template>
  <div class="record">
    <div class="list">
      <div v-for="(item,index) in list" :key="index" class="item">
        <div class="date">
          <span class="label">消费时间</span>
          {{item.create_time}}
        </div>
        <div class="name">
          <span class="label">姓名</span>
          {{item.alias}}
        </div>
        <div class="type">
          <span class="label">消费类型:</span>
          <span v-if="item.shopping_cart.length">
            消费
          </span>
          <span v-else-if="item.is_new_member">
            开卡
          </span>
          <span v-else-if="(item.prestore_price || item.giving_price) &&item.integral>=0">
            充值
          </span>
          <span v-else-if="!(item.prestore_price || item.giving_price) && item.integral>0 && !item.gross_price">
            积分充值{{item.integral}}
          </span>
          <span v-else-if="item.integral<0 && !item.gross_price">
            积分消费{{-item.integral}}兑换{{item.prestore_price}}元
          </span>
          <span v-else>
            快速消费
          </span>
        </div>
        <span v-if="item.shopping_cart.length" class="label">消费明细</span>
        <div v-if="item.shopping_cart.length" class="detail">
          <div v-for="(shopItem,index) in item.shopping_cart" :key="index" class="detail-item">
            <!-- <div class="type">
              <span class="label">商品类型</span>
              {{}}
            </div> -->
            <div class="name">
              <span class="label">名称</span>
              {{shopItem.good.alias}}
              <span v-if="['countBuyUse','countBoughtUse'].includes(shopItem.type)">
                <br>{{`(使用${shopItem.useTimes}次)`}}
              </span>
            </div>
            <div class="num">
              <span class="label">数量</span>
              {{shopItem.qty}}
            </div>
            <div class="perform">
              <span class="label">金额</span>
              {{ `${['countBuyUse','countBoughtUse'].includes(shopItem.type)?(shopItem.good.employ_cardinal_price *Number(shopItem.useTimes)):shopItem.discountPriceAll}` }}
            </div>
          </div>
        </div>
        <div class="consume">
          <span class="label">消费金额</span>
          {{item.payment_balance}}
        </div>
        <div class="recharge">
          <span class="label">充值金额</span>
          {{item.prestore_price}}
        </div>
        <div class="balance">
          <span class="label">余额</span>
          {{item.member_balance_after_price}}
        </div>
      </div>
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
  watch: {

  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$api.wx.getMemberConsumeList(this.$route.query.id, {
        start_time: this.$route.query.startTime + ' 00:00:00',
        end_time: this.$route.query.endTime + ' 23:59:59'
      }).then(res => {
        this.list = res.data.order.map(v => {
          v.shopping_cart = v.shopping_cart ? JSON.parse(v.shopping_cart) : []
          return v
        })
      })
    }
  }
}

</script>
<style lang="less" scoped>
  .record {
    padding: 15px;

    .list {
      .item {
        padding: 5px 10px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.7);
        line-height: 30px;
        box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        background-color: white;

        .label {
          margin-right: 10px;
          position: relative;
          display: inline-block;
          width: 60px;
          text-align-last: justify;

          &::after {
            content: "：";
            position: absolute;
            right: -15px;
          }
        }

        >div {}

        .detail {
          margin: 5px 0;
          @border: 1px dashed rgba(0, 0, 0, 0.2);
          border-top: @border;
          border-bottom: @border;

          &-item {
            border-bottom: @border;

            .name {}

            .perform {}

            &:last-child {
              border-bottom: none;
            }
          }
        }

        &:first-child {
          ~.item {
            margin-top: 20px;
          }
        }
      }
    }

  }

</style>
