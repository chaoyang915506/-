import request from "@/utils/request";

// 实时综合风险走势
export function getRealTimeComprehensiveRiskTrend(data) {
  return request({
    url: "/system/index/getRealTimeComprehensiveRiskTrend",
    method: "post",
    data: data,
  });
}
// 今日异物侵限高发监测点统计
export function getForeignBodyStatistics(data) {
  return request({
    url: "/system/index/getForeignBodyStatistics",
    method: "post",
    data: data,
  });
}
// 今日恶劣天气统计
export function getBadWeatherStatistics(data) {
  return request({
    url: "/system/index/getBadWeatherStatistics",
    method: "post",
    data: data,
  });
}
// 综合风险
export function getSynRisk(data) {
  return request({
    url: "/system/index/getSynRisk",
    method: "post",
    data: data,
  });
}
// 设备总数和报警监测点
export function getFacAndWarnMonitor(data) {
  return request({
    url: "/system/index/getFacAndWarnMonitor",
    method: "post",
    data: data,
  });
}
// 未来趋势预测和历史事件趋势
export function getHisAndForecast(data) {
  return request({
    url: "/system/index/getHisAndForecast",
    method: "post",
    data: data,
  });
}
// 监测点综合风险排名变化
export function getMonitorRiskRank(data) {
  return request({
    url: "/system/index/getMonitorRiskRank",
    method: "post",
    data: data,
  });
}
// 当天异物侵限预警
export function getForMatWarn(data) {
  return request({
    url: "/system/index/getForMatWarn",
    method: "post",
    data: data,
  });
}
// 当天天气预警
export function geSevWeatherWarn(data) {
  return request({
    url: "/system/index/geSevWeatherWarn",
    method: "post",
    data: data,
  });
}
// 当天设备预警
export function getFacilityWarn(data) {
  return request({
    url: "/system/index/getFacilityWarn",
    method: "post",
    data: data,
  });
}
// 当天综合预警
export function getSynWarn(data) {
  return request({
    url: "/system/index/getSynWarn",
    method: "post",
    data: data,
  });
}
// 当天预警统计
export function getWarnState(data) {
  return request({
    url: "/system/index/getWarnState",
    method: "post",
    data: data,
  });
}
// 关键监测点实况
export function getCriMonitorScene(data) {
  return request({
    url: "/system/index/getCriMonitorScene",
    method: "post",
    data: data,
  });
}
// 地图数据
export function getMapInformation(query) {
  return request({
    url: '/system/index/getMapInformation',
    method: 'get',
    params: query
  })
}
// 查看预警的线路
export function getWarnLine(data) {
  return request({
    url: "/system/index/getWarnLine",
    method: "post",
    data: data,
  });
}
// 根据线路查询线路上监测点的信息和状态
export function getLineMonitorState(data) {
  return request({
    url: '/system/index/getLineMonitorState',
    method: 'post',
    data: data
  })
}
// 查看详情-误报(误报数据加入失效库)
export function insertFailure(data) {
  return request({
    url: '/system/index/insertFailure',
    method: 'post',
    data: data
  })
}
// 获取所有路线
export function getAllLines(data) {
  return request({
    url: '/system/index/getAllLines',
    method: 'post',
    data: data
  })
}
// 获取筛选路线数据
export function getFilterMapInfor(ids) {
  return request({
    url: '/system/index/getFilterMapInfor/'+ ids,
    method: 'get'
  })
}
// 查看监测点的信息
export function getMonitor(query) {
  return request({
    url: '/system/index/getMonitor',
    method: 'get',
    params: query
  })
}
// 查看详情
export function getMonitorParticulars(query) {
  return request({
    url: '/system/index/getMonitorParticulars',
    method: 'get',
    params: query
  })
}
// 技术参数
export function getFacilityTecSpec(query) {
  return request({
    url: '/system/index/getFacilityTecSpec',
    method: 'get',
    params: query
  })
}
