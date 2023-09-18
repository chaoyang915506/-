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
  xAxisData: {
    type: Array,
    default: [],
  },
  seriesData: {
    type: Array,
    default: [],
  },
  title: String,
});
const option = computed(() => {
  const option = {
    title: {
      text: "设备数量统计",
      textStyle: {
        color: "#b6bdbf",
        fontSize: "14px",
      },
    },
    color: ["#41b1b6"],
    // tooltip: {
    //   trigger: "axis",
    //   axisPointer: {
    //     // 坐标轴指示器，坐标轴触发有效
    //     type: "line", // 默认为直线，可选为：'line' | 'shadow'
    //   },
    // },
    grid: {
      left: "20%",
      top: "20%",
      right: "25%",
      bottom: "5%",
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
      data: props.xAxisData,
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
        data: props.seriesData,
        // data: deviceData.devicCount,
        type: "bar",
        showBackground: false,
        barWidth: 30,
        itemStyle: {
          borderRadius: 8,
          borderWidth: 3,
          label: {
            show: true, //开启显示
            position: "top", //在上方显示
            textStyle: {
              color: "#41b1b6",
              fontSize: 16,
              fontWeight: "bold",
            },
          },
        },
      },
    ],
  };
  return option;
});
</script>

<style lang="scss" scoped>
</style>