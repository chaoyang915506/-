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
const option = computed(() => {
  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "30%",
      right: "70%",
      textStyle: {
        color: "#565454",
      },
    },
    series: [
      {
        name: "北斗卡绑定统计",
        type: "pie",
        radius: ["40%", "80%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: props.chartData.total,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "10",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          normal: {
            color: function (colors) {
              var colorList = [
                "#ffbf3c",
                "#fb1212",
                "#50cccb"
              ];
              return colorList[colors.dataIndex];
            },
          },
        },
        data: props.chartData.list,
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
