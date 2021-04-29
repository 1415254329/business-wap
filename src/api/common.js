import axios from '@/libs/api.request'

// 发送消息记录
export function getSendMessageList () {
  return axios.request({
    url: '/api/send',
    method: 'get'
  })
}
// 发送消息
export function sendMessage (data) {
  return axios.request({
    url: '/api/send',
    method: 'post',
    data
  })
}

// 获取会员列表
export function getMemberList () {
  return axios.request({
    url: '/api/member',
    method: 'get'
  })
}
// 获取员工列表
export function getStaffList () {
  return axios.request({
    url: '/api/staff',
    method: 'get'
  })
}

// 获取积分列表
export function getIntegral () {
  return axios.request({
    url: '/api/integral',
    method: 'get'
  })
}

// 获取项目列表
export function getProject () {
  return axios.request({
    url: '/api/project',
    method: 'get'
  })
}

// 获取分类列表
export function getCategory () {
  return axios.request({
    url: '/api/category',
    method: 'get'
  })
}

// 获取商品列表
export function getCommodity () {
  return axios.request({
    url: '/api/commodity',
    method: 'get'
  })
}

// 获取计次服务
export function getMeter () {
  return axios.request({
    url: '/api/meter',
    method: 'get'
  })
}
// 获取耗品列表
export function getWastage () {
  return axios.request({
    url: '/api/wastage',
    method: 'get'
  })
}
// 获取优惠券列表
export function getCoupon () {
  return axios.request({
    url: '/api/coupon',
    method: 'get'
  })
}
// 获取提成规则列表
export function getRoyalty () {
  return axios.request({
    url: '/api/royalty',
    method: 'get'
  })
}
// 请求日志
export function addLog (page) {
  return axios.request({
    url: '/api/tenant/request_log',
    method: 'get',
    params: {
      page
    }
  })
}
// 接口目录
export function Permission () {
  return axios.request({
    url: '/api/permission',
    method: 'get'
  })
}
// 获取主/职位
export function getPosition () {
  return axios.request({
    url: '/api/position',
    method: 'get'
  })
}

// 获取部门/职位
export function getGroup () {
  return axios.request({
    url: '/api/group',
    method: 'get'
  })
}

// 获取系统日志
export function getLogs () {
  return axios.request({
    url: '/api/tenant/request_log',
    method: 'GET'
  })
}
