import request from '@/utils/request'
export function 查询轨迹(query) {
    return request({
        url: '/app/carrier/carrierTrack',
        method: 'post',
        data: query
    })
}
export function 查询载体卡详情(carrierId) {
    return request({
        url: '/app/carrier/carrierBdsCardInfoList?carrierId='+carrierId,
        method: 'get',
    })
}
