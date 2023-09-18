import request from "@/utils/request.js";

// 获取算法模型类型统计
export function getmodelCount(query) {
  return request({
    url: "/simulation/algorithm/getForeMatterAlgorithmCount",
    method: "get",
    params: query,
  });
}
// 获取算法列表
export function getList(query) {
  return request({
    url: "/simulation/algorithm/selectAlgorithmList",
    method: "get",
    params: query,
  });
}
// 获取算法列表-----异物分析
export function getListForgin(query) {
  return request({
    url: "/simulation/algorithm/selectAlgorithm",
    method: "get",
    params: query,
  });
}
// 新增
export function addData(data) {
  return request({
    url: "/simulation/algorithm/addAlgorithm",
    method: "post",
    data: data,
  });
}
// 修改
export function updateData(data) {
  return request({
    url: "/simulation/algorithm/updateAlgorithm",
    method: "put",
    data: data,
  });
}
//删除
export function deleteById(id) {
  return request({
    url: "/simulation/algorithm/deleteAlgorithmById/" + id,
    method: "delete",
  });
}
// 通过id获取
export function getById(id) {
  return request({
    url: "/simulation/algorithm/selectAlgorithmListById/" + id,
    method: "get",
  });
}

export function exportPlan() {
  return request({
    url: '/simulation/algorithm/export',
    method: 'get',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
    responseType: 'blob'
  })
}
// 算法库训练
export function train(data) {
  return request({
    url: "/simulation/algorithm/train",
    method: "post",
    data: data,
  });
}