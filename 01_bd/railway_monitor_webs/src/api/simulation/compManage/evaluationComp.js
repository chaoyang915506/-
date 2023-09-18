import request from '@/utils/request'

// 列表查询
export function getEva(query) {
  return request({
    url: '/simulation/evaluation/listPage',
    method: 'post',
    data: query
  })
}
export function getEvaById(id) {
  return request({
    url: '/simulation/evaluation/find/'+id,
    method: 'get',
  })
}

// 添加
export function addEva(data) {
  return request({
    url: '/simulation/evaluation/add',
    method: "post",
    data:data
  })
}
//删除
export function deleteEva(ids) {
  return request({
    url: '/simulation/evaluation/delete/' + ids,
    method: 'delete',
  })
}
// 编辑
export function editEva(query) {
  return request({
    url: '/simulation/evaluation/update',
    method: 'put',
    data: query
  })
}