import request from "@/utils/request";
export function 查询组织机构(name) {
  return request({
    url: "/app/org/tree",
    method: "get",
    params: name,
  });
}
export function 多源数据列表查询(data) {
  return request({
    url: "/app/acct/multiData/query",
    method: "post",
    data,
  });
}
export function 多源数据按位置统计(data) {
  return request({
    url: "/app/acct/multiData/stat/position",
    method: "post",
    data,
  });
}
export function 多源数据按位置查询记录(data) {
  return request({
    url: "/app/acct/multiData/position/message",
    method: "post",
    data,
  });
}
export function 多源数据按多位置查询记录(data) {
  return request({
    url: "/app/acct/multiData/multi-position/message",
    method: "post",
    data,
  });
}
export function 重点账号列表用户账号() {
  return request({
    url: "/app/acct/dd/list",
    method: "get",
  });
}
export function 重点账号删除(id) {
  return request({
    url: "/app/acct/" + id,
    method: "delete",
  });
}
export function 列表统计增量数据(data) {
  return request({
    url: "/app/acct/multiData/query/icData",
    method: "post",
    data,
  });
}

export function 多源数据导出(data) {
  return request({
    url: "/app/acct/multiData/export",
    method: "post",
    responseType: "blob",
    data: data,
  });
}

export function 查询AIS数据过期(startTime, endTime) {
  return request({
    url: `/app/acct/multiData?startTime=${startTime}&endTime=${endTime}`,
    method: "get",
  });
}

export function 查询AIS数据(startTime, endTime) {
  return request({
    url: `/app/acct/multiData/v2?startTime=${startTime}&endTime=${endTime}`,
    method: "get",
  });
}
