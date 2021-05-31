import axios from '@/libs/api.request'
//获取商铺信息
export function getShopData(data) {
    return axios.request({
        url: '/api/tenant/info',
        method: 'get',
        data
    })
}
//修改商铺信息
export function setShopData(data) {
    return axios.request({
        url: '/api/tenant/info',
        method: 'put',
        data
    })
}
//增加服务
export function addServeList(data) {
    return axios.request({
        url: '/api/project',
        method: 'POST',
        data
    })
}
//获取服务列表
export function getServeList(data) {
    return axios.request({
        url: '/api/project',
        method: 'GET',
        data
    })
}
//修改服务项目
export function setServeProject(data) {
    return axios.request({
        url: `/api/project/${data.id}`,
        method: 'PUT',
        data
    })
}
//删除服务项目
export function delServeProject(data) {
    return axios.request({
        url: `/api/project/${data.id}`,
        method: 'DELETE'
    })
}
//获取分类列表
export function getSortList(data) {
    return axios.request({
        url: '/api/category',
        method: 'GET',
        data
    })
}


//获取商品列表
export function getCommodityList(data) {
    return axios.request({
        url: '/api/commodity',
        method: 'GET',
        data
    })
}
//修改商品
export function setCommondity(data) {
    return axios.request({
        url: `/api/commodity/${data.id}`,
        method: 'PUT',
        data
    })
}
//增加商品
export function addCommondity(data) {
    return axios.request({
        url: '/api/commodity',
        method: 'POST',
        data
    })
}
//删除服务项目
export function delCommondity(data) {
    return axios.request({
        url: `/api/commodity/${data.id}`,
        method: 'DELETE'
    })
}


//获取员工列表
export function getStaffList(data) {
    return axios.request({
        url: '/api/staff',
        method: 'GET',
        data
    })
}
//增加员工
export function addStaff(data) {
    return axios.request({
        url: '/api/staff',
        method: 'POST',
        data
    })
}
//修改员工信息
export function setStaff(data) {
    return axios.request({
        url: `/api/staff`,
        method: 'PUT',
        data
    })
}
//删除员工
export function delStaff(data) {
    return axios.request({
        url: `/api/staff/${data.id}`,
        method: 'DELETE'
    })
}
//获取部门列表
export function getDepartmentList(data) {
    return axios.request({
        url: '/api/group',
        method: 'GET',
        data
    })
}

//获取预约列表
export function getScheduledList(data) {
    return axios.request({
        url: '/api/reservation',
        method: 'GET',
        data
    })
}
//增加预约
export function addScheduled(data) {
    return axios.request({
        url: `/api/reservation${data}`,
        method: 'POST',
    })
}
//修改预约
export function setScheduled(id, data) {
    return axios.request({
        url: `/api/reservation/status/${id}?${data}`,
        method: 'PUT',
    })
}


//获取职位列表
export function getPositionList(data) {
    return axios.request({
        url: '/api/position',
        method: 'GET',
        data
    })
}
//获取员工预约设置
export function getStaffSetting(data) {
    return axios.request({
        url: `/api/staff/reservation/${data}`,
        method: 'GET',
        data
    })
}

//创建员工预约设置
export function getReservationSetting(data) {
    return axios.request({
        url: `/api/staff/reservation/${data}`,
        method: 'POST',
        data
    })
}


//获取会员列表
export function getVipList(data) {
    return axios.request({
        url: `api/member`,
        method: 'GET',
        data
    })
}

//获取带有未读消息记录的会员列表
export function getUnreadList(data) {
    return axios.request({
        url: `api/chat/unread`,
        method: 'GET',
        data
    })
}
//获取指定会员的消息记录
export function getMenberId(data) {
    return axios.request({
        url: `api/chat/${data}`,
        method: 'GET',
        data
    })
}
//条件筛选消息列表
export function getFilterNews(data) {
    return axios.request({
        url: `api/chat/search${data}`,
        method: 'GET',
        data
    })
}
//已读消息
export function getInRead(data) {
    return axios.request({
        url: `/api/chat/read`,
        method: 'PUT',
        data
    })
}
//发消息给会员
export function sendNewsToVip(data) {
    return axios.request({
        url: `/api/chat`,
        method: 'POST',
        data
    })
}































































//获取计次列表
export function getNumberList(data) {
    return axios.request({
        url: '/api/meter',
        method: 'GET',
        data
    })
}