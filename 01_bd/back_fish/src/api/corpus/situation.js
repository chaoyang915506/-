import request from '@/utils/request.js'

export function 将excel数据导入数据库(data) {
    return request({
        url: `/app/subdata/importData`,
        method: "post",
        data
    });
}

export function 态势管理列表(params) {
    return request({
        url: `/app/situation/list`,
        method: "get", params
    });
}

export function 态势管理增加(data) {
    return request({
        url: "/app/situation",
        method: "post",
        data,
    });
}
export function 态势管理编辑(data) {
    return request({
        url: "/app/situation",
        method: "put",
        data,
    });
}

export function 态势管理查询(pids) {
    return request({
        url: `/app/situation/${pids}`,
        method: "get",
    });
}
export function 态势管理删除(pids) {
    return request({
        url: `/app/situation/${pids}`,
        method: "delete",
    });
}


// begintime	开始时间	query	false	
// string
// ct	当前时间	query	false	
// string
// duration	间隔天数	query	false	
// string
// endtime	结束时间	query	false	
// string
// flag	标志位	query	false	
// string
// // id	百分比	query	false	
// integer(int64)
// isAsc		query	false	
// string
// // name	舰艇名	query	false	
// string
// orderBy		query	false	
// string
// orderByColumn		query	false	
// string
// pageNum		query	false	
// integer(int32)
// pageSize		query	false	
// integer(int32)
// percent	百分比	query	false	
// string
// position	位置	query	false	
// string
// reasonable		query	false	
// boolean
// states	状态