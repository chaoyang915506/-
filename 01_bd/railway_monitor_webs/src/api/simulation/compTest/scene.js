import request from "@/utils/request.js";

//场景库查询
export function getScene(query) {
  return request({
    url: "/simulation/scene/list",
    method: "post",
    data: query,
  });
}
// 总数查询
export function getSceneCount(query) {
  return request({
    url: "/simulation/scene/findCount",
    method: "get"
  });
}
// 场景库新增
export function addScene(data) {
  return request({
    url: "/simulation/scene/add",
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
    data: data
  });
}
export function deletScene(ids) {
  return request({
    url: "/simulation/scene/delete/"+ids,
    method: "delete",
  });
}