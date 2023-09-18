import request from "@/utils/request";


// 获取所有路线
export function getAllLines(data) {
  return request({
    url: '/simulation/overview/screen',
    method: 'get',
    data: data
  })
}
// 真实设备与仿真设备统计
export function getEquipmentCount(data) {
  return request({
    url: "/simulation/overview/getEquipmentCount",
    method: "get",
    data: data,
  });
}

// 根据线路查询线路上监测点的信息和状态
export function selectMonitor(data) {
  return request({
    url: "/simulation/overview/selectMonitor",
    method: "post",
    params: data,
  });
}
// 获取监测点信息
export function getMonitorById(id) {
  return request({
    url: "/simulation/monitor/echo/" + id,
    method: "get",
  });
}

//新增前要的数据全部路线等监测点数据
export function addinfodata() {
  return request({
    method: "post",
    url: "system/monitor/getAllMonitor",
  });
}