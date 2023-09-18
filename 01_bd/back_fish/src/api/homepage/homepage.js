import request from '@/utils/request.js'


export function 首页关岛当年舰艇部署信息查询() {
    return request({
        url: "/app/subdata/getHomePageInfo",
        method: "get",
        // params: name,
    });
}
export function 多源数据列表统计增量数据(data) {
    return request({
        url: "/app/acct/multiData/query/icData",
        method: "post",
        // params: name,
        data
    });
}
export function 多源数据列表查询(data) {
    return request({
        url: "/app/acct/multiData/query",
        method: "post",
        // params: name,
        data
    });
}
export function 首页西太平洋部署统计(data) {
    return request({
        url: "/app/thr/query/sqqy/index",
        method: "post",
        // params: name,
        data
    });
}
export function 首页资源管理列表(data) {
    return request({
        url: "/app/resources/list",
        method: "get",
        params: data,

    });
}
export function 首页西太平洋部署舰型统计V2(data) {
    return request({
        url: "/app/thr/forecas/statsBySmTypeV2",
        method: "post",
        data

    });
}