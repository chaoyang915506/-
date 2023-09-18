import request from "@/utils/request";

export function 潜艇预测管理列表(params) {
    return request({
        url: `/app/predict/list`,
        method: "get", params
    });
}

export function 潜艇预测管理增加(data) {
    return request({
        url: "/app/predict",
        method: "post",
        data,
    });
}
export function 潜艇预测管理编辑(data) {
    return request({
        url: "/app/predict",
        method: "put",
        data,
    });
}

export function 潜艇预测管理查询(pids) {
    return request({
        url: `/app/predict/${pids}`,
        method: "get",
    });
}
export function 潜艇预测管理删除(pids) {
    return request({
        url: `/app/predict/${pids}`,
        method: "delete",
    });
}


