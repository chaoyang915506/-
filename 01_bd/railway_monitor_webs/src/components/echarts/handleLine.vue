<template>
  <echarts
    :option="option"
    ref="echart"
    :update-options="{ notMerge: true }"
    autoresize
  />
</template>
<script setup>
// @mouseover="mouseover"
// @mouseout="mouseout"
let { proxy } = getCurrentInstance();

let props = defineProps({
  chartData: Object,
  dataZoom: {
    type: Boolean,
    default: false,
  },
});
let actionTimer = ref(null);
let stepLength = ref(4);
onMounted(() => {
  nextTick(() => {
    if (props.chartData.isAnimation) {
      // startActions();
    }
  });
});
const startActions = () => {
  var a = 1;
  actionTimer.value = setInterval(function () {
    if (a == props.chartData.xData.length - stepLength.value) {
      a = 0;
    }
    if (!proxy.$refs.echart) return;
    proxy.$refs.echart.dispatchAction({
      type: "dataZoom",
      startValue: a,
      endValue: a + stepLength.value,
    });
    a++;
  }, 1000);
};

// 鼠标移入停止
function mouseover() {
  clearInterval(actionTimer.value);
  actionTimer.value = null;
}
// 鼠标移出开启
function mouseout() {
  if (props.chartData.isAnimation) {
    startActions();
  }
}
const option = computed(() => {
  // console.log(props.chartData.xData, "x轴");
  // console.log(props.chartData.yData, "x轴");
  const option = {
    title: {
      text: props.chartData.title,
      textStyle: {
        color: "#fff",
        fontWeight: "100",
        //字体系列
        fontFamily: "sans-serif",
        //字体大小
        fontSize: 15,
      },
    },
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: 15,
      right: 15,
      top: props.chartData.gridTop ? props.chartData.gridTop : 50,
      bottom: props.dataZoom ? 15 : 0,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: "#ccc",
      },
      boundaryGap: false,
      data: props.chartData.xData,
    },
    yAxis: [
      {
        type: "value",
        axisLabel: {
          show: props.chartData.isYAxisLabel ? true : false,
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
      },
    ],
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
        show: props.dataZoom,
        type: "slider",
        bottom: "10px",
        realtime: true,
        start: 0,
        end: 100,
        // startValue: 4,
        // endValue: 10,
        // xAxisIndex: [0, 1],
        height: 5,
        borderColor: "rgba(0,0,0,0)",
        textStyle: {
          color: "#05D5FF",
        },
      },
    ],
    series: [
      {
        data: props.chartData.yData,
        markPoint: {
          // symbol: "circle",
          symbolSize: 15,
          label: {
            show: false,
          },
          symbolOffset: [0, 0],
          data: props.chartData.showMaxValue
            ? [{ type: "max", name: "最大值" }]
            : [],
        },
        type: "line",
        smooth: props.chartData.isMmooth,
        showSymbol: props.chartData.showSymbol,
        itemStyle: {
          color: props.chartData.color,
          opacity: 1,
        },
        areaStyle: {
          color: props.chartData.isShowArea
            ? {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: props.chartData.topColor
                      ? props.chartData.topColor
                      : "rgba(50, 216, 205, 1)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: props.chartData.bottomColor
                      ? props.chartData.bottomColor
                      : "rgba(255, 255, 255, 0.2)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              }
            : "none",
        },
      },
    ],
  };

  return option;
});
</script>