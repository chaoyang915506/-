export function formatterData(data) {
  let res = data
    .map((i) => {
      return {
        ...i,
        sort: Date.parse(new Date(i.forecastTime)),
        date:
          i.forecastUnit == "day"
            ? new Date(i.forecastTime).getDate() + "日"
            : new Date(i.forecastTime).getMonth() + 1 + "月",
      };
    })
    .sort((a, b) => a.sort - b.sort);
  //   console.log(res, "最后的结果");
  return res;
}
