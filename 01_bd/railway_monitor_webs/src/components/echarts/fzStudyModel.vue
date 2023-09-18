<template>
  <echarts :option="option" :ref="id" :update-options="{ notMerge: true }" autoresize />
</template>
<script setup>
let { proxy } = getCurrentInstance();

let props = defineProps({
  chartData: {
    type: Object,
    default: {}
  },
  id: {
    type: String,
    default: 'echart'
  },
  echartsIndex: {
    type: Number,
    default: undefined
  }
});
let colors = ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"]
const option = computed(() => {
  // console.log(props.chartData, "x轴");
  const option = {
    title: {
      text: props.chartData.title,
      textStyle: {
        color: "#fff",
        fontWeight: "100",
        //字体系列
        fontFamily: "sans-serif",
        //字体大小
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0,0,0,0.8)", //设置背景图片 rgba格式
      textStyle: {
        color: "#eee", //设置文字颜色
        fontSize: 13,
      },
      borderWidth: "1", //边框宽度设置1
      borderColor: "rgba(0,0,0,0.8)", //设置边框颜色
      formatter(params){
        return `<p>
          <span>次数：</span>
          <span>${params[0].name}</span>
        </p><p>
          <span>loss值：</span>
          <span>${params[0].value}</span>
        </p>`
      }
    },
    grid: {
      left: 15,
      right: 15,
      top: props.chartData.gridTop ? props.chartData.gridTop : 50,
      bottom: props.dataZoom ? 15 : 0,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: "#ccc",
      },
      boundaryGap: false,
      data: props.chartData.xData,
    },
    yAxis: [
      {
        type: "value",
        axisLabel: {
          show: props.chartData.isYAxisLabel ? true : false,
        },
        // max: 10,//设置最大值
        // min: 0,//设置最小值
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            color: props.chartData.dashedColor
              ? props.chartData.dashedColor
              : "#909399",
          },
        },
      },
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
        data: props.chartData.yData,
        markPoint: {
          // symbol: "circle",
          symbolSize: 15,
          label: {
            show: false,
          },
          symbolOffset: [0, 0],
          data: props.chartData.showMaxValue
            ? [{ type: "max", name: "最大值" }]
            : [],
        },
        type: "line",
        smooth: props.chartData.isMmooth, // 是否平滑曲线
        showSymbol: props.chartData.showSymbol,
        itemStyle: {
          lineStyle: {
            width: props.echartsIndex == undefined ? 1 : 0.5// 0.1的线条是非常细的了
          },
          color: props.echartsIndex == undefined ? props.chartData.color : colors[props.echartsIndex],
          width: 0.5,
          opacity: 1,
        }
      },
    ],
  };

  return option;
});
</script>