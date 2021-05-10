<template>
  <div>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      size="50%"
      @close="closeDrawer"
    >
      <el-form ref="formData" :model="formData" label-width="160px">
        <el-form-item label="封面图">
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
          <el-dialog :visible.sync="dialogVisible" :modal="false">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="formData.alias" class="input"></el-input>
        </el-form-item>
        <el-form-item label="售价">
          <el-input v-model="formData.sale_price" class="input"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="formData.category_alias"
            placeholder="请选择"
            filterable
            allow-create
            @change="changeSelect"
            :filter-method="search"
          >
            <el-option
              v-for="item in serveProject"
              :key="item.id"
              :value="item.id"
              :label="item.category_alias"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回访天数">
          <el-input v-model="formData.follow_time" class="input"></el-input>
        </el-form-item>
        <el-form-item label="小程序上架">
          <el-button
            :type="formData.xcx_online_switch ? 'success' : 'info'"
            @click="setSwitch(formData.xcx_online_switch)"
            >{{ formData.xcx_online_switch ? "已开启" : "已关闭" }}</el-button
          >
        </el-form-item>
        <el-form-item label="小程序显示价格售价">
          <el-input v-model="formData.xcx_sale_price" class="input"></el-input>
        </el-form-item>
        <el-button type="primary" @click="onSubmit" style="margin-left: 200px"
          >立即保存</el-button
        >
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
import { setServeProject, addServeList, getSortList } from "@/api/scheduled.js";
import { getToken } from "@/utils/auth";
import URL from "@/config/index.js";
export default {
  props: {},
  data() {
    return {
      isadd: false,
      drawer: false,
      formData: {},
      direction: "rtl",
      dialogImageUrl: "",
      dialogVisible: false,
      blFileList: [],
      header: {},
      serveProject: [],
    };
  },
  methods: {
    search(e) {
      this.formData.category_str = e;
    },
    changeSelect(e) {
      this.serveProject.forEach((item) => {
        if (item.id == e) {
          this.formData.category_id = item.id;
          //this.formData.category_str = item.alias
        }
      });
    },
    //修改图片地址
    getImgurl(res) {
      this.formData.cover = res.data.uri;
    },
    handlePictureCardPreview(file) {
      //替换图片路径
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    setSwitch(e) {
      //button状态
      if (e) {
        this.formData.xcx_online_switch = 0;
        return;
      }
      this.formData.xcx_online_switch = 1;
    },
    onSubmit() {
      if (this.isadd) {
        addServeList(this.formData).then((res) => {
          if (!res.code) {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.$parent.getServeList();
            this.getCloseDrawer();
          }
        });
        return;
      }
      setServeProject(this.formData).then((res) => {
        if (!res.code) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.getCloseDrawer();
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
    },
    getSortList() {
      getSortList().then((res) => {
        for (var p1 in res.data.tenant_project) {
          this.serveProject.push(res.data.tenant_project[p1]);
        }
      });
    },
  },
  created() {
    this.url = URL.baseUrl.pro + "/api/upload";
    this.getSortList();
    this.header = {
      Authorization: getToken(),
      os: "web",
    };
  },
};
</script>
<style>
</style>