import request from '@/utils/request'

export function 查询(query) {
    return request({
        url: '/app/apply/list',
        method: 'get',
        params: query
    })
}
export function 查询终端集合(query) {
    return request({
        url: '/app/apply/getTerminalList',
        method: 'get',
        params: query,
    })
}
export function 根据id查询列表(id) {
    return request({
        url: '/app/apply/'+id,
        method: 'get',
    })
}
export function 添加(data) {
    return request({
        url: '/app/apply',
        method: 'post',
        data
    })
}
export function 编辑(data) {
    return request({
        url: '/app/apply',
        method: 'put',
        data
    })
}
export function 提交(query) {
    return request({
        url: '/app/apply/submit',
        method: 'get',
        params: query
    })
}
export function 删除(ids) {
    return request({
        url: '/app/apply/' + ids,
        method: 'delete',
    })
}
export function 查询人员列表() {
    return request({
        url: '/app/users/list',
        method: 'get',
    })
}
export function 查询部门列表() {
    return request({
        url: '/app/dept/list',
        method: 'get',
    })
}

export function 通用上传(data) {
    return request({
        url: '/common/upload',
        method: 'post',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
        data
    })
}