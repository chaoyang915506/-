import request from "@/utils/request";

export function 组织机构列表() {
  return request({
    url: `/app/org/list`,
    method: "get",
  });
}

export function 组织机构增加(data) {
  return request({
    url: "/app/org",
    method: "post",
    data,
  });
}
export function 组织机构修改(data) {
  return request({
    url: "/app/org",
    method: "put",
    data,
  });
}

export function 组织机构删除(orgIds) {
  return request({
    url: `/app/org/${orgIds}`,
    method: "delete",
  });
}
