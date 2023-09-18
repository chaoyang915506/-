import request from "@/utils/request";

export function 统计信息管理列表(params) {
    return request({
        url: `/app/subdata/list`,
        method: "get", params
    });
}

export function 统计信息管理增加(data) {
    return request({
        url: "/app/subdata",
        method: "post",
        data,
    });
}
export function 统计信息管理编辑(data) {
    return request({
        url: "/app/subdata",
        method: "put",
        data,
    });
}

export function 统计信息管理查询(pids) {
    return request({
        url: `/app/subdata/${pids}`,
        method: "get",
    });
}
export function 统计信息管理删除(pids) {
    return request({
        url: `/app/subdata/${pids}`,
        method: "delete",
    });
}


// addr	${comment}	string	
// begintime	开始时间	string(date-time)	
// berthCount	停泊次数	integer(int32)	
// c1		string	
// c2		string	
// count	战备出动率次数	integer(int32)	
// createBy	创建者ID	integer(int64)	
// createTime		string(date-time)	
// deployCount	部署次数	integer(int32)	
// deploymentFlag	部署标识	string	
// deploymentSite	${comment}	string	
// detail	${comment}	string	
// endtime	结束时间	string(date-time)	
// event	事件	string	
// harborName	母港名称	string	
// harborZh	母港名称	string	
// id	主键ID	integer(int64)	
// jtType	舰艇类型(级别)	string	
// num	${comment}	integer(int64)	
// paramList	月份	array	TblSubdataQueryParam
// priority	${comment}	integer(int64)	
// remark		string	
// serviceCount	维修次数	integer(int32)	
// source	${comment}	string	
// states	${comment}	string	
// updateBy		integer(int64)	
// updateTime		string(date-time)	
// year	战备出动率年份