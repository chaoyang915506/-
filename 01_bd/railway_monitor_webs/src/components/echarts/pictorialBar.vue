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
    grid: {
      left: '2%',
      top: '15%',
      right: '5%',
      bottom: '7%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.chartData.xData,
      axisLine: {
        lineStyle: {
          color: 'rgba(52, 51, 51, 1)'
        }
      },
      splitLine: { show: false },
      axisLabel: {
        margin: 10,
        fontFamily: 'MicrosoftYaHei',
        fontSize: 12,
        interval: 0,
        color: '#ccc'
      },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      nameTextStyle: {
        fontFamily: 'MicrosoftYaHei',
        fontSize: 12,
        color: 'rgba(113, 113, 113, 1)'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(52, 51, 51, 1)'
        }
      },
      splitLine: { show: false },
      axisLabel: {
        margin: 20,
        show: false,
        fontFamily: 'MicrosoftYaHei',
        fontSize: 12,
        color: 'rgba(113, 113, 113, 1)'
      },
      axisTick: { show: false }
    },
    dataZoom: [//滚动条
      {
        show: props.chartData.yData.length > 5 ? true : false,
        type: 'slider',
        bottom: '8px',
        realtime: true,
        startValue: 0,
        endValue: 4,
        xAxisIndex: [0, 1],
        height: 3,
        borderColor: 'rgba(0,0,0,0)',
        textStyle: {
          color: '#05D5FF',
        },
      }
    ],
    series: [
      {
        name: '报警',
        type: 'pictorialBar',
        animationDuration: 0,
        legendHoverLink: false,
        symbolRepeat: 'true',
        symbolMargin: '30%',
        symbol: 'rect',
        symbolSize: [25, 3],
        itemStyle: {
          color: '#bbb'
        },
        data: props.chartData.yData,
        z: 1,
        animationEasing: 'elasticOut',
        label: {
          show: true,
          lineHeight: 10,
          formatter: '{c}%',
          position: 'top',
          color: '#68F1EE',
          fontSize: 14
        }
      },
    ]
  }
  return option
})
</script>