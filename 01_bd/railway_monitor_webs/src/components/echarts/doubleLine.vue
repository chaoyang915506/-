<template>
  <echarts
    :option="option"
    ref="echart"
    :update-options="{ notMerge: true }"
    autoresize
  />
</template>

<script setup>
/****
 *
 * isToolTipLabel    是否展示tooltip
 * isYaxisLabel      是否展示y轴label
 * yData              Y轴值
 * yMaxData           Y轴最大值
 *
 * ***/
let { proxy } = getCurrentInstance();

let props = defineProps({
  chartData: Object,
});

const option = computed(() => {
  const option = {
    title: {
      text: props.chartData.title,
      textStyle: {
        color: "#fff",
        fontWeight: "100",
        //字体系列
        fontFamily: "sans-serif",
        //字体大小
        fontSize: 18,
      },
    },
    legend: {
      icon: "circle",
      top: "0%",
      itemWidth: 6,
      itemGap: 20,
      textStyle: {
        color: "#ccc",
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: "axis",
      show: props.chartData.isToolTipLabel,
    },
    grid: {
      left: 15,
      right: 30,
      top: 40,
      bottom: 10,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLabel: {
        color: "#909399",
        fontSize: 12,
        interval: 0,
      },
      boundaryGap: false,
      axisTick: {
        show: true,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
      },
      data: props.chartData.xData,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        show: props.chartData.isYaxisLabel,
        color: "#909399",
        fontSize: 12,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: props.chartData.dashedColor
            ? props.chartData.dashedColor
            : "#909399",
        },
      },
      axisLine: {
        show: false,
      },
      name: "",
    },
    series: [
      {
        name: "未来趋势预测",
        type: "line",
        data: props.chartData.yDataing,
        smooth: true,
        symbolSize: 0,
        showSymbol: props.chartData.showSymbol,
        // markPoint: {
        //   // symbol: "circle",
        //   symbolSize: 15,
        //   label: {
        //     show: false,
        //   },
        //   symbolOffset: [0, 0],
        //   data: props.chartData.showMaxValue
        //     ? [{ type: "max", name: "最大值" }]
        //     : [],
        // },
        itemStyle: {
          color: props.chartData.itemLineStyling,
        },
      },
      {
        name: "历史事件趋势",
        type: "line",
        symbolSize: 0, // 是否显示断点
        data: props.chartData.yDataed,
        smooth: true,
        showSymbol: props.chartData.showSymbol,
        markPoint: {
          label: {
            show: false,
          },
        },
        itemStyle: {
          color: props.chartData.itemLineStyled,
        },
      },
    ],
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: "linear",
    animationEasingUpdate: "linear",
  };
  return option;
});
</script>