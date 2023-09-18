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
      const CubeLeft = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          // console.log(ctx, shape);
          const yAxisPoint = shape.yAxisPoint;
          const c0 = [shape.x, shape.y];
          const c1 = [shape.x + 9, shape.y - 9];
          const c2 = [yAxisPoint[0] + 9, yAxisPoint[1] - 9];
          const c3 = [yAxisPoint[0], yAxisPoint[1]];
          ctx
            .moveTo(c0[0], c0[1])
            .lineTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .closePath();
        },
      });
      const CubeRight = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const yAxisPoint = shape.yAxisPoint;
          const c1 = [shape.x, shape.y];
          const c2 = [yAxisPoint[0], yAxisPoint[1]];
          const c3 = [yAxisPoint[0] + 9, yAxisPoint[1] + 18];
          const c4 = [shape.x + 9, shape.y + 18];
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath();
        },
      });
      const CubeTop = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const c1 = [shape.x, shape.y];
          const c2 = [shape.x + 9, shape.y + 18];
          const c3 = [shape.x + 18, shape.y + 9];
          const c4 = [shape.x + 9, shape.y - 9];
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath();
        },
      });
      echarts.graphic.registerShape("CubeLeft", CubeLeft);
      echarts.graphic.registerShape("CubeRight", CubeRight);
      echarts.graphic.registerShape("CubeTop", CubeTop);
      let maxd = Math.max.apply(null, this.chartData.seriesdata);
      // const MAX = [100, 100, 100, 100, 100, 100];
      let MAX = [];
      // console.log(maxd, "max");
      this.chartData.seriesdata.forEach((i) => {
        MAX.push(maxd);
      });

      return {
        tooltip: {
          trigger: "axis",
          confine: false,
          formatter: (params) => {
            // console.log(params, "red");
            let marker = `<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;\"></span>`;

            return `${params[0].axisValue}<br/>
              ${marker}&emsp; ${params[0].data}<br/>
            `;
            // ${params[0].marker} ${params[0].seriesName}&emsp;&emsp; ${params[0].data}<br/>
          },
        },
        title: {
          text: "",
          top: 32,
          left: 18,
          textStyle: {
            color: "#00F6FF",
            fontSize: 24,
          },
        },
        grid: {
          left: 40,
          right: 10,
          bottom: 10,
          top: 10,
          containLabel: true,
        },
        yAxis: [
          {
            type: "category",
            data: this.chartData.xdata,
            axisLine: {
              show: false,
              lineStyle: {
                color: "white",
              },
            },
            // offset: -100,
            axisTick: {
              show: false,
              // length: 9,
              // alignWithLabel: true,
              lineStyle: {
                color: "#7DFFFD",
              },
            },
            axisLabel: {
              fontSize: 12,
            },
          },
          {
            type: "category",
            // inverse: true,
            axisLine: "none",
            axisTick: "none",
            show: true,
            axisLabel: {
              textStyle: {
                color: "#fff",
                fontSize: "12",
              },
            },
            data: this.chartData.seriesdata,
          },
        ],
        dataZoom: [
          //滚动条
          {
            show:
              this.max && this.chartData.seriesdata.length > 2 ? true : false,
            yAxisIndex: 1,
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
            yAxisIndex: [1],
            moveOnMouseWheel: true,
            // moveOnMouseMove: true,
            zoomOnMouseWheel: false,
          },
        ],
        xAxis: {
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
              color: "white",
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            fontSize: 16,
          },
          boundaryGap: ["20%", "20%"],
        },
        series: [
          // {
          //   type: "custom",
          //   renderItem: function (params, api) {
          //     const location = api.coord([api.value(0), api.value(1)]);
          //     return {
          //       type: "group",
          //       children: [
          //         {
          //           type: "CubeLeft",
          //           shape: {
          //             api,
          //             xValue: api.value(0),
          //             yValue: api.value(1),
          //             x: location[0],
          //             y: location[1],
          //             yAxisPoint: api.coord([0, api.value(1)]),
          //           },
          //           style: {
          //             fill: "rgba(7,29,97,.6)",
          //           },
          //         },
          //         {
          //           type: "CubeRight",
          //           shape: {
          //             api,
          //             xValue: api.value(0),
          //             yValue: api.value(1),
          //             x: location[0],
          //             y: location[1],
          //             yAxisPoint: api.coord([0, api.value(1)]),
          //           },
          //           style: {
          //             fill: "rgba(10,35,108,.7)",
          //           },
          //         },
          //         {
          //           type: "CubeTop",
          //           shape: {
          //             api,
          //             xValue: api.value(0),
          //             yValue: api.value(1),
          //             x: location[0],
          //             y: location[1],
          //             yAxisPoint: api.coord([0, api.value(1)]),
          //           },
          //           style: {
          //             fill: "rgba(11,42,106,.8)",
          //           },
          //         },
          //       ],
          //     };
          //   },
          //   data: MAX,
          // },
          {
            type: "custom",
            renderItem: (params, api) => {
              const location = api.coord([api.value(0), api.value(1)]);
              // console.log(location, "api");
              return {
                type: "group",
                children: [
                  {
                    type: "CubeLeft",
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      yAxisPoint: api.coord([0, api.value(1)]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                        {
                          offset: 0,
                          color: "#3B80E2",
                        },
                        {
                          offset: 1,
                          color: "#49BEE5",
                        },
                      ]),
                    },
                  },
                  {
                    type: "CubeRight",
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      yAxisPoint: api.coord([0, api.value(1)]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                        {
                          offset: 0,
                          color: "#3B80E2",
                        },
                        {
                          offset: 1,
                          color: "#49BEE5",
                        },
                      ]),
                    },
                  },
                  {
                    type: "CubeTop",
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      yAxisPoint: api.coord([0, api.value(1)]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                        {
                          offset: 0,
                          color: "#3B80E2",
                        },
                        {
                          offset: 1,
                          color: "#49BEE5",
                        },
                      ]),
                    },
                  },
                ],
              };
            },
            label: {
              show: true,
              position: "right",
              formatter: (e) => {
                switch (e.name) {
                }
              },
              fontSize: 10,
              color: "#fff",
              // offset: [5, 4],
            },
            data: this.chartData.seriesdata,
          },
          // {
          //   type: "bar",
          //   label: {
          //     show: false,
          //     position: "right",
          //     formatter: (e) => {
          //       switch (e.name) {
          //       }
          //     },
          //     fontSize: 16,
          //     color: "#fff",
          //     offset: [5, 4],
          //   },
          //   itemStyle: {
          //     color: "transparent",
          //   },
          //   data: MAX,
          // },
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