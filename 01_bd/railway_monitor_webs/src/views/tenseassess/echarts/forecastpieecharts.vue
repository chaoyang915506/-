<template>
  <echarts :option="option" :update-options="{ notMerge: true }" autoresize />
</template>

<script setup>
const props = defineProps({
  chartData: Object,
});
let dateTime = ref("1");
function clickTime(val) {
  dateTime.value = val;
}
const option = computed(() => {
  const option = {
    grid: {
      left: 10,
      right: 10,
      top: 100,
      bottom: 70,
      containLabel: true,
    },
    tooltip: {
      trigger: "item",
      formatter: "{b} : {d}%",
    },
    title: {
      text: props.chartData.title,
      top: 7,
      left: 20,
      textStyle: {
        color: "#b7b7af",
        fontSize: 16,
        fontWeight: 300,
      },
    },
    legend: {
      top: "bottom",
      icon: "circle",
      itemWidth: 9,
      textStyle: {
        color: "white",
      },
    },
    series: [
      {
        label: {
          color: "white",
          show: false,
        },
        labelLine: {
          show: false,
        },
        type: "pie",
        radius: [15, 88],
        center: ["50%", "50%"],
        roseType: "area",
        top: 0,
        itemStyle: {
          borderRadius: 3,
        },
        data: props.chartData.serviesData,
      },
    ],
  };
  return option;
});
</script>
<style lang="scss" scoped>
@import url("../css/echarts.css");
</style>