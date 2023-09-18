import request from "@/utils/request";

// 应急处理管理-列表
export function getDispose(query) {
  return request({
    url: "/system/dispose/list",
    method: "get",
    params: query,
  });
}

// 应急处理管理-应急处理未处理、进行中、已办结分类统计
export function getStateCount(data) {
  return request({
    url: "/system/dispose/getStateCount",
    method: "post",
    data: data,
  });
}

// 应急处理管理-处理流程-为应急预案流程添加响应描述
export function getDisposeFlow(data) {
  return request({
    url: "/system/dispose/disposeFlow",
    method: "post",
    data: data,
  });
}
// 获取应急处理-已处理事项详细信息
export function processedQuery(query) {
  return request({
    url: "/system/dispose/processedQuery",
    method: "get",
    params: query,
  });
}
// 应急处理管理-待办理事项详细信息
export function pendingQuery(query) {
  return request({
    url: "/system/dispose/pendingQuery",
    method: "get",
    params: query,
  });
}
export function getPreviewById(id) {
  return request({
    url: "/system/plan/preview/" + id,
    method: "get",
  });
}
