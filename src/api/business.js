import axios from '@/libs/api.request'

// 获取商户列表
export function getStoreList () {
  return axios.request({
    url: '/api/tenant/all',
    method: 'get'
  })
}

// 获取最后一条订单No
export function getLastOrderNo () {
  return axios.request({
    url: '/api/orders/last_order_no',
    method: 'GET'
  })
}

// 创建订单
export function addOrder (data) {
  return axios.request({
    url: '/api/orders',
    method: 'POST',
    data
  })
}

// 获取订单列表
export function getOrderList (params) {
  return axios.request({
    url: '/api/orders',
    method: 'GET',
    params
  })
}

// 删除指定订单
export function delOrder (id) {
  return axios.request({
    url: '/api/orders/' + id,
    method: 'Delete'
  })
}

// 分类编辑
export function editCategory (id, data) {
  return axios.request({
    url: '/api/category/' + id,
    method: 'PUT',
    data
  })
}

// 获取提成
export function getBonus (params) {
  return axios.request({
    url: '/api/bonus',
    method: 'GET',
    params
  })
}

// 获取报表统计
export function getReportStats (params) {
  return axios.request({
    url: '/api/collect/patrol',
    method: 'GET',
    params
  })
}
// 获取每日报表统计
export function getDailyReportStats (params) {
  return axios.request({
    url: '/api/collect/patrol4day',
    method: 'GET',
    params
  })
}
// 获取利润报表统计
export function getProfitReportStats (params) {
  return axios.request({
    url: '/api/collect/profits4day',
    method: 'GET',
    params
  })
}

// 获取订单统计
export function getOrderStats (params) {
  return axios.request({
    url: '/api/collect/order',
    method: 'GET',
    params
  })
}

// 获取支付方式统计
export function getPaymentStats (params) {
  return axios.request({
    url: '/api/collect/payment',
    method: 'GET',
    params
  })
}

// 获取分类统计
export function getCategoryStats (params) {
  return axios.request({
    url: '/api/collect/content',
    method: 'GET',
    params
  })
}

// 获取商品销售统计
export function getCommodityStats (params) {
  return axios.request({
    url: '/api/collect/commodity',
    method: 'GET',
    params
  })
}

// 获取服务项目销售统计
export function getServiceStats (params) {
  return axios.request({
    url: '/api/collect/project',
    method: 'GET',
    params
  })
}

// 获取计次项目销售统计
export function getMeterStats (params) {
  return axios.request({
    url: '/api/collect/meter',
    method: 'GET',
    params
  })
}

// 获取所有店铺报表统计
export function getShopReportStats (params) {
  return axios.request({
    url: '/api/collect/patrol_all_business',
    method: 'GET',
    params
  })
}

// 获取会员跨店报表统计
export function getAcrossReportStats (params) {
  return axios.request({
    url: '/api/collect/member/across',
    method: 'GET',
    params
  })
}

// 积分兑换
export function integralExchange (id, data) {
  return axios.request({
    url: '/api/integral/exchange/' + id,
    method: 'POST',
    data
  })
}

// 获取项目回访列表
export function getProjectRevisitList (params) {
  return axios.request({
    url: '/api/orders/project/follow',
    method: 'GET',
    params
  })
}

// 设置项目回访状态为已访问
export function projectRevisitChange (id) {
  return axios.request({
    url: '/api/orders/project/follow/' + id,
    method: 'PUT'
  })
}

// 获取计次回访列表
export function getMeterRevisitList (params) {
  return axios.request({
    url: '/api/orders/meter/follow',
    method: 'GET',
    params
  })
}
// 设置计次回访状态为已访问
export function meterRevisitChange (id) {
  return axios.request({
    url: '/api/orders/project/follow/' + id,
    method: 'PUT'
  })
}

// 获取会员生日回访列表
export function getMemberBirthdayRevisitList (params) {
  return axios.request({
    url: '/api/member/birthday',
    method: 'GET',
    params
  })
}
// 设置会员生日回访为已访问
export function memberBirthdayRevisitChange (id) {
  return axios.request({
    url: '/api/member/birthday' + id,
    method: 'PUT'
  })
}

// 获取店铺收支列表
export function getCashFlowList (params) {
  return axios.request({
    url: '/api/disburse',
    method: 'GET',
    params
  })
}

// 创建店铺收支
export function createCashFlow (data) {
  return axios.request({
    url: '/api/disburse',
    method: 'POST',
    data
  })
}

// 修改店铺收支
export function changeCashFlow (data) {
  return axios.request({
    url: '/api/disburse/' + data.id,
    method: 'PUT',
    data
  })
}

// 删除店铺收支
export function deleteCashFlow (id) {
  return axios.request({
    url: '/api/disburse/' + id,
    method: 'DELETE'
  })
}
