import request from "@/utils/request.js";
//统计分析-异物侵限综合风险分析
export function situationMatterRisk() {
  return request({
    url: "/system/assess/foreignMatterRisk",
    method: "post",
  });
}
//统计分析-单点监测点历史统计	year:年、month:月、day:日
export function situationmonitorHistoryRisk(params) {
  return request({
    url: "/system/assess/monitorHistoryRisk",
    method: "post",
    data: params,
  });
}
// 统计分析-路网历史统计
export function situationnetworkHistoryRisk(params) {
  return request({
    url: "/system/assess/networkHistoryRisk",
    method: "post",
    data: params,
  });
}
//统计分析-线路段历史统计
export function situationrouteHistoryRisk(parmas) {
  return request({
    url: "/system/assess/routeHistoryRisk",
    method: "post",
    data: parmas,
  });
}
//统计分析-恶劣天气综合风险分析
export function situationsevereWeatherRisk() {
  return request({
    url: "/system/assess/severeWeatherRisk",
    method: "post",
  });
}

//综合分析综合风险分析
export function getsynthesizeRisk() {
  return request({
    url: "/system/assess/synthesizeRisk",
    method: "post",
  });
}
export function situationriskDistribution(params) {
  return request({
    url: "/system/assess/riskDistribution",
    method: "post",
    data: params,
  });
}
// 态势/综合-单点监测点预测统计	态势预测和态势综合分析
// forecast:态势预测;synthesis:态势综合分析
export function situationmonitorForecastRisk(params) {
  return request({
    url: "/system/assess/monitorForecastRisk",
    method: "post",
    data: params,
  });
} //异物侵限综合风险预测分析
//forecast:态势预测;synthesis:态势综合分析
export function forMatForecastRisk(params) {
  return request({
    url: "/system/assess/forMatForecastRisk",
    method: "post",
    data: params,
  });
}
//-恶劣天气综合风险预测分析
//;forecast:态势预测;synthesis:态势综合分析
export function sevWeatForecastRisks(params) {
  return request({
    url: "/system/assess/sevWeatForecastRisk",
    method: "post",
    data: params,
  });
}
//路网预测统计
//forecast:态势预测;synthesis:态势综合分析 路网预测统计
export function lunetworkForecastRisk(params) {
  return request({
    url: "/system/assess/networkForecastRisk",
    method: "post",
    data: params,
  });
}
//路段近三个月预测统计forecast:态势预测;synthesis:态势综合分析
export function lineMonthsForecastRisk(params) {
  return request({
    url: "/system/assess/threeMonthsForecastRisk",
    method: "post",
    data: params,
  });
}
//中央图风险点分布
// ;forecast:态势预测;synthesis:态势综合分析
export function mapForecastDistribution(params) {
  return request({
    url: "/system/assess/riskForecastDistribution",
    method: "post",
    data: params,
  });
}

//未来风险预测;forecast:态势预测;synthesis:态势综合分析
export function synthesisForecastRisk(params) {
  return request({
    url: "/system/assess/synthesisForecastRisk",
    method: "post",
    data: params,
  });
}

//获取所有的路线检测点信息
export function getMountions() {
  return request({
    url: "/system/monitor/getAllMonitor",
    method: "post",
  });
}
//获取所有的路线
export function getAllAssessLines() {
  return request({
    url: "/system/assess/getAllAssessLines",
    method: "post",
  });
}
//获取所有的监测点
export function getAllGradeMonitors() {
  return request({
    url: "/system/assess/getAllGradeMonitors",
    method: "post",
  });
}