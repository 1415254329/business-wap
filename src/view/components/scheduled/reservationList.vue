<template>
  <div>
    <edit ref="edit"></edit>
    <el-button type="success" @click="addProject">新增预约</el-button>
    <el-table :data="filterData" style="width: 100%">
      <el-table-column prop="alias" label="预约人名称"> </el-table-column>
      <el-table-column prop="phone" label="预约人手机号"> </el-table-column>
      <el-table-column prop="member_id" label="预约人会员id"> </el-table-column>
      <el-table-column prop="staff_id" label="员工"> </el-table-column>
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
import { getScheduledList, delStaff } from "@/api/scheduled.js";
import edit from "@/view/components/scheduled/comments/reservationedit";
import URL from "@/config/index.js";
export default {
  components: { edit },
  data() {
    return {
      propsId: 0,
      tableData: [],
    };
  },
  computed: {
    filterData: function () {
      let array = [];
      this.tableData.forEach((item) => {
        array.push(item);
      });
      return array;
    },
  },
  methods: {
    //删除
    delItem(index) {
      console.log(index);
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
        this.tableData = tableData;
      });
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
      this.$refs.edit.formData = {
        alias: null,
        phone: null,
        member_id: null,
        staff_id: null,
        arrival_time: null,
        remake: null,
        body_count: null,
        project_list: null,
      };
      this.$refs.edit.drawer = true;
    },
  },
  created() {
    this.getScheduledList();
  },
};
</script>
<style>
</style>