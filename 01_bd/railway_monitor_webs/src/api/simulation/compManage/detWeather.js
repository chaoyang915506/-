import request from "@/utils/request.js";
export function getTable(query) {
  return request({
    url: "/simulation/facility/listPage",
    method: "post",
    data: query,
  });
}
// 文件上传
export const uploadFile = (data) => {
  return request({
    url: '/commonFile/upload',
    method: 'post',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
    data: data
  })
}
//新增
export function addfacility(body) {
  return request({
    url: "/simulation/facility/add",
    method: "post",
    data: body,
  });
}
// 根据id查询数据
export function getfacilityById(id) {
  return request({
    url: '/simulation/facility/find/' + id,
    method: 'get'
  })
}
//编辑
export function editfacility(body) {
  return request({
    url: "/simulation/facility/update",
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
// 设备数量统计
export function facilityCount(x) {
  return request({
    url: "/simulation/facility/findFacilityTypeCount",
    method: "get",
  });
}
// 摄像头型号数量统计
export function findFacilityModelCount() {
  return request({
    url: "/simulation/facility/findFacilityModelCount",
    method: "get",
  });
}
//气象灾害统计
export function WeatherDisasterCount() {
  return request({
    url: "/simulation/facility/findWeatherDisasterCount",
    method: "get",
  });
}
//获取全部检测点
export function getAllMonitor() {
  return request({
    url: "/system/monitor/getAllMonitor",
    method: "post",
  });
}
//近半年异物侵限走势统计
export function getForMatTrendall() {
  return request({
    method: "get",
    url: "/simulation/facility/findForeignMatterTrendCount",
  });
}

//新增前要的数据 查询路线和监测点
export function addinfodata() {
  return request({
    method: "get",
    url: "/simulation/map/findLineTree",
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
    // this.lat = "";
    // this.lon = "";
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
  { value: "0", label: "气象检测" },
  { value: "1", label: "异物检测" },
];
