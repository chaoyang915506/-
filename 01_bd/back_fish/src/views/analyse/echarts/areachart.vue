<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
  name: "areachart",
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
      // console.log(this.echarts, "charts");
      let res = this.chartData;
      let max = Math.max.apply(null, [
        ...this.chartData.leftdata.map((i) => i.value),
        ...this.chartData.rightdata.map((i) => i.value),
      ]);
      // console.log(max, "max");
      // console.log(res, "shenm");
      return {
        title: [
          {
            gridIndex: 0,
            text: res.serialtit[0],
            top: 5,
            left: 20,
            textAlign: "left",
            textStyle: {
              color: "#fff",
              fontSize: this.max ? 16 : 10,
            },
          },
          {
            gridIndex: 0,
            text: res.serialtit[1],
            top: 5,
            right: 20,
            textAlign: "left",
            textStyle: {
              color: "#fff",
              fontSize: this.max ? 16 : 10,
            },
          },
        ],
        tooltip: {
          show: this.max,
          enterable: true,
          confine: true,
          // extraCssText: "width:200px;height:100px;",
          // trigger: "item",
          formatter: (params) => {
            let title;
            let body = ``;
            let name = res.serialtit[params.seriesIndex] + "<br/>";
            if (params.name == "部署次数" || params.name == "0") {
              title = `${name}部署次数<br/>${params.marker}${params.value}<br/>`;
            } else if (params.name == "维修次数" || params.name == "1") {
              title = `${name}维修次数<br/>${params.marker}${params.value}<br/>`;
            } else if (params.name == "停靠点" || params.name == "2") {
              title = `${name}停靠点<br/>${params.marker}${params.value}<br/>`;
              if (params.name == 2) {
                res.leftdata[0].info.forEach((item) => {
                  body += "停靠位置:" + item.addr + "<br/>";
                });
              } else {
                res.rightdata[0].info.forEach((item) => {
                  body += "停靠位置:" + item.addr + "<br/>";
                });
              }
            }
            return title + body;
          },
        },
        grid: [
          {
            show: false,
            left: "5%",
            top: "10%",
            bottom: "8%",
            containLabel: true,
            width: "37%",
          },
          {
            show: false,
            left: "51%",
            top: "10%",
            bottom: "8%",
            width: "0%",
          },
          {
            show: false,
            right: "2%",
            top: "10%",
            bottom: "8%",
            containLabel: true,
            width: "37%",
          },
        ],
        xAxis: [
          {
            type: "value",
            inverse: true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            position: "top",
            axisLabel: {
              show: true,
              color: "#fff",
              fontSize: this.max ? 14 : 10,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#fff",
              },
            },
            max: max,
          },
          {
            gridIndex: 1,
            show: false,
          },
          {
            gridIndex: 2,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            position: "top",
            axisLabel: {
              show: true,
              color: "#fff",
              fontSize: this.max ? 14 : 10,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#fff",
              },
            },
            max: max,
          },
        ],
        yAxis: [
          {
            type: "category",
            inverse: true,
            position: "right",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#fff",
              },
            },

            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
          {
            gridIndex: 1,
            type: "category",
            inverse: true,
            position: "left",
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              padding: [30, 0, 0, 20],
              textStyle: {
                color: "#ffffff",
                fontSize: 10,
              },
              align: "center",
            },
            data: this.chartData.ydata,
          },
          {
            gridIndex: 2,
            type: "category",
            inverse: true,
            position: "left",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#fff",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            data: this.chartData.ydata,
          },
        ],
        series: [
          {
            // name: "2017",
            type: "bar",
            barWidth: 25,
            stack: "1",
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(255, 188, 70, 0.5)",
                  },
                  {
                    offset: 1,
                    color: "rgba(255, 188, 70, 0)",
                  },
                ],
                global: false,
              },
            },
            label: {
              show: false,
            },
            data: this.chartData.leftdata,
          },
          {
            // name: "2018",
            type: "bar",
            stack: "2",
            barWidth: 25,
            xAxisIndex: 2,
            yAxisIndex: 2,
            itemStyle: {
              color: {
                type: "linear",
                x: 1,
                y: 0,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(82, 253, 235, 0.5)",
                  },
                  {
                    offset: 1,
                    color: "rgba(82, 253, 235, 0)",
                  },
                ],
                global: false,
              },
            },
            label: {
              show: false,
            },
            data: this.chartData.rightdata,
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
</style>F