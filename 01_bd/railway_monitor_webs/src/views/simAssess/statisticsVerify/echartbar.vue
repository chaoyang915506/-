<template>
  <echarts
    :option="option"
    ref="echart"
    :update-options="{ notMerge: true }"
    autoresize
  ></echarts>
</template>

<script setup>
const props = defineProps({
  echartData: Object,
});

const option = computed(() => {
  const option = {
    color: ["#3584bb", "#ff8d29"],
    title: {
      text: "走势图",
      //   subtext: "Fake Data",
      left: "45%",
    },
    grid: {
      left: 20,
      top: 40,
      right: 30,
      bottom: 10,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      formatter: function (params) {
        console.log(params, "log");
        return `${params[0].marker}&nbsp;${
          params[0].color == "green" ? "历史" : "预测"
        }
          ${params[0].data}
        `;
      },
    },
    // toolbox: {
    //   show: true,
    //   feature: {
    //     saveAsImage: {}
    //   }
    // },
    // legend:{
    //     data:['Electricity']
    // },
    xAxis: {
      type: "category",
      boundaryGap: true,
      // prettier-ignore
      data: props.echartData.xdata,
    },
    yAxis: {
      type: "value",
      boundaryGap: true,
      //   axisLabel: {
      //     formatter: "{value} W",
      //   },
      axisPointer: {
        snap: true,
      },
    },
    visualMap: {
      show: false,
      dimension: 0,
      pieces: [
        {
          lte: 17,
          color: "green",
        },
        {
          gt: 17,
          lte: props.echartData.ydata.length,
          color: "red",
        },
      ],
    },
    series: [
      {
        name: "历史",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 10,
        emphasis: {
          itemStyle: {
            borderWidth: 10,
          },
        },
        // itemStyle: {
        //   borderColor: "green",
        //   borderWidth: 0,
        // },
        // prettier-ignore
        data:  props.echartData.ydata,
        // markArea: {
        //   itemStyle: {
        //     color: 'rgba(255, 173, 177, 0.4)' //背景色
        //   },
        //   label: {
        //     color: 'red' //文字颜色
        //   },
        //   data: [
        //     [
        //       {
        //         name: 'Morning Peak',
        //         xAxis: '07:30'
        //       },
        //       {
        //         xAxis: '10:00'
        //       }
        //     ],
        //     [
        //       {
        //         name: 'Evening Peak',
        //         xAxis: '17:30'
        //       },
        //       {
        //         xAxis: '21:15'
        //       }
        //     ]
        //   ]
        // }
      },
      //   {
      //     name: "预测支出",
      //     type: "line",
      //     smooth: true,
      //     symbol: "circle",
      //     symbolSize: 10,
      //     emphasis: {
      //       itemStyle: {
      //         borderWidth: 10,
      //         color: "#ff8d29",
      //       },
      //     },
      //     lineStyle: {
      //       color: "#ff8d29",
      //     },
      //     // itemStyle: {
      //     //   borderColor: "red",
      //     //   borderWidth: 0,
      //     // },
      //     data: props.echartData.ydata2,
      //   },
    ],
  };

  return option;
});
</script>

<style lang="scss" scoped>
</style>