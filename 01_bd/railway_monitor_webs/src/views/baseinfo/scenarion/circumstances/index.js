//处理天气的
export function formatterWeather(res, dataWeather) {
  let { FogStatus, RainStatus, WindStatus, SnowStatus } = dataWeather;
  // console.log(FogStatus, "天气的数据");
  //   console.log(FogStatus, "天气的数据");
  //   console.log(FogStatus, "天气的数据");
  //   console.log(res, "all");

  //将对象拆开处理
  let arr = [];
  for (let key in res) {
    let kvalue = res[key];

    // console.log(kvalue, "allshuzu");
    let map1 = kvalue.map((idx) => {
      //   idx[key];
      let keyname;
      //找键名
      if (key == "windStatus") {
        keyname = WindStatus.find((win) => win.value == idx[key]);
        return { ...idx, keyname: keyname ? keyname.label : "无" };
      } else if (key == "snowStatus") {
        keyname = SnowStatus.find((win) => win.value == idx[key]);
        return { ...idx, keyname: keyname ? keyname.label : "无" };
      } else if (key == "rainStatus") {
        keyname = RainStatus.find((win) => win.value == idx[key]);
        return { ...idx, keyname: keyname ? keyname.label : "无" };
      } else if (key == "fogStatus") {
        keyname = FogStatus.find((win) => win.value == idx[key]);
        return { ...idx, keyname: keyname ? keyname.label : "无" };
      }
    });
    arr.push(...map1);
  }
  return arr;
}

export function fomattertexture(res, texture, state) {
  // console.log(res, "拿到数据");
  if (state == "texture") {
    return res.texture.map((item) => {
      const texturefind = texture.find((i) => i.value == item.texture);
      return {
        ...item,
        keyname: texturefind ? texturefind.label : "空",
      };
    });
  } else {
    return res.scene_type.map((item) => {
      const texturefind = texture.find((i) => i.value == item.scene_type);
      return {
        ...item,
        keyname: texturefind ? texturefind.label : "空",
      };
    });
  }
}

