<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
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
      let value = 40;
      let name = "维修率";
      return {
        backgroundColor: "#061740",
        title: [
          // {
          //   text: "维修率",
          //   textStyle: {
          //     color: "#fff",
          //     fontSize: 14,
          //     fontWeight: 500,
          //   },
          // },
          {
            // text: '{a|' + value + '}{c|%}',
            text: "{a|" + this.chartData.percent + "%}{c|\n" + name + "}",
            x: "center",
            y: "center",
            textStyle: {
              rich: {
                a: {
                  fontSize: 12,
                  color: "#29EEF3",
                },

                c: {
                  fontSize: 12,
                  color: "#fff",
                  // padding: [5,0]
                },
              },
            },
          },
        ],
        series: [
          {
            type: "pie",
            name: "外圆环",
            radius: ["80%", "75%"],
            // radius: ["80%", "75%"],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
              normal: {
                color: "#304867",
              },
            },
            label: {
              show: false,
            },
            data: [100],
          },
          {
            name: "吃猪肉频率",
            type: "pie",
            radius: ["70%", "54%"],
            silent: true,
            clockwise: true,
            startAngle: 90,
            z: 0,
            zlevel: 0,
            label: {
              normal: {
                position: "center",
              },
            },
            data: [
              {
                value: value,
                name: "",
                itemStyle: {
                  normal: {
                    color: "red",
                  },
                },
              },
              {
                value: 100 - value,
                name: "",
                label: {
                  normal: {
                    show: false,
                  },
                },
                itemStyle: {
                  normal: {
                    color: "#173164",
                  },
                },
              },
            ],
          },
          {
            name: "",
            type: "gauge",
            radius: "76%",
            center: ["50%", "50%"],
            startAngle: 0,
            endAngle: 359.9,
            splitNumber: 8,
            hoverAnimation: true,
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 60,
              lineStyle: {
                width: 5,
                color: "#061740",
              },
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                opacity: 0,
              },
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 0,
                name: "",
              },
            ],
          },
          {
            type: "pie",
            name: "内环",
            radius: ["46%", "48%"],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
              normal: {
                color: "#304867",
              },
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