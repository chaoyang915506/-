<template>
  <echarts
    :option="option"
    ref="echart"
    :update-options="{ notMerge: true }"
    autoresize
  />
</template>
<script setup>
import { watch } from "@vue/runtime-core";
const props = defineProps({
  chartData: Object,
});
let colorDeep = ["red", "#ffc245", "#5ccfcd", "#0482ff"];
let colorShallow = ["#fd8989", "#ffdf9e", "#a8e6e5", "#9acdff"];
const option = computed(() => {
  const sData = props.chartData.sData;
  const sData1 = props.chartData.sData1;
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    series: [
      // 内圈
      {
        type: "pie",
        radius: ["30%", "50%"],
        label: {
          show: false,
          position: "outside",
          fontSize: 12,
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          color: function (colors) {
            // console.log(colors, "shallow");
            return colorShallow[colors.dataIndex];
          },
        },
        data: sData,
      },
      // 外圈
      {
        type: "pie",
        radius: ["50%", "70%"],
        label: {
          show: false,
          position: "outside",
          fontSize: 12,
        },
        labelLine: {
          show: false,
          // length: 20,
          // smooth: true,
          // lineStyle: {
          //    color: '#333',
          //    width: 2
          // }
        },
        itemStyle: {
          color: function (colors) {
            // console.log(colors, "deep");
            return colorDeep[colors.dataIndex];
          },
        },
        data: sData1,
      },
    ],
  };

  return option;
});
</script>
<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 90% !important;
}
</style>
