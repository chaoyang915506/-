<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
  name: "barshiptype",
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
      let data1 = this.chartData;
      let quchong = [
        ...new Set([
          0,
          ...data1.map.map((i) => {
            return i[2];
          }),
        ]),
      ];
      let colorlist = (155 / quchong.length).toFixed(0);
      let color = quchong
        .map((i, j) => {
          if (j == 0) {
            return {
              i: 0,
              color: "#fff",
            };
          } else {
            return {
              i: (i + 1) * colorlist,
              color: `rgb(${(i + 1) * colorlist + 100}, 0, 0)`,
            };
          }
        })
        .sort((a, b) => a.i - b.i);
      let pieces = quchong.map((i, j) => {
        return {
          value: i,
          color: color.map((i) => i.color)[j],
        };
      });
      // let max = Math.max.apply(null, quchong);
      let max = color.length;
      let rd = [
        "#ffffff",
        "#ffcccc",
        "#ffaaaa",
        "#ff8888",
        "#ff7777",
        "#ff6666",
        "#ff4444",
        "#ff2f2f",
        "#ff0000",
        "#cc0000",
        "#bb0000",
        "#880000",
        "#660000",
        "#440000",
        "#330000",
        "#220000",
        "#110000",
        "#000000",
      ].map((i, j) => {
        return {
          value: j,
          color: i,
        };
      });
      return {
        tooltip: {
          trigger: "item",

          formatter: function (params) {
            return `${params.name}-${params.value[1] + 1}:<br/>${
              params.marker
            }${params.value[2]}`;
          },
        },
        visualMap: {
          type: "piecewise",
          orient: "horizontal",
          show: false,
          // pieces: pieces,
          pieces: rd,
          // min: 0,
          // max: max,
          // show: false,
          calculable: true,
          seriesIndex: [0],
          right: 0,
          top: 0,
          min: 0,
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: "#fff",
          },

          inRange: {
            color: color.map((i) => i.color),
            // symbolSize: [100, 100],
          },
          controller: {
            inRange: {
              symbolSize: [1, 1],
            },
          },
        },
        grid: {
          left: 30,
          right: 0,
          top: 5,
          bottom: 30,
          // height: '80%',
          // width: '80%',
          // y: '10%',
        },
        xAxis: {
          show: true,
          data: data1.year,

          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
            fontSize: 10,
          },
        },
        yAxis: {
          show: true,
          data: data1.month,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
            fontSize: 10,
          },
        },
        series: [
          {
            name: "Punchcustom Card",
            type: "heatmap",
            data: data1.map,
            label: {
              show: false,
            },
            itemStyle: {
              borderColor: "black",
              color: function (params) {
                // window.arlert(params)
                //   console.log(params, 'red')
                //   if (params.data[2] < 40) {
                //     return '#ec2b22'
                //   } else if (params.data[2] < 30 && params.data[2] > 20) {
                //     return 'yellow'
                //   } else {
                //     return 'purple'
                //   }
              },
            },
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