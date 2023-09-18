import request from '@/utils/request.js'
export function 查询母港信息() {
    return request({
        method: 'get',
        url: '/app/harbor/info'
    })
}
export function 查询组织机构(name) {
    return request({
        url: "/app/org/tree",
        method: "get",
        params: name,
    });
}
export function 组织人员列表(name) {
    return request({
        url: "/app/user/list",
        method: "get",
        params: name,
    });
}
export function 组织机构模块所属舰艇查询(name) {
    return request({
        url: "/app/subdata/getBtoNvInfo",
        method: "get",
        params: name,
    });
}
export function 组织机构指挥官查询(name) {
    return request({
        url: "/app/user/getCmdrInfo",
        method: "get",
        params: name,
    });
}
export function 组织机构查询(id) {
    return request({
        url: "/app/org/" + id,
        method: "get",
    });
}
export function 组织人员详情查询(id) {
    return request({
        url: "/app/user/" + id,
        method: "get",
    });
}
export function 人员教育经历查询(id) {
    return request({
        url: "/app/edu/getInfoByOrgUserId/" + id,
        method: "get",
    });
}
export function 人员工作经历查询(id) {
    return request({
        url: "/app/wkx/getWkxByOrgUserId/" + id,
        method: "get",
    });
}
export function 个人能力查询(data) {
    return request({
        url: "/app/ps/getInfoById",
        method: "get",
        params: data
    });
}
export function 个人能力查询Type2(orgUserId) {
    return request({
      url: `/app/ps/getInfoById/?orgUserId=${orgUserId}`,
      method: "get",
    });
  }
export function 人物关系查询(data) {
    return request({
        url: "/app/user/getCrInfo",
        method: "get",
        params: data
    });
}
export function 根据舷号获取人物详情(sideNum) {
    return request({
        url: "/app/user/getInfoBySideNum/" + sideNum,
        method: "get",
    });
}
export function 组织机构战例查询(orgId) {
    return request({
        url: "/app/seop/getInfoByOrgId/" + orgId,
        method: "get",
    });
}
export function 组织机构获取人员演训经历查询(orgUserId) {
    return request({
        url: "/app/ep/getInfoByOrgUserId/" + orgUserId,
        method: "get",
    });
}

