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
