  <!-- 中国地图 -->
<template>
  <echarts
    :option="option"
    ref="echart"
    :update-options="{ notMerge: true }"
    autoresize
  />
</template>
<script setup>
// import siteSysbomPng from './../../assets/images/emergencyplan/site-sysbom.png'
import AMapLoader from '@amap/amap-jsapi-loader';
import { onMounted } from '@vue/runtime-core';
import { registerMap } from "echarts/core";
import chainJson from './js/china.json'

/**
 * backgroundColor, // 背景
 * zoom // 地图缩放比
 * **/
let { proxy } = getCurrentInstance()
let props = defineProps({
  chartData: {
    type: Object,
    default: {}
  },
  geoCoordMap: {
    type: Object,
    default: {}
  },
  chinaDatas: {
    type: Array,
    default: []
  }
})
window.addEventListener("resize", function () {
  if (!proxy.$refs.echart) return
  proxy.$refs.echart.resize()
})
let planePath = 'path://M.6,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705';
// let symbolImg = 'image://' + siteSysbomPng //或者import引入在拼接也行
// 注册地图 
     nextTick(() => {
       registerMap('china', chainJson)
     })
     var convertData = function (data) {
       var res = [];
       for (var i = 0; i < data.length; i++) {
         var dataItem = data[i];
         var fromCoord = props.geoCoordMap[dataItem[0].name];
         var toCoord = props.geoCoordMap[dataItem[1].name];
         if (fromCoord && toCoord) {
           res.push([{
             coord: fromCoord
           }, {
             coord: toCoord
           }]);
         }
       }
       return res;
     };
     let series = [];
     [['北京市', props.chinaDatas]].forEach(function (item, i) {
       series.push({
         name: item[0],
         type: 'lines',
         zlevel: 1,
         effect: {
           show: true,
           period: 6,
           trailLength: 0.7,
           color: '#fff',
           symbolSize: 3
         },
         lineStyle: {
           color: '#a6c84c',
           width: 0,
           curveness: 0.2
         },
         data: convertData(item[1])
       }, {
         name: item[0],
         type: 'lines',
         zlevel: 2,
         effect: {
           show: true,
           period: 6,
           trailLength: 0,
           symbol: planePath,
           symbolSize: 15
         },
         lineStyle: {
           color: '#a6c84c',
           width: 1,
           opacity: 0.4,
           curveness: 0.2
         },
         data: convertData(item[1])
       }, {
         name: item[0],
         type: 'effectScatter',
         coordinateSystem: 'geo',
         zlevel: 2,
         rippleEffect: {
           // scale: 2,
           brushType: 'stroke'
         },
         emphasis: {
           scale: 1.1
         },
         label: {
           show: true,
           position: 'right',
           formatter: '{b}'
         },
         // symbol: symbolImg,
         // symbol: 'circle',
         symbolSize: function (val) {
           return val[2] / 8;
         },
         itemStyle: {
           color: '#FFDB5C',
         },
         data: item[1].map(function (dataItem) {
           return {
             name: dataItem[1].name,
             value: props.geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
           };
         }),
       },
         // {
         //   type: 'scatter',
         //   coordinateSystem: 'geo',
         //   itemStyle: {
         //     color: '#00FFF6',
         //   },
         //   // rippleEffect: {
         //   //   // scale: 2,
         //   //   brushType: 'stroke'
         //   // },
         //   symbol: symbolImg,
         //   // symbol: 'circle',
         //   // symbolSize: function (val) {
         //   //   return val[2] / 8;
         //   // },
     
         //   // symbolOffset: [0, -20],
         //   z: 999,
         //   data: item[1].map(function (dataItem) {
         //     return {
         //       name: dataItem[1].name,
         //       value: props.geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
         //     };
         //   }),
         // },
       );
     });
const option = computed(() => {
  const option = {
    backgroundColor: props.chartData.backgroundColor,
    title: {
      left: 'left',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    geo: {
      map: "china",
      zoom: props.chartData.zoom,
      aspectScale: 0.75, // 长宽比
      roam: true,
      emphasis: {
        label: {
          show: false,
          color: '#fff'
        },
        itemStyle: {
          areaColor: '#317D84',
          borderWidth: 0,
        }
      },
      label: {
        show: false,
        color: '#ccc'
      },
      itemStyle: {
        areaColor: '#7F7F7F',
        borderColor: '#000',
      }
      // itemStyle: {
      //   borderColor: 'rgba(147, 235, 248, 1)',
      //   borderWidth: 1,
      //   areaColor: {
      //     type: 'radial',
      //     x: 0.5,
      //     y: 0.5,
      //     r: 0.8,
      //     colorStops: [
      //       {
      //         offset: 0,
      //         color: 'rgba(147, 235, 248, 0)', // 0% 处的颜色
      //       },
      //       {
      //         offset: 1,
      //         color: 'rgba(147, 235, 248, .2)', // 100% 处的颜色
      //       },
      //     ],
      //     globalCoord: false, // 缺省为 false
      //   },
      //   shadowColor: 'rgba(128, 217, 248, 1)',
      //   // shadowColor: 'rgba(255, 255, 255, 1)',
      //   shadowOffsetX: -2,
      //   shadowOffsetY: 2,
      //   shadowBlur: 10,
      // }
    },
    series: series
  };

  return option;
})

</script>