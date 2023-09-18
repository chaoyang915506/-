import request from '@/utils/request'

export function 查询(query) {
    return request({
        url: '/app/flow/list',
        method: 'get',
        params: query
    })
}
export function 新增(data) {
    return request({
        url: '/app/flow',
        method: 'post',
        data: data
    })
}