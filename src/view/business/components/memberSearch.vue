<template>
  <el-autocomplete
    v-model="searchText"
    size="medium"
    :fetch-suggestions="querySearchAsync"
    placeholder="请输入内容"
    @select="handleSelect"
    popper-class="search-suggestion"
    :popper-append-to-body="false"
    highlight-first-item
  >
    <template slot="prepend">
      <slot name="prepend"></slot>
    </template>
    <template slot="suffix">
      <slot name="suffix"></slot>
    </template>
    <template slot-scope="scope">
      <div v-if="scope.item.alias" class="item">
        <span class="ellipsis-1">{{ scope.item.alias }}</span>
        <span>{{ scope.item.phone || "暂无数据" }}</span>
        <span class="ellipsis-1">{{
          scope.item.serial_num || "暂无数据"
        }}</span>
        <span class="ellipsis-1">{{ scope.item.balance_price }}</span>
      </div>
      <div v-else class="empty">未搜索到相关数据</div>
    </template>
  </el-autocomplete>
</template>
<script>
import { member as memberSearch } from "@/utils/search";
export default {
  props: {
    showText: {
      type: Boolean,
      default: false,
    },
    memberList: {
      type: Array,
      default: () => [],
    },
  },
  data: function () {
    return {
      loading: false, // 会员列表是否已获取
      curMemberList: [],
      searchText: "",
      searchPopHead: "",
      searchMemberListShow: false,
      searchTimeout: 0,
    };
  },
  created() {
    if (!this.memberList.length) {
      this.getMemberList();
    } else {
      this.loading = true;
    }
  },
  mounted() {
    
    console.log(this)
    const listDom = document.querySelector(".el-autocomplete-suggestion__list");
    this.searchPopHead = document.createElement("li");
    this.searchPopHead.innerHTML = `<div class="item">
      <span>名称</span><span>手机号</span><span>卡号</span><span>余额</span>
      </div>`;
    listDom.appendChild(this.searchPopHead);
  },
  methods: {
    getMemberList() {
      this.$api.common.getMemberList().then((res) => {
        this.curMemberList =
          res.data && Object.values(res.data).filter((val) => val.status === 0);

        this.loading = true;
      });
    },
    querySearchAsync(queryString, cb) {
      if (!queryString) {
        let empty = [];
        cb(empty);
        return;
      }

      this.searchPopHead.style.display = "none"; // 自定义头在搜索时隐藏

      if (!this.loading) {
        // 如果会员数据仍在请求，延迟执行
        setTimeout(() => {
          this.querySearchAsync(queryString, cb);
        }, 200);
        return;
      }

      let memberList = this.memberList.length
        ? this.memberList
        : this.curMemberList;

      let results = queryString ? memberSearch(queryString, memberList) : [];

      if (!results.length) results[0] = {}; // 推入空数据，使建议弹窗显示

      clearTimeout(this.searchTimeout);

      this.searchTimeout = setTimeout(() => {
        this.searchPopHead.style.display = "block";
        cb(results);
      }, 200);
    },
    handleSelect(item) {
      if (this.showText) {
        this.searchText = item.alias;
      }
      this.$emit("selected", item);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.search-suggestion {
  width: 650px !important;
  // .el-scrollbar{
  //   height: 400px;
  //   .el-scrollbar__wrap{
  //       max-height: 400px;
  //   }
  // }

  .el-autocomplete-suggestion__list {
    li {
      @borderCommon: 1px solid rgba(0, 0, 0, 0.08);

      .item {
        display: grid;
        grid-template-columns: 150px 200px 150px 100px;

        span {
          padding: 0 10px;
          flex-shrink: 0;
          border-top: @borderCommon;
          border-left: @borderCommon;
          &:last-child {
            border-right: @borderCommon;
          }
        }
      }

      .empty {
        padding: 30px 0;
        border: @borderCommon;
        text-align: center;
      }

      &:first-child {
        span {
          font-size: 14px;
          font-weight: 700;
          color: rgba(0, 0, 0, 0.4);
        }
      }

      &:last-child {
        span {
          border-bottom: @borderCommon;
        }
      }
      &:hover {
        background-color: #73e9d1;
      }
    }
  }
}
</style>
