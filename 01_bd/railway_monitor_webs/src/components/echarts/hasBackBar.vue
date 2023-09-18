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
let timer = ref(null);
onMounted(() => {
  nextTick(() => {
    // console.log(props.chartData, "erchar");
    // startActions()
  });
});
// function startActions() {
//   let step = 0;
//   timer.value = setInterval(function () {
//     let data = [];
//     if (step == 0) {
//       if (props.chartData.yData && props.chartData.yData.length) {
//         props.chartData.yData.forEach((item, index) => {
//           data[index] = 0;
//         });
//       }
//       step++;
//     } else {
//       data = props.chartData.yData;
//       step = 0;
//     }
//     option.value.series[0].data = data;
//     if (!proxy.$refs.echart) return;
//     proxy.$refs.echart.setOption(option.value);
//   }, 3000);
// }
// 鼠标移入停止
// function mouseover() {
//   clearInterval(timer.value);
//   timer.value = null;
// }
// 鼠标移出开启
// function mouseout() {
//   // startActions()
// }
const option = computed(() => {
  // console.log(props.chartData, 'props.chartDataprops.chartData')
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
    tooltip: {
      trigger: "axis",
      // show: props.chartData.isToolTipLabel,
    },
    grid: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 15,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLabel: {
        color: "#c0c3cd",
        fontSize: 12,
        interval: 0,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      data: props.chartData.xData,
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLabel: {
        show: props.chartData.isYaxisLabel,
        color: "#c0c3cd",
        fontSize: 14,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      name: "",
    },
    legend: {
      left: "center",
      bottom: 10,
      textStyle: {
        color: "#EEE",
      },
    },
    dataZoom: [
      //滚动条
      {
        show: props.chartData.yData.length > 5 ? true : false,
        type: "slider",
        bottom: "8px",
        realtime: true,
        startValue: 0,
        endValue: 4,
        xAxisIndex: [0, 1],
        height: 3,
        borderColor: "rgba(0,0,0,0)",
        textStyle: {
          color: "#05D5FF",
        },
      },
    ],
    series: [
      {
        // data: [2],
        data: props.chartData.yData,
        type: "bar",
        // barMaxWidth: 'auto',
        barWidth: 15,
        itemStyle: {
          color: "#148D8D",
        },
        label: {
          show: false,
          // position: 'top',
          // distance: 10,
          // color: '#fff'
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ],
  };
  // console.log(props.chartData.yData, "什么问");
  // console.log(props.chartData.yMaxData, "什么问");
  return option;
});
</script>
