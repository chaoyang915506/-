import request from '@/utils/request'

// 查询树列表
export function listTree(query) {
  return request({
    url: '/app/dept/treeNodeList',
    method: 'get',
    params: query
  })
}
// 部门管理列表
export function listDepById(query) {
  return request({
    url: '/app/dept/getChildrenList/' + query,
    method: 'get',
  })
}
export function listDep(query) {
  return request({
    url: '/app/dept/list',
    method: 'get',
  })
}
// 查询申请人
export function applicantList(query) {
  return request({
    url: '/app/users/applicantList',
    method: 'get',
    params: query
  })
}
// 审批流程管理
export function flowList(query) {
  return request({
    url: '/app/flow/list',
    method: 'get',
    params: query
  })
}
// 新增部门
export function addDept(data) {
  return request({
    url: '/app/dept',
    method: 'post',
    data: data
  })
}
// 编辑部门
export function editDept(data) {
  return request({
    url: '/app/dept',
    method: 'put',

    data: data
  })
}
// 删除部门
export function deleteDept(ids) {
  return request({
    url: '/app/dept/' + ids,
    method: 'delete',
  })
}
// 新增人员
export function addUsers(data) {
  return request({
    url: '/app/users',
    method: 'post',
    data: data
  })
}
// 编辑人员
export function editUsers(data) {
  return request({
    url: '/app/users',
    method: 'put',
    data: data
  })
}
// 删除人员
export function deleteUsers(ids) {
  return request({
    url: '/app/users/' + ids,
    method: 'delete',
  })
}
// 人员导出
// export function exportUsers() {
//   return request({
//     url: '/app/users/export',
//     method: 'post',
//   })
// }
// // 部门导出
// export function exportDept() {
//   return request({
//     url: '/app/dept/export',
//     method: 'post',
//   })
// }
