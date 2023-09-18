// import { dataStack } from "echarts/lib/helper";

export function 格式化兵力部署(data, dict) {
    // console.log(data, '兵力');
    let arr = [{
        key: 1,
        name: '太平洋(东——西)'
    }, {
        key: 2,
        name: '大西洋(北——南)'
    }]
    let newdata = data.filter(i => i.blbs).map(i => {
        let k = dict.find(idx => idx.dictValue == i.blbs)
        if (k) {
            return { ...i, keyname: k.dictLabel }
        }
    })

    //大西洋的数据
    let eastD = newdata.filter(i => i.ssqy == 1)
    let obj1 = {}
    // 重新处理成{chilren：【】}
    for (let key in eastD) {
        let kv = eastD[key]
        if (!obj1[kv.keyname]) {
            obj1[kv.keyname] = []
        } else {
            obj1[kv.keyname].push(kv)

        }
    }
    for (let key in obj1) {
        if (!arr[0].children) {
            arr[0].children = [{
                name: key,
                children: obj1[key]
            }]
        } else {
            arr[0].children.push({
                name: key,
                children: obj1[key]
            })
        }
    }
    // 大西洋下的数据
    // console.log('处理出来', obj1, arr,);
    let southD = newdata.filter(i => i.ssqy == 2)
    let obj2 = {}
    // 重新处理成{chilren：【】}
    for (let key in southD) {
        let kv = southD[key]
        if (!obj2[kv.keyname]) {
            obj2[kv.keyname] = []
        } else {
            obj2[kv.keyname].push(kv)

        }
    }
    for (let key in obj2) {
        if (!arr[1].children) {
            arr[1].children = [{
                name: key,
                children: obj2[key]
            }]
        } else {
            arr[1].children.push({
                name: key,
                children: obj2[key]
            })
        }
    }

    // console.log('处理出来', arr,);
    return arr




}



/**
 * 
 * @param {*} data 
 * @param {*} year 
 */
export function formatterdate(data, year, rd) {
    //筛选出所有的年份去重
    let yearmun = [...new Set(data.map(i => i.year))]

    //取到最大的年
    // let maxyear = Math.max.apply(null, yearmun)
    let maxyear = new Date().getFullYear()

    //要查看多少年的数据
    let lookyear = year

    // console.log(year)
    //要遍历的年10年
    let traverselist = []

    //判断取全部年还是取指定的年的数量
    if (lookyear == null) {
        traverselist = yearmun.sort((a, b) => a - b)
    } else if (lookyear == 1) {
        traverselist = [maxyear]
    } else {
        // 存年的list取10年
        for (let i = 0; i < lookyear; i++) {
            traverselist.unshift(maxyear - i)
        }

    }

    //年 排序后的数据
    let yearlist = data.sort((a, b) => a.year - b.year)

    //要reurn 的数据
    let arr = []
    // console.log(traverselist)

    let y //当前遍历的年
    traverselist.forEach((i, j) => {
        y = i
        //查询到当前数据的count
        let newyear = yearlist.filter(item => item.year == y).sort((a, b) => a.month - b.month)
        for (let k = 0; k < 12; k++) {
            // console.log(newyear, 'y')
            let findmonth = newyear.find(item => item.month == (k + 1))
            // console.log(findmonth, '查')
            if (findmonth) {
                arr.push([j, k, rd ? findmonth.bsCount : findmonth.deployCount])
            } else {
                arr.push([j, k, 0])

            }
        }
    })
    return {
        map: arr,
        year: traverselist,
        month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    }
}