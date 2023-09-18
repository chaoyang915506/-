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
      return {
        backgroundColor: "#061740",
        title: [
          {
            text: "中度污染\n首要污染物：PM10",
            left: "center",
            bottom: "5%",
            textStyle: {
              fontWeight: "normal",
              fontSize: 14,
              color: "#fff",
            },
          },
          // {
          //   text: "102",
          //   left: "center",
          //   top: "36%",
          //   textStyle: {
          //     fontWeight: "normal",
          //     fontSize: '45',
          //     color: "#fff",
          //     fontWeight:'bold'
          //   },
          // },
        ],
        series: [
          {
            type: "liquidFill",
            // type: "pie",
            radius: "45%",
            center: ["50%", "45%"],
            data: [0.5, 0.5, 0.5], // data个数代表波浪数
            backgroundStyle: {
              borderWidth: 1,
              color: "rgb(255,0,255,0.1)",
            },
            label: {
              normal: {
                formatter: "102 \n \nAPI",
                // color: "blue",
                textStyle: {
                  fontSize: 20,
                  color: "#fff",
                },
              },
            },
            outline: {
              show: false,
            },
          },
          {
            type: "pie",
            center: ["50%", "45%"],
            radius: ["50%", "52%"],
            hoverAnimation: false,
            data: [
              {
                name: "",
                value: 500,
                labelLine: {
                  show: false,
                },
                itemStyle: {
                  color: "#009cff",
                },
                emphasis: {
                  labelLine: {
                    show: false,
                  },
                  itemStyle: {
                    color: "#009cff",
                  },
                },
              },
              {
                //画中间的图标
                name: "",
                value: 4,
                labelLine: {
                  show: false,
                },
                itemStyle: {
                  color: "#ffffff",
                  normal: {
                    color: "#009cff",
                    borderColor: "#009cff",
                    borderWidth: 10,
                    // borderRadius: '100%'
                  },
                },
                label: {
                  borderRadius: "100%",
                },
                emphasis: {
                  labelLine: {
                    show: false,
                  },
                  itemStyle: {
                    color: "#009cff",
                  },
                },
              },
              {
                // 解决圆点过大后续部分显示明显的问题
                name: "",
                value: 4,
                labelLine: {
                  show: false,
                },
                itemStyle: {
                  color: "#009cff",
                },
                emphasis: {
                  labelLine: {
                    show: false,
                  },
                  itemStyle: {
                    color: "#009cff",
                  },
                },
              },
              {
                //画剩余的刻度圆环
                name: "",
                value: 88,
                itemStyle: {
                  color: "rgba(9,59,118,0.95)",
                },
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                emphasis: {
                  labelLine: {
                    show: false,
                  },
                  itemStyle: {
                    color: "rgba(255,255,255,0)",
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