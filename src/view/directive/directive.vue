<template>
  <div class="app-container">
    <div class="func">
      <div class="search">
        <div class="search-container">
          <el-input size="medium" v-model="searchText" placeholder="请输入内容"></el-input>
          <el-button size="medium" @click="handleSearch" type="primary">搜索</el-button>
        </div>
      </div>
    </div>
    <div class="func">
      <div class="search">
        <el-select v-if="this.$store.getters.userInfo.master_id === 0" v-model="store" placeholder="请选择"
          :disabled="listLoading">
          <el-option label="全部店铺" value=""></el-option>
          <el-option v-for="item in storeList" :key="item.id" :label="item.store_name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="status" placeholder="请选择" :disabled="listLoading">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="memberRuleId" placeholder="请选择" :disabled="listLoading">
          <el-option label="全部会员等级" value=""></el-option>
          <el-option v-for="item in memberRuleList" :key="item.id" :label="item.alias" :value="item.id"></el-option>
        </el-select>
        <el-button @click="$router.push('/directive/add/0')" size="medium" type="primary">添加会员</el-button>
        <el-button @click="$router.push('/directive/stats/visit')" size="medium" type="primary">会员到店分析</el-button>
        <el-button @click="$router.push('/directive/stats/ranking')" size="medium" type="primary">排行榜</el-button>
        <el-button @click="$router.push('/directive/stats/debt')" size="medium" type="primary">欠款</el-button>
        <el-button @click="$router.push('/directive/stats/level')" size="medium" type="primary">会员等级分析</el-button>
      </div>
    </div>
    <el-table class="table-consume-custom" v-loading="listLoading"
      :data="curList.slice((pageVar.page-1)*pageVar.pageSize,pageVar.page*pageVar.pageSize)"
      cell-class-name="bonusCellClass" fit border>
      <el-table-column align="center" label="会员姓名" width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.alias }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员等级">
        <template slot-scope="scope">{{ scope.row.hierarchyName }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员卡号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.serial_num }}</template>
      </el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.gender === 0">女</span>
          <span v-else-if="scope.row.gender === 1">男</span>
          <span v-else>保密</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户余额">
        <template slot-scope="scope">{{ scope.row.balance_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="赠金">
        <template slot-scope="scope">{{ scope.row.giving_price }}</template>
      </el-table-column>
      <el-table-column align="center" label="积分">
        <template slot-scope="scope">{{ scope.row.integral }}</template>
      </el-table-column>
      <el-table-column align="center" label="备注" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.memo}}</template>
      </el-table-column>
      <el-table-column align="center" label="负责人">
        <template slot-scope="scope">{{ scope.row.staffName }}</template>
      </el-table-column>
      <el-table-column align="center" label="店铺来源" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.storeName }}</template>
      </el-table-column>
      <el-table-column align="center" label="注册时间" width="155">
        <template slot-scope="scope">{{ scope.row.regist_time }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="325">
        <template slot-scope="scope">
          <div v-if="status===0" class="normal">
            <el-button @click="$router.push(`/directive/add/${scope.row.id}`)" type="primary" size="small">编辑
            </el-button>
            <el-button @click="handleViewDebtOrder(scope.row) " type="success" size="small">还款记录</el-button>
            <el-button @click="handleViewOrder(scope.row) " type="success" size="small">交易记录</el-button>
            <el-button @click="handleDelete(scope.row.id,scope.$index)" type="danger" size="small">删除</el-button>
          </div>
          <div v-else-if="status===1">
            <el-button @click="handleEdit(scope.row,scope.$index)" type="success" size="small">恢复</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pageVar.page" :page-sizes="pageVar.pageSizes" :page-size="pageVar.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="pageVar.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
    <div v-for="(item,index) in memberStats" :key="index" class="stats">
      <span v-if="item.tenant_id == $store.getters.userInfo.id">
        {{`本店会员数量：${item.count || 0}，
        总余额：${item.balance_price || 0}，
        总赠金：${item.giving_price || 0}，
        总欠款：${item.arrears_price || 0}`}}
      </span>
      <span v-else-if="$store.getters.userInfo.master_id == 0">
        {{`分店名称：${item.storeName}，
        会员数量：${item.count || 0}，
        总余额：${item.balance_price || 0}，
        总赠金：${item.giving_price || 0}，
        总欠款：${item.arrears_price || 0}`}}
      </span>
    </div>
    <span></span>
    <Modal v-model="orderShow" width="1200px">
      <OrderMember :show="orderShow" :memberId="curMemberId" />
      <span slot="footer"></span>
    </Modal>
    <Modal v-model="debtOrderShow" width="1200px">
      <OrderDebt :show="debtOrderShow" :memberId="curMemberId" />
      <span slot="footer"></span>
    </Modal>
  </div>
</template>

<script>
import OrderMember from '../business/components/orderMember'
import OrderDebt from '../business/components/orderDebt'
import {
  member as memberSearch
} from '@/utils/search'
export default {
  components: {
    OrderMember,
    OrderDebt
  },
  data () {
    return {
      debtOrderShow: false,
      orderShow: false,
      curMemberId: 0,
      isSearch: false,
      searchText: '',
      listLoading: false,
      list: [],
      curList: [],
      staffList: [],

      memberStats: [],
      pageVar: {
        page: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50]
      },
      memberRuleId: '',
      memberRuleList: [],
      status: 0,
      statusList: [{
        value: 0,
        label: '正常'
      },
      {
        value: 1,
        label: '封禁'
      },
      {
        value: 2,
        label: '全部'
      }
      ],
      store: '',
      storeList: []
    }
  },
  watch: {
    store () {
      this.handleFilterChange()
    },
    status () {
      this.handleFilterChange()
    },
    memberRuleId () {
      this.handleFilterChange()
    }
  },
  created () {
    this.getList()
    if (this.$store.getters.userInfo.master_id === 0) {
      this.getStoreList()
    }
  },
  methods: {
    getList () {
      this.listLoading = true

      let getMemberList = this.$api.common.getMemberList().then((res) => {
        let list = (res.data ? Object.values(res.data) : [])
        if (this.$store.getters.userInfo.master_id !== 0) {
          list = list.filter(v => {
            let storeId = v.tenant_id
            if (storeId === this.$store.getters.userInfo.id) {
              return true
            }
          })
        }
        return list
      })

      this.$api.common.getStaffList().then(res => {
        this.staffList = Object.values(res.data)
      })

      setTimeout(() => { // 延迟执行
        this.$store.dispatch('store/refreshStoreList').then(() => {
          getMemberList.then((l) => {
            if (!l.length) {
              this.listLoading = false
            }
            this.memberRuleList = this.$store.getters.userInfo.member_rule && Object.values(JSON.parse(
              this.$store.getters.userInfo.member_rule))
            l.map((v, i) => {
              this.memberRuleList.some(rv => {
                if (rv.id == v.hierarchy) {
                  v.hierarchyName = rv.alias
                  return true
                }
              })
              this.$store.dispatch('store/findStore', v.tenant_id).then((sv) => {
                v.storeName = sv && sv.store_name
              }).then(() => {
                v.tenant_staff_id && this.staffList.find(sv => {
                  if (sv.id == v.tenant_staff_id) {
                    v.staffName = sv.staff_name
                  }
                })
                if (i === l.length - 1) {
                  this.list = l
                  this.curList = this.list.filter((val) => val.status === 0)
                  this.pageVar.total = this.curList.length
                  this.listLoading = false
                }
              })
            })
          })
          this.$api.member.getMemberVisit().then(res => {
            // TODO 之后获取一次直接存储在全局中，避免重复获取重复数据
            // this.$store.commit('member/setStats', res.data)

            res.data.statistical && res.data.statistical.map((v, i) => {
              this.$store.dispatch('store/findStore', v.tenant_id).then((sv) => {
                v.storeName = sv && sv.store_name
                if (v.master_id === 0) {
                  this.memberStats.splice(0, 0, v)
                } else {
                  this.memberStats.push(v)
                }
              })
            })
          })
        })
      })
    },
    getStoreList () {
      this.$api.store.getStoreList().then(res => {
        this.storeList = res.data
      })
    },
    handleSearch () {
      this.handleFilterChange() // 重置curList以搜索
      let searchText = this.searchText
      let memberList = this.curList
      this.curList = searchText ? memberSearch(searchText, memberList) : memberList
      this.pageVar.total = this.curList.length
    },
    handleEdit (item, index) {
      item.status = 0
      this.$api.member.editMember(item).then((res) => {
        this.loading = false
        this.curList.splice(index, 1)
        this.$Message.success('编辑成功')
      })
    },
    handleViewDebtOrder (item) {
      this.curMemberId = item.id
      this.debtOrderShow = true
    },
    handleViewOrder (item) {
      this.curMemberId = item.id
      this.orderShow = true
    },
    handleFilterChange () {
      this.curList = this.list.filter(v => {
        console.log(v.hierarchy, this.memberRuleId, v.hierarchy === this.memberRuleI)
        let statusJudge = (this.status === 0 || this.status === 1) ? v.status === this.status : 1
        let storeJudge = this.store ? v.tenant_id === this.store : 1
        let memberRuleJudge = this.memberRuleId ? Number(v.hierarchy) === this.memberRuleId : 1
        return statusJudge && storeJudge && memberRuleJudge
      })
      this.pageVar.page = 1
      this.pageVar.total = this.curList.length
    },
    handleDelete (id, index) {
      this.$prompt('请输入密码确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({
        value
      }) => {
        if (value !== this.$store.state.user.password) {
          this.$message({
            type: 'danger',
            message: '密码错误'
          })
          return
        }
        this.$api.member.delMember(id).then((res) => {
          this.curList[index].status = 1
          this.curList.splice(index, 1)
          this.$Message.info('删除成功')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },

    handleSizeChange (val) {
      this.pageVar.pageSize = val
      this.pageVar.page = 1
    },
    handleCurrentChange (val) {
      this.pageVar.page = val
    }
  }
}

</script>

<style lang="less" scoped>
  /deep/.ivu-modal-body {
    padding: 50px 16px 16px 16px;
  }

  .stats {
    padding-left: 10px;
    font-size: 16px;
  }

  .row {
    margin: 10px 0;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .positionList {
    display: flex;
    flex-direction: column;

    &-item {
      display: flex;

      .title {
        flex-shrink: 0;
        display: block;
        margin-top: 5px;
        width: 50px;
        text-align: right;
      }
    }

    .staffList {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      padding-left: 10px;
      width: 100%;

      &-item {
        margin: 0 5px;
        padding: 5px 20px;
        border-radius: 20px;
        transition: all .3s;

        &:hover {
          cursor: pointer;
          color: white;
          background: rgba(40, 140, 240, 0.5);
        }
      }
    }
  }

  /deep/ .ivu-modal-footer {
    padding: 0;
  }

</style>
