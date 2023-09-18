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
    title: {
      text: "近半年异物侵限走势统计",
      textStyle: {
        color: "white",
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    // 通过这个color修改两条线的颜色
    color: ["#ff5c5c", "#14b9d9"],
    tooltip: {
      trigger: "axis",
      show: true,
      backgroundColor: "rgba(0, 0, 0,0.6)",
      color: "white",
      textStyle: {
        color: "#fff",
      },
      // formatter: function (params) {
      //   console.log(params, "all");
      //   const item1 = params[0];
      //   const item2 = params[1];
      //   return `
      //   ${props.echartData.forcasttime[item1?.dataIndex]}<br/>
      //   ${item1.marker}&nbsp;&nbsp;${item1.data}<br/>
      //   ${props.echartData.historycreatetime[item2?.dataIndex]}<br/>
      //   ${item2.marker}&nbsp;&nbsp;${item2.data}<br/>
      //   `;
      // },
    },
    legend: {
      type: "plain",
      icon: "circle",
      // 如果series 对象有name 值，则 legend可以不用写data
      // 修改图例组件 文字颜色
      textStyle: {
        color: "#4c9bfd",
      },
      textStyle: {
        fontSize: "15px",
        color: "white",
      },
      // 这个10% 必须加引号
      right: "10%",
      top: "2%",
    },
    grid: {
      left: "20",
      top: "40",
      right: "30",
      bottom: "10",
      containLabel: true,
    },

    xAxis: {
      axisTick: {
        show: false,
      },

      type: "category",
      boundaryGap: false,
      data: props.echartData.historycreatetime,
      axisTick: {
        show: false, // 去除刻度线
      },
      axisLabel: {
        color: "#afafaf", // 文本颜色
      },
    },
    yAxis: {
      axisTick: {
        show: false, // 去除刻度线
      },
      axisLabel: {
        color: "#585858", // 文本颜色
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: "#7e9fb6",
        },
      },
      type: "value",
      splitLine: {
        // show: false,
        lineStyle: {
          type: "dashed",
          color: "#999999",
        },
      },
    },
    series: [
      {
        name: "未来趋势预测",
        // data: [2, 23, 5],
        data: props.echartData.forcast,
        type: "line",
        smooth: true,
        showSymbol: false,
      },
      {
        name: "历史时间趋势预测",
        // data: [23, 324, 3],
        data: props.echartData.history,

        type: "line",
        smooth: true,
        showSymbol: false,
      },
    ],
  };
  return option;
});
</script>

<style lang="scss" scoped>
</style>