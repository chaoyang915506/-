export function fomatterenv(res, weather) {
  const { RainStatus, WindStatus, FogStatus, SnowStatus } = weather;

  let arr = res.windStatus.map((i) => {
    let results = WindStatus.find((idx) => idx.value == i.wind_status);
    return {
      ...i,
      name: results ? results.label : "无",
    };
  });

  let arr1 = res.snowStatus.map((i) => {
    let results = SnowStatus.find((idx) => idx.value == i.snow_status);
    return {
      ...i,
      name: results ? results.label : "无",
    };
  });
  let arr2 = res.rainStatus.map((i) => {
    let results = RainStatus.find((idx) => idx.value == i.rain_status);
    return {
      ...i,
      name: results ? results.label : "无",
    };
  });
  let arr3 = res.fogStatus.map((i) => {
    let results = FogStatus.find((idx) => idx.value == i.fog_status);
    return {
      ...i,
      name: results ? results.label : "无",
    };
  });
  console.log(arr, arr1, arr2, arr3);
  return [...arr, ...arr1, ...arr2, ...arr3];
}
