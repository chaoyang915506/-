import request from '@/utils/request'

// 实时状态---设备状态、数量
export function getFacilityCount(data) {
  return request({
    url: '/system/facility/getFacilityCount',
    method: 'post',
    params: data
  })
}
// 实时状态---获取前7个风险次数最多的监测点
export function getMonitorRiskCount(data) {
  return request({
    url: '/system/analyse/getMonitorRiskCount',
    method: 'post',
    params: data
  })
}
// 实时状态---监测点实时风险预测
export function getRealTimeRisk(data) {
  return request({
    url: '/system/analyse/getRealTimeRisk',
    method: 'post',
    params: data
  })
}
// 实时状态---获取风险统计
export function getRiskStat(data) {
  return request({
    url: '/system/analyse/getRiskStat',
    method: 'post',
    params: data
  })
}
// 实时状态-获取实时状态中所有监测点
export function getAllMonitorAndCoord(data) {
  return request({
    url: '/system/analyse/getAllMonitorAndCoord',
    method: 'post',
    data: data
  })
}
// 实时状态-监测点基本信息 
export function getMonitorInfo(data) {
  return request({
    url: '/system/analyse/getMonitorInfo',
    method: 'post',
    params: data
  })
}
// 实时状态- 获取天气情况 
export function getRealTimeWeather(data) {
  return request({
    url: '/system/history/getRealTimeWeather',
    method: 'post',
    params: data
  })
}
// 实时状态- 获取所有恶劣天气的接口 
export function getAllSevWeather(data) {
  return request({
    url: '/system/analyse/getAllSevWeather',
    method: 'post',
    params: data
  })
}
// 实时状态-获取实时风险等级 
export function getRiskGrade(data) {
  return request({
    url: '/system/analyse/getRiskGrade',
    method: 'post',
    params: data
  })
}
// 实时状态-获取实时风险等级 
export function getSynAnalyse(query) {
  return request({
    url: '/system/analyse/getSynAnalyse',
    method: 'get',
    params: query
  })
}