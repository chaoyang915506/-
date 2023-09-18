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
const props = defineProps({
  chartData: Object,
});
const emit = defineEmits(["changeDate"]);
let dateTime = ref("1");
function clickTime(val) {
  if (val == "1") {
    emit("changeDate", "year");
  } else if (val == "2") {
    emit("changeDate", "month");
  } else if (val == "3") {
    emit("changeDate", "day");
  }
  dateTime.value = val;
}
const option = computed(() => {
  const option = {
    color: ["#c27e28", "#30ac55", "#dcb519"],
    grid: {
      left: 10,
      right: 10,
      top: 100,
      bottom: props.chartData.seriesone.length > 20 ? 32 : 10,
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
      //   textAlign: "right",
    },
    tooltip: {
      trigger: "axis",
      show: true,
    },
    legend: {
      right: 20,
      top: 50,
      icon: "circle",
      itemWidth: 8,
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
          lineStyle: {
            type: "dashed",
          },
        },
      },
    ],
    series: [
      {
        type: "line",
        smooth: true,
        showSymbol: false,
        data: props.chartData.seriesone,
      },
    ],
    dataZoom: [
      {
        type: "slider",
        show: props.chartData.seriesone.length > 20 ? true : false,
        start: 0,
        end: props.chartData.seriesone.length > 20 ? 20 : 100,
        xAxisIndex: [0],
        bottom: 15,
        left: 20,
        right: 20,
        realtime: true,
        height: 10,
        borderColor: "#363636",
        textStyle: {
          color: "#05D5FF",
        },
        backgroundColor: "#424242",
      },
    ],
  };
  return option;
});
</script>
<style lang="scss" scoped>
@import url("../css/echarts.css");
</style>