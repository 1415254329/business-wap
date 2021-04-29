<template>
  <div>
    <edit ref="edit"></edit>
    <el-button type="success" @click="addProject">新增项目</el-button>
    <el-table :data="filterData" style="width: 100%">
      <el-table-column prop="alias" label="名称"> </el-table-column>
      <el-table-column prop="category_alias" label="分类"> </el-table-column>
      <el-table-column prop="sale_price" label="售价"> </el-table-column>
      <el-table-column prop="follow_time" label="回访天数"> </el-table-column>
      <el-table-column prop="xcx_sale_price" label="小程序售价">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="success" size="small"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="delItem(scope.$index)"
            slot="reference"
            style="margin-left: 10px"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getServeList, delServeProject } from "@/api/scheduled.js";
import edit from "@/view/components/scheduled/comments/edit";
import URL from "@/config/index.js"
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
        if (!item.status) {
          array.push(item);
        }
      });
      return array;
    },
  },
  methods: {
    //删除
    delItem(index) {
      console.log(index)
      let that = this;
      this.$Modal.confirm({
        title: "信息",
        content: "是否确认删除？",
        onOk() {
          delServeProject(that.filterData[index]).then((res) => {
            if (!res.code) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              that.getServeList();
            }
          });
        },
      });
    },
    //获取列表
    getServeList() {
      getServeList().then((res) => {
        let tableData = [];
        for (var p1 in res.data) {
          if (res.data.hasOwnProperty(p1)) {
            res.data[p1].forEach((item) => {
              tableData.push(item);
            });
          }
        }
        this.tableData = tableData;
      });
    },
    handleClick(e) {
      this.$refs.edit.blFileList = [];
      this.$refs.edit.isadd = false;
      this.$refs.edit.formData = e;
      this.$refs.edit.drawer = true;
      if (e.cover) {
        this.$refs.edit.blFileList = [
          {
            url: `${URL.baseUrl.pro}${e.cover}`,
          },
        ];
      }
    },
    addProject(e) {
      this.$refs.edit.isadd = true;
      this.$refs.edit.formData = {
        alias: null,
        follow_time: null,
        category_id: null,
        category_str: null,
        member_price: null,
        serial_num: null,
        bar_code: null,
        sale_price: null,
        xcx_online_switch: 0,
        xcx_sale_price: null,
        cover: null,
      };
      this.$refs.edit.drawer = true;
    },
  },
  created() {
    this.getServeList();
  },
};
</script>
<style>
</style>