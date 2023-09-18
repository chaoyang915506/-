import request from '@/utils/request'

export function 列表(query) {
    return request({
        url: '/app/card/cardInventoryList',
        method: 'get',
        params: query
    })
}
export function 入库(data) {
    return request({
        url: '/app/card',
        method: 'post',
        data: data
    })
}
export function 删除(id) {
    return request({
        url: '/app/card/'+id,
        method: 'delete'
    })
}
export function 编辑(data) {
    return request({
        url: '/app/card',
        method: 'put',
        data: data
    })
}

export function 下发(data) {
    return request({
        url: '/app/card/issueCard',
        method: 'post',
        data: data
    })
}