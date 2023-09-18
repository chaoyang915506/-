<template>
  <echarts
    :option="option"
    ref="echart"
    autoresize
    :update-options="{ notMerge: true }"
  ></echarts>
</template>

<script setup>
const props = defineProps({
  echartsData: Object,
});
const option = computed(() => {
  const option = {
    title: {
      text: props.echartsData.title,
      textStyle: {
        color: "#b6bdbf",
        fontSize: "14px",
      },
    },
    color: ["#41b1b6"],
    grid: {
      left: 20,
      top: 40,
      right: 20,
      bottom: 10,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: true,
      },

      minorSplitLine: {
        show: false,
      },
      axisTick: {
        alignWithLabel: true,
      },
      // data: deviceData.deviceName,
      data: props.echartsData.xAxisData,
      axisLabel: {
        interval: 0,
      },
    },
    yAxis: {
      type: "value",
      // 修改刻度标签 相关样式
      axisLabel: {
        showMaxLabel: true,
        interval: 0,
        color: "rgba(255,255,255,.6) ",
        fontSize: 12,
      },
      // y轴分割线的颜色
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#999999",
        },
      },
    },
    series: [
      {
        data: props.echartsData.seriesData,
        // data: deviceData.devicCount,
        type: "bar",
        showBackground: false,
        barWidth: 30,
        itemStyle: {
          borderRadius: 8,
          borderWidth: 3,
        },
        label: {
          show: true, //开启显示
          position: "top", //在上方显示
          fontSize: 14,
          color: "#0ad0d0",
        },
      },
    ],
  };
  return option;
});
</script>