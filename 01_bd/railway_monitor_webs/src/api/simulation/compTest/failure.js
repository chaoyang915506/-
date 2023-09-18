import request from "@/utils/request.js";

//失效库查询
export function getfailure(query) {
  return request({
    url: "/simulation/failure/listPage",
    method: "post",
    data: query,
  });
}
// 失效库新增
export function addfailure(data) {
  return request({
    url: "/simulation/failure/add",
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
    data: data
  });
}
export function deletfailure(ids) {
  return request({
    url: "/simulation/failure/delete/" + ids,
    method: "delete",
  });
}
export function exportPlan(ids) {
  return request({
    url: '/simulation/failure/export/' + ids,
    method: 'get',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
    responseType: 'blob'
  })
}