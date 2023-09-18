import request from "@/utils/request";
export function 查询组织机构(name) {
  return request({
    url: "/app/org/tree",
    method: "get",
    params: name,
  });
}
export function 查询母港() {
  return request({
    url: "/app/harbor/info",
    method: "get",
  });
}
export function 查询自定义() {
  return request({
    url: "/app/submaine/list",
    method: "get",
  });
}

export function 查询兵力部署() {
  return request({
    url: "/app/submaine/queryTroops",
    method: "get",
  });
}
export function 单艇战备率(name) {
  return request({
    url: "/app/subdata/getWarInfo/" + name,
    method: "get",
  });
}
export function 单艇停泊位置点(name) {
  return request({
    url: "/app/subdata/getberthInfo/" + name,
    method: "get",
  });
}
export function 单艇战备出动率(name) {
  return request({
    url: "/app/subdata/getInfo/" + name,
    method: "get",
  });
}
export function 潜艇信息根据舷号查询(sideNum) {
  return request({
    url: "/app/submaine/queryInfo/" + sideNum,
    method: "get",
  });
}
export function 母港信息管理查询(harborId) {
  return request({
    url: "/app/harbor/" + harborId,
    method: "get",
  });
}
export function 战备详情查询(names) {
  return request({
    url: '/app/sit/state/query/V2',
    method: 'get',
    params: names
  })
}
export function 战备详情查询V3(names) {
  return request({
    url: '/app/sit/state/query/V3',
    method: 'get',
    params: names
  })
}
export function 统计分析自定义(names) {
  return request({
    url: "/app/sta/compare",
    method: "post",
    data: names,
  });
}
export function 兵力部署查询() {
  return request({
    url: "/app/sta/blbs",
    method: "get",
  });
}
export function 母港战备出动频率(data) {
  return request({
    url: "/app/sta/hompot/getCdRate",
    method: "post",
    data,
  });
}
export function 母港舰型统计(data) {
  return request({
    url: "/app/sta/hompot/getWSStat",
    method: "post",
    data,
  });
}
export function 母港靠泊本港舰船类别列表(data) {
  return request({
    url: "/app/sta/hompot/getVesselTypes",
    method: "post",
    data,
  });
}

export function 单艇生命周期查询(name) {
  return request({
    url: "/app/subdata/getlifeInfo",
    method: "get",
    params: name,
  });
}

export function 单艇生命周期查询新(beginTime, endTime, names) {
  return request({
    url: `/app/subdata/getlifeInfoNew?beginTime=${beginTime}&endTime=${endTime}&names=${names}`,
    method: "get",
  });
}

export function 单艇生命周期查询新时间轴调用(name) {
  return request({
    url: `/app/subdata/getlifeInfoNew`,
    method: "get",
    params: name,
  });
}

// { id:}
export function 密度分析日历图查询(data) {
  return request({
    url: "/app/subdata/getDeployInfo",
    method: "get",
    params: data,
  });
}
export function 战备出动频率分析多(data) {
  return request({
    url: "/app/subdata/getDcInfo",
    method: "get",
    params: data,
  });
}
export function 部署密度分析日历图多(data) {
  return request({
    url: "/app/subdata/getDeployInfo",
    method: "get",
    params: data,
  });
}
export function 大队中队船型占比查询(data) {
  return request({
    url: "/app/subdata/getShipTypeInfo",
    method: "get",
    params: data,
  });
}
//位置
export function 司令部大队中队概况(data) {
  return request({
    url: "/app/org/" + data,
    method: "get",
  });
}

export function 转港校验(names) {
  return request({
    url: "/app/sta/check/checkTransfer",
    method: "post",
    data: names,
  });
}

export function 单艇生命周期(names, beginTime, endTime) {
  return request({
    url: `/app/subdata/getlifeInfo/?names=${names}&beginTime=${beginTime}&endTime=${endTime}`,
    method: "get",
    data: names,
  });
}
export function 部署时长(data) {
  return request({
    url: `/app/subdata/getDeployDuration`,
    method: "get",
    params: data,
  });
}
//wei
export function 战备出动频率分析部署次数(data) {
  return request({
    url: `/app/subdata/getDcInfo`,
    method: "get",
    params: data,
  });
}

export function 战备出动频率分析维修次数(id) {
  return request({
    url: `/app/subdata/getServiceCount/${id}`,
    method: "get",
  });
}
//
export function 母港日历图(data) {
  return request({
    url: `/app/sta/hompot/getCalendar`,
    method: "post",
    data,
  });
}

export function 通用查询舷号(data) {
  return request({
    url: `/app/submaine/querySideNumById`,
    method: "get",
    params: data,
  });
}
export function 态势模块状态信息根据弦号列表查询V2(data) {
  return request({
    url: `/app/sit/state/list/V2`,
    method: "post",
    data,
  });
}
export function 态势模块状态信息根据弦号列表查询V3(data) {
  return request({
    url: `/app/sit/state/list/V3`,
    method: "post",
    data,
  });
}
export function 根据母港ID查询潜艇信息历史(harborId) {
  return request({
    url: `/app/hisc/getInfoByHarborId/${harborId}`,
    method: "get",
  });
}
export function 查询图片服务器地址() {
  return request({
    url: `/app/config`,
    method: "get",
  });
}
export function 社交媒体信息(params) {
  return request({
    url: `/app/sm/listBySn/?sideNum=${params.sideNum}&pageNum=${params.pageNum}&pageSize=${params.pageSize}`,
    // url: `/app/sm/listBySn/`,
    method: "get",
  });
}