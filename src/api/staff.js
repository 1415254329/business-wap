import axios from '@/libs/api.request'

// 员工登录
export function login (params) {
  return axios.request({
    url: '/api/staff/login',
    method: 'GET',
    params
  })
}
// 员工提成列表
export function getBonus (params) {
  return axios.request({
    url: '/api/collect/staff/bonus',
    method: 'GET',
    params
  })
}

// 员工操作权限
export function permissionFnChange (id, data) {
  return axios.request({
    url: '/api/staff/operate_permission/' + id,
    method: 'PUT',
    data
  })
}
