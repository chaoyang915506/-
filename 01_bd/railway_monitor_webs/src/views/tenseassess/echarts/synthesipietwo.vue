<template>
  <echarts
    :option="option"
    ref="echart"
    :update-options="{ notMerge: true }"
    autoresize
  />
</template>

<script setup>
const props = defineProps({
  chartData: Object,
});

const option = computed(() => {
  let options = {
    title: [
      {
        text: props.chartData.title,
        top: 7,
        left: 0,
        textStyle: {
          color: "#b7b7af",
          fontSize: 16,
          fontWeight: 300,
        },
      },
      {
        subtext: "历史",
        left: "24%",
        top: "78%",
        textAlign: "center",
        subtextStyle: {
          fontSize: 14,
          color: "#fff",
          // fontFamily: "SourceHanSansCN",
          fontWeight: 400,
        },
      },
      {
        subtext: "预测",
        right: "14%",
        top: "78%",
        textAlign: "center",
        subtextStyle: {
          fontSize: 14,
          color: "#fff",
          fontFamily: "SourceHanSansCN",
          fontWeight: 400,
        },
      },
    ],
    tooltip: {
      trigger: "item",
      //{a}<br/>
      formatter: "{b} : {c}次 ({d}%)",
    },
    legend: {
      top: "bottom",
      icon: "circle",
      //   width: "2px",
      itemWidth: 9,
      itemStyle: {
        //   color:"red"
        // fontSize: '18px',
      },

      textStyle: {
        color: "white",
      },
    },
    series: [
      {
        type: "pie",
        radius: [20, 70],
        center: ["25%", "50%"],
        roseType: "radius",
        itemStyle: {
          borderRadius: 5,
        },
        label: {
          show: false,
        },
        //经过显示带线的只指示
        // emphasis: {
        //   label: {
        //     show: true,
        //   },
        // },
        minAngle: 100,
        data: props.chartData.serviesData.hisMapsList,
      },
      {
        type: "pie",
        radius: [20, 70],
        center: ["75%", "50%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 5,
        },
        label: {
          show: false,
        },
        data: props.chartData.serviesData.forecastMapList,
      },
    ],
  };
  return options;
});
</script>

<style lang="scss" scoped>
@import url("../css/echarts.css");
</style>