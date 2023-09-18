<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
  name: "barcombat",
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
      const offsetX = 6;
      const offsetY = 3;
      // 绘制左侧面
      const CubeLeft = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          // 会canvas的应该都能看得懂，shape是从custom传入的
          const xAxisPoint = shape.xAxisPoint;
          // console.log(shape);
          const c0 = [shape.x, shape.y];
          const c1 = [shape.x - offsetX, shape.y - offsetY];
          const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1] - offsetY];
          const c3 = [xAxisPoint[0], xAxisPoint[1]];
          ctx
            .moveTo(c0[0], c0[1])
            .lineTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .closePath();
        },
      });
      // 绘制右侧面
      const CubeRight = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const xAxisPoint = shape.xAxisPoint;
          const c1 = [shape.x, shape.y];
          const c2 = [xAxisPoint[0], xAxisPoint[1]];
          const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] - offsetY];
          const c4 = [shape.x + offsetX, shape.y - offsetY];
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath();
        },
      });
      // 绘制顶面
      const CubeTop = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const c1 = [shape.x, shape.y];
          const c2 = [shape.x + offsetX, shape.y - offsetY]; //右点
          const c3 = [shape.x, shape.y - offsetX];
          const c4 = [shape.x - offsetX, shape.y - offsetY];
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath();
        },
      });
      // 注册三个面图形
      echarts.graphic.registerShape("CubeLeft", CubeLeft);
      echarts.graphic.registerShape("CubeRight", CubeRight);
      echarts.graphic.registerShape("CubeTop", CubeTop);

      const VALUE = [100, 200, 300, 400, 300, 200, 100];

      return {
        tooltip: {
          trigger: "axis",
          confine: true,
          axisPointer: {
            type: "shadow",
          },
          formatter: function (params, ticket, callback) {
            const item = params[1];
            return item.name + " : " + item.value + "次";
          },
        },
        grid: {
          left: "10%",
          right: "15%",
          top: "15%",
          bottom: "10%",
          containLabel: false,
        },
        xAxis: {
          type: "category",
          data: this.chartData.xdata,
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#2B7BD6",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 12,
          },
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#2B7BD6",
            },
          },
          name: "次",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#153D7D",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 12,
          },
          // boundaryGap: ['20%', '20%'],
        },
        series: [
          {
            type: "custom",
            renderItem: (params, api) => {
              const location = api.coord([api.value(0), api.value(1)]);
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
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "#33BCEB",
                        },
                        {
                          offset: 1,
                          color: "#337CEB",
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
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "#28A2CE",
                        },
                        {
                          offset: 1,
                          color: "#1A57B7",
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
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "#43C4F1",
                        },
                        {
                          offset: 1,
                          color: "#28A2CE",
                        },
                      ]),
                    },
                  },
                ],
              };
            },
            data: this.chartData.seriesdata,
          },
          {
            type: "bar",
            label: {
                show: true,
                position: "top",
                formatter: (e) => {
                  return e.value;
                },
                fontSize: 12,
                color: "#43C4F1",
                // offset: [0, -25],
            },
            itemStyle: {
              color: "transparent",
            },
            tooltip: {},
            data: this.chartData.seriesdata,
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