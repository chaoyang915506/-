import request from '@/utils/request'

// 地图配置-线路列表查询
export function getPlan(query) {
    return request({

        url: '/simulation/environmentConfig/listPage',

        method: 'post',
        data: query
    })
}
// 根据id查询数据
export function getPlanById(id) {
    return request({

        url: '/simulation/environmentConfig/find/' + id,

        method: 'get'
    })
}
// 添加
export function addPlan(data) {
    return request({

        url: '/simulation/environmentConfig/add',

        method: 'post',
        data: data
    })
}
// 编辑
export function editPlan(data) {
    return request({


        url: '/simulation/environmentConfig/update',

        method: 'put',
        data: data
    })
}
//删除
export function delPlan(ids) {
    return request({


        url: '/simulation/environmentConfig/delete/' + ids,

        method: 'delete',
    })
}
export const uploadFile = (data) => {
    return request({
        url: '/commonFile/upload',
        method: 'post',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
        data: data
    })
}
export const bizFile = (fileUuid) => {
    return request({
        url: 'bizCommonFile/bizLoad/' + fileUuid,
        method: 'get',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
        // responseType: 'blob',
    })
}
export function exportPlan(data) {
    return request({
        url: '/simulation/matterConfig/export',
        method: 'post',
        data: data
    })
}