import request from '@/utils/request'

export function 北斗卡绑定统计() {
    return request({
        url: '/app/card/cardBindingCount',
        method: 'get'
    })
}
export function 查询实时点信息() {
    return request({
        url: '/app/carrier/carrierLocation',
        method: 'get',
    })
}
export function 各海事局对比() {
    return request({
        url: '/app/dept/getCardNetInNum',
        method: 'get'
    })
}
export function 获取实时信息列表() {
    return request({
        url: '/app/terminal/realTimeMsg',
        method: 'get'
    })
}
export function 获取实时信息列表可查询(query) {
    return request({
        url: '/app/carrier/carrierLocation',
        method: 'get',
        params: query
    })
}
export function 载体统计一级() {
    return request({
        url: '/app/carrier/carrierInfoCount',
        method: 'get'
    })
}
export function 载体统计二级(query) {
    return request({
        url: '/app/carrier/carrierCount',
        method: 'get',
        params: query
    })
}
export function 按北斗卡状态查询位置(query) {
    return request({
        url: '/app/carrier/carrierLocationByState',
        method: 'get',
        params: query
    })
}
