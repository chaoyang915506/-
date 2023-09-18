import request from '@/utils/request'

// 预案-列表
export function getPlan(query) {
  return request({
    url: '/system/plan/list',
    method: 'get',
    params: query
  })
}

// 新增预案
export function addPlan(data) {
  return request({
    url: '/system/plan',
    method: 'post',
    data: data
  })
}

// 修改预案
export function updatePlan(data) {
  return request({
    url: '/system/plan',
    method: 'put',
    data: data
  })
}

// 删除预案
export function delPlan(id) {
  return request({
    url: '/system/plan/' + id,
    method: 'delete'
  })
}
// 根据id查询数据
export function getPlanById(id) {
  return request({
    url: '/system/plan/' + id,
    method: 'get'
  })
}

// 预案流程管理-列表

export function getFlow(query) {
  return request({
    url: '/system/flow/list',
    method: 'get',
    params: query
  })
}
// 启动应急预案-查询推荐预案
export function getRiskGradePlan(data) {
  return request({
    url: '/system/index/getRiskGradePlan',
    method: 'post',
    data: data
  })
}
// 启动应急预案(新增数据到应急处理表)
export function startContingencyPlan(data) {
  return request({
    url: '/system/index/startContingencyPlan',
    method: 'post',
    data: data
  })
}
// 应急预案管理-查询
export function getPreviewById(id) {
  return request({
    url: '/system/plan/preview/' + id,
    method: 'get',
  })
}