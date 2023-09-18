import request from "@/utils/request.js";

//异物库表/system/matter/list
export function getforeign(query) {
    return request({
      url: "/system/matter/list",
      method: "get",
      params: query,
    });
  }
  export function addforeign(params) {
    return request({
      url: "/system/matter",
      method: "post",
      data: params,
    });
  }