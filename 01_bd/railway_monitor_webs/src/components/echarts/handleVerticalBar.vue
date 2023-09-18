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
      // type: 'value',
      axisLine: {
        show: true
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: true
      },
      data: props.chartData.xData
    },
    yAxis: [
      {
        axisLabel: {
          show: true,
          color: '#909399',
          fontSize: 13
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#909399'
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true
        }
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

        data: props.chartData.yData,
        itemStyle: {
          color: '#6ADDE1'
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 13,
          color: '#fff',
          offset: [0, 4],
        }
      }
    ],
  };

  return option;
})
</script>