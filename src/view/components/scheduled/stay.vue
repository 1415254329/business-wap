<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4" class="backfff">
        <div class="center bold" style="padding-top: 20px">留言人员</div>
        <div class="scroll">
          <div
            v-for="(item, index) in user.isRead ? user.allList : user.filter"
            :key="index"
          >
            <div :class="['name', index == user.index ? 'active' : '']">
              {{ item.alias }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button
              :type="!user.isRead ? 'primary' : ''"
              round
              @click="setRead(false)"
              >未处理</el-button
            >
          </el-col>
          <el-col :span="4"
            ><el-button
              :type="user.isRead ? 'primary' : ''"
              round
              @click="setRead(true)"
              >已处理</el-button
            ></el-col
          >
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="4">
            <el-button round>昨日</el-button>
          </el-col>
          <el-col :span="4"><el-button round>今日</el-button></el-col>
          <el-col :span="4"><el-button round>明日</el-button></el-col>
        </el-row>

        <div class="ConBox">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="scroll1">
                <div></div>
              </div>
            </el-col>
            <el-col :span="18"> </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getUnreadList, getMenberId } from "@/api/scheduled.js";
export default {
  data() {
    return {
      user: {
        List: null,
        filter: [],
        allList: [],
        index: 0,
        isRead: false,
        con: {
          time: null,
          content: null,
        },
      },
    };
  },

  methods: {
    setRead(e) {
      this.user.isRead = e;
    },
    getUnreadList() {
      let filter = [];
      getUnreadList().then((res) => {
        this.user.List = res.data;
        res.data.forEach((item) => {
          let data = this.$parent.vipList.find((item1) => item1.id == item);
          if (data) {
            filter.push(data);
          }
        });
        this.user.filter = filter;
        getMenberId(filter[0].id).then((res) => {
          console.log(res, "详情");
        });
      });
    },
  },
  created() {
    this.user.allList = this.$parent.vipList;
    this.getUnreadList();
  },
};
</script>
<style lang="less">
.scroll1 {
  background-color: #fff;
  height: 720px;
  overflow-y: scroll;
}
.ConBox {
  margin-top: 20px;
  background-color: #fff;
}
.active {
  color: #409eff !important;
  border-bottom: 1px solid #409eff !important;
}
.name {
  text-align: center;
  line-height: 50px;
  border-bottom: 1px solid #f5f5f5;
}
.backfff {
  background-color: #fff;
}
.scroll {
  background-color: #fff;
  height: 800px;
  overflow-y: scroll;
}
.bold {
  font-weight: bold;
}
.center {
  text-align: center;
}
</style>