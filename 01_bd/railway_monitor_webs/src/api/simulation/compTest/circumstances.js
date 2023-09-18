import request from "@/utils/request.js";

// 情景库查询
export function getScenesList(query) {
  return request({
    url: "/simulation/scenes/list",
    method: "post",
    data: query,
  });
}
// 情景库新增
export function addScenes(data) {
  return request({
    url: "/simulation/scenes/add",
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
    data: data
  });
}
// 情景库删除
export function deleteScenes(ids) {
  return request({
    url: "/simulation/scenes/delete/"+ids,
    method: "delete",
  });
}
//组态查询
export function getconfigurationCount(query) {
  return request({
    url: "/system/configuration/configurationCount",
    method: "get",
    params: query,
  });
}

//情景集气象组态统计
export function getWeatherconfig() {
  return request({
    url: "/simulation/environmentConfig/getWeatherConfigCount",
    method: "get",
  });
}
// 情景集异物组态统计
export function getFormattconfig() {
  return request({
    url: "/simulation/matterConfig/getForMattConfigCount",
    method: "get",
  });
}
//情景集场景组态统计
export function getSceneconfig() {
  return request({
    url: "/simulation/sceneConfig/getSceneConfigCount",
    method: "get",
  });
}