import request from '@/utils/request'

export function 查询(query) {
    return request({
        url: '/app/terminal/list',
        method: 'get',
        params: query,
    })
}
export function 删除(id) {
    return request({
        url: '/app/terminal/' + id,
        method: 'delete',
    })
}

export function 新增(data) {
    return request({
        url: '/app/terminal',
        method: 'post',
        data: data,
    })
}
export function 编辑(data) {
    return request({
        url: '/app/terminal',
        method: 'put',
        data: data,
    })
}
export function 注销(data) {
    return request({
        url: '/app/terminal/logoutTerminal',
        method: 'post',
        data,
    })
}
export function 查询使用人(query) {
    return request({
        url: '/app/users/list',
        method: 'get',
        params: query,
    })
}
export function 分配使用人(data) {
    return request({
        url: '/app/terminal/edituserId',
        method: 'post',
        data,
    })
}
