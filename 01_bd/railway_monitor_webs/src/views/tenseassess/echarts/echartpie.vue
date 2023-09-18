<template>
  <echarts
    :option="option"
    ref="echart"
    :update-options="{ notMerge: true }"
    autoresize
  />
  <div class="bgc_ecahrts"></div>
</template>

<script setup>
let props = defineProps({
  chartData: Object,
});
const option = computed(() => {
  const option = {
    color: [props.chartData.color, "#7610d5"],
    title: [
      {
        text: props.chartData.info,
        x: "center",
        top: "32%",
        textStyle: {
          color: "#808080",
          fontSize: 12,
          fontWeight: "300",
        },
      },
      {
        text: (props.chartData.datapie * 100).toFixed(2) + "%",
        x: "center",
        top: "50%",
        textStyle: {
          fontSize: 10,
          color: "#343434",
          foontWeight: "500",
        },
      },
    ],
    grid: {
      left: 10,
      right: 10,
      top: 100,
      bottom: 20,
      containLabel: true,
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["55%", "70%"],
        label: {
          show: false,
          position: "center",
        },
        labelLine: {
          show: false,
        },
        data: [{ value: props.chartData.datapie }, { value: 1 }],
      },
      {
        type: "pie",
        radius: "55%",
        center: ["50%", "50%"],
        hoverAnimation: false,
        // clockWise: false,
        itemStyle: {
          normal: {
            shadowBlur: 0,
            shadowColor: "#fff",
            color: "#fff",
          },
        },
        label: {
          show: false,
        },
        data: [100],
      },
      // {
      //   name: "Access From",
      //   type: "pie",
      //   zlevel: 1,
      //   silent: true,
      //   radius: ["0%", "50%"],
      //   label: {
      //     show: false,
      //     // position: "center",
      //   },
      //   labelLine: {
      //     show: false,
      //   },
      //   itemStyle: {
      //     normal: {
      //       color: "red",
      //     },
      //   },
      // },
    ],
  };
  return option;
});
</script>

<style lang="scss" scoped>
// .bgc_ecahrts {
//   position: absolute;
//   left: 0;
//   top: 0;
//   background-color: #fff;
//   border-radius: 50%;
// }
</style>