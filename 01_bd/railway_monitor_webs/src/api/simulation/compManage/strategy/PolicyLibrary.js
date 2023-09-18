import request from '@/utils/request'
// 策略组件-策略库

//列表查询
export function getPol(query) {
  return request({
    url: '/simulation/policy/selectPolicyLibrary',
    method: 'get',
    params: query
  })
}
//模糊查询
export function getSelectByName(query) {
  return request({
    url: '/simulation/policy/selectPolicyLibraryByName',
    method: 'get',
    params: query
  })
}
// 获取算法模型类型统计
export function getModel() {
  return request({
    url: '/simulation/policy/getModelNameList',
    method: 'get',
  })
}
// 添加
export function addPol(data) {
  return request({
    url: '/simulation/policy/addPolicyLibrary',
    method: "post",
    data
  })
}
//回显
export function detailPol(ids) {
  return request({
    url: '/simulation/policy/echo/' + ids,
    method: 'get',
  })
}
//删除
export function deletePol(ids) {
  return request({
    url: '/simulation/policy/deletePolicyLibrary/' + ids,
    method: 'delete',
  })
}
// 编辑
export function editPol(data) {
  return request({
    url: '/simulation/policy/updatePolicyLibraryById',
    method: "put",
    data
  })
}
// 统计查询
export function getPolCount(query) {
  return request({
    method: "get",
    url: "/simulation/policy/getPolicyLibraryCount",
  });
}