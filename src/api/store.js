import axios from '@/libs/api.request'

// 获取所有商户
export function getStoreList (data) {
  return axios.request({
    url: '/api/tenant/all',
    method: 'GET',
    data
  })
}

// 创建子商户
export function createSubStore (data) {
  return axios.request({
    url: '/api/tenant/register_slave',
    method: 'POST',
    data
  })
}

// 获取商户信息
export function getStoreDetail () {
  return axios.request({
    url: '/api/tenant/info',
    method: 'GET'
  })
}

// 修改商户信息
export function editStoreDetail (data) {
  return axios.request({
    url: '/api/tenant/info',
    method: 'PUT',
    data
  })
}
// 修改密码
export function editPassword (data) {
  return axios.request({
    url: '/api/tenant/reset_pwd',
    method: 'POST',
    data
  })
}
