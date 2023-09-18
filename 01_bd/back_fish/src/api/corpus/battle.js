import request from "@/utils/request";

export function 战例查询(orgId) {
  return request({
    url: `/app/seop/getInfoByOrgId/${orgId}`,
    method: "get",
  });
}

export function 战例保存(data) {
  return request({
    url: "/app/seop",
    method: "post",
    data,
  });
}
export function 战例修改(data) {
  return request({
    url: "/app/seop",
    method: "put",
    data,
  });
}

export function 战例删除(orgId) {
  return request({
    url: `/app/seop/remove/${orgId}`,
    method: "delete",
  });
}
