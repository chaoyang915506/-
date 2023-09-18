import request from '@/utils/request'

export function 查询(query) {
    return request({
        url: '/app/card/list',
        method: 'get',
        params: query
    })
}
export function 注销(query) {
    return request({
        url: '/app/card/bdsCardLogout',
        method: 'get',
        params: query
    })
}
export function 解绑使用人(query) {
    return request({
        url: '/app/card/untieUser',
        method: 'get',
        params: query
    })
}
export function 解绑终端编号(query) {
    return request({
        url: '/app/card/untieTerminal',
        method: 'get',
        params: query
    })
}
export function 关联终端(query) {
    return request({
        url: '/app/card/relevanceTerminal',
        method: 'get',
        params: query
    })
}
export function 分配使用人(query) {
    return request({
        url: '/app/card/allot',
        method: 'get',
        params: query
    })
}
