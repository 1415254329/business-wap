<template>
  <div>
    <edit ref="edit"></edit>
    <el-dialog
      :visible.sync="dialogStatus"
      width="60%"
      :show-close="false"
      @close="closeDia"
    >
      <el-upload
        :headers="header"
        name="img"
        :action="url"
        list-type="picture-card"
        :limit="1"
        :on-success="getImgurl"
        :file-list="blFileList"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-button type="primary" @click="savePhoto">保存</el-button>
    </el-dialog>

    <el-table :data="filterData" style="width: 100%">
      <el-table-column prop="staff_name" label="名称"> </el-table-column>
      <el-table-column prop="gender" label="性别"> </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="setPhoto(scope.row)" type="success" size="small"
            >头像设置</el-button
          >
          <el-button @click="handleClick(scope.row)" type="success" size="small"
            >预约设置</el-button
          >
          <el-button
            :type="scope.row.xcx_online_switch ? 'success' : 'info'"
            size="small"
            @click="delItem(scope.row)"
            slot="reference"
            style="margin-left: 10px"
            >{{ scope.row.xcx_online_switch ? "已上架" : "已下架" }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { setStaff, getStaffSetting } from "@/api/scheduled.js";
import edit from "@/view/components/scheduled/comments/staffedit";
import URL from "@/config/index.js";
export default {
  components: { edit },
  data() {
    return {
      dialogStatus: false,
      propsId: 0,
      tableData: [],
      form: {},
      blFileList: [],
    };
  },
  computed: {
    filterData: function () {
      console.log(this.$parent.filterStaff);
      return this.$parent.filterStaff;
    },
  },
  methods: {
    savePhoto() {
      let obj = {
        department_id: this.form.position[0].department_id,
        position_id: this.form.position[0].id,
      };
      this.form.position = JSON.stringify([obj]);
      setStaff(this.form).then((res) => {
        if (!res.code) {
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.dialogStatus = false
        }
      });
    },
    getImgurl(res) {
      this.form.icon = res.data.uri;
    },
    setPhoto(info) {
      this.form = info;
      if (info.icon) {
        this.blFileList.push({
          url: `${URL.baseUrl.pro}${info.icon}`,
        });
      }

      this.dialogStatus = true;
    },
    closeDia() {
      this.blFileList = [];
    },
    //是否上下架
    delItem(info) {
      let status = info.xcx_online_switch;
      if (info.xcx_online_switch) {
        info.xcx_online_switch = 0;
      } else {
        info.xcx_online_switch = 1;
      }
      let obj = {
        department_id: info.position[0].department_id,
        position_id: info.position[0].id,
      };
      info.position = JSON.stringify([obj]);
      setStaff(info).then((res) => {
        if (!res.code) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          return;
        }
        info.xcx_online_switch = status;
      });
    },
    getList() {
      this.$parent.getStaffList();
    },
    handleClick(e) {
      this.$refs.edit.id = e.id;
      this.$refs.edit.offday.tags = [];
      this.$refs.edit.reservationTime.tags = [];
      this.$refs.edit.canTime = [];
      getStaffSetting(e.id).then((res) => {
        this.$refs.edit.formData = {
          ahead_time: null,
          eve_amount: null,
          time_type: 1,
          week: [],
          project_list: null,
          rest_day_list: {
            date: [],
            period: [[], [], [], [], [], [], []],
          },
          motto: null,
          brief: null,
          position: null,
          product: null,
        };
        if (res.data) {
          res.data.rest_day_list = JSON.parse(res.data.rest_day_list);
          this.$refs.edit.initData(res.data);
          this.$refs.edit.formData = res.data;
        }
      });
      this.$refs.edit.drawer = true;
    },
  },
  created() {
    this.url = URL.baseUrl.pro + "/api/upload";
    this.header = {
      Authorization: getToken(),
      os: "web",
    };
  },
};
</script>
<style>
.el-upload-list__item {
  transition: none !important;
}
</style>