import request from "@/utils/request.js";

//环境库查询
export function getSurr(query) {
  return request({
    url: "/simulation/environment/list",
    method: "post",
    data: query,
  });
}
// 总数查询
export function getSurrCount(query) {
  return request({
    url: "/simulation/environment/findCount",
    method: "get"
  });
}
// 环境库新增
export function addSurr(data) {
  return request({
    url: "/simulation/environment/add",
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
    data: data
  });
}
// 删除
export function deletSurr(ids) {
  return request({
    url: "/simulation/environment/delete/"+ids,
    method: "delete",
  });
}
export function getWeatherCount() {
  return request({
    url: "/simulation/environment/weatherCount",
    method: "get",
  });
}