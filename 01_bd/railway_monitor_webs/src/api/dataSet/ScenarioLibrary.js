import request from "@/utils/request.js";

// 情景库查询
export function getsystemlist(query) {
    return request({
      url: "/system/set/list",
      method: "get",
      params: query,
    });
  }
  //组态查询
export function getconfigurationCount(query) {
    return request({
      url: "/system/configuration/configurationCount",
      method: "get",
      params: query,
    });
  }