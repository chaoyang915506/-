import request from "@/utils/request";

export function 潜艇信息列表() {
  return request({
    url: "/app/submaine/list",
    method: "get",
  });
}

export function 母港信息列表() {
  return request({
    url: "/app/harbor/list",
    method: "get",
  });
}

export function 潜艇信息增加(data) {
  return request({
    url: "/app/submaine",
    method: "post",
    data,
  });
}
export function 潜艇信息修改(data) {
  return request({
    url: "/app/submaine",
    method: "put",
    data,
  });
}

export function 潜艇信息删除(smIds) {
  return request({
    url: `/app/submaine/${smIds}`,
    method: "delete",
  });
}

export function 组织机构列表() {
  return request({
    url: `/app/org/list`,
    method: "get",
  });
}
