<template>
  <echarts
    :option="option"
    ref="echart"
    :update-options="{ notMerge: true }"
    autoresize
  />
  <div class="left_date">
    <div
      @click="clickTime('1')"
      :class="[dateTime == '1' ? 'active' : '', 'year']"
    >
      年
    </div>
    <div
      @click="clickTime('2')"
      :class="[dateTime == '2' ? 'active' : '', 'month']"
    >
      月
    </div>
    <div
      @click="clickTime('3')"
      :class="[dateTime == '3' ? 'active' : '', 'day']"
    >
      日
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue-demi";

const emit = defineEmits(["echarthtree"]);
let dateTime = ref("1");
function clickTime(val) {
  if (val == 1) {
    emit("echarthtree", "year");
  } else if (val == 2) {
    emit("echarthtree", "month");
  } else if (val == 3) {
    emit("echarthtree", "day");
  }
  dateTime.value = val;
}
const props = defineProps({
  chartData: Object,
});
let redsd = {
  type: "slider",
  show: true,
  start: 0,
  end: 100,
  xAxisIndex: [0],
  bottom: 20,
  left: 30,
};
let symbol = false;
watch(
  () => props.chartData.seriesone,
  (val) => {
    if (val.length == 1) {
      symbol = true;
    } else {
      symbol = false;
    }
  }
);
// let grid = { left: 10, right: 10, top: 100, bottom: 70, containLabel: true };
const option = computed(() => {
  const option = {
    color: ["#198cf6"],
    grid: {
      left: 10,
      right: 10,
      top: 100,
      bottom: props.chartData.seriesone.length > 10 ? 32 : 10,
      containLabel: true,
    },
    title: {
      text: props.chartData.title,
      top: 7,
      right: 20,
      textStyle: {
        color: "#b7b7af",
        fontSize: 16,
        fontWeight: 300,
      },
    },
    tooltip: {
      trigger: "axis",
      show: true,
    },

    legend: {
      right: 20,
      top: 50,
      itemWidth: 8,
      icon: "circle",
      // data: props.chartData.legendList,
      textStyle: {
        color: "white",
      },
    },
    xAxis: [
      {
        type: "category",
        axisTick: { show: false },
        data: props.chartData.xaxisdate,
        axisLine: {
          //   show: false,
          lineStyle: {
            color: "white",
          },
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          //   show: false,
          color: "white",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        splitLine: {
          //   show: false,
          lineStyle: {
            type: "dashed",
          },
        },
      },
    ],
    series: [
      {
        name: props.chartData.legendList[0],
        type: "line",
        smooth: true,
        barGap: 0,
        symbolSize: 8,
        showSymbol: symbol,
        barWidth: 15,
        data: props.chartData.seriesone,
        barGap: "20%",
        areaStyle: {
          color: "#333f4a",
        },
      },
    ],
    // dataZoom: [props.chartData.dataZoom ? redsd : ""],
    // dataZoom: {
    //   type: "slider",
    //   show: props.chartData.seriesone.length > 10 ? true : false,
    //   start: 0,
    //   end: props.chartData.seriesone.length > 10 ? 4 : 100,
    //   xAxisIndex: [0],
    //   bottom: 20,
    //   left: 30,
    //   realtime: true,
    //   height: 10,
    //   // maxSpan: 4,
    //   borderColor: "#363636",
    //   textStyle: {
    //     color: "#05D5FF",
    //   },
    //   backgroundColor: "#424242",
    // },
  };
  return option;
});
</script>

<style lang="scss" scoped>
@import url("../css/echarts.css");
</style>