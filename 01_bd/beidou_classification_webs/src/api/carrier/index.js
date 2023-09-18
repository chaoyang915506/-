import request from '@/utils/request'

export function 列表(query) {
    return request({
        url: '/app/carrier/list',
        method: 'get',
        params: query,
    })
}
export function 新增(data) {
    return request({
        url: '/app/carrier',
        method: 'post',
        data: data,
    })
}
export function 编辑(data) {
    return request({
        url: '/app/carrier',
        method: 'put',
        data: data,
    })
}
export function 删除(id) {
    return request({
        url: '/app/carrier/' + id,
        method: 'delete',
    })
}
export function 注销(data) {
    return request({
        url: '/app/carrier/logoutCarrier',
        method: 'post',
        data,
    })
}
export function 绑定终端(query) {
    return request({
        url: '/app/carrier/bindingTerminal',
        method: 'get',
        params: query,
    })
}
export function 解绑(query) {
    return request({
        url: '/app/carrier/unBindTerminal',
        method: 'get',
        params: query,
    })
}
export function 查询解绑列表(id) {
    return request({
        url: '/app/carrier/bdsCarrierTerminal/' + id,
        method: 'get',
    })
}
export function 查询终端设备(query) {
    return request({
        url: 'app/terminal/selectBdsTerminalInfo',
        method: 'get',
        params: query,
    })
}
