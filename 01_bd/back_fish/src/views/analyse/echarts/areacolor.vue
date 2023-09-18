<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
  name: "areacolor",
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
      // console.log(this.chartData, "re");
      let max = Math.max.apply(null, [
        ...this.chartData.leftdata,
        ...this.chartData.rightdata,
      ]);
      return {
        title: [
          {
            gridIndex: 0,
            text: this.chartData.leftlabel,
            top: 15,
            left: 20,
            textAlign: "left",
            textStyle: {
              color: "#fff",
              fontSize: this.max ? 16 : 10,
            },
          },
          {
            gridIndex: 0,
            text: this.chartData.rightlabel,
            top: 15,
            right: 20,
            textAlign: "left",
            textStyle: {
              color: "#fff",
              fontSize: this.max ? 16 : 10,
            },
          },
          {
            // gridIndex: 0,
            x: "center",
            y: "top",
            top: -3,
            text: this.chartData.front,
            // top: 5,
            // right: "auto",
            // left: "auto",
            // textAlign: "center",
            textStyle: {
              color: "#fff",
              fontSize: this.max ? 20 : 10,
            },
          },
        ],
        grid: [
          {
            show: false,
            left: 20,
            top: "20%",
            bottom: "8%",
            containLabel: false,
            width: "30%",
          },
          {
            show: false,
            left: "51%",
            top: "20%",
            bottom: "8%",
            width: "50%",
          },
          {
            show: false,
            right: 20,
            top: "20%",
            bottom: "8%",
            containLabel: false,
            width: "30%",
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
              show: false,
              color: "#fff",
            },
            splitLine: {
              show: false,
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
              show: false,
              color: "#fff",
            },
            splitLine: {
              show: false,
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
              show: false,
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
                fontSize: this.max ? 14 : 10,
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
              show: false,
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
            name: "2017",
            type: "bar",
            barWidth: 10,
            stack: "1",
            itemStyle: {
              color: this.chartData.color,
              //     color: {
              //       type: "linear",
              //       x: 0,
              //       y: 0,
              //       x2: 1,
              //       y2: 0,
              //       colorStops: [
              //         {
              //           offset: 0,
              //           color: "rgba(255, 188, 70, 0.5)",
              //         },
              //         {
              //           offset: 1,
              //           color: "rgba(255, 188, 70, 0)",
              //         },
              //       ],
              //       global: false,
              //     },
            },
            label: {
              show: true,
              position: "left",
              color: "#fff",
              fontSize: 10,
            },
            data: this.chartData.leftdata,
          },
          {
            name: "2018",
            type: "bar",
            stack: "2",
            barWidth: 10,
            xAxisIndex: 2,
            yAxisIndex: 2,
            itemStyle: {
              color: this.chartData.color,
            },
            label: {
              show: true,
              position: "right",
              color: "#fff",
              fontSize: 10,
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