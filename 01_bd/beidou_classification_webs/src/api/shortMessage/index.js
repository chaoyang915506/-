import request from "@/utils/request";

// 查询缓存详细
export function 短报文列表查询(params) {
  return request({
    url: "/app/card/shortMessage",
    method: "get",
    params: params,
  });
}
// 查询缓存详细
export function 短报文列表查询新(params) {
  return request({
    url: "/app/card/shortMessageDetail",
    method: "get",
    params: params,
  });
}
// 查询缓存详细
export function 发送列表查询(params) {
  return request({
    url: "/app/card/shortMessageDetail",
    method: "get",
    params: params,
  });
}
export function 统计短报文位置(params) {
  return request({
    url: "/app/card/shortMessageLocation",
    method: "get",
    params: params,
  });
}
export function 统计短报文分类(params) {
  return request({
    url: "/app/card/shortMessageClassify",
    method: "get",
    params: params,
  });
}
export function 短报文年度统计(params) {
  return request({
    url: "/app/card/shortMsgStat",
    method: "get",
    params: params,
  });
}

export function 导出原始短报文(ids) {
  return request({
    url: "/app/card/exportshortMessage",
    method: "post",
    data: ids,
    responseType: "blob",
  });
}
