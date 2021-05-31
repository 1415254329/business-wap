<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="3" class="backfff">
        <div class="center bold" style="padding-top: 20px">留言人员</div>
        <div class="scroll">
          <div
            v-for="(item, index) in user.filter"
            :key="index"
            @click="setUser(index)"
          >
            <div :class="['name', index == user.index ? 'active' : '']">
              <div>{{ item.alias }}</div>
              <div>{{ item.phone }}</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="21">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-date-picker
              :default-time="['00:00:00', '23:59:59']"
              v-model="value1"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd"
              @change="setDate"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="12">
            <el-autocomplete
              class="inline-input"
              v-model="state2"
              :fetch-suggestions="querySearch"
              placeholder="请输入会员名"
              :trigger-on-focus="false"
              value-key="alias"
              @select="searchVipName"
            ></el-autocomplete>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">
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
        <div class="ConBox">
          <el-row>
            <el-col :span="4">
              <div class="scroll1">
                <div
                  v-for="(item, index) in user.speakList"
                  :key="index"
                  :class="[
                    'userSpeak',
                    index == user.index1 ? 'speakActive' : '',
                  ]"
                  @click="setSpeaKList(index)"
                >
                  第{{ index + 1 }}个留言
                </div>
              </div>
            </el-col>
            <el-col :span="20">
              <div style="margin: 20px" v-if="user.speakList.length">
                <div>
                  留言时间：{{ user.speakList[user.index1].create_time }}
                </div>
                <div>留言内容：{{ user.speakList[user.index1].context }}</div>
                <div style="text-align: right">
                  <el-button
                    type="primary"
                    round
                    @click="clickButton(user.speakList[user.index1].id)"
                    v-if="!user.speakList[user.index1].read"
                    >回复</el-button
                  >
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 指定用户留言 -->
    <el-dialog :title="Specify.name" :visible.sync="Specify.status">
      <div class="dialog">
        <div class="scrollDialog">
          <div v-for="(item, index) in Specify.list" :key="index" class="List">
            <div>日期:{{ item.create_time }}</div>
            <div>留言内容:{{ item.context }}</div>
            <div class="flex flexend">
              <el-button
                type="primary"
                round
                @click="clickReply(item.member_id)"
                >回复</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- /指定用户留言 -->
  </div>
</template>
<script>
import {
  getUnreadList,
  getMenberId,
  getFilterNews,
  getInRead,
  sendNewsToVip,
} from "@/api/scheduled.js";
export default {
  data() {
    return {
      Specify: {
        status: false,
        list: {},
        name: null,
        value: null,
      },
      state2: null,
      value1: null,
      allShow: true,
      user: {
        speakList: [],
        filter: [],
        allList: [],
        index: 0,
        index1: 0,
        isRead: false,
        con: {
          time: null,
          content: null,
        },
      },
      needBjo: {
        read: 0,
        start_time: null,
        end_time: null,
      },
    };
  },
  methods: {
    clickReply(id, fn) {
      //回复消息
      this.$prompt("请输入内容", "内容", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        sendNewsToVip({
          member_id: id,
          context: value,
        }).then((res) => {
          if (!res.code) {
            this.$message({
              message: "发送成功",
              type: "success",
            });
            if (fn) fn();
          }
        });
      });
    },
    searchVipName(e) {
      //搜索会员
      console.log(e);

      getMenberId(e.id).then((res) => {
        if (res.data == null) {
          this.$message("该用户没有留言");
          return;
        }
        let list = res.data.filter((item) => item.point_type == 0);
        console.log(list, 192);
        this.Specify.list = list;
        this.Specify.name = e.alias;
        this.Specify.status = true;
        console.log(res, "消息记录");
      });
    },
    querySearch(queryString, cb) {
      var restaurants = this.user.allList;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.alias.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    setDate(e) {
      //修改时间
      this.needBjo.read = this.user.isRead ? 1 : 0;
      if (e != null) {
        this.needBjo.start_time = e[0];
        this.needBjo.end_time = e[1];
        this.getFilterNews();
        return;
      }
      this.needBjo.start_time = null;
      this.needBjo.end_time = null;
      if (this.user.isRead) {
        this.getFilterNews();
        return;
      }
      this.getUnreadList();
    },
    clickButton(id) {
      let that = this;
      //点击已读
      let fn = function () {
        getInRead({
          ids: id,
        }).then((res) => {
          if (!res.code) {
            that.getUnreadList();
            return;
          }
          this.$message.error("已读失败");
        });
      };
      this.clickReply(id, fn);
    },
    getFilterNews() {
      //条件拉取人员
      let obj = {};
      obj.read = this.needBjo.read;
      if (this.needBjo.start_time) {
        obj.start_time = this.needBjo.start_time;
        obj.end_time = this.needBjo.end_time;
      }
      let urlData = "?";
      for (let key in obj) {
        if (key == "read") {
          urlData = urlData + `${key}=${obj[key]}`;
        } else {
          urlData = urlData + `&${key}=${obj[key]}`;
        }
      }
      getFilterNews(urlData).then((res) => {
        if (!res.code) {
          this.user.filter = [];
          this.user.speakList = [];
          let filter = [];
          if (!this.user.isRead) {
            this.allShow = res.data.length ? true : false;
          }
          res.data.forEach((item) => {
            let data = this.$parent.vipList.find((item1) => item1.id == item);
            if (data) {
              filter.push(data);
            }
          });
          this.$set(this.user, "filter", filter);
          this.getDetails(filter);
        }
      });
    },
    getUnreadList() {
      //未处理消息人员处理
      getUnreadList().then((res) => {
        let filter = [];

        this.allShow = res.data.length ? true : false;
        res.data.forEach((item) => {
          let data = this.$parent.vipList.find((item1) => item1.id == item);
          if (data) {
            filter.push(data);
          }
        });
        this.user.filter = filter;
        this.getDetails(filter);
      });
    },
    setSpeaKList(e) {
      this.user.index1 = e;
      this.getNoReadList();
    },
    setUser(e) {
      //修改当前人员
      this.user.index = e;
      this.user.index1 = 0;
      this.getNoReadList();
    },
    setRead(e) {
      //修改已读未读
      this.user.speakList = [];
      this.user.isRead = e;
      this.user.index = 0;
      this.getNoReadList();
    },
    getNoReadList() {
      //获取已读未读列表
      this.needBjo.read = this.user.isRead ? 1 : 0;
      if (this.user.isRead) {
        this.getFilterNews();
      } else {
        if (this.needBjo.start_time) {
          this.getFilterNews();
          return;
        }
        this.getUnreadList();
      }
    },
    getDetails(filter) {
      if (filter.length) {
        let id = filter[this.user.index].id;
        getMenberId(id).then((res) => {
          if (res.data) {
            let arr = [];
            res.data.forEach((item, index) => {
              if (!item.read == !this.user.isRead && item.point_type == 0) {
                arr.push(item);
              }
            });
            this.$set(this.user, "speakList", arr);
            return;
          }
          this.$set(this.user, "speakList", []);
        });
      }
      this.$set(this.user, "speakList", []);
    },
    getDay(num, str) {
      var today = new Date();
      var nowTime = today.getTime();
      var ms = 24 * 3600 * 1000 * num;
      today.setTime(parseInt(nowTime + ms));
      var oYear = today.getFullYear();
      var oMoth = (today.getMonth() + 1).toString();
      if (oMoth.length <= 1) oMoth = "0" + oMoth;
      var oDay = today.getDate().toString();
      if (oDay.length <= 1) oDay = "0" + oDay;
      return oYear + str + oMoth + str + oDay;
    },
  },
  created() {
    this.user.allList = this.$parent.vipList;
    this.getUnreadList();
  },
};
</script>
<style lang="less">
@import "css.css";
.scrollDialog {
  height: 550px;
  overflow-y: scroll;
}
.dialog {
  height: 60vh;
  .List {
    background-color: #f5f5f5;
    padding: 20px;
    border-bottom: 4px solid #fff;
  }
  .date {
    font-size: 30px;
  }
}
.speakActive {
  color: #409eff !important;
  border-bottom: 1px solid #409eff !important;
}
.userSpeak {
  text-align: center;
  line-height: 60px;
  height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.scroll1 {
  background-color: #fff;
  height: 720px;
  overflow-y: scroll;
  border-right: 1px solid #f5f5f5;
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