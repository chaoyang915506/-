import request from "@/utils/request";

export function 母港列表查询() {
  return request({
    url: `/app/harbor/list`,
    method: "get",
  });
}

export function 母港增加(data) {
  return request({
    url: "/app/harbor",
    method: "post",
    data,
  });
}
export function 母港修改(data) {
  return request({
    url: "/app/harbor",
    method: "put",
    data,
  });
}

export function 母港删除(harborIds) {
  return request({
    url: `/app/harbor/${harborIds}`,
    method: "delete",
  });
}
