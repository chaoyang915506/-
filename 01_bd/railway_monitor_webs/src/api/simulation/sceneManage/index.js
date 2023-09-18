import request from '@/utils/request'
//列表查询
export function getSce(query) {
  return request({
    url: '/simulation/scene/selectScenarioSimulationList',
    method: 'get',
    params: query
  })
}
//获取图片列表
export function getPicList(query) {
  return request({
    url: '/simulation/scene/findList',
    method: 'post',
    data: query
  })
}
// 新增仿真
export function addPic(query) {
  return request({
    url: '/simulation/scene/insertScenarioSimulation',
    method: 'post',
    data: query
  })
}
// 获取监测点列表
export function getMonitor() {
  return request({
    url: '/simulation/scene/selectMonitor',
    method: 'get',
  })
}
// 获取策略库列表
export function getPolicyLibrary() {
  return request({
    url: '/simulation/scene/selectPolicyLibraryList',
    method: 'get',
  })
}
// 获取评价列表
export function getEvaluationList() {
  return request({
    url: '/simulation/scene/selectEvaluationList',
    method: 'get',
  })
}
// 获取应急预案列表
export function getContingencyPlanList() {
  return request({
    url: '/simulation/scene/selectSContingencyPlanList',
    method: 'get',
  })
}
// 删除
export function deleteSce(ids) {
  return request({
    url: '/simulation/scene/deleteScenarioSimulationByIds/'+ids,
    method: 'delete',
  })
}
// 保存情景
export function updateSce(params) {
  return request({
    url: '/simulation/scene/updateScenarioSimulation',
    method: 'post',
    data:params
  })
}
// 添加策略库
export function  addPolicy(params) {
  return request({
    url: '/simulation/scene/insertPolicyLibrary',
    method: 'post',
    data:params
  })
}
// 详情
export function  getSceById(id) {
  return request({
    url: '/simulation/scene/selectScenarioSimulationById/'+id,
    method: 'get',
  })
}