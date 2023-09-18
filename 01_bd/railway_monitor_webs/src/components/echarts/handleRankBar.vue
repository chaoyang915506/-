<template>
  <echarts
    :option="option"
    ref="echart"
    :update-options="{ notMerge: true }"
    autoresize
  />
</template>
<script setup>

let { proxy } = getCurrentInstance()

let props = defineProps({
  chartData: Object
})
const option = computed(() => {
  const option = {
    title: {
      text: props.chartData.title,
      textStyle: {
        color: '#fff',
        fontWeight: '100',
        //字体系列
        fontFamily: 'sans-serif',
        //字体大小
        fontSize: 15
      },
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: 10,
      right: 10,
      top: 40,
      bottom: 20,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
    },
    yAxis: [
      {
        axisLabel: {
          show: true,
          color: '#909399',
          fontSize: 13
        },
        splitLine: {
          show: false
        },
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        data: props.chartData.xData,
      },
      {
        type: 'category',
        axisLabel: {
          show: true,
          color: '#fff'
        },
        splitLine: {
          show: false
        },
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        data: props.chartData.yData,
      }
    ],
    legend: {
      left: "center",
      bottom: 10,
      textStyle: {
        color: "#EEE",
      },
    },
    series: [
      {
        type: "bar",
        barWidth: 10,
        realtimeSort: true,
        data: props.chartData.yData,
        label: {
          valueAnimation: true
        },
        itemStyle: {
          color: '#6ADDE1',
        }
      }
    ],
  };

  return option;
})
</script>