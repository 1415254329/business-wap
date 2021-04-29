import axios from '@/libs/api.request'
import store from '@/store'
// 登录
export function login ({ account, password }) {
  const params = {
    account,
    password
  }
  return axios.request({
    url: '/api/tenant/login',
    params,
    method: 'get'
  })
}
// 注册
export function register ({ account, phone, password, store_name }) {
  const data = {
    account, phone, password, store_name
  }
  return axios.request({
    url: '/api/tenant/register',
    data,
    method: 'post'
  })
}

// 找回密码
export function forgotPWD (params) {
  return axios.request({
    url: '/api/find_pwd',
    params,
    method: 'GET'
  })
}

// 创建部门/职位
export function position (alias, pid) {
  const data = {
    alias, pid
  }
  return axios.request({
    url: '/api/position',
    method: 'post',
    data
  })
}

// 获取商户信息
export function getUserInfo () {
  return axios.request({
    url: '/api/tenant/info',
    method: 'get'
  }).then(res => {
    if (res.data.staff_info) {
      store.commit('permission/setCurrentFn', res.data.staff_info.operate_permission)
    }
    return res
  })
}

// 删除主/职位
export function del_position (id) {
  return axios.request({
    url: '/api/position/' + id,
    method: 'DELETE'
  })
}
// 修改职位/部门
export function edit_position (id, alias, pid, status) {
  const data = {
    id, alias, pid, status
  }
  return axios.request({
    url: '/api/position',
    method: 'PUT',
    data
  })
}

// 创建部门
export function add_group (alias) {
  const data = {
    alias
  }
  return axios.request({
    url: '/api/group',
    method: 'post',
    data
  })
}
// 删除部门
export function del_group (id) {
  return axios.request({
    url: '/api/group/' + id,
    method: 'DELETE'
  })
}
// 修改部门
export function edit_group (id, data) {
  return axios.request({
    url: '/api/group/' + id,
    method: 'PUT',
    data
  })
}

// 添加员工
export function staff (data) {
  return axios.request({
    url: '/api/staff',
    method: 'POST',
    data
  })
}
// 编辑员工信息
export function update_staff (data) {
  return axios.request({
    url: '/api/staff',
    method: 'PUT',
    data
  })
}
// 删除员工
export function del_staff (id) {
  return axios.request({
    url: '/api/staff/' + id,
    method: 'DELETE'
  })
}
// 获取商户信息
export function getInfo () {
  return axios.request({
    url: '/api/tenant/info',
    method: 'get'
  })
}
// 设置会员规则
export function member_rule (member_rule, old) {
  return axios.request({
    url: '/api/tenant/member_rule',
    method: 'PUT',
    data: {
      member_rule,
      old
    }
  })
}

// 设置充值规则
export function recharge_rule (recharge_rule, old) {
  return axios.request({
    url: '/api/tenant/recharge_rule',
    method: 'PUT',
    data: {
      recharge_rule,
      old
    }
  })
}
// 服务项目 添加
export function add_project (data) {
  return axios.request({
    url: '/api/project',
    method: 'POST',
    data
  })
}
// 服务项目 删除
export function del_project (id) {
  return axios.request({
    url: '/api/project/' + id,
    method: 'DELETE'
  })
}
// 服务项目修改
export function edit_project (data, id) {
  // console.log(id)
  return axios.request({
    url: '/api/project/' + id,
    method: 'PUT',
    data
  })
}
// 删除分类
export function del_category (id) {
  return axios.request({
    url: '/api/category/' + id,
    method: 'DELETE'
  })
}
// 编辑分类
export function edit_category (alias, source, member_rule, staff_rule, id, status) {
  const data = {
    alias, source, member_rule, staff_rule, status
  }
  return axios.request({
    url: '/api/category/' + id,
    method: 'PUT',
    data
  })
}
// 编辑商品
export function edit_shop (data, id) {
  return axios.request({
    url: '/api/commodity/' + id,
    method: 'PUT',
    data
  })
}
export function add_shop (data) {
  return axios.request({
    url: '/api/commodity',
    method: 'POST',
    data
  })
}
export function del_shop (id) {
  return axios.request({
    url: '/api/commodity/' + id,
    method: 'DELETE'
  })
}
export function edit_commodity (data, id) {
  return axios.request({
    url: '/api/commodity/' + id,
    method: 'PUT',
    data
  })
}
export function add_commodity (data) {
  return axios.request({
    url: '/api/commodity',
    method: 'POST',
    data
  })
}
export function del_commodity (id) {
  return axios.request({
    url: '/api/commodity/' + id,
    method: 'DELETE'
  })
}

// 添加计次服务
export function add_meter (data) {
  return axios.request({
    url: '/api/meter',
    method: 'POST',
    data
  })
}
// 修改计次服务
export function edit_meter (data, id) {
  return axios.request({
    url: '/api/meter/' + id,
    method: 'PUT',
    data
  })
}
export function del_meter (id) {
  return axios.request({
    url: '/api/meter/' + id,
    method: 'DELETE'
  })
}
// 添加耗品
export function add_wastage (data) {
  return axios.request({
    url: '/api/wastage',
    method: 'POST',
    data
  })
}
// 修改耗品
export function edit_wastage (data, id) {
  return axios.request({
    url: '/api/wastage/' + id,
    method: 'PUT',
    data
  })
}
export function del_wastage (id) {
  return axios.request({
    url: '/api/wastage/' + id,
    method: 'DELETE'
  })
}
// 添加优惠券
export function add_coupon (data) {
  return axios.request({
    url: '/api/coupon',
    method: 'POST',
    data
  })
}
export function edit_coupon (data, id) {
  return axios.request({
    url: '/api/coupon/' + id,
    method: 'PUT',
    data
  })
}
export function del_coupon (id) {
  return axios.request({
    url: '/api/coupon/' + id,
    method: 'DELETE'
  })
}

// 创建提成规则
// source:
// — 商品[tenant_commodity]
// — 服务项目[tenant_project]
// — 计次服务[tenant_meter]
// — 计次服务套餐[tenant_meter_combo]
// — 快速消费[tenant_speedy]
// — 耗品[tenant_wastage]
// — 开卡[tenant_member]

export function getRules () {
  return axios.request({
    url: '/api/royalty',
    method: 'GET'
  })
}

export function add_royalty (data) {
  return axios.request({
    url: '/api/royalty',
    method: 'POST',
    data
  })
}

// 修改提成规则
export function edit_royalty (id, data) {
  return axios.request({
    url: '/api/royalty/' + id,
    method: 'PUT',
    data
  })
}

export function del_royalty (id) {
  return axios.request({
    url: '/api/royalty/' + id,
    method: 'DELETE'
  })
}

// 编辑员工权限
export function edit_permission (staff_id, permission) {
  return axios.request({
    url: '/api/staff/permission',
    method: 'PUT',
    data: {
      permission, staff_id
    }
  })
}

// 添加积分设置
export function addIntegral (data) {
  return axios.request({
    url: '/api/integral',
    method: 'POST',
    data
  })
}

// 编辑积分设置
export function editIntegral (data) {
  return axios.request({
    url: '/api/integral/' + data.id,
    method: 'PUT',
    data
  })
}

// 删除积分设置
export function delIntegral (id) {
  return axios.request({
    url: '/api/integral/' + id,
    method: 'DELETE'
  })
}
