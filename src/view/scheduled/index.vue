<template>
  <div>
    <div class="revisit">
      <div class="revisit-menu">
        <el-menu :default-active="navName[0].name" @select="handleSelect">
          <el-menu-item
            v-for="(item, index) in navName"
            :key="index + '1'"
            :index="item.name"
            :data-index="index"
          >
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="revisit-main">
        <component :is="componentName" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  getStaffList,
  getShopData,
  getScheduledList,
} from "@/api/scheduled.js";
import shop from "@/view/components/scheduled/shop";
import serve from "@/view/components/scheduled/serve";
import commodity from "@/view/components/scheduled/commodity";
import number from "@/view/components/scheduled/number";
import reservationList from "@/view/components/scheduled/reservationList";
import staff from "@/view/components/scheduled/staff";
import stay from "@/view/components/scheduled/stay";
import lookBoard from "@/view/components/scheduled/lookBoard";
export default {
  components: {
    shop,
    serve,
    commodity,
    number,
    reservationList,
    staff,
    stay,
    lookBoard,
  },
  data() {
    return {
      componentName: "reservationList",
      navName: [
        {
          name: "预约列表 ",
          pageName: "reservationList",
        },
        {
          name: "我的商铺 ",
          pageName: "shop",
        },
        {
          name: "服务项目 ",
          pageName: "serve",
        },
        {
          name: "商品管理 ",
          pageName: "commodity",
        },
        /*  {
          name: "计次管理 ",
          pageName: "number",
        }, */
        {
          name: "员工管理 ",
          pageName: "staff",
        },
        {
          name: "用户留言 ",
          pageName: "stay",
        },
        {
          name: "预约看板",
          pageName: "lookBoard",
        },
      ],
      staff: [],
      shopData: null,
      scheduledList: null,
    };
  },
  computed: {
    filterStaff: function () {
      let array = [];
      this.staff.forEach((item) => {
        if (!item.status) {
          item.gender ? (item.gender = "男") : (item.gender = "女");
          array.push(item);
        }
      });
      return array;
    },
  },
  methods: {
    getScheduledList() {
      getScheduledList().then((res) => {
        let tableData = [];
        for (var p1 in res.data) {
          tableData.push(res.data[p1]);
        }
        this.scheduledList = tableData
      });
    },
    handleSelect(key) {
      this.navName.forEach((item) => {
        if (item.name == key) {
          this.componentName = item.pageName;
        }
      });
    },
    getStaffList() {
      getStaffList().then((res) => {
        let tableData = [];
        for (var p1 in res.data) {
          tableData.push(res.data[p1]);
        }
        this.staff = tableData;
      });
    },
    getShopData() {
      getShopData().then((res) => {
        this.$set(this, "shopData", res.data);
      });
    },
  },
  created() {
    this.getShopData();
    this.getStaffList();
    this.getScheduledList();
  },
};
</script>
<style lang="less" scoped>
.revisit {
  position: relative;
  padding: 15px;
  display: flex;

  &-menu {
    flex-shrink: 0;
    width: 200px;
  }

  &-main {
    margin-left: 10px;
    // flex-grow: 1;
    width: calc(~"100% - 210px");
  }
}
</style>