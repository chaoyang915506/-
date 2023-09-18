import request from "@/utils/request";

export function 档案查询(name) {
  return request({
    url: `/app/subrecord/queryInfo/${name}`,
    method: "get",
  });
}

export function 档案保存(data) {
  return request({
    url: "/app/subrecord",
    method: "post",
    data,
  });
}
export function 档案修改(data) {
  return request({
    url: "/app/subrecord",
    method: "put",
    data,
  });
}

export function 档案删除(name) {
  return request({
    url: `/app/subrecord/remove/${name}`,
    method: "delete",
  });
}
