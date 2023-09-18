import request from "@/utils/request";

export function 组织人员增加(data) {
  return request({
    url: "/app/user",
    method: "post",
    data,
  });
}
export function 组织人员修改(data) {
  return request({
    url: "/app/user",
    method: "put",
    data,
  });
}

export function 教育经历增加(data) {
  return request({
    url: "/app/edu",
    method: "post",
    data,
  });
}
export function 教育经历修改(data) {
  return request({
    url: "/app/edu",
    method: "put",
    data,
  });
}

export function 工作经历增加(data) {
  return request({
    url: "/app/wkx",
    method: "post",
    data,
  });
}
export function 工作经历修改(data) {
  return request({
    url: "/app/wkx",
    method: "put",
    data,
  });
}

export function 演训经历增加(data) {
  return request({
    url: "/app/ep",
    method: "post",
    data,
  });
}
export function 演训经历修改(data) {
  return request({
    url: "/app/ep",
    method: "put",
    data,
  });
}
export function 个人能力增加(data) {
  return request({
    url: "/app/ps",
    method: "post",
    data,
  });
}
export function 个人能力修改(data) {
  return request({
    url: "/app/ps",
    method: "put",
    data,
  });
}

export function 人员删除(orgUserId) {
  return request({
    url: `/app/user/remove/${orgUserId}`,
    method: "delete",
  });
}

export function 多媒体数据上传(data) {
  return request({
    url: "/common/upload/media",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data,
  });
}
