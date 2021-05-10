<template>
  <div>
    <div style="background-color: #fff; padding: 20px 0">
      <el-form ref="form" :model="form" label-width="160px">
        <el-form-item label="店铺名称">
          <el-input v-model="form.store_name" class="input" disabled></el-input>
        </el-form-item>
        <el-form-item label="logo">
          <el-upload
            :headers="header"
            name="img"
            :action="url"
            list-type="picture-card"
            :on-preview="(file) => handlePictureCardPreview(file, 'logo')"
            :limit="1"
            :on-success="(file) => getImgurl(file, 'logo')"
            :file-list="blFileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="logo.dialogVisible">
            <img width="100%" :src="logo.dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="小程序封面图">
          <el-upload
            :headers="header"
            name="img"
            :action="url"
            list-type="picture-card"
            :limit="5"
            :on-preview="(file) => handlePictureCardPreview(file, 'banner')"
            :file-list="banner.blFileList"
            :on-remove="(file, fileList) => delImg(file, fileList, 'xcx_event')"
            :on-success="(file) => getImgurl(file, 'xcx_event')"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="banner.dialogVisible">
            <img width="100%" :src="banner.dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="小程序作品图">
          <el-upload
            :headers="header"
            name="img"
            :action="url"
            list-type="picture-card"
            :limit="10"
            :on-preview="(file) => handlePictureCardPreview(file, 'xcx_expo')"
            :file-list="xcx_expo.blFileList"
            :on-remove="(file, fileList) => delImg(file, fileList, 'xcx_expo')"
            :on-success="(file) => getImgurl(file, 'xcx_expo')"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="xcx_expo.dialogVisible">
            <img width="100%" :src="xcx_expo.dialogImageUrl" alt="" />
          </el-dialog>
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
      logo: {
        dialogImageUrl: "",
        dialogVisible: false,
      },
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
      xcx_expo: {
        dialogImageUrl: "",
        dialogVisible: false,
        blFileList: [],
      },
    };
  },
  methods: {
    delImg(file, fileList, key) {
      let arr = [];
      fileList.forEach((item) => {
        arr.push(item.url.replace(URL.baseUrl.pro, ""));
      });
      this.form[key] = JSON.stringify(arr);
    },
    getImgurl(res, key) {
      console.log(res, key);
      if (key == "logo") {
        this.form[key] = res.data.uri;
        return;
      }
      let arr = JSON.parse(this.form[key]);
      arr.push(res.data.uri);
      this.form[key] = JSON.stringify(arr);
    },
    handlePictureCardPreview(file, key) {
      this[key].dialogImageUrl = file.url;
      this[key].dialogVisible = true;
    },
    onSubmit() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.form.days_off = [];
      this.day.forEach((item) => {
        if (item.status) {
          this.form.days_off.push(item.num);
        }
      });
      setShopData(this.form).then((res) => {
        loading.close();
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
        if (res.data.xcx_expo) {
          let xcx_expo = JSON.parse(res.data.xcx_expo);

          xcx_expo.forEach((item) => {
            this.xcx_expo.blFileList.push({
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
    console.log(this["banner"]);
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