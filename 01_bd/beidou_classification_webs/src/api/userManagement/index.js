import request from '@/utils/request'

export function 查询(query) {
    return request({
        url: '/app/users/list',
        method: 'get',
        params: query
    })
}
export function 新增(data) {
    return request({
        url: '/app/users/addUser',
        method: 'post',
        data: data
    })
}
export function 删除(ids) {
    return request({
        url: '/app/users/'+ids,
        method: 'delete',
    })
}
export function 编辑(data) {
    return request({
        url: '/app/users',
        method: 'put',
        data: data
    })
}
export function 查询人员(id) {
    return request({
        url: '/app/users/'+id,
        method: 'get',
    })
}