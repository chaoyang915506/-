<template>
  <div id="mapContainer" ref="map"></div>
</template>

<script setup>
// import AMapLoader from "@amap/amap-jsapi-loader";
import { mapData } from "@/utils/chinamap.js";
import * as echarts from "echarts";
import { nextTick, onBeforeUnmount, onMounted } from "vue-demi";
const props = defineProps({
  echartData: Object,
});
const map = ref(null);
const scale = ref(10);
// 地图缩放 flag: 0->放大 1->缩小
function roamMap(flag) {
  let myChart = echarts.init(map.value);
  let currentZoom = myChart.getOption().geo[0].zoom; // 当前的缩放比例
  let increaseAmplitude = 1.8; // 点击按钮每次 放大/缩小 比例
  if (flag == 1) {
    increaseAmplitude = 0.8;
  }
  myChart.setOption({
    geo: {
      zoom: currentZoom * increaseAmplitude,
    },
  });
}
defineExpose({ roamMap, addMap });

watch(
  () => props.echartData,
  (curValue, preValue) => {
    nextTick(() => {
      addMap();
    });
  },
  {
    deep: true,
    immediate: true,
  }
);
function addMap() {
  let myChart = echarts.init(map.value);
  echarts.registerMap("chinaMap", mapData);
  let option = {
    title: {
      text: props.echartData.title,
      top: 7,
      right: 40,
      textStyle: {
        color: "white",
        fontSize: 16,
        fontWeight: 300,
      },
    },
    geo: {
      type: "map",
      map: "chinaMap",
      roam: true,
      zoom: 1.2,
      center: [108.956239, 34.268309],
      scaleLimit: {
        //滚轮缩放的极限控制
        min: 1,
        max: 10,
      },
      itemStyle: {
        //地图区域的多边形 图形样式。
        areaColor: "#959595", //地图区域的颜色。
      },
    },
    series: [
      {
        // type: "scatter",
        type: "effectScatter",
        coordinateSystem: "geo",
        rippleEffect: {
          number: 2,
        },
        data: props.echartData.lonLat.map((i) => i.value),
        // data: resddata.map((i) => i.value),
        itemStyle: {
          // color: "rgba(173, 96, 106, 0.8)",
          color: props.echartData.bgcolor,
        },
        symbolSize: function (value, params) {
          // console.log(value, params, "all");
          // return props.echartData.average[params.dataIndex].averageid;
          return scale.value * props.echartData.average[params.dataIndex];
          // return data.map((i) => i.size)[params.dataIndex];
        },
      },
    ],
  };

  myChart.on("georoam", function (params) {
    var option = myChart.getOption(); //获得option对象
    if (params.zoom != null && params.zoom != undefined) {
      //捕捉到缩放时
      scale.value = 10 * params.zoom;
      // option.geo[0].zoom = option.series[0].zoom; //下层geo的缩放等级跟着上层的geo一起改变
      // option.geo[0].center = option.series[0].center; //下层的geo的中心位置随着上层geo一起改变
    }
    myChart.setOption(option); //设置option
  });
  myChart.setOption(option);
}
onMounted(() => {
  window.addEventListener("resize", addMap);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", addMap);
});
onMounted(() => {
  addMap();
});
</script>

<style lang="scss" scoped>
#mapContainer {
  position: relative;
}
</style>