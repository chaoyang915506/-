import request from "@/utils/request";

// 预测验证管理-查询
export function listPage(data) {
  return request({
    url: "/simulation/forecast/listPage",
    method: "post",
    data: data,
  });
}
// 预测验证管理-添加
export function addData(data) {
  return request({
    url: "/simulation/forecast/add",
    method: "post",
    data: data,
  });
}
// 预测验证管理-修改
export function updateData(data) {
  return request({
    url: "/simulation/forecast/update",
    method: "put",
    data: data,
  });
}
// 预测验证管理-删除
export function deleteData(ids) {
  return request({
    url: "/simulation/forecast/delete/" + ids,
    method: "delete",
  });
}
// 查询线路和监测点
export function findLineTree(data) {
  return request({
    url: "/simulation/map/findLineTree",
    method: "get",
    data: data,
  });
}
//查询
export function findforecast(id) {
  return request({
    url: "/simulation/forecast/find/" + id,
    method: "get",
  });
}
//获取算法的数据
export function getalgorithmId() {
  return request({
    url: "/simulation/algorithm/getForecastAlgorithm",
    method: "get",
  });
}
