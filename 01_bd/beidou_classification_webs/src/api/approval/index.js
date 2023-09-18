import request from '@/utils/request'

export function 查询(query) {
    return request({
        url: '/app/approval/list',
        method: 'get',
        params: query
    })
}
export function 获取审批信息(id) {
    return request({
        url: '/app/approval/auditInfo/'+id,
        method: 'get',
    })
}
// 导出
export function 导出(query) {
    return request({
      url: '/common/download',
      method: 'get',
      params: query,
      responseType: 'blob'
    })
  }
// 审核
export function 审核(data) {
    return request({
      url: '/app/approval/audit',
      method: 'post',
      data: data,
    })
  }