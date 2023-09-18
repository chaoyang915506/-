import request from '@/utils/request.js'
export function 通用上传请求单个多媒体数据(data) {
    return request({
        url: '/common/upload/media',
        method: 'post',
        data
    })
}
// export function 通用上传请求多个(files) {
//     return request({
//         url: '/common/uploads/v2',
//         method: 'post',
//         data: files
//     })
// }
export function 查询图片服务器地址() {
    return request({
        url: `/app/config`,
        method: "get",
    });
}
export function 资料管理列表() {
    return request({
        url: `/app/material/list`,
        method: "get",
    });
}
export function 资料管理增加(data) {
    return request({
        url: `/app/material`,
        method: "post", data
    });
}
export function 资料管理删除(materialIds) {
    return request({
        url: `/app/material/${materialIds}`,
        method: "delete"
    });
}
export function 资料在线文档删除(materialIds) {
    return request({
        url: `/app/material/detail/${materialIds}`,
        method: "delete"
    });
}
export function 资料管理查询(materialId) {
    return request({
        url: `/app/material/${materialId}`,
        method: "get"
    });
}
export function 资料管理编辑(data) {
    return request({
        url: `/app/material`,
        method: "put",
        data
    });
}
export function 资料在线文档编辑(data) {
    return request({
        url: `/app/material/detail`,
        method: "put",
        data
    });
}
export function 资料在线文档增加(data) {
    return request({
        url: `/app/material/detail`,
        method: "post",
        data
    });
}
export function 资料在线文档查询(detailId) {
    return request({
        url: `/app/material/detail/${detailId}`,
        method: "get",
        // params: data
    });
}
export function 资料管理导出(data) {
    return request({
        url: `/app/material/export`,
        method: "post",
        responseType: 'blob',
        data
    });
}
export function 资料在线文档导出(data) {
    return request({
        url: `/app/material/detail/export`,
        method: "post",
        responseType: 'blob',
        data
    });
}
export function 本地文件通用下载(id) {
    return request({
        url: `/common/download/file`,
        method: "get",
        params: id,
        // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'blob',
    });
}
