import request from '@/utils/request'

// 地图配置-线路列表查询
export function getSelectLine(query) {
  return request({
    url: '/simulation/map/selectLine',
    method: 'get',
    params: query
  })
}
//模糊查询
export function getSelectByLineName(query) {
  return request({
    url: '/simulation/map/selectByLineName',
    method: 'get',
    params: query
  })
}
// 添加
export function addLine(data) {
  return request({
    url: '/simulation/map/addLine',
    method: "post",
    timeout: 30000 * 30000,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }, // form data
    data
  })
}
//删除
export function deleteLine(ids) {
  return request({
    url: '/simulation/map/deleteLine/' + ids,
    method: 'delete',
  })
}
// 查询
export function getLineById(ids) {
  return request({
    url: '/simulation/map/seachLineById/' + ids,
    method: 'get',
  })
}
//发布
export function updateLineById(query) {
  return request({
    url: '/simulation/map/updateLineById',
    method: 'put',
    data: query
  })
}