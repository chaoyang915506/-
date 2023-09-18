<template>
  <echarts
    :option="option"
    ref="echart"
    :update-options="{ notMerge: true }"
    autoresize
  ></echarts>
</template>

<script setup>
const props = defineProps({

})

const option = computed(() => {
  const option = {
    title: {
      text: "近半年异物侵限走势统计",
      textStyle: {
        color: "white",
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    // 通过这个color修改两条线的颜色
    color: ["#00f2f1", "#ed3f35"],
    tooltip: {
      trigger: "axis",
    },
    legend: {
      type: "plain",
      icon: "circle",
      // 如果series 对象有name 值，则 legend可以不用写data
      // 修改图例组件 文字颜色
      textStyle: {
        color: "#4c9bfd",
      },
      textStyle: {
        fontSize: "15px",
        color: "white",
      },
      // 这个10% 必须加引号
      right: "10%",
      top: "2%",
    },
    grid: {
      left: "2%",
      top: "40%",
      right: "2%",
      bottom: "4%",
      containLabel: true,
    },

    xAxis: {
      axisTick: {
        show: false,
      },

      type: "category",
      boundaryGap: false,
      data: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
      axisTick: {
        show: false, // 去除刻度线
      },
      axisLabel: {
        color: "#4c9bfd", // 文本颜色
      },
    },
    yAxis: {
      axisTick: {
        show: false, // 去除刻度线
      },
      axisLabel: {
        color: "#4c9bfd", // 文本颜色
      },
      splitLine: {
        lineStyle: {
          color: "#012f4a", // 分割线颜色
        },
      },
      type: "value",
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#999999",
        },
      },
    },
    series: [
      {
        name: "未来趋势预测",
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: "line",
        smooth: true,
        showSymbol: false,
      },
      {
        name: "历史时间趋势预测",
        data: [8230, 9323, 90, 34, 12690, 13630, 120],
        type: "line",
        smooth: true,
        showSymbol: false,
      },
    ],
  };
  return option;
});
</script>

<style lang="scss" scoped>
</style>