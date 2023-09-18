import request from "@/utils/request.js";
export function getTable(query) {
  return request({
    url: "/system/facility/list",
    method: "get",
    params: query,
  });
}
//新增
export function addfacility(body) {
  return request({
    url: "/system/facility",
    method: "post",
    data: body,
  });
}
//编辑
export function editfacility(body) {
  return request({
    url: "/system/facility",
    method: "put",
    data: body,
  });
}
export function deletefacility(ids) {
  return request({
    url: "/system/facility/" + ids,
    method: "delete",
  });
}
// 设备数量统计	type分为两种类型；facilityType:设备数量统计,facilityModel:异物监测摄像头型号数量
export function facilityCount(query) {
  return request({
    url: "/system/facility/facilityCount",
    method: "get",
    params: query,
  });
}

//气象灾害统计
export function WeatherDisasterCount() {
  return request({
    url: "/system/facility/getWeatherDisasterCount",
    method: "post",
  });
}
//获取全部检测点
export function getAllMonitor() {
  return request({
    url: "/system/monitor/getAllMonitor",
    method: "post",
  });
}

export class DataFrom {
  constructor() {
    this.id = "";
    this.route = "";
    // this.monitor = {

    // };
    this.monitoringScene = "";
    this.monitoringPointGrade = "";
    this.monitoringPointName = "";
    this.lat = "";
    this.lon = "";
    this.facilityType = "";
    this.facilityModel = "";
    this.monitorId = "";
    this.createTime =
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate() +
      " " +
      new Date().getHours() +
      ":" +
      new Date().getSeconds() +
      ":" +
      new Date().getMinutes();
  }
}
export const sceneList = [
  { value: '0', label: "气象检测" },
  { value: '1', label: "异物检测" },
];
