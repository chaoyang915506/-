import request from "@/utils/request";

export function 账号列表查询() {
  return request({
    url: `/app/acct/list`,
    method: "get",
  });
}

export function 账号增加(data) {
  return request({
    url: "/app/acct",
    method: "post",
    data,
  });
}
export function 账号修改(data) {
  return request({
    url: "/app/acct",
    method: "put",
    data,
  });
}

export function 账号删除(ids) {
  return request({
    url: `/app/acct/${ids}`,
    method: "delete",
  });
}
