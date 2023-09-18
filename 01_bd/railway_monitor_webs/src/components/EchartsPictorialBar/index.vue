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
  echartData: Object,
});

// let girdData = {
//   left: 20,
//   top: 40,
//   right: 20,
//   bottom: 22,
//   containLabel: false,
// };
// let girdData2 = {
//   left: 10,
//   right: 10,
//   bottom: 2,
//   top: 30,
//   containLabel: false,
// };
// watch(
//   () => props.echartData.seriesData,
//   (val) => {
//     if (val.length > 9 && props.echartData.dataZoom) {
//       redsd.value.show = true;
//       girdData.bottom = 50;
//       girdData2.bottom = 50;
//     }
//   },
//   {
//     immediate: true,
//     deep: true,
//   }
// );

const option = computed(() => {
  let maxlength = props.echartData.maxValueSpan
    ? props.echartData.maxValueSpan
    : 10;
  const option = {
    title: {
      text: props.echartData.title,
      textStyle: {
        color: props.echartData.titleColor
          ? props.echartData.titleColor
          : "#b6bdbf",
        fontSize: props.echartData.fontSize
          ? props.echartData.fontSize
          : "14px",
        fontWeight: 300,
      },
    },
    // grid: props.echartData.girdData
    //   ? props.echartData.girdData
    //   : props.echartData.girdData2
    //   ? girdData1
    //   : girdData,
    grid: {
      left: 10,
      right: 10,
      bottom: props.echartData.seriesData.length > maxlength ? 50 : 30,
      top: 40,
      containLabel: false,

      // props.echartData.seriesData.length > props.echartData.maxValueSpan
      //   ? props.echartData.maxValueSpan
      //   : 10
    },
    xAxis: {
      type: "category",
      //x轴的标题的样式
      axisLabel: {
        color: "rgba(255,255,255,.6) ",
        fontSize: "12",
      },
      interval: 100,
      axisLine: {
        show: props.echartData.axisLine,
        lineStyle: {
          color: "#2a4e77",
        },
      },
      axisLabel: {
        interval: 0,
        color: "#a7a7a7",
      },
      minorSplitLine: {
        // show: false,
      },
      axisTick: {
        //x轴刻度线
        show: false,
      },
      data: props.echartData.xAxisData,
    },
    yAxis: {
      type: "value",
      show: false,
    },
    series: [
      {
        type: "pictorialBar",
        animationDuration: 0,
        legendHoverLink: false,
        symbolRepeat: "true",
        symbolMargin: "30%",
        symbol: "rect",
        symbolSize: [25, 3],
        itemStyle: {
          color: "#bbb",
        },
        data: props.echartData.seriesData,
        z: 1,
        animationEasing: "elasticOut",
        label: {
          show: true,
          lineHeight: 10,
          formatter: (params) => {
            return props.echartData.percent
              ? (params.value * 100).toFixed(2) + "%"
              : params.value;
          },
          position: "top",
          color: props.echartData.color ? props.echartData.color : "#a7a7a7",
          fontSize: 14,
        },
      },
    ],
    // dataZoom: [props.echartData.dataZoom ? redsd.value : ""],
    dataZoom: {
      type: "slider",
      show: props.echartData.seriesData.length > maxlength ? true : false,
      start: 0,
      end: 70,
      xAxisIndex: [0],
      bottom: 15,
      left: 30,
      right: 30,
      realtime: true,
      height: 10,
      borderColor: "#363636",
      textStyle: {
        color: "#05D5FF",
      },
      backgroundColor: "#424242",
      minValueSpan: props.echartData.minValueSpan
        ? props.echartData.minValueSpan
        : 6, //最小显示多少个
      maxValueSpan: props.echartData.maxValueSpan
        ? props.echartData.maxValueSpan
        : 10, //最小显示多少个
    },
  };

  return option;
});
</script>