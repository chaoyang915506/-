<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
  name: "fightingpie",
  props: {
    chartData: {
      type: Object,
      default: null,
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
      // this.echarts.
      let value = this.chartData.value;
      // console.log(value, "dddd");
      //   let title = "%";
      //   let int = value.toFixed(2).split(".")[0];
      //   let float = value.toFixed(2).split(".")[1];

      return {
        title: {
          //   text: "{a|" + int + "}{b|." + float + "}{c|" + title + "}",
          text: (this.chartData.value * 100).toFixed(2) + "%",
          x: "center",
          y: "center",
          textStyle: {
            // rich: {
            fontSize: 12,
            color: "#fff",

            //   b: {
            //     fontSize: 12,
            //     color: "#65d3ff",
            //     // padding: [0,0,14,0]
            //   },
            //   c: {
            //     fontSize: 12,
            //     color: "#65d3ff",
            //     padding: [5, 0, 0, 0],
            //   },
            // },
          },
        },
        series: [
          {
            type: "gauge",
            // radius: ["60%", "50%"],

            radius: "80%",
            clockwise: true,
            startAngle: "90",
            endAngle: "-270",
            splitNumber: 10,
            detail: {
              offsetCenter: [0, -20],
              formatter: " ",
            },
            pointer: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: [
                  [value / 100, "#23b9ff"],
                  [1, "rgb(3,89,130)"],
                ],
                width: 10,
                shadowColor: "#23b9ff",
                shadowBlur: 2,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
              length: 32,
              lineStyle: {
                color: "white",
                width: 6,
              },
            },
            axisLabel: {
              show: false,
            },
          },
          {
            type: "pie",
            name: "内层细圆环",
            radius: ["57%", "60%"],
            hoverAnimation: true,
            clockWise: false,
            itemStyle: {
              color: "#84c1e0",
            },
            label: {
              show: false,
            },
            data: [100],
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