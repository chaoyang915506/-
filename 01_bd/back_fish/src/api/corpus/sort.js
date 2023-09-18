import request from "@/utils/request";

export function 基本信息列表() {
  return request({
    url: `/app/base/list`,
    method: "get",
  });
}
export function 基本信息查询(code) {
  return request({
    url: `/app/base/getInfoByCode/${code}`,
    method: "get",
  });
}
export function 深测查询(code) {
  return request({
    url: `/app/sq/getInfoByCode/${code}`,
    method: "get",
  });
}
export function 推进查询(code) {
  return request({
    url: `/app/tj/getInfoByCode/${code}`,
    method: "get",
  });
}
export function 武器查询(code) {
  return request({
    url: `/app/wq/getInfoByCode/${code}`,
    method: "get",
  });
}
export function 作战查询(code) {
  return request({
    url: `/app/zz/getInfoByCode/${code}`,
    method: "get",
  });
}

export function 基本信息增加(data) {
  return request({
    url: "/app/base",
    method: "post",
    data,
  });
}
export function 基本信息修改(data) {
  return request({
    url: "/app/base",
    method: "put",
    data,
  });
}

export function 基本信息删除(code) {
  return request({
    url: `/app/base/remove/${code}`,
    method: "delete",
  });
}

export function 深测增加(data) {
  return request({
    url: "/app/sq",
    method: "post",
    data,
  });
}


export function 深测删除(ids) {
  return request({
    url: `/app/sq/remove/${ids}`,
    method: "delete",
  });
}

export function 推进增加(data) {
  return request({
    url: "/app/tj",
    method: "post",
    data,
  });
}


export function 推进删除(ids) {
  return request({
    url: `/app/tj/remove/${ids}`,
    method: "delete",
  });
}

export function 武器增加(data) {
  return request({
    url: "/app/wq",
    method: "post",
    data,
  });
}


export function 武器删除(ids) {
  return request({
    url: `/app/wq/remove/${ids}`,
    method: "delete",
  });
}

export function 作战增加(data) {
  return request({
    url: "/app/zz",
    method: "post",
    data,
  });
}


export function 作战删除(ids) {
  return request({
    url: `/app/zz/remove/${ids}`,
    method: "delete",
  });
}
