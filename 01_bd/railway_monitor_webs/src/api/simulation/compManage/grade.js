import request from '@/utils/request'

// 地图配置-线路列表查询
export function getSelectMonitor(query) {
  return request({
    url: '/simulation/monitor/selectMonitor',
    method: 'get',
    params: query
  })
}
//模糊查询
export function getSelectByLineName(query) {
  return request({
    url: '/simulation/monitor/selectByMonitorName',
    method: 'get',
    params: query
  })
}
// 添加
export function addLine(data) {
  return request({
    url: '/simulation/monitor/addMonitor',
    method: "post",
    data:data
  })
}
//删除
export function deleteLine(ids) {
  return request({
    url: '/simulation/monitor/deleteMonitor/' + ids,
    method: 'delete',
  })
}
// 查询
export function getLineById(id) {
  return request({
    url: '/simulation/monitor/seachMonitorById/'+ id,
    method: 'get',
  })
}
// 编辑
export function editLine(query) {
  return request({
    url: '/simulation/monitor/updateMonitorById',
    method: 'put',
    data: query
  })
}