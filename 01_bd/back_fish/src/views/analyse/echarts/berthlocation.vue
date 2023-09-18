<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
  name: "berthlocation",
  props: {
    chartData: {
      type: Object,
      default: null,
    },
    max: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    chartData: {
      deep: true,
      immediate: true,
      handler(val) {
        // console.log("执行", val);
        if (val && this.echarts != null) {
          this.echarts.setOption(this.option);
        }
      },
    },
  },
  data() {
    return {
      echarts: null,
    };
  },
  computed: {
    option() {
      let yData, yLabel;
      let resd = JSON.parse(JSON.stringify(this.chartData));
      if (this.max == true) {
        yLabel = this.chartData.xdata;
        yData = this.chartData.seriesdata;
      } else {
        if (resd && resd.xdata && resd.xdata.length > 3) {
          yLabel = resd.xdata.splice(0, 3);
          yData = resd.seriesdata.splice(0, 3);
        } else {
          yLabel = this.chartData.xdata;
          yData = this.chartData.seriesdata;
        }
      }
      let maxd = Math.max.apply(null, this.chartData.seriesdata);
      return {
        grid: {
          left: "5%",
          right: "5%",
          bottom: "5%",
          top: "10%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          confine: true,
          axisPointer: {
            type: "none",
          },
          continue: true,
          formatter: function (params) {
            return (
              params[0].name +
              "<br/>" +
              "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#719DF7'></span>" +
              params[0].seriesName +
              " : " +
              params[0].value +
              " <br/>"
            );
          },
        },
        xAxis: {
          show: true,
          type: "value",
          minInterval: 1,
          axisLabel: {
            show: true,
            margin: 15,
            textStyle: {
              color: "#fff",
              fontSize: 12,
              fontFamily: "PingFang SC",
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: [
          {
            type: "category",
            inverse: true,
            minInterval: 1,
            axisLabel: {
              width: 100,
              overflow: "break",
              show: true,
              margin: 15,
              textStyle: {
                color: "#fff",
                fontSize: 12,
                fontFamily: "PingFang SC",
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#D9D9D9",
              },
            },
            data: yLabel,
          },
        ],
        dataZoom: [
          //滚动条
          {
            show: this.max && yData.length > 6 ? true : false,
            yAxisIndex: 0,
            orient: "vertical",
            filterMode: "empty",
            type: "slider",
            realtime: true,
            maxValueSpan: 6,
            height: "100%",
            width: 10,
            right: 0,
            top: 0,
            borderColor: "rgba(0,0,0,0)",
            textStyle: {
              color: "#05D5FF",
            },
            showDataShadow: false,
          },
          {
            type: "inside",
            yAxisIndex: [0],
            moveOnMouseWheel: true,
            // moveOnMouseMove: true,
            zoomOnMouseWheel: false,
          },
        ],
        series: [
          {
            name: "次数",
            type: "bar",
            zlevel: 1,
            barWidth: 13,
            // label: {
            //   show: true,
            //   // lineHeight: 10,
            //   posititon: "inside",
            //   textStyle: {
            //     color: "#fff",
            //   },
            // },
            // itemStyle: {
            //   color: new echarts.graphic.LinearGradient(
            //     1,
            //     0,
            //     0,
            //     0,
            //     [
            //       { offset: 0, color: "rgba(5,213,255,1" },
            //       { offset: 0.98, color: "rgba(5,213,255,0)" },
            //     ],
            //     false
            //   ),
            //   shadowColor: "rgba(5,213,255,1)",
            //   shadowBlur: 4,
            // },
            data: yData,
          },
        ],
      };
    },
  },
  methods: {
    init() {
      this.echarts = this.$echarts.init(this.$refs.echarts);
      this.echarts.setOption(this.option);
    },
    resize() {
      this.echarts.resize();
    },
  },
  mounted() {
    this.init();
    window.addEventListener("resize", () => {
      if (this.echarts) {
        this.echarts.resize();
      }
    });
  },
  beforeDestroy() {
    this.echarts.dispose();
    this.echarts = null;
  },
  destroyed() {
    window.removeEventListener("resize", () => {
      this.echarts.resize();
    });
  },
};
</script>

<style lang="scss" scoped>
.title {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  color: red;
}
</style>