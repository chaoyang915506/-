<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
  name: "barresponse",
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
      console.log(this.chartData, "red");
      var data0 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

      var bottomdata = [], //下
        topdata = []; //上
      topdata = this.chartData.topdata;
      bottomdata = this.chartData.bottomdata;

      var data3 = []; //上衣和裤子的和
      //   var data5 = []; //相当于data1

      if (bottomdata.length !== 0) {
        data3 = bottomdata.map((i, j) => {
          return topdata[j] + i;
        });
      }

      let dom = 200;
      let barWidth = dom / 20;
      // console.log(bottomdata, topdata, data3, "shemo数据");
      return {
        tooltip: {
          trigger: "axis",
          confine: true,
          formatter: (params) => {
            // console.log(params, "red");
            return `${params[0].axisValue}<br/>
              ${params[1].marker} ${params[1].seriesName}&emsp;&emsp; ${params[1].data}<br/>
              ${params[0].marker} ${params[0].seriesName}&emsp;&emsp; ${params[0].data}<br/>
            `;
          },
        },
        textStyle: {
          color: "#C9C9C9",
        },
        legend: {
          type: "scroll",
          //   orient: "vertical",
          selectedMode: false,
          right: "5",
          top: "5",
          itemWidth: 10,
          itemHeight: 6,
          textStyle: {
            color: "#ffffff",
            fontSize: 12,
          },
        },
        grid: {
          containLabel: true,
          left: "5",
          top: 40,
          bottom: 20,
          right: "5",
        },
        xAxis: {
          type: "category",
          data: this.chartData.xdata,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            margin: 10,
            interval: 0,
            textStyle: {
              fontFamily: "Microsoft YaHei",
              color: "#FFF",
            },
            fontSize: 12,
            // formatter: function (value) {
            //   return value.split("").join("\n");
            // },
          },
        },
        yAxis: [
          {
            type: "value",
            // max: 120,

            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
          {
            show: false,
          },
        ],
        dataZoom: [
          //滚动条
          {
            show: this.max ? false : true,
            type: "slider",
            // start: 0,
            // end: this.max ? 100 : 30,
            // maxspanvalue: 5,
            maxValueSpan: this.max ? "" : 4,
            bottom: "10",
            left: "30",
            height: 5,
            borderColor: "rgba(0,0,0,0)",
            textStyle: {
              color: "#05D5FF",
            },
          },
        ],
        series: [
          {
            type: "bar",
            name: "维修次数",
            type: "bar",
            data: bottomdata,
            stack: "zs",
            barWidth: barWidth,
            // label: {
            //   show: true,
            //   offset: 4,
            //   color: "red",
            //   position: "ritht",
            // },
            itemStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                type: "linear",
                global: false,
                colorStops: [
                  {
                    offset: 0,
                    color: "yellow",
                  },
                  {
                    offset: 1,
                    color: "yellow",
                  },
                ],
              },
            },
          },

          {
            name: "部署次数",
            type: "bar",
            data: topdata,
            stack: "zs",
            type: "bar",
            barWidth: barWidth,
            itemStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                type: "linear",
                global: false,
                colorStops: [
                  {
                    offset: 0,
                    color: "purple",
                  },
                  {
                    offset: 1,
                    color: "purple",
                  },
                ],
              },
            },
          },

          {
            data: data0,
            type: "pictorialBar",
            barWidth: barWidth,
            symbol: "diamond",
            symbolOffset: [0, "50%"],
            symbolSize: [barWidth, barWidth * 0.5],
            zlevel: 2,
            itemStyle: {
              color: "#018bc1",
            },
          },
          {
            data: bottomdata,
            type: "pictorialBar",
            barWidth: barWidth,
            symbolPosition: "end",
            symbol: "diamond",
            symbolOffset: [0, "-50%"],
            symbolSize: [barWidth, barWidth * 0.5],
            zlevel: 2,
          },
          {
            data: bottomdata,
            type: "pictorialBar",
            barWidth: barWidth,
            symbolPosition: "end",
            symbol: "diamond",
            symbolOffset: [0, "-50%"],
            symbolSize: [barWidth, barWidth * 0.5],
            zlevel: 2,
          },
          {
            data: bottomdata,
            type: "pictorialBar",
            barWidth: barWidth,
            symbolPosition: "end",
            symbol: "diamond",
            symbolOffset: [0, "-50%"],
            symbolSize: [0, barWidth * 0.5],
            zlevel: 2,
          },
          {
            data: bottomdata,
            type: "pictorialBar",
            barWidth: barWidth,
            symbolPosition: "end",
            symbol: "diamond",
            symbolOffset: [0, "-50%"],
            symbolSize: [barWidth, barWidth * 0.5],
            zlevel: 2,
            itemStyle: {
              color: "#05f2f8",
            },
          },
          {
            data: data3,
            type: "pictorialBar",
            barWidth: barWidth,
            symbolPosition: "end",
            symbol: "diamond",
            symbolOffset: [0, "-50%"],
            symbolSize: [barWidth, barWidth * 0.5],
            zlevel: 2,
            itemStyle: {
              color: "#028c76",
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