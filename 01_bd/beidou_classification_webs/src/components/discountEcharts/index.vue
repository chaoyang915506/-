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
const emit = defineEmits(['echartsClickHandle']);
const { proxy } = getCurrentInstance();
const props = defineProps({
  chartData: Object,
});
const option = computed(() => {
  const option = {
    grid: props.chartData.grid ? props.chartData.grid : {},

    color: [
      props.chartData.lineColor[0],
      props.chartData.lineColor[1],
      props.chartData.lineColor[2],
    ],
    title: {
      text: props.chartData.title,
      top: 7,
      left: 0,
      textStyle: {
        color: "black",
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: "axis",
      show: true,
      formatter(params) {
        // ${val.axisValue}<br/>
        let list = [];
        params.forEach((val) => {
          list.push(
            `${val.marker}${
              props.chartData.legendList.length ? val.seriesName : ""
            }&nbsp;&nbsp;&nbsp;${val.data + props.chartData.company}<br/>`
          );
        });
        return list.join("");
      },
    },
    legend: {
      right: 20,
      top: props.chartData.legendStyle ? props.chartData.legendStyle.top : 40,
      itemWidth: 8,
      icon: "circle",
      textStyle: {
        color: props.chartData.legendStyle
          ? props.chartData.legendStyle.color
          : null, //字体颜色
      },
    },
    xAxis: [
      {
        type: props.chartData.xAxisType
          ? props.chartData.xAxisType
          : "category",
        axisTick: { show: true },
        data: props.chartData.seriesone,
        axisLine: {
          show: true,
          lineStyle: {
            type: "solid",
            color: props.chartData.XYColor ? props.chartData.XYColor : "30ac55",
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        type: props.chartData.yAxisType ? props.chartData.yAxisType : "value",
        lineStyle: {
          show: true,
          type: "solid",
          color: props.chartData.XYColor ? props.chartData.XYColor : "30ac55",
        },
        axisLine: {
          show: true,
          lineStyle: {
            type: "solid",
            color: props.chartData.XYColor ? props.chartData.XYColor : "30ac55",
          },
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
        data: props.chartData.yAxisData ? props.chartData.yAxisData : [],
      },
    ],
    series: props.chartData.legendList.length
      ? props.chartData.legendList.map((val, index) => {
          return {
            name: val,
            type: props.chartData.type,
            barWidth : 20, //柱图宽度
            data: Array.isArray(props.chartData.xaxisdate[0])
              ? props.chartData.xaxisdate[index]
              : props.chartData.xaxisdate[0],
            // smooth: true,//线平滑
          };
        })
      : {
          type: props.chartData.type,
          data: props.chartData.xaxisdate,
          barWidth : 20, //柱图宽度
        },
  };
  return option;
});
const handleClick = (val)=>{
  emit('echartsClickHandle',val)
}
</script>
<style lang="scss" scoped>
</style>
