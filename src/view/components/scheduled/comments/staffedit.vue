<template>
  <div>
    <el-drawer :visible.sync="drawer" :direction="direction" size="50%">
      <div class="scroll">
        <el-form ref="formData" :model="formData" label-width="180px">
          <el-form-item label="提前可预约时间(分)">
            <el-input
              v-model="formData.ahead_time"
              class="input"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item label="每个时间可预约次数(分)">
            <el-input
              v-model="formData.eve_amount"
              class="input"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item label="提前可预约时间(分)">
            <el-radio-group v-model="formData.time_type">
              <el-radio :label="1">半点</el-radio>
              <el-radio :label="2">整点</el-radio>
              <el-radio :label="3">十分</el-radio>
              <el-radio :label="4">十五分</el-radio>
              <el-radio :label="5">二十分</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="可服务项目列表">
            <el-select
              v-model="isServerList"
              placeholder="请选择"
              value-key="id"
              multiple
          
              
            >
              <el-option
                v-for="item in filterServeData"
                :key="item.id + '1'"
                :label="item.alias"
                :value="item.alias"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="休息日列表">
            <el-date-picker
              v-model="offday.date"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <el-time-picker
              is-range
              v-model="offday.time"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              value-format="HH:mm"
              format="HH:mm"
            >
            </el-time-picker>
            <div>
              <el-tag
                v-for="(item, index) in offday.tags"
                :key="index + 'tag'"
                closable
              >
                {{ item }}
              </el-tag>
            </div>
            <div>
              <el-button type="primary" @click="addTag">添加</el-button>
            </div>
          </el-form-item>
          <el-form-item label="预约时间设置">
            <el-checkbox-group v-model="canTime">
              <el-checkbox
                v-for="(item, index) in week"
                :key="index + 'week'"
                :label="index"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
            <!-- 不可预约tag -->
            <div>
              不可预约时间:
              <el-tag
                v-for="(item, index) in reservationTime.tags"
                :key="index + 'time'"
                closable
                @close="delReservationTags(index)"
              >
                {{ item }}
              </el-tag>
            </div>
            <!-- /不可预约tag -->
            <div>
              <!-- 不可逾越星期 -->
              <el-select v-model="reservationTime.noweek" placeholder="请选择">
                <el-option
                  v-for="(item, index) in week"
                  :key="'noq' + index"
                  :label="item.name"
                  :value="item.index"
                >
                </el-option>
              </el-select>
              <!-- /不可逾越星期 -->
              <!-- 不可逾越时间 -->
              <el-time-picker
                v-model="reservationTime.notime"
                :picker-options="{
                  selectableRange: '00:00:00 - 23:59:59',
                }"
                value-format="HH:mm"
                format="HH:mm"
                placeholder="任意时间点"
              >
              </el-time-picker>
              <!-- /不可逾越时间 -->
            </div>
            <div>
              <el-button type="primary" @click="addNoDate">添加</el-button>
            </div>
          </el-form-item>
          <el-form-item label="签名">
            <el-input
              v-model="formData.motto"
              class="input"
              type="text"
            ></el-input>
          </el-form-item>
          <el-form-item label="个人简介">
            <el-input
              v-model="formData.brief"
              class="input"
              type="text"
            ></el-input>
          </el-form-item>
          <el-form-item label="显示职位">
            <el-input
              v-model="formData.position"
              class="input"
              type="text"
            ></el-input>
          </el-form-item>
          <el-button
            type="primary"
            @click="onSubmit('formData')"
            style="margin-left: 200px"
            >立即保存</el-button
          >
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { getServeList, getReservationSetting } from "@/api/scheduled.js";
export default {
  props: {},
  computed: {
    filterServeData: function () {
      let arr = [];
      this.serveList.forEach((item) => {
        if (!item.status) {
          arr.push(item);
        }
      });
      return arr;
    },
  },
  data() {
    return {
      isServerList: ["烫发"],
      offday: {
        date: null,
        time: null,
        tags: [],
        formOffDate: [],
      },
      reservationTime: {
        notime: null, //不可预约时间
        noweek: null, //不可预约星期
        indexList: [],
        tags: [], //不可预约时间tags
        hs: [],
        canRe: [0, 0, 0, 0, 0, 0, 0], //可预约时间设置
      },
      canTime: [],
      initweek: "0,0,0,0,0,0,0",
      period: [[], [], [], [], [], [], []],
      week: [
        {
          name: "星期天",
          status: 0,
          index: 0,
        },
        {
          name: "星期一",
          status: 0,
          index: 1,
        },
        {
          name: "星期二",
          status: 0,
          index: 2,
        },
        {
          name: "星期三",
          status: 0,
          index: 3,
        },
        {
          name: "星期四",
          status: 0,
          index: 4,
        },
        {
          name: "星期五",
          status: 0,
          index: 5,
        },
        {
          name: "星期六",
          status: 0,
          index: 6,
        },
      ],
      drawer: false,
      id: null,
      formData: {},
      direction: "rtl",
      serveList: [],
    };
  },

  methods: {
    onSubmit() {
      this.formData.rest_day_list.week = this.initweek; //rest_day_list.week
      this.reservationTime.indexList.forEach((item, index) => {
        this.period[item].push(this.reservationTime.hs[index]);
      });
      this.offday.formOffDate.forEach((item) => {
        this.formData.rest_day_list.date.push(item);
      }); //rest_day_list.date
      this.formData.rest_day_list = JSON.stringify(this.formData.rest_day_list);
      this.canTime.forEach((item) => {
        this.reservationTime.canRe[item] = 1;
      });
      this.formData.week = this.reservationTime.canRe; //formData.week
      this.formData.project_list = this.isServerList;
      let urlData = `${this.id}?`;
      for (let key in this.formData) {
        urlData = urlData + `&${key}=${this.formData[key]}`;
      }
      getReservationSetting(urlData).then((res) => {
        if (!res.code) {
          this.$message({
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    delReservationTags(index) {
      this.reservationTime.tags.splice(index, 1);
    },
    addNoDate() {
      this.reservationTime.tags.push(
        `${this.week[this.reservationTime.noweek].name} ${
          this.reservationTime.notime
        }`
      );
      this.reservationTime.indexList.push(this.reservationTime.noweek);
      this.reservationTime.hs.push(this.reservationTime.notime);
    },
    addTag() {
      this.offday.tags.push(
        `${this.offday.date} ${this.offday.time[0]}-${this.offday.time[1]}`
      );
      this.offday.formOffDate.push({
        date: this.offday.date,
        start: this.offday.time[0],
        end: this.offday.time[1],
      });
    },
    getServeList() {
      getServeList().then((res) => {
        for (var p1 in res.data) {
          if (res.data.hasOwnProperty(p1)) {
            res.data[p1].forEach((item) => {
              this.serveList.push(item);
            });
          }
        }
      });
    },

    //关闭抽屉
    getCloseDrawer() {
      this.drawer = false;
    },

    initData(e) {
      let canRe = e.week.split(",");
      canRe.forEach((item, index) => {
        if (item == "1") {
          this.canTime.push(index);
        }
      });
      this.formData.rest_day_list = e.rest_day_list;
      this.period = e.rest_day_list.period;
      e.rest_day_list.date.forEach((item) => {
        this.offday.tags.push(`${item.date} ${item.start}-${item.end}`);
      });
      e.rest_day_list.period.forEach((item, index) => {
        item.forEach((time) => {
          this.reservationTime.tags.push(`${this.week[index].name} ${time}`);
        });
      });
      this.isServerList = e.project_list
    },
  },
  created() {
    this.getServeList();
  },
};
</script>
<style>
.scroll {
  height: 800px;
  overflow-y: scroll;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
  background-color: #409eff;
}
</style>