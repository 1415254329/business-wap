<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        :label="item.date + `(${item.week})`"
        :name="item.day.toString()"
        v-for="(item, index) in tabNav"
        :key="index"
      ></el-tab-pane>
    </el-tabs>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="rowClass"
    >
      <el-table-column
        prop="time"
        label="姓名"
        align="center"
        width="150"
        style="background: #ffffff !important"
      >
        <el-table-column
          prop="time"
          label="时间段"
          align="center"
          width="150"
          style="background: #ffffff"
        >
        </el-table-column>
      </el-table-column>
      <el-table-column
        :label="item.staff_name"
        v-for="(item, index) in filterData"
        :key="index"
        prop="time"
        :label-class-name="item.id.toString()"
      >
        <template slot-scope="scope">
          <div
            v-if="
              scope.row.scheduledList.findIndex(
                (item) => item.staff_id == scope.column.labelClassName
              ) >= 0
            "
          >
            <el-popover trigger="hover" placement="top">
              <p>
                预约人:
                {{
                  scope.row.scheduledList[
                    scope.row.scheduledList.findIndex(
                      (item) => item.staff_id == scope.column.labelClassName
                    )
                  ].alias
                }}
              </p>
              <p>
                预约时间:
                {{
                  scope.row.scheduledList[
                    scope.row.scheduledList.findIndex(
                      (item) => item.staff_id == scope.column.labelClassName
                    )
                  ].arrival_time
                }}
              </p>
              <p>
                预约人手机号码:
                {{
                  scope.row.scheduledList[
                    scope.row.scheduledList.findIndex(
                      (item) => item.staff_id == scope.column.labelClassName
                    )
                  ].phone
                }}
              </p>
              <p>
                预约人状态:
                {{
                  scope.row.scheduledList[
                    scope.row.scheduledList.findIndex(
                      (item) => item.staff_id == scope.column.labelClassName
                    )
                  ].statusText
                }}
              </p>
              <div slot="reference" class="name-wrapper">
                <el-tag
                  size="medium"
                  effect="dark"
                  :type="
                    scope.row.scheduledList[
                      scope.row.scheduledList.findIndex(
                        (item) => item.staff_id == scope.column.labelClassName
                      )
                    ].statusTag
                  "
                >
                  {{
                    scope.row.scheduledList[
                      scope.row.scheduledList.findIndex(
                        (item) => item.staff_id == scope.column.labelClassName
                      )
                    ].alias
                  }}</el-tag
                >
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  computed: {
    filterData: function () {
      return this.$parent.filterStaff;
    },
  },
  data() {
    return {
      activeName: "",
      menu: [],
      tableData: [],
      tabNav: [],
      currentDateTime: {
        year: "",
        month: "",
        day: "",
        week: "",
        monthHaveDay: "",
      },
    };
  },
  methods: {
    //设置表头的颜色
    rowClass({ row, rowIndex }) {
      let obj = {
        background: "#dbf1dc",
        color: "#44b548",
      };
      return obj;
    },
    filterDayData(day) {
      let scheduledList = this.$parent.scheduledList;
      scheduledList.forEach((scheduled) => {
        scheduled["statusTag"] =
          scheduled.status == 0 || scheduled.status == 3
            ? "info"
            : scheduled.status == 1
            ? "success"
            : "danger";
        scheduled["statusText"] =
          scheduled.status == 0
            ? "待处理"
            : scheduled.status == 1
            ? "同意"
            : scheduled.status == 2
            ? "拒绝"
            : "取消";
        if (scheduled.arrival_time.substring(8, 10) == day) {
          let i = this.tableData.findIndex(
            (item) =>
              item.startHour ==
              parseInt(scheduled.arrival_time.substring(11, 13))
          );
          if (i >= 0) {
            this.tableData[i].scheduledList.push(scheduled);
          }
        }
      });
    },
    handleClick(tab, event) {
      this.tableData.forEach((scheduled) => {
        scheduled.scheduledList = [];
      });
      this.filterDayData(tab.paneName);
    },
    //获取时间列分组
    getTimeParagraph() {
      let startTimeString = this.$parent.shopData.business_start_hours;
      let endTimeString = this.$parent.shopData.business_end_hours;
      let startHour = parseInt(startTimeString.substring(0, 2));
      let endHour = parseInt(endTimeString.substring(0, 2));
      let endMinute = parseInt(endTimeString.substring(3, 5));
      if (endMinute != 0) endHour += 1;
      for (let i = startHour; i < endHour; i++) {
        this.tableData.push({
          startHour: startHour,
          endHour: endHour,
          endMinute: endMinute,
          time: `${startHour}:00-${startHour}:59`,
          scheduledList: [],
        });
        startHour += 1;
      }
    },
    //获取当前日期之后的20天
    getAfterDate() {
      let startYear = this.currentDateTime.year;
      let startMonth = this.currentDateTime.month;
      let startDay = this.currentDateTime.day;
      let startWeek = this.currentDateTime.week;
      let startMonthHaveDay = this.currentDateTime.monthHaveDay;
      for (let i = 1; i <= 20; i++) {
        if (i == 1) this.activeName = startDay.toString();
        let weekNum = this.getWeek(startYear, startMonth, startDay);
        let week;
        switch (weekNum) {
          case 0:
            week = "周日";
            break;
          case 1:
            week = "周一";
            break;
          case 2:
            week = "周二";
            break;
          case 3:
            week = "周三";
            break;
          case 4:
            week = "周四";
            break;
          case 5:
            week = "周五";
            break;
          case 6:
            week = "周六";
            break;
        }
        let obj = {
          date: `${startYear}-${
            startMonth / 10 < 1 ? `0${startMonth}` : `${startMonth}`
          }-${startDay / 10 < 1 ? `0${startDay}` : `${startDay}`}`,
          weekNum: weekNum,
          week: week,
          day: startDay,
          ristStatus: true,
        };
        this.tabNav.push(obj);
        if (startDay + 1 > startMonthHaveDay) {
          startDay = 1;
          if (startMonth == 12) {
            startMonth = 1;
            startYear += 1;
          } else {
            startMonth += 1;
            startMonthHaveDay = this.getMonthDay(startYear, startMonth - 1);
          }
        } else {
          startDay += 1;
        }
      }
    },
    //获取当前日期
    getCurrentDate() {
      let myDate = new Date();
      this.currentDateTime.year = myDate.getFullYear();
      this.currentDateTime.month = myDate.getMonth() + 1;
      this.currentDateTime.day = myDate.getDate();
      this.currentDateTime.week = myDate.getDay();
      this.currentDateTime.monthHaveDay = this.getMonthDay(
        myDate.getFullYear(),
        myDate.getMonth()
      );
      this.getAfterDate();
    },
    //指定年月有多少天
    getWeek(year, month, day) {
      let days = new Date(year, month - 1, day).getDay();
      return days;
    },
    //指定年月有多少天
    getMonthDay(year, month) {
      let days = new Date(year, month + 1, 0).getDate();
      return days;
    },
  },
  created() {
    this.getTimeParagraph();
    this.getCurrentDate();
    this.filterDayData(this.activeName);
  },
};
</script>
<style lang="less">
.el-table thead.is-group th {
  background: none;
  padding: 0px;
}
.el-table thead.is-group tr:first-of-type th:first-of-type,
.el-table thead.is-group tr:last-of-type th:first-of-type {
  background: #ffffff !important;
}
.el-table thead.is-group tr:first-of-type th:first-of-type {
  border-bottom: none;
}
.el-table thead.is-group tr:first-of-type th:first-of-type div.cell {
  text-align: right;
  color: #666;
}
.el-table thead.is-group tr:last-of-type th:first-of-type div.cell {
  text-align: left;
  color: #666;
}
.el-table thead.is-group tr:first-of-type th:first-of-type:before {
  content: "";
  position: absolute;
  width: 1px;
  // height: 55px;
  height: 120px; //自行调整
  top: 0;
  left: 0;
  background-color: grey;
  opacity: 0.2;
  display: block;
  // transform: rotate(-43deg);
  transform: rotate(-73deg); //自行调整
  -webkit-transform-origin: top;
  transform-origin: top;
}
.el-table thead.is-group tr:last-of-type th:first-of-type:before {
  content: "";
  position: absolute;
  width: 1px;
  // height: 60px;
  height: 120px; //自行调整
  bottom: 0;
  right: 0;
  background-color: grey;
  opacity: 0.2;
  display: block;
  // transform: rotate(-45deg);  //自行调整
  transform: rotate(-73deg);
  -webkit-transform-origin: bottom;
  transform-origin: bottom;
}
</style>