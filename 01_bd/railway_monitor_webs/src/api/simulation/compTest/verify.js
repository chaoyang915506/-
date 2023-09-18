import request from "@/utils/request.js";

// 查询该算法下的所有模型
export function getModelByAigType(algtype) {
  return request({
    url: "/simulation/validation/getModelByAlgType",
    method: "get",
    params: algtype,
  });
}
// 验证功能
export function validateion(data, ids) {
  return request({
    url: "/simulation/validation/" + ids,
    method: "post",
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
    data: data,
  });
}
export function download(data) {
  return request({
    url: "/simulation/validation/download",
    method: "post",
    responseType: "blob",
    // headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data,
    // responseType: "blob",
  });
}
export function validationexport(data) {
  return request({
    url: "/simulation/validation/export",
    method: "post",
    responseType: "blob",
    data,
  });
}
