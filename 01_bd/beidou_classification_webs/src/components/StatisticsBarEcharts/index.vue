<template>
  <echarts
    :option="option"
    ref="echart"
    id="echart"
    :update-options="{ notMerge: true }"
    @click="handleClick"
    autoresize
  />
</template>
<script setup>
// chartDataHistory_one: {
//   title: "",
//   company: "%",
//   type: "line",
//   lineColor: ["#339966"],
//   legendList: [],
//   dataZoom: false,
//   gridStyle: {
//     left: 10,
//     right: 10,
//     top: 100,
//     bottom: 10,
//     containLabel: true,
//   },
//   xaxisdate: [],值
//   seriesone: [],横坐标
// },
import { watch } from "@vue/runtime-core";
const emit = defineEmits(["echartsClickHandle"]);
const { proxy } = getCurrentInstance();
const props = defineProps({
  chartData: Object,
});
const option = computed(() => {
  var loadData = [];
  var xData = props.chartData.xData;
  var sData = props.chartData.sData;
  var sData1 = props.chartData.sData1;

  const option = {
    title: {
      top: 0,
      left: 0,
      text: "短报文年度统计",
      textStyle: {
        color: "black",
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      top: "1%",
      right: "3%",
      textStyle: {
        //字体颜色
        color: "black",
        fontSize: 14,
        fontWeight: 600,
      },
    },
    grid: {
      top: "20%",
      left: "5%",
      right: "5%",
      bottom: "10%",
      containLabel: false,
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#d2d2d2",
        },
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "black",
      },
    },
    xAxis: {
      type: "category",
      data: xData,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#838383",
        },
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: "接收量",
        type: "bar",
        barWidth: 20,
        barGap: "80%",
        data: sData,
        itemStyle: {
          color: "#0080ff",
        },
      },
      {
        name: "发送量",
        type: "bar",
        barWidth: 20,
        barGap: "80%",
        data: sData1,
        itemStyle: {
          color: "#ffbf3c",
        },
      },
    ],
  };
  return option;
});
</script>
<style lang="scss" scoped>
</style>
