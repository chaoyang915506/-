import request from "@/utils/request";

// 查询舰艇实时状态
export function 查询舰艇实时状态() {
  return request({
    url: "/app/sit/list",
    method: "get",
  });
}

// 查询舰艇实时状态详情
export function 查询舰艇实时状态详情(data) {
  return request({
    url: "/app/sit/state/list",
    method: "post",
    data: data,
  });
}

// 导出 /app/sit/export
export function 舰艇数据导出(data) {
  return request({
    url: "/app/sit/export",
    method: "post",
    responseType: "blob",
    data: data,
  });
}

export function 舰艇数据导出V2(data) {
  return request({
    url: "/app/sit/exportV2",
    method: "post",
    responseType: "blob",
    data: data,
  });
}
export function 查询舰艇实时状态详情V2(data) {
  return request({
    url: "/app/sit/state/list/V2",
    method: "post",
    data: data,
  });
}

export function 查询舰艇实时状态详情V3(data) {
  return request({
    url: "/app/sit/state/list/V3",
    method: "post",
    data: data,
  });
}

export function 根据弦号查询详情(sideNum) {
  return request({
    url: `/app/submaine/queryInfo/${sideNum}`,
    method: "get",
  });
}

export function 查询MMIS数据(mmsis, startTime, endTime) {
  return request({
    url: `/app/rt/list/?mmsis=${mmsis}&startTime=${startTime}&endTime=${endTime}`,
    method: "get",
  });
}

export function 查询图片服务器地址() {
  return request({
    url: `/app/config`,
    method: "get",
  });
}

export function 舰艇档案信息(sideNum) {
  return request({
    url: `/app/subrecord/queryInfo/${sideNum}`,
    method: "get",
  });
}

export function 社交媒体信息(sideNum, pageNum, pageSize) {
  return request({
    url: `/app/sm/listBySn/?sideNum=${sideNum}&pageNum=${0}&pageSize=${100}`,
    method: "get",
  });
}
export function 社交媒体信息V2(sideNum, pageNum, pageSize) {
  return request({
    url: `/app/sm/listBySn/v2/?sideNum=${sideNum}&pageNum=${0}&pageSize=${100}`,
    method: "get",
  });
}

export function 社交媒体数据数据导出(data) {
  return request({
    url: "/app/sm/export",
    method: "post",
    responseType: "blob",
    data: data,
  });
}

export function 根据弦号查询人员(sideNum) {
  return request({
    url: `/app/user/getInfoBySideNum/${sideNum}`,
    method: "get",
  });
}
