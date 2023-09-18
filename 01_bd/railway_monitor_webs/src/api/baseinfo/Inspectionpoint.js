import request from '@/utils/request'

// 监测点管理-列表
export function getMonitor(query) {
  return request({
    url: '/system/monitor/list',
    method: 'get',
    params: query
  })
}

// 新增监测点
export function addMonitor(data) {
  return request({
    url: '/system/monitor',
    method: 'post',
    data: data
  })
}

// 修改监测点
export function updateMonitor(data) {
  return request({
    url: '/system/monitor',
    method: 'put',
    data: data
  })
}

// 删除监测点
export function delMonitor(id) {
  return request({
    url: '/system/monitor/' + id,
    method: 'delete'
  })
}
// 根据id查询数据
export function getMonitorById(id) {
  return request({
    url: '/system/monitor/' + id,
    method: 'get'
  })
}

//新增前要的数据全部路线等监测点数据
export function addinfodata() {
  return request({
    method: "post",
    url: "system/monitor/getAllMonitor",
  });
}