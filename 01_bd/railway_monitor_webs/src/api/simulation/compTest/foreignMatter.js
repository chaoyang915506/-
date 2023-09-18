import request from "@/utils/request.js";

//异物库查询
export function getforeign(query) {
  return request({
    url: "/simulation/matter/list",
    method: "post",
    data: query,
  });
}
// 总数查询
export function getfindCount(query) {
  return request({
    url: "/simulation/matter/findCount",
    method: "get"
  });
}
// 异物库新增
export function addfind(data) {
  return request({
    url: "/simulation/matter/add",
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
    data: data
  });
}
export function deletforeign(ids) {
  return request({
    url: "/simulation/matter/delete/"+ids,
    method: "delete",
  });
}