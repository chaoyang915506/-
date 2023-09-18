import { forammtertimemand } from "../js/compontents";

/**
 * 线路段综合分析统计
 * @param {*} res 接口返回的两个对象
 * @param {*} val 当前是年月日哪个
 */

export function formatlineData(res, val) {
  let obj = {};
  for (let key in res.hisMapsList) {
    let cpyv = res.hisMapsList[key];
    if (!obj[cpyv.id]) {
      obj[cpyv.id] = [cpyv];
    } else {
      obj[cpyv.id].push(cpyv);
    }
  }

  let obj1 = {};
  for (let key in res.forecastMapList) {
    let cpyv = res.forecastMapList[key];
    if (!obj1[cpyv.line_id]) {
      obj1[cpyv.line_id] = [
        { ...cpyv, id: cpyv.line_id, createTime: cpyv.fdtime },
      ];
    } else {
      obj1[cpyv.line_id].push({
        ...cpyv,
        id: cpyv.line_id,
        createTime: cpyv.fdtime,
      });
    }
  }
  // console.log(obj, obj1, "every");
  let newarr = []; //旧的集合 预测
  let newarr1 = []; //新的集合 历史
  // return;
  //排序obj obj1
  for (let key in obj) {
    // console.log(obj[key], "数组");
    // console.log(forammtertimemand(val, obj[key], "createTime"), "redfdsf");
    newarr1.push({
      key: key,
      list:
        obj[key].length > 0
          ? forammtertimemand(val, obj[key], "createTime")
          : [],
    });
  }
  for (let key in obj1) {
    newarr.push({
      key: key,
      list: obj1[key] ? forammtertimemand(val, obj1[key], "createTime") : [],
    });
  }

  // console.log(newarr, newarr1, "chulihou");
  // return;
  let lastarr = [];

  let ress = [...newarr1, ...newarr];
  let objaa = {};
  for (let key in ress) {
    let kn = ress[key]["key"];
    let kv = ress[key]["list"];
    if (!objaa[kn]) {
      objaa[kn] = kv;
    } else {
      objaa[kn].push(...kv);
    }
  }

  for (let key in objaa) {
    lastarr.push(objaa[key]);
  }
  // newarr1.forEach((i) => {
  //   // console.log(i, "every");
  //   let resules = newarr.find((idx) => idx.key == i.key);
  //   if (resules) {
  //     lastarr.push([...i.list, ...resules.list]);
  //   } else {
  //     lastarr.push(i.list);
  //   }
  // });

  // 新的从旧的里面查
  // [
  //   ...new Set([...newarr1.map((i) => i.key), ...newarr.map((i) => i.key)]),
  // ].forEach((i) => {
  //   let resulte = newarr1.find((idx) => idx.id == i);
  //   // console.log(resulte, "shujul");
  //   if (resulte == undefined) {
  //     // console.log(i.list, "every");
  //     lastarr.push(i.list);
  //   }
  // });

  // console.log(
  //   [...new Set([...newarr1.map((i) => i.key), ...newarr.map((i) => i.key)])],
  //   "qu key"
  // );
  //id去重结果
  let quchong = [
    ...new Set(
      lastarr
        .filter((i) => i)
        .flat()
        .map((i) => i.id)
        .filter((i) => i)
    ),
  ];
  // console.log(
  //   lastarr.filter((i) => i),
  //   "结果"
  // );
  return lastarr.filter((i) => i);
}
/**
 *单点检测点综合分析统计
 * @param {*} res 接口返回的两个对象
 * @param {*} val 当前是年月日哪个
 * @returns
 */
export function dandianFn(res, val) {
  let obj = {};
  for (let key in res.hisMapsList) {
    let cpyv = res.hisMapsList[key];
    if (!obj[cpyv.id]) {
      obj[cpyv.id] = [cpyv];
    } else {
      obj[cpyv.id].push(cpyv);
    }
  }

  let obj1 = {};
  for (let key in res.forecastMapList) {
    let cpyv = res.forecastMapList[key];
    if (!obj1[cpyv.monitor_id]) {
      obj1[cpyv.monitor_id] = [
        { ...cpyv, id: cpyv.monitor_id, createTime: cpyv.fdtime },
      ];
    } else {
      obj1[cpyv.monitor_id].push({
        ...cpyv,
        id: cpyv.monitor_id,
        createTime: cpyv.fdtime,
      });
    }
  }
  // console.log(obj, obj1, "every");
  let newarr = []; //旧的集合 预测
  let newarr1 = []; //新的集合 历史
  // return;
  // console.log(newarr, newarr1, "liangg e");
  //排序obj obj1
  for (let key in obj) {
    // console.log(obj[key], "数组");
    // console.log(forammtertimemand(val, obj[key], "createTime"), "redfdsf");
    newarr1.push({
      key: key,
      list:
        obj[key].length > 0
          ? forammtertimemand(val, obj[key], "createTime")
          : [],
    });
  }
  for (let key in obj1) {
    // console.log(forammtertimemand(val, obj1[key], "createTime"), "redddd");
    newarr.push({
      key: key,
      list:
        obj1[key].length > 0
          ? forammtertimemand(val, obj1[key], "createTime")
          : [],
    });
  }

  // console.log(newarr, newarr1, "chulihou");
  //xinde shouju   // return;
  let lastarr = [];
  // newarr1.forEach((i) => {
  //   // console.log(i, "every");
  //   let resules = newarr.find((idx) => idx.key == i.key);
  //   console.log(resules, "结果");
  //   if (resules) {
  //     lastarr.push([...i.list, ...resules.list]);
  //   } else {
  //     lastarr.push(i.list);
  //   }
  // });
  let ress = [...newarr1, ...newarr];
  let objaa = {};
  for (let key in ress) {
    // console.log(ress[key]["list"], "key");
    let kn = ress[key]["key"];
    let kv = ress[key]["list"];
    if (!objaa[kn]) {
      objaa[kn] = kv;
    } else {
      objaa[kn].push(...kv);
    }
  }
  // console.log(objaa, "jieguo");
  for (let key in objaa) {
    lastarr.push(objaa[key]);
  }
  // console.log(lastarr, "dieyi");
  // // 新的从旧的里面查
  // [
  //   ...new Set([...newarr1.map((i) => i.key), ...newarr.map((i) => i.key)]),
  // ].forEach((i) => {
  //   // console.log(i, "key");
  //   let resulte = newarr1.find((idx) => idx.id == i);
  //   console.log(resulte);
  //   if (resulte == undefined) {
  //     // console.log(i, "every");
  //     lastarr.push(i.list);
  //   }
  // });
  // console.log(lastarr, "redsss");
  // console.log(
  //   [...new Set([...newarr1.map((i) => i.key), ...newarr.map((i) => i.key)])],
  //   "qu key"
  // );
  //id去重结果
  let quchong = [
    ...new Set(
      lastarr
        .filter((i) => i)
        .flat()
        .map((i) => i.id)
        .filter((i) => i)
    ),
  ];
  // console.log(lastarr, "redddd");
  return lastarr.filter((i) => i);
}

//处理线路段综合分析统计数据
export function formatterData(obj) {
  let arr = [];
  for (let key in obj) {
    let value = obj[key];
    // console.log(value, "得到数组");
    // 按日期进行分类
    let obja = {};
    for (let kk in value) {
      let kv = value[kk];
      //   console.log(kv, "kv");
      if (!obja[kv.time]) {
        obja[kv.time] = [kv];
      } else {
        obja[kv.time].push(kv);
      }
    }
    let arr2 = [];
    // console.log(obja, "时间筛选ok");
    for (let keyg in obja) {
      let valuek = obja[keyg];
      //   console.log(valuek, "按日期分好的数据数组");
      let fore = 0;
      let synthesis = 0;
      let weather = 0;
      let time = "";
      let id = "";
      valuek.forEach((i) => {
        fore += i.foreignMatter;
        synthesis += i.synthesis;
        weather += i.weather;
        id = i.id;
        time = i.time;
      });
      arr2.push({ fore, synthesis, weather, id, time });
    }
    // console.log(arr2, "处理好最深一层数据");
    arr.push(arr2);
  }
  //   console.log(arr, "最终的数据");
  return arr;
}
//这个处理的完成走上边的逻辑
export function formmaterobj(res) {
  let obj = {};
  for (let key in res.data.hisMapsList) {
    const keyvalue = res.data.hisMapsList[key];
    if (!obj[keyvalue.id]) {
      obj[keyvalue.id] = [{ ...keyvalue, time: keyvalue.createTime }];
    } else {
      obj[keyvalue.id].push({ ...keyvalue, time: keyvalue.createTime });
    }
  }
  for (let key in res.data.forecastMapList) {
    let keyvalue = res.data.forecastMapList[key];
    if (!obj[keyvalue.line_id]) {
      obj[keyvalue.line_id] = [
        { ...keyvalue, time: keyvalue.fdtime, id: keyvalue.line_id },
      ];
    } else {
      obj[keyvalue.line_id].push({
        ...keyvalue,
        time: keyvalue.fdtime,
        id: keyvalue.line_id,
      });
    }
  }
  return obj;
}
// import { useDict } from "@/utils/dict.js";
// const { texture } = proxy.useDict("texture");
//处理综合管理的饼图
// export function formatterpic(res, texture) {
//   //   console.log(texture, "all", Object.prototype.toString.call(texture));
//   // 合并两个对象
//   //   console.log(texture.value, "测试");
//   let obj = {};
//   let arr = [];
//   let mapdata = res.hisMapsList.map((i) => {
//     return {
//       ...i,
//       fmfr: i.percentum,
//     };
//   });
//   for (let key in mapdata) {
//     let kv = mapdata[key];
//     if (!obj[kv.texture]) {
//       obj[kv.texture] = [kv];
//     } else {
//       obj[kv.texture].push(kv);
//     }
//   }
//   for (let key in res.forecastMapList) {
//     let kv = res.forecastMapList[key];
//     if (!obj[kv.texture]) {
//       obj[kv.texture] = [kv];
//     } else {
//       obj[kv.texture].push(kv);
//     }
//   }
//   //   console.log(obj, "合并成一个对象");
//   for (let key in obj) {
//     let keyvalue = obj[key];
//     let fmfr = 0;
//     let name = "";
//     keyvalue.forEach((i) => {
//       fmfr += i.fmfr;
//       name = i.texture;
//     });
//     arr.push({ value: fmfr.toFixed(4), name });
//     // console.log({ value: fmfr.toFixed(4), name }, "合并");
//   }
//   //   console.log(arr, "最终数据");
//   let lastdata = arr.map((i) => {
//     let value = texture.find((idx) => idx.value == i.name);
//     return {
//       ...i,
//       name: value ? value.label : "空",
//     };
//   });
//   return lastdata;
// }
export function formatterpic(res, texture) {
  let forecastMapList = res.forecastMapList.map((ind) => {
    // let result = texture.find((i) => i.value == ind.texture);
    return {
      name: ind.texture,
      // name: result.label,
      value: ind.fmfr,
    };
  });
  let hisMapsList = res.hisMapsList.map((ind) => {
    // let result = texture.find((i) => i.value == ind.texture);
    return {
      name: ind.texture,
      // name: result.label,
      value: ind.percentum,
    };
  });

  return { hisMapsList, forecastMapList };
}
// // 恶劣天气
// export function mal_weather(res) {
//   // console.log(res, "接口的数据");
//   // console.log(weather, "四种天气");
//   // let { RainStatus, WindStatus, FogStatus, SnowStatus } = weather;
//   let obj = {};
//   for (let key in res.data.forecastMapList) {
//     // 得到第一个对象中的数组
//     let resules = res.data.forecastMapList[key];
//     if (!obj[resules.sevweather]) {
//       obj[resules.sevweather] = [resules];
//     } else {
//       obj[resules.sevweather].push(resules);
//     }
//   }
//   for (let key in res.data.hisMapsList) {
//     // 得到第一个对象中的数组
//     let resules = res.data.hisMapsList[key];
//     if (!obj[resules.sevweather]) {
//       obj[resules.sevweather] = [resules];
//     } else {
//       obj[resules.sevweather].push(resules);
//     }
//   }
//   // console.log(obj, "第一个对象中相同数据进行合并");
//   let arr = [];
//   for (let key in obj) {
//     let results = obj[key];
//     let num = 0;
//     results.forEach((i) => {
//       num += i.wefr;
//     });
//     // console.log(num, "和");
//     arr.push({ num: num.toFixed(3), key });
//   }
//   // console.log(arr, "处理出的数据");
//   return arr;
// }
