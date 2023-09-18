import { getMountions } from "@/api/tenseassess/tenseassess.js";
// async function getAllMonitor() {
//   let res = await getMountions();
//   await formatterData(res.data);
// }
// getAllMonitor();

export function formatterData(data) {
  let lineData = [];
  [...new Set(data.map((i) => i.lineID))].forEach((i) => {
    let res = data.find((idx) => idx.lineID == i);
    if (res && res.lineID && res.lienName) {
      lineData.push({
        lineID: res.lineID,
        lienName: res.lienName,
        grade: res.grade,
      });
    }
  });
  let monitorData = [];
  [...new Set(data.map((i) => i.monitorID))].forEach((i) => {
    let res = data.find((idx) => idx.monitorID == i);
    if (res && res.monitorID && res.monitorName) {
      monitorData.push({
        monitorID: res.monitorID,
        monitorName: res.monitorName,
        grade: res.grade,
      });
    }
  });

  //   console.log(lineData, "试试");
  return { lineData, monitorData };
}
export function formatterDatas(data) {
  let lineData = [];
  [...new Set(data.map((i) => i.lineID))].forEach((i) => {
    let res = data.find((idx) => idx.lineID == i);
    if (res && res.lineID && res.lienName) {
      lineData.push({
        lineID: res.lineID,
        lienName: res.lienName,
        grade: res.grade,
      });
    }
  });
  let monitorData = [];
  [...new Set(data.map((i) => i.monitorID))].forEach((i) => {
    let res = data.find((idx) => idx.monitorID == i);
    if (res && res.monitorID && res.monitorName) {
      monitorData.push({
        monitorID: res.monitorID,
        monitorName: res.monitorName,
        grade: res.grade,
      });
    }
  });

  //   console.log(lineData, "试试");
  return { lineData, monitorData };
}
// console.log(lineData, "线路数据");
//筛监测点
export function formatterMontain(data, linedata, id = "id") {
  // console.log(data, "shenm ");
  // console.log(linedata, "所有吗");
  //去重接口返回的全部的监测点id
  let arr = [];
  [...new Set(data.flat().map((i) => i[id]))].forEach((i) => {
    let res = linedata.find((idx) => idx.monitorID == i);
    // console.log(res, "linedata");
    if (res) {
      arr.push(res);
    }
  });
  let result = arr.map((i) => {
    return {
      ...i,
      label: i.monitorName,
      value: i.monitorID,
    };
  });
  return result.length == 0 ? [] : result;
}

/**
 * 筛路线
 * @param {*} data 当前的数据
 * @param {*} linedata  全部线路的数据
 * @param {*} id 选填
 */
export function formmaterlist(data, linedata, id = "id") {
  //去重接口返回的全部的监测点id
  let arr = [];
  [...new Set(data.flat().map((i) => i[id]))].forEach((i) => {
    let res = linedata.find((idx) => idx.lineID == i);
    if (res) {
      arr.push(res);
    }
  });
  return arr.map((i) => {
    return {
      ...i,
      label: i.lienName,
      value: i.lineID,
    };
  });
}

export function formmaterlthreeone(data, linedata) {
  let arr = [];
  [...new Set(data.flat().map((i) => i.id))].forEach((i) => {
    // console.log(linedata, "arefef");
    let res = linedata.find((idx) => idx.monitorID == i);
    // console.log(res, "aerer");
    if (res) {
      arr.push(res);
    }
  });
  return arr.map((i) => {
    return {
      ...i,
      label: i.monitorName,
      value: i.monitorID,
    };
  });
}

//统计分析假数据
export const jiaechart1 = [
  [
    {
      synthesis: 1,
      foreignMatter: 0,
      createTime: "2022",
      weather: 0,
      id: 12,
    },
    {
      synthesis: 1,
      foreignMatter: 0,
      createTime: "2021",
      weather: 0,
      id: 12,
    },
  ],
  [
    {
      synthesis: 55,
      foreignMatter: 55,
      createTime: "2022",
      weather: 55,
      id: 26,
    },
  ],
  [
    {
      synthesis: 3,
      foreignMatter: 55,
      createTime: "2022",
      weather: 55,
      id: 27,
    },
  ],
  [
    {
      synthesis: 54,
      foreignMatter: 2,
      createTime: "2022",
      weather: 55,
      id: 32,
    },
  ],
];
export const jiachart2 = [
  [
    {
      synthesis: 1,
      foreignMatter: 0,
      createTime: "2022-04",
      weather: 0,
      id: 1,
    },
  ],
  [
    {
      synthesis: 1,
      foreignMatter: 33,
      createTime: "2022-04",
      weather: 0,
      id: 6,
    },
    {
      synthesis: 1,
      foreignMatter: 33,
      createTime: "2022-05",
      weather: 0,
      id: 6,
    },
  ],
];
//态势预测假数据
export const jiashuju21 = [
  [
    { foreignMatter: 0, synthesis: 2432, weather: 444, id: 12, fdtime: "2022" },
    {
      foreignMatter: 100,
      synthesis: 243,
      weather: 444,
      id: 12,
      fdtime: "2023",
    },
  ],
  [{ foreignMatter: 44, synthesis: 144, weather: 505, id: 26, fdtime: "2023" }],
];
export const jiashuju22 = [
  [
    { foreignMatter: 0, synthesis: 2432, weather: 444, id: 12, fdtime: "2022" },
    {
      foreignMatter: 100,
      synthesis: 243,
      weather: 444,
      id: 12,
      fdtime: "2023",
    },
    {
      foreignMatter: 100,
      synthesis: 243,
      weather: 444,
      id: 12,
      fdtime: "2023",
    },
  ],
  [
    { foreignMatter: 44, synthesis: 144, weather: 505, id: 26, fdtime: "2023" },
    { foreignMatter: 44, synthesis: 144, weather: 505, id: 26, fdtime: "2023" },
    { foreignMatter: 44, synthesis: 144, weather: 505, id: 26, fdtime: "2023" },
  ],
];

// 态势综合分析的假数据
export const jiashuju31 = [
  [{ for: 0, synth: 1, weather: 0, id: 12, time: "2022" }],
  [{ for: 44, synth: 144, weather: 505, id: 26, time: "2022" }],
];
export const jiashuju32 = [
  [{ fore: 0, synthesis: 1, weather: 0, id: 1, time: "2022" }],
  [
    { fore: 1, synthesis: 0, weather: 0, time: "2021", id: 6 },
    { fore: 8, synthesis: 19, weather: 22, time: "2022", id: 6 },
  ],
];

/**
 * timeformat 时间格式 分年月日
 * resultes 处理过一层的数据
 * key key值可能不太一样
 * 完成日期的格式化处理 排序
 */
export function fomattersortTime(timeformat, resultes, key) {
  // console.log(resultes);
  let arr = [];
  arr = resultes.map((i) => {
    return i
      .map((j) => {
        if (timeformat == "year") {
          j["keysort"] = new Date(j[key]).getFullYear();
          j[key] = new Date(j[key]).getFullYear() + "年";
          return j;
        } else if (timeformat == "month") {
          // j["keysort"] = new Date(j[key]).getMonth() + 1;
          j["keysort"] = Date.parse(new Date(j[key]));

          j[key] = new Date(j[key]).getMonth() + 1 + "月";
          return j;
        } else if (timeformat == "day") {
          // j["keysort"] = new Date(j[key]).getDate();
          j["keysort"] = Date.parse(new Date(j[key]));
          j[key] = new Date(j[key]).getDate() + "日";
          return j;
        }
      })
      .sort((a, b) => a.keysort - b.keysort);
  });
  // console.log(arr, "all");
  return arr;
}
/**
 * @param {*} timeformat  年月日
 * @param {*} resultes 数据arr
 * @param {*} key 键值
 */
export function forammtertimemand(timeformat, resultes, key) {
  if (resultes.length == 0) return [];
  // else {
  let copy = JSON.parse(JSON.stringify(resultes));
  return copy
    .map((j) => {
      if (timeformat == "year") {
        j["keysort"] = new Date(j[key]).getFullYear();
        j[key] = new Date(j[key]).getFullYear() + "年";

        return j;
      } else if (timeformat == "month") {
        j["keysort"] = Date.parse(new Date(j[key]));
        // j["keysort"] = new Date(j[key]).getMonth() + 1;
        j[key] = new Date(j[key]).getFullYear() + "-" +Number(new Date(j[key]).getMonth() + 1 ) ;
        return j;
      } else if (timeformat == "day") {
        // j["keysort"] = new Date(j[key]).getDate();
        j["keysort"] = Date.parse(new Date(j[key]));
        j[key] =new Date(j[key]).getMonth() + 1+'-'+ new Date(j[key]).getDate();
        return j;
      }
    })
    .sort((a, b) => a.keysort - b.keysort);
  // }
}

// 单点检测点历史统计
export function formattersingleCount(val, results) {
  if (results.data.forecastMapList.length == 0) return [];
  let obj = {};
  for (let key in results.data.forecastMapList) {
    let keyvalue = results.data.forecastMapList[key];
    if (!obj[keyvalue.monitor_id]) {
      obj[keyvalue.monitor_id] = [keyvalue];
    } else {
      obj[keyvalue.monitor_id].push(keyvalue);
    }
  }
  let arrdata = [];
  for (let key in obj) {
    arrdata.push(obj[key]);
  }
  // console.log(JSON.stringify(arrdata), "redgs");

  return fomattersortTime(val, arrdata, "fdtime");
}
