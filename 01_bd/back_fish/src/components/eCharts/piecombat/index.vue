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
      let angle = 0; //角度，用来做简单的动画效果的
      // console.log(this.chartData, "props");
      return {
        backgroundColor: "#061740",
        title: [
          {
            text: "{a|" + this.chartData.percent + "}{c|%}",
            x: "center",
            y: "center",
            textStyle: {
              rich: {
                a: {
                  fontSize: 12,
                  color: "#ffffff",
                  fontWeight: "bold",
                },
                c: {
                  fontSize: 12,
                  color: "#ffffff",
                  fontWeight: "normal",
                },
              },
            },
          },
        ],
        series: [
          //内环
          {
            name: "",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              return {
                type: "arc",
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2.3) * 0.65,
                  startAngle: ((0 + -angle) * Math.PI) / 180,
                  endAngle: ((360 + -angle) * Math.PI) / 180,
                },
                style: {
                  stroke: "#0CD3DB",
                  fill: "transparent",
                  lineWidth: 0.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          //外环
          {
            name: "",
            type: "pie",
            radius: ["80%", "65%"],
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
                value: this.chartData.percent,
                name: "",
                itemStyle: {
                  normal: {
                    //外环发光
                    borderWidth: 0.5,
                    shadowBlur: 20,
                    borderColor: "#4bf3f9",
                    shadowColor: "#9bfeff",
                    color: {
                      // 圆环的颜色
                      colorStops: [
                        {
                          offset: 0,
                          color: "#4bf3f9", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#4bf3f9", // 100% 处的颜色
                        },
                      ],
                    },
                  },
                },
              },
              {
                value: 100 - this.chartData.percent,
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