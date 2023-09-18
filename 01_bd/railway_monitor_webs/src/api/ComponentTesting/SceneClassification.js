import request from "@/utils/request.js";

// 地图配置-线路列表查询
export function getPlan(query) {
    return request({
      url: '/simulation/environment/listPage',
      method: 'post',
      data: query
    })
  }
  // 根据id查询数据
  export function getPlanById(id) {
    return request({
      url: '/simulation/environment/find/' + id,
      method: 'get',
    })
  }
//异物库表/system/matter/list
// export function getforeign(query) {
//   return request({
//     url: "/system/matter/list",
//     method: "get",
//     params: query,
//   });
// }
// export function addforeign(params) {
//   return request({
//     url: "/system/matter",
//     method: "post",
//     data: params,
//   });
// }

//异物数据统计
// export function textureCount() {
//   return request({
//     url: "/system/matter/textureCount",
//     method: "get",
//   });
// }

//场景库查询
// export function scencelist(query) {
//   return request({
//     url: "/system/scene/list",
//     method: "get",
//     params: query,
//   });
// }
// 场景库的数量查询
// export function scenceCount(query) {
//   return request({
//     url: "/system/scene/sceneTypeCount",
//     method: "get",
//     params: query,
//   });
// }

// 环境库查询
// export function getenvironment(query) {
//   return request({
//     method: "get",
//     url: "/system/environment/list",
//     params: query,
//   });
// }
// 环境 气象分类统计
export function getweatherCount(query) {
  return request({
    method: "get",
    url: "/system/environment/weatherCount",
    params: query,
  });
}
//环境 自然环境分类
// export function getenvironmentCount(query) {
//   return request({
//     url: "/system/environment/environmentCount",
//     method: "get",
//     params: query,
//   });
// }

// 情景库查询
// export function getsystemlist(query) {
//   return request({
//     url: "/system/set/list",
//     method: "get",
//     params: query,
//   });
// }

//组态查询
// export function getconfigurationCount(query) {
//   return request({
//     url: "/system/configuration/configurationCount",
//     method: "get",
//     params: query,
//   });
// }
