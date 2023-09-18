<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
  name: "piearch",
  props: {
    chartData: {
      type: Array,
      default: [],
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
      let colors = ["#FF8700", "#ffc300", "#00e473", "#009DFF", "#0034ff"];
      let total;
      // let pie1 = this.chartData[0] ? this.chartData[0].shipCount : 0;
      // let pie1n = total - (this.chartData[0] ? this.chartData[0].shipCount : 0);
      // let pie2 = this.chartData[1] ? this.chartData[1].shipCount : 0;
      // let pie2n = total - (this.chartData[1] ? this.chartData[1].shipCount : 0);
      // let pie3 = this.chartData[2] ? this.chartData[2].shipCount : 0;
      // let pie3n = total - (this.chartData[2] ? this.chartData[2].shipCount : 0);
      // let pie4 = this.chartData[3] ? this.chartData[3].shipCount : 0;
      // let pie4n = total - (this.chartData[3] ? this.chartData[3].shipCount : 0);
      // let pie5 = this.chartData[4] ? this.chartData[4].shipCount : 0;
      // let pie5n = total - (this.chartData[4] ? this.chartData[4].shipCount : 0);
      // let maxlist = [pie1, pie2, pie3, pie4, pie5];
      let maxlist = this.chartData
        ? this.chartData.map((item) => item.shipCount)
        : [];
      total = Math.max.apply(null, maxlist);
      // console.log(this.chartData[0] ? this.chartData[0].shipCount : 0, "red");
      let that = this;
      return {
        tooltip: {
          show: true,
          confine: true,
          formatter: (params) => {
            return `船型占比<br/>${params.marker}&nbsp;${params.name}&nbsp;${params.value}`;
          },
        },
        color: ["orange", "aquamarine", "pink"],
        legend: {
          show: this.max ? true : false,
          // orient: "vertical",
          top: 10,
          // align: "right",
          left: 0,
          textStyle: {
            color: "#FFF",
            fontWeight: "bold",
          },
          // x: 690,
          // y: 120,
          // data: ["A", "B", "C"],
        },
        series: (function () {
          let seriesArr = [];
          if (that.chartData && that.chartData.length) {
            that.chartData.forEach((item, index) => {
              seriesArr.push({
                name: item.jbpc,
                type: "pie",
                startAngle: 90,
                hoverAnimation: false,
                tooltip: {},
                radius: [60 - index * 13 + "%", 68 - index * 13 + "%"],
                center: ["50%", "50%"],
                label: {
                  show: true,
                  position: "outside",
                  color: "#fff",
                },
                labelLine: {
                  show: true,
                  position: "outside",
                },
                data: [
                  {
                    value: total * 3,
                    itemStyle: {
                      color: "rgba(80,150,224,0)",
                    },
                    labelLine: { show: false },
                    label: { show: false },
                  },
                  {
                    name: item.jbpc,
                    value: item.shipCount,
                    itemStyle: {
                      shadowColor: "rgba(0, 0, 0, .3)",
                      shadowBlur: 10,
                      shadowOffsetY: 3,
                      shadowOffsetX: 0,
                      color: colors[index],
                    },
                  },
                  {
                    value: total - item.shipCount,
                    labelLine: { show: false },
                    label: { show: false },
                    itemStyle: {
                      color: "rgba(80,150,224,0.3)",
                    },
                  },
                ],
              });
            });
          }
          return seriesArr;
        })(),
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