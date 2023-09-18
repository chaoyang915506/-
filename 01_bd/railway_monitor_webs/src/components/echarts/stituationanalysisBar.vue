<template>
  <echarts
    :option="option"
    ref="echart"
    :update-options="{ notMerge: true }"
    autoresize
  />
</template>
<script setup>
let props = defineProps({
  chartData: Object,
});
const option = computed(() => {
  const option = {
    title: [
      {
        zlevel: 0,
        text: props.chartData.title,
        textStyle: {
          color: "#bfbfb6",
          fontWeight: "100",
          //字体系列
          fontFamily: "sans-serif",
          //字体大小
          fontSize: 14,
        },
      },
      {
        zlevel: 1,
        text: "注：强风（6级风+7级风），大风（八级以上)",
        left: "105",
        top: "20",
        textAlign: "center",
        textStyle: {
          color: "#bfbfb6",
          // fontWeight: "100",
          //字体系列
          fontFamily: "sans-serif",
          //字体大小
          fontSize: 10,
        },
      },
    ],

    grid: {
      left: 20,
      right: 50,
      top: 40,
      bottom: 20,
      containLabel: true,
    },
    xAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    yAxis: [
      {
        type: "category",
        axisLabel: {
          show: true,
          color: "white",
          fontSize: 13,
        },
        splitLine: {
          show: false,
        },
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
        },
        data: props.chartData.xData,
      },
      {
        type: "category",
        axisLabel: {
          show: false,
          //   color: "#fff",
        },
        splitLine: {
          show: false,
        },
        // inverse: true,
        // animationDuration: 300,
        // animationDurationUpdate: 300,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: props.chartData.yData,
      },
    ],
    series: [
      {
        type: "bar",
        yAxisIndex: 1,
        barCategoryGap: 50,
        barWidth: 15,
        data: props.chartData.yData,
        showBackground: true,
        backgroundStyle: {
          color: "#2b3948",
        },
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 1,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#2c4489", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#17a9ac", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        label: {
          show: true,
          position: "right",
          textStyle: {
            //数值样式
            color: "white",
            fontSize: 12,
            fontWeight: 700,
          },
          formatter: (params) => {
            return (params.value * 100).toFixed(2) + "%";
          },
        },
      },
    ],
  };

  return option;
});
</script>