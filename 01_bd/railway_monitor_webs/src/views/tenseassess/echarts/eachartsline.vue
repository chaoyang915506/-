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
  <div class="searchinput">
    <el-select
      v-model="props.chartData.lineValue"
      class="m-2"
      @change="changeSelect"
      placeholder=""
      size="small"
    >
      <el-option
        v-for="item in props.chartData.lineList"
        :key="item.id"
        :label="item.monitorName"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script setup>
const emit = defineEmits(["echarttwo", "lineChangeline"]);
const props = defineProps({
  chartData: Object,
});
const changeSelect = (e) => {
  // console.log(e, "red的说法");
  emit("lineChangeline", e);
};
let dateTime = ref("1");
function clickTime(val) {
  if (val == 1) {
    emit("echarttwo", "year");
  } else if (val == 2) {
    emit("echarttwo", "month");
  } else if (val == 3) {
    emit("echarttwo", "day");
  }
  dateTime.value = val;
    emit("getDateTime",dateTime.value);
}
let redsd = {
  type: "slider",
  show: true,
  start: 0,
  end: 100,
  xAxisIndex: [0],
  bottom: 20,
  left: 30,
};
let grid = { left: 10, right: 10, top: 100, bottom: 70, containLabel: true };
const option = computed(() => {
  const option = {
    color: ["red", "#14b9d9", "yellow"],
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
    },
    legend: {
      right: 20,
      top: 50,
      itemWidth: 8,
      icon: "circle",
      textStyle: {
        color: "white",
      },
    },
    tooltip: {
      trigger: "axis",
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
        symbolSize: 8,
        data: props.chartData.seriesone,
      },
      {
        name: props.chartData.legendList[1],
        type: "line",
        smooth: true,
        symbolSize: 8,
        data: props.chartData.seriestwo,
      },
      {
        name: props.chartData.legendList[2],
        type: "line",
        symbolSize: 8,
        smooth: true,
        data: props.chartData.seriesthree,
      },
    ],
    dataZoom: {
      type: "slider",
      show: props.chartData.seriesone.length > 20 ? true : false,
      start: 0,
      end: props.chartData.seriesone.length > 10 ? 40 : 100,
      xAxisIndex: [0],
      bottom: 20,
      left: 30,
      realtime: true,
      height: 10,
      // maxSpan: 4,
      borderColor: "#363636",
      textStyle: {
        color: "#05D5FF",
      },
      backgroundColor: "#424242",
    },
  };
  return option;
});
</script>

<style lang="scss" scoped>
@import url("../css/echarts.css");
</style>