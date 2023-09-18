import request from '@/utils/request'
// 策略组件-策略库

//查询
export function getModelList(query) {
  return request({
    url: '/simulation/model/selectModelListByName',
    method: 'get',
    params: query
  })
}

// 详情
export function getModelById(id) {
  return request({
    url: '/simulation/model/selectModelById/' + id,
    method: 'get',
  })
}

// 统计列表
export function getModelCount(query) {
  return request({
    method: "get",
    url: "/simulation/model/getModelCount",
    params: query,
  });
}