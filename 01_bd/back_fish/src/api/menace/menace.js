import request from "@/utils/request";

export function 获取范围区域() {
  return request({
    url: "/app/thr/list",
    method: "get",
  });
}

export function 获取范围区域V2() {
  return request({
    url: "/app/thr/list/v2",
    method: "get",
  });
}

export function 威胁预测(sideNums, days) {
  return request({
    url: `/app/thr/pre/list/?days=${days}&sideNums=${sideNums}`,
    method: "get",
  });
}

export function 威胁预测V2(sideNums, days) {
  return request({
    url: `/app/thr/pre/list/v2/?date=${days}&sideNums=${sideNums}`,
    method: "get",
  });
}

export function 态势分析五边图() {
  return request({
    url: `/app/thr/result/graph`,
    method: "get",
  });
}

export function 获取弦号列表(data) {
  return request({
    url: `/app/thr/query/sqqy`,
    method: "post",
    data,
  });
}

export function 获取弦号列表V2(data) {
  return request({
    url: `/app/thr/query/sqqy/V2`,
    method: "post",
    data,
  });
}
export function 获取弦号列表V3(data) {
  return request({
    url: `/app/thr/query/sqqy/V3`,
    method: "post",
    data,
  });
}
export function 预测根据弦号列表查询(data) {
  return request({
    url: `/app/thr/forecas/query`,
    method: "get",
    params: data,
  });
}
export function 预测根据弦号列表查询V2(data) {
  return request({
    url: `/app/thr/forecas/query/V2`,
    method: "get",
    params: data,
  });
}
export function 威胁分析预测弦号日历集合(data) {
  return request({
    url: `/app/thr/forecas/getCalendarV2/${data}`,
    method: "get",
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
    // params:data
  });
}
