import request from "@/utils/request";

export function 首页资源列表() {
  return request({
    url: `/app/resources/list`,
    method: "get",
  });
}

export function 首页资源增加(data) {
  return request({
    url: "/app/resources",
    method: "post",
    data,
  });
}
export function 首页资源修改(data) {
  return request({
    url: "/app/resources",
    method: "put",
    data,
  });
}

export function 首页资源删除(resourceIds) {
  return request({
    url: `/app/resources/${resourceIds}`,
    method: "delete",
  });
}
