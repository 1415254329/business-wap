<template>
  <div>
    <edit ref="edit"></edit>
    <el-button type="success" @click="addProject">新增预约</el-button>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="3"
        ><el-button
          :type="today.status ? 'primary' : 'info'"
          round
          @click="setStatus(1)"
          >今日</el-button
        ></el-col
      >
      <el-col :span="18">
        <el-popover placement="right" width="400" trigger="click">
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="选择日期"
            @change="setDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <el-button
            slot="reference"
            :type="!today.status ? 'primary' : 'info'"
            round
            @click="setStatus(0)"
            >选择日期</el-button
          >
        </el-popover>
      </el-col>
    </el-row>

    <el-table :data="filterData" style="width: 100%">
      <el-table-column prop="alias" label="预约日期">
        <template slot-scope="scope">
          <div>
            {{ scope.row.arrival_time.substring(0, 11) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="alias" label="预约人名称">
        <template slot-scope="scope">
          <div>
            {{ scope.row.alias }}{{ scope.row.member_id ? "(会员)" : "(散客)" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="预约人手机号"> </el-table-column>
      <el-table-column prop="staff_id" label="员工">
        <template slot-scope="scope">
          <div>
            {{
              staffList.find((item) => item.id == scope.row.staff_id).staff_name
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="arrival_time" label="预约时间">
        <template slot-scope="scope">
          <div>{{ scope.row.arrival_time.substring(11, 16) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="project_list" label="预约项目">
        <template slot-scope="scope">
          <div>{{ scope.row.project_list }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="预约状态">
        <template slot-scope="scope">
          <span>{{
            scope.row.status == 0
              ? "待处理"
              : scope.row.status == 1
              ? "同意"
              : scope.row.status == 2
              ? "已拒绝"
              : "已取消"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="success" size="small"
            >编辑</el-button
          >
          <!-- <el-button  type="success" size="small" @click="$router.push('./business/buy/good')"
            >到店</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getScheduledList, delStaff, getStaffList } from "@/api/scheduled.js";
import edit from "@/view/components/scheduled/comments/reservationedit";
import URL from "@/config/index.js";
export default {
  components: { edit },
  data() {
    return {
      date: "",
      today: {
        status: true,
      },
      propsId: 0,
      tableData: [],
      staffList: [],
    };
  },
  computed: {
    filterData: function () {
      let array = [];

      this.tableData.forEach((item, index) => {
        array.push(item);
      });
      return array;
    },
  },
  methods: {
    setStatus(isToday) {
      //点击选择时间
      if (isToday) {
        this.today.status = true;
        this.toDayList();
        return;
      }
      this.today.status = false;
    },
    setDate(e) {
      let year = parseInt(e.substring(0, 5));
      let month = parseInt(e.substring(5, 8));
      let day = parseInt(e.substring(8, 10));
      this.filterList(year, month, day);
    },
    //删除
    delItem(index) {
      let that = this;
      this.$Modal.confirm({
        title: "信息",
        content: "是否确认删除？",
        onOk() {
          delStaff(that.filterData[index]).then((res) => {
            if (!res.code) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              that.getScheduledList();
            }
          });
        },
      });
    },
    //获取列表
    getScheduledList() {
      getScheduledList().then((res) => {
        let tableData = [];
        for (var p1 in res.data) {
          tableData.push(res.data[p1]);
        }
        this.$parent.scheduledList = tableData;
        this.tableData = tableData;
        this.toDayList();
      });
    },
    toDayList() {
      let myDate = new Date();
      let nowYear = myDate.getFullYear();
      let nowMonth = myDate.getMonth() + 1;
      let nowDay = myDate.getDate();
      this.filterList(nowYear, nowMonth, nowDay);
    },
    filterList(year, month, day) {
      let list = this.$parent.scheduledList;
      let tabelData = [];
      list.forEach((item, index) => {
        if (
          parseInt(item.arrival_time.substring(0, 4)) == year &&
          parseInt(item.arrival_time.substring(5, 7)) == month &&
          parseInt(item.arrival_time.substring(8, 10)) == day
        ) {
          let type = typeof item.project_list;
          console.log(type);
          if (type == "string") {
            if (item.project_list == null) {
              item.project_list = {
                tenant_project: [],
              };
              return;
            }
            item.project_list = item.project_list;
          }
          tabelData.push(item);
        }
      });
      this.tableData = tabelData;
    },
    handleClick(e) {
      this.$refs.edit.blFileList = [];
      this.$refs.edit.isadd = false;
      this.$refs.edit.formData = e;
      this.$refs.edit.drawer = true;
      if (e.icon) {
        this.$refs.edit.blFileList = [
          {
            url: `${URL.baseUrl.pro}${e.icon}`,
          },
        ];
      }
    },
    addProject(e) {
      this.$refs.edit.isadd = true;
      this.$refs.edit.serveList = this.$parent.serveList;
      this.$refs.edit.formData = {
        alias: null,
        phone: null,
        member_id: null,
        staff_id: null,
        arrival_time: null,
        remake: null,
        body_count: null,
        project_list: {
          tenant_project: [],
        },
      };
      this.$refs.edit.drawer = true;
    },
    getStaffList() {
      getStaffList().then((res) => {
        let tableData = [];
        for (var p1 in res.data) {
          tableData.push(res.data[p1]);
        }
        this.$parent.staff = tableData;
        this.$set(this, "staffList", tableData);
      });
    },
  },
  created() {
    this.getScheduledList();
    this.getStaffList();
  },
};
</script>
<style>
</style>