<template>
  <echarts
    :option="option"
    ref="echart"
    :update-options="{ notMerge: true }"
    autoresize
  />
</template>
<script setup>
import siteSysbomPng from './../../assets/images/emergencyplan/site-sysbom.png'
import { registerMap } from "echarts/core";
import chainJson from './js/china.json'

let symbolImg = 'image://' + new URL('./../../assets/images/emergencyplan/site-sysbom.png', import.meta.url).href //或者import引入在拼接也行
let color = ['#1884D2', '#f97767'];
let serverPath = "path://M960 320H64c-35.346 0-64-28.654-64-64V128c0-35.346 28.654-64 64-64h896c35.346 0 64 28.654 64 64v128c0 35.346-28.654 64-64 64z m-96-176c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m-128 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m224 496H64c-35.346 0-64-28.654-64-64v-128c0-35.346 28.654-64 64-64h896c35.346 0 64 28.654 64 64v128c0 35.346-28.654 64-64 64z m-96-176c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m-128 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m224 496H64c-35.346 0-64-28.654-64-64v-128c0-35.346 28.654-64 64-64h896c35.346 0 64 28.654 64 64v128c0 35.346-28.654 64-64 64z m-96-176c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m-128 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z";
let monitoringPath = "path://M787.456 878.08H236.544c-21.504 0-39.424 40.96-39.424 40.96V960h630.272v-40.96c-0.512-22.528-17.92-40.96-39.936-40.96zM905.728 0H118.272C52.736 0 0 55.296 0 122.88v573.44c0 67.584 52.736 122.88 118.272 122.88h275.456v40.96c0 22.528 17.92 40.96 39.424 40.96h157.696c21.504 0 39.424-20.992 39.424-40.96v-40.96h275.456c65.024 0 118.272-55.296 118.272-122.88V122.88C1024 55.296 971.264 0 905.728 0zM118.272 655.36a40.448 40.448 0 0 1-39.424-40.96V122.88c0-22.528 17.92-40.96 39.424-40.96h787.456c21.504 0 39.424 18.432 39.424 40.96V614.4c0 22.528-17.92 40.96-39.424 40.96H118.272z m680.96-470.016L669.696 320 579.584 226.304a38.784 38.784 0 0 0-62.464 8.704L399.872 448l-48.64-125.952a41.408 41.408 0 0 0-28.672-25.088 38.784 38.784 0 0 0-35.84 11.264l-117.76 122.88a42.112 42.112 0 0 0 0 57.856c15.36 15.872 40.448 15.872 55.808 0l75.776-78.848 56.32 146.944a40.064 40.064 0 0 0 33.792 25.6h2.56a39.68 39.68 0 0 0 34.304-20.48l132.096-240.128 81.92 84.992c15.36 15.872 40.448 15.872 55.808 0L855.04 243.2a42.112 42.112 0 0 0 0-57.856 38.656 38.656 0 0 0-55.808 0z";
let planePath = 'path://M.6,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705';

let geoCoordMap = {
  "南京": [118.8062, 31.9208],
  '连云港': [119.1248, 34.552],

  '上海': [121.4648, 31.2891],
  '北京': [116.4551, 40.2539],
  '郑州': [113.65, 34.76],
  '西安': [108.95, 34.27],
  '兰州': [103.73, 36.03],
  '乌鲁木齐': [87.68, 43.77],
};

let pointInfo = {
  /** 一带一路中心线 */
  "连云港": {
    type: symbolImg,
    // type: null,
    state: true
  },
  "郑州": {
    type: null,
    state: true
  },
  "西安": {
    type: null,
    state: true
  },
  "兰州": {
    type: null,
    state: true
  },
  "乌鲁木齐": {
    type: null,
    state: true
  },
  // /** */
  "南京": {
    type: serverPath,
    state: false
  },
  "北京": {
    type: serverPath,
    state: true
  }
}

/** 轨迹 */
let track = [
  { start_city: "郑州", end_city: "连云港" },
  { start_city: "西安", end_city: "郑州" },
  { start_city: "兰州", end_city: "西安" },
  { start_city: "乌鲁木齐", end_city: "兰州" },

  { start_city: "南京", end_city: "连云港" },
  { start_city: "北京", end_city: "连云港" }
]
// 注册地图 
registerMap('china', chainJson)
function handleData (data) {
  let obj = {}
  let arr = []
  for (let i = 0, len1 = data.length; i < len1; i++) {
    if (arr.indexOf(data[i].start_city) === -1) {
      arr.push(data[i].start_city)
    }
    for (let j = 0, len2 = arr.length; j < len2; j++) {
      obj[arr[j]] = []
    }
  }
  for (let i = 0, len = data.length; i < len; i++) {
    obj[data[i].start_city].push([{ 'name': data[i].start_city }, { 'name': data[i].end_city }])
  }
  return obj
}

function convertData (data) {
  let res = [];
  for (let i = 0; i < data.length; i++) {
    let dataItem = data[i];
    let fromCoord = geoCoordMap[dataItem[0].name];
    let toCoord = geoCoordMap[dataItem[1].name];
    if (fromCoord && toCoord) {
      res.push({
        fromName: dataItem[0].name,
        toName: dataItem[1].name,
        coords: [fromCoord, toCoord]
      });
    }
  }
  return res;
}
var series = [];
var data = handleData(track);
let tempArr = [];
for (let k in data) {
  tempArr.push([k, data[k]])
}

tempArr.forEach((item, i) => {
  series.push(
    {
      name: item[0],
      type: 'lines',
      zlevel: 1,
      symbolSize: 6,
      effect: { show: true, period: 3, trailLength: 0.7, color: '#fff', symbolSize: 3 },
      lineStyle: { color: !pointInfo[item[0]]["state"] ? color[1] : color[0], width: 0, curveness: 0.2 },
      data: convertData(item[1])
    },
    {
      name: item[0],
      type: 'lines',
      zlevel: 1,
      effect: { show: true, period: 3, trailLength: 0, symbol: planePath, symbolSize: 15 },
      lineStyle: { color: !pointInfo[item[0]]["state"] ? color[1] : color[0], width: 1.1, opacity: 0.6, curveness: 0.2 },
      data: convertData(item[1])
    },
    {
      name: item[0],
      type: 'effectScatter',
      // type: 'graph',
      coordinateSystem: 'geo',
      rippleEffect: { brushType: 'stroke' },
      label: {
        show: true,
        position: 'right',
        formatter: '{b}',
        color: color[0],
        fontSize: 13
      },
      emphasis: {
        scale: 1.1
      },
      itemStyle: { color: color[0] },
      data: item[1].map((dataItem) => {
        return {
          name: dataItem[1].name,
          symbol: pointInfo[dataItem[1].name]["type"],
          // symbolOffset: [0, -30],
          symbolSize: !pointInfo[dataItem[1].name]["type"] ? 9 : 28,
          itemStyle: {
            color: color[0]
          },
          value: geoCoordMap[dataItem[1].name]
        };
      })
    },
    // {
    //   type: 'scatter',
    //   coordinateSystem: 'geo',
    //   itemStyle: {
    //     color: '#00FFF6',
    //   },
    //   symbol: symbolImg,
    //   symbolSize: [32, 51],

    //   symbolOffset: [0, -20],
    //   z: 999,
    //   data: item[1].map(function (dataItem) {
    //   return {
    //     name: dataItem[1].name,
    //     value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
    //   };
    // }),
    // },
    {
      name: item[0],
      // type: 'effectScatter',
      type: 'graph',
      coordinateSystem: 'geo',
      rippleEffect: {
        brushType: 'stroke'
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{b}',
        color: !pointInfo[item[0]]["state"] ? color[1] : color[0],
        fontSize: 13
      },
      // symbol: 'roundRect', //气泡
      symbolSize: !pointInfo[item[0]]["type"] ? 9 : 18,
      itemStyle: {
        color: !pointInfo[item[0]]["state"] ? color[1] : color[0]
      },
      data: [{
        name: item[0],
        symbol: pointInfo[item[0]]["type"],
        itemStyle: {
          color: !pointInfo[item[0]]["state"] ? color[1] : color[0],
        },
        value: geoCoordMap[item[0]]
      }]
    }
  )
})
const option = computed(() => {
  const option = {
    backgroundColor: '#3C3D3F',
    geo: {
      // type: 'map',
      map: 'china',
      zoom: 1.9, // 默认显示级别
      aspectScale: 0.75, // 长宽比
      layoutCenter: ['50%', '50%'],
      layoutSize: '140%',
      emphasis: { /** 悬浮背景 */
        /** 是否显示地图名称 */
        label: {
          show: false
        },
        itemStyle: {
          // areaColor: 'rgba(37, 43, 61, 0.5)',
          areaColor: 'rgba(29,85,139,0)',
          borderWidth: 0,
        }
      },
      /** 隐藏南海诸岛右下角小地图 */
      regions: [
        {
          name: '南海诸岛',
          /** 隐藏地图，透明度为 0 时不绘制该图形 */
          itemStyle: { opacity: 0 },
          // 隐藏文字
          label: { show: false }
        }
      ],
      roam: true, // 是否允许缩放
      // layoutCenter: ['50%', '60%'], // 地图位置
      // layoutSize: '100%',
      itemStyle: {
        // areaColor: 'rgba(51, 69, 89, 0.5)', // 地图背景色
        // borderColor: '#516a89', // 省市边界线00fcff 516a89
        // borderWidth: 1,
        borderColor: 'rgba(192,245,249,0)',
        borderWidth: 3,
        // shadowColor: '#6FFDFF',
        shadowOffsetY: 0,
        shadowBlur: 10,
        areaColor: 'rgba(29,85,139,0)',
      },
    },
    // tooltip: {
    //   trigger: 'item',
    //   // backgroundColor: 'rgba(0, 0, 0, 0.8)',
    //   // borderColor: '#FFFFCC',
    //   showDelay: 0,
    //   hideDelay: 0,
    //   enterable: true,
    //   transitionDuration: 0,
    //   extraCssText: 'z-index:100',
    //   formatter: (params, ticket, callback) => {
    //     // console.log(params, ticket, callback);
    //     const { color, componentSubType, data } = params;
    //     let res = ``;
    //     // 组件类型
    //     if (componentSubType == "lines") {
    //       res = `<span style="color:${color}">${data.fromName} > ${data.toName}</span>`;
    //     }
    //     return res
    //   }
    // },
    series: series
  };

  return option;
})

</script>