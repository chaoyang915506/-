import request from '@/utils/request'

export function getPlan(query) {
  return request({
    url: '/simulation/sceneConfig/listPage',
    method: 'post',
    data: query
  })
}
// 根据id查询数据
export function getPlanById(id) {
  return request({
    url: '/simulation/sceneConfig/find/' + id,
    method: 'get'
  })
}
// 添加
export function addPlan(data) {
  return request({
    url: '/simulation/sceneConfig/add',
    method: 'post',
    data: data
  })
}
// 编辑
export function editPlan(data) {
  return request({
    url: '/simulation/sceneConfig/update',
    method: 'put',
    data: data
  })
}
//删除
export function delPlan(ids) {
  return request({
    url: '/simulation/sceneConfig/delete/' + ids,
    method: 'delete',
  })
}
export const uploadFile = (data) => {
  return request({
    url: '/commonFile/upload',
    method: 'post',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
    data: data
  })
}
export const bizFile = (fileUuid) => {
  return request({
    url: 'bizCommonFile/bizLoad/' + fileUuid,
    method: 'get',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
    // responseType: 'blob',
  })
}
export function exportPlan() {
  return request({
    url: '/simulation/sceneConfig/export',
    method: 'get',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
    responseType: 'blob'
  })
}