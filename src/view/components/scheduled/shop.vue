<template>
  <div>
    <div style="background-color: #fff; padding: 20px 0">
      <el-form ref="form" :model="form" label-width="160px">
        <el-form-item label="logo">
          <el-upload
            :headers="header"
            name="img"
            :action="url"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :limit="1"
            :on-success="getImgurl"
            :file-list="blFileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="小程序封面图">
          <el-upload
            :headers="header"
            name="img"
            :action="url"
            list-type="picture-card"
            :limit="5"
            :on-preview="handlePictureCardPreview1"
            :file-list="banner.blFileList"
            :on-remove="delImg"
            :on-success="successBanner"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="banner.dialogVisible">
            <img width="100%" :src="banner.dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="店铺名称">
          <el-input v-model="form.store_name" class="input" disabled></el-input>
        </el-form-item>
        <el-form-item label="座机号">
          <el-input v-model="form.telephone" class="input"></el-input>
        </el-form-item>
        <el-form-item label="行业">
          <el-input v-model="form.trade" class="input"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.addr" class="input"></el-input>
        </el-form-item>
        <el-form-item label="开店时间">
          <el-time-picker
            :editable="false"
            v-model="form.business_start_hours"
            placeholder="请选择"
            value-format="HH:mm:ss"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="关店时间">
          <el-time-picker
            :editable="false"
            v-model="form.business_end_hours"
            placeholder="请选择"
            value-format="HH:mm:ss"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="休息日">
          <el-checkbox
            v-model="day[index].status"
            v-for="(item, index) in day"
            :key="index + 'day'"
            >{{ item.num }}号</el-checkbox
          >
        </el-form-item>
        <el-button type="primary" @click="onSubmit" style="margin-left: 200px"
          >立即修改</el-button
        >
      </el-form>
    </div>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { getShopData, setShopData } from "@/api/scheduled.js";
import URL from "@/config/index.js";
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      blFileList: [],
      form: {
        days_off: [],
        logo: null,
      },
      header: null,
      day: [],
      url: null,
      banner: {
        dialogImageUrl: "",
        dialogVisible: false,
        blFileList: [],
      },
    };
  },
  methods: {
    delImg(file, fileList) {
      let arr = [];
      fileList.forEach((item) => {
        arr.push(item.url.replace(URL.baseUrl.pro, ""));
      });
      this.form.xcx_event = JSON.stringify(arr);
    },
    successBanner(res, file, fileList) {
      let arr = JSON.parse(this.form.xcx_event);
      arr.push(res.data.uri);
      this.form.xcx_event = JSON.stringify(arr);
    },
    getImgurl(res) {
      this.form.logo = res.data.uri;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureCardPreview1(file) {
      this.banner.dialogImageUrl = file.url;
      this.banner.dialogVisible = true;
    },
    onSubmit() {
      this.form.days_off = [];
      this.day.forEach((item) => {
        if (item.status) {
          this.form.days_off.push(item.num);
        }
      });
      setShopData(this.form).then((res) => {
        if (!res.code) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
        }
      });
    },
    //获取info信息
    getShopData() {
      getShopData().then((res) => {
        this.forDay();
        if (res.data.days_off == "") {
          res.data.days_off = [];
        } else if (JSON.parse(res.data.days_off).length > 0) {
          res.data.days_off = JSON.parse(res.data.days_off);
          this.setMatch(res.data.days_off);
        }
        if (res.data.logo) {
          this.blFileList.push({
            url: `${URL.baseUrl.pro}${res.data.logo}`,
          });
        }
        if (res.data.xcx_event) {
          let arr = JSON.parse(res.data.xcx_event);

          arr.forEach((item) => {
            this.banner.blFileList.push({
              url: `${URL.baseUrl.pro}${item}`,
            });
          });
        }
        this.$set(this, "form", res.data);
      });
    },
    setMatch(e) {
      e.forEach((item) => {
        this.day.forEach((item1) => {
          if (item1.num == item) {
            item1.status = true;
          }
        });
      });
    },
    forDay() {
      for (let i = 1; i <= 31; i++) {
        this.day.push({
          status: false,
          num: i,
        });
      }
    },
  },
  created() {
    this.url = URL.baseUrl.pro + "/api/upload";
    this.header = {
      Authorization: getToken(),
      os: "web",
    };
    this.getShopData();
  },
};
</script>
<style>
.input {
  width: 200px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>