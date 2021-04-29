import axios from '@/libs/api.request'

// 添加会员
export function addMember (data) {
  return axios.request({
    url: '/api/member',
    method: 'post',
    data
  })
}
// 编辑会员
export function editMember (data) {
  return axios.request({
    url: '/api/member',
    method: 'PUT',
    data
  })
}
// 删除会员
export function delMember (id) {
  return axios.request({
    url: '/api/member/' + id,
    method: 'DELETE'
  })
}

// 会员还款
export function editMemberDebt (id, data) {
  return axios.request({
    url: '/api/member/repay/' + id,
    method: 'PUT',
    data
  })
}

// 获取会员还款记录
export function getMemberDebt (params) {
  return axios.request({
    url: '/api/member/repay',
    method: 'GET',
    params
  })
}

// 获取会员还款撤单
export function delMemberDebt (id) {
  return axios.request({
    url: '/api/member/repay/' + id,
    method: 'DELETE'
  })
}

// 会员到店记录分析
export function getMemberVisit () {
  return axios.request({
    url: '/api/collect/member',
    method: 'GET'
  })
}

// 获取会员已购买计次列表
export function getMemberCountList (params) {
  return axios.request({
    url: '/api/orders/meter',
    method: 'GET',
    params
  })
}

// 获取会员兑换记录
export function getMemberIntegralList () {
  return axios.request({
    url: '/api/integral/exchange',
    method: 'GET'
  })
}
