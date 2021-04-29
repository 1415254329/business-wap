import axios from '@/libs/api.request'

// 获取微信凭证
export function getAccess (code) {
  return axios.request({
    url: '/api/wechat/code2session/' + code,
    method: 'get'
  })
}

// 绑定
export function bind (data) {
  return axios.request({
    url: '/api/wechat/bind',
    method: 'POST',
    data
  })
}

// 取消绑定
export function unBind (openId) {
  return axios.request({
    url: '/api/wechat/bind/' + openId,
    method: 'DELETE'
  })
}

// 获取绑定信息
export function getBindInfo (openId) {
  return axios.request({
    url: '/api/wechat/' + openId,
    method: 'get'
  })
}

// 登录
export function login (openId) {
  return axios.request({
    url: '/api/wechat/login/' + openId,
    method: 'get'
  })
}

// 获取会员列表
export function getMemberCardList () {
  return axios.request({
    url: '/api/wechat/member',
    method: 'get'
  })
}

// 获取会员列表
export function getMemberConsumeList (id, params) {
  return axios.request({
    url: '/api/wechat/member/orders/' + id,
    method: 'get',
    params
  })
}

// 获取会员列表
export function getStaffList () {
  return axios.request({
    url: '/api/wechat/staff',
    method: 'get'
  })
}

// 获取会员列表
export function getStaffBonusList (id, params) {
  return axios.request({
    url: '/api/wechat/staff/bonus/' + id,
    method: 'get',
    params
  })
}
