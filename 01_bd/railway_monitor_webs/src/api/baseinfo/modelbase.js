import request from "@/utils/request.js";

export function getmodellist(query) {
  return request({
    url: "/system/model/list",
    method: "get",
    params: query,
  });
}
export function getmodelCount(query) {
  return request({
    url: "/system/model/modelCount",
    method: "get",
    params: query,
  });
}
// 情景库查询
export function getsystemlist(query) {
  return request({
    url: "/system/set/list",
    method: "get",
    params: query,
  });
}
//编辑查询功能
export function inquire(id) {
  return request({
    url: "/system/model/" + id,
    method: "get",
  });
}
