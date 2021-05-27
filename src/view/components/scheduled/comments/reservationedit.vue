<template>
  <div>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      size="50%"
      @close="closeDrawer"
    >
      <el-form v-if="!isadd" label-width="160px">
        <el-form-item label="预约状态">
          <el-select v-model="value" placeholder="请选择" @change="setStatus">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作理由" v-if="value == 2">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="reason"
          >
          </el-input>
        </el-form-item>
        <el-button type="primary" style="margin-left: 200px" @click="setReser"
          >立即修改</el-button
        >
      </el-form>

      <div class="scroll" v-if="isadd">
        <div style="margin-bottom: 20px">
          <el-row :gutter="20">
            <el-col :span="6" :offset="3"
              ><el-button
                :type="!reservation.index ? 'primary' : ''"
                round
                @click="clickReservation(0)"
                >会员预约</el-button
              ></el-col
            >
            <el-col :span="6"
              ><el-button
                :type="reservation.index ? 'primary' : ''"
                round
                @click="clickReservation(1)"
                >散客预约</el-button
              ></el-col
            >
          </el-row>
          <div class="demo-input-suffix flex labelBox">
            <div class="label flex">会员选择</div>
            <el-select
              v-model="reservation.value"
              placeholder="请选择"
              :disabled="reservation.index == 0 ? false : true"
              @change="setReservation"
            >
              <el-option
                v-for="(item, index) in vipList"
                :key="index"
                :label="item.alias"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>

        <el-form
          ref="formData"
          :model="formData"
          label-width="160px"
          :rules="rules"
        >
          <el-form-item label="预约人名称" prop="alias">
            <el-input v-model="formData.alias" class="input"></el-input>
          </el-form-item>
          <el-form-item label="预约人手机号" prop="phone">
            <el-input v-model="formData.phone" class="input"></el-input>
          </el-form-item>
          <el-form-item label="预约项目">
            <el-select
              v-model="serveVal"
              placeholder="请选择"
              @change="changeServe"
              :filter-method="search"
            >
              <el-option
                v-for="(item, index) in serveList"
                :key="index"
                :value="item.alias"
                :label="item.alias"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="员工">
            <el-select
              v-model="formData.staff_id"
              placeholder="请选择"
              @change="changeSelect"
              :filter-method="search"
            >
              <el-option
                v-for="item in staffList"
                :key="item.staff_name"
                :value="item.id"
                :label="item.staff_name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="到店时间">
            <el-date-picker
              v-model="formData.arrival_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formData.remake" class="input"></el-input>
          </el-form-item>
          <el-form-item label="人数">
            <el-input v-model="formData.body_count" class="input"></el-input>
          </el-form-item>
         <!--  <el-form-item label="会员ID">
            <el-input v-model="formData.member_id" class="input"></el-input>
          </el-form-item> -->
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
import {
  setScheduled,
  addScheduled,
  getDepartmentList,
  getVipList,
} from "@/api/scheduled.js";
import { getToken } from "@/utils/auth";
export default {
  props: {},
  data() {
    return {
      vipList: [],
      reservation: {
        index: 0,
        value: null,
        item: null,
      },
      value: "",
      reason: null,
      options: [
        {
          value: "1",
          label: "同意",
        },
        {
          value: "2",
          label: "拒绝",
        },
        {
          value: "3",
          label: "取消",
        },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      serveList: null,
      serveVal: null,
      isadd: false,
      drawer: false,
      formData: {},
      direction: "rtl",
      dialogImageUrl: "",
      dialogVisible: false,
      blFileList: [],
      header: {},
      serveProject: [],
      rules: {
        alias: [{ required: true, message: "请输入名称", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    staffList: function () {
      return this.$parent.$parent.filterStaff;
    },
  },
  methods: {
    setReservation(e) {

      let item = this.$parent.$parent.vipList.filter(
        (item, index) => item.id == e
      );
      this.reservation.item = item;
      this.formData.alias = item[0].alias;
      this.formData.phone = item[0].phone;
      this.formData.member_id = item[0].id;
      console.log(this.formData.member_id);
    },
    clickReservation(e) {
      this.reservation.index = e;
      if (e == 1) {
        this.reservation.value = null;
        this.formData.alias = null;
        this.formData.phone = null;
        this.formData.member_id = null;
      }
    },
    changeServe(e) {
      this.formData.project_list.tenant_project = [e];
    },
    setReser() {
      //修改预约
      let data = `status=${this.value}&reason=${this.reason}`;
      setScheduled(this.formData.id, data).then((res) => {
        if (!res.code) {
          this.$message({
            message: "更新成功",
            type: "success",
          });
          this.drawer = false;
        }
      });
    },
    setStatus(e) {
      console.log(this.value);
    },
    search(e) {
      this.formData.category_str = e;
    },
    changeSelect(e) {
      this.serveProject.forEach((item) => {
        if (item.id == e) {
          this.formData.category_id = item.id;
        }
      });
    },
    //修改图片地址
    getImgurl(res) {
      this.formData.icon = res.data.uri;
    },
    handlePictureCardPreview(file) {
      //替换图片路径
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    setSwitch(e, name) {
      //button状态
      if (e) {
        this.formData[`${name}`] = 0;
        return;
      }
      this.formData[`${name}`] = 1;
    },
    setParam(param) {
      let str = "?";
      for (var key in param) {
        str = `${str}&${key}=${param[key]}`;
      }
      str.replace("&", "");
      console.log(str);
      return str;
    },
    onSubmit(formData) {
      console.log(this.formData);
      this.$refs[formData].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.formData.gender == "女"
          ? (this.formData.gender = 0)
          : (this.formData.gender = 1);
        this.formData.project_list = JSON.stringify(this.formData.project_list);
        if (this.isadd) {
          addScheduled(this.setParam(this.formData)).then((res) => {
            if (!res.code) {
              this.$message({
                message: "添加成功",
                type: "success",
              });
              this.$parent.getScheduledList();
              this.getCloseDrawer();
            }
          });
          return;
        }
      });
    },
    //关闭抽屉
    getCloseDrawer() {
      this.drawer = false;
    },
    //关闭抽屉时
    closeDrawer() {
      this.blFileList = [];
      this.$parent.getScheduledList();
    },
    getDepartmentList() {
      getDepartmentList().then((res) => {
        this.serveProject = res.data;
      });
    },
    initList() {
      //初始化列表
      getVipList().then((res) => {
        let arr = res.data.filter((item, inex) => item.status == 0);
        this.vipList = arr;
        this.$parent.$parent.vipList = arr;
      });
    },
  },
  created() {
    this.initList();
    this.getDepartmentList();
    this.header = {
      Authorization: getToken(),
      os: "web",
    };
  },
};
</script>
<style>
.labelBox {
  align-items: center;
  margin-top: 20px;
}
.label {
  width: 140px;
  justify-content: flex-end;
  align-items: center;
  margin-right: 20px;
}
.flex {
  display: flex;
}
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