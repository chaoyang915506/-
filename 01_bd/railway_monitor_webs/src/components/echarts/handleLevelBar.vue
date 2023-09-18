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
    // tooltip: {
    //   trigger: 'axis'
    // },
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
          color: '#fff',
          verticalAlign: 'bottom',
          align:'right',
          fontSize: 13,
          //调整文字上右下左
          padding: [0,10,10,0],
        },
        splitLine: {
          show: false
        },
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
        name: '',
        type: 'pictorialBar',
        // symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAZlBMVEUAAABe3uVe3+Vf3uVf3+Zf3uVg3+Zg3+Zf3+Vi4OZh4OZg3+Z86/Bh3+Zi4Odj4Odi4OZ86/B76/B86/Bj4ed56+9x5+xn4umB7/N87PB36e+A7/N+7fF/7vJ/7vJ+7fGA7/OB7/PReX+lAAAAIXRSTlMABQkVDREmIhk3MR10LEFFPHh7cUprXE35h2XnqMLAp+mHAG9cAAAB5ElEQVRIx83WjU7CMBQFYIoiKMqU/XUboHv/l/Tce7t2XamDNSacETEmX86tlK2rx4py150o+MstMBLwWRfHKo6JCVxLnvmFGBjFQ58oF1//sUZhGy/ClSTWObgnL4O+bkeN4nY2okfNMbkRt9/vtxz8InoTsWplJSCzFxPmO8+GpSIByX3YQAuGDWtRKhKjCnxDXhF6Z4yxnZ20Wgko7BMRDmxtSGVaI4kdTIgb+zTYoJQlIMlDlmUFgrcDWWC201qSayqlTkiCddWWeV62VU0YlnpRi9VOKaSUsiyq/N0krwq2Ugt7lVpZl5BfHNiytjagMi+XYp0kCR45hMlivVQrE/uU5pXSrCB5bM6d1t2lOZItMqmliT3q5uVxqxzyW/ccfYLNKx7ZTeykMvNyac2yt2Fbc61MHLSC0rwoxbiNdlQ3GBm1NLHQsHUrtEXppR/ljNpW6DbSCoqlFiVoN6YdaFlgsSFVPs1BdT8OaB5QyQzVcaqWDows/zepxR8ObLglTrdtCRVuRNj4Rrxh+//0ke2f8KVL+Kon3GCSbmsJN9OUW3j6g0Ns+LgCij2u0h+Sghc8mlMPBMgdx5DFh59VmOVHrvmDnoNxCz3J7MFWsMuaLyR089xz/xhlfijvwutR8gv3zk6BLUUeCgAAAABJRU5ErkJggg==',
        symbolSize: [10, 10],
        symbolOffset: [8, 0],
        z: 3,
        symbolPosition: 'end',
        data: props.chartData.yData,
        itemStyle: {
          color: '#016DDA',
          opacity: 1,
        }
      },
      {
        type: "bar",
        barWidth: 5,
        // name: "订单",
        // yAxisIndex: 0,
        showBackground: true,
        backgroundStyle: { color: 'rgba(82, 168, 255, 0.1)', borderRadius: [0, 30, 30, 0] },
        data: props.chartData.yData,
        itemStyle: {
          borderRadius: [0, 30, 30, 0],
          color: {
            type: 'linear',
            // x=0,y=1,柱子的颜色在垂直方向渐变
            x: 0,
            y: 1,
            colorStops: [
              // 0%处的颜色
              {
                offset: 0,
                color: '#6ADDE1',
              },
              // 100%处的颜色
              {
                offset: 1,
                color: '#016DDA',
              },
            ],
            global: false // 缺省为 false
          }
        }
      }
    ],
  };

  return option;
})
</script>