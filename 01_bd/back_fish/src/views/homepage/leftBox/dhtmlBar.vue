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
      // console.log(this.chartData, "chart");
      let fontcol = "#00000087";
      let this_ = {};
      this_.colmap = {
        飞行: "#00daff",
        定检: "#f9ff00",
        排故: "#ff6000",
        停飞: "#a3abad",
      };
      this_.startTime = 1620576000000;
      this_.categories = this.chartData.zData;
      // this_.dataE = [
      //   { name: "飞行", value: [0, 1620576000000, 1620601200000, "7小时"] }, //毫秒数要为数字类型
      //   // { name: "排故", value: [0, 1620619200000, 1620630000000, "3小时"] },
      //   { name: "飞行", value: [1, 1620644400000, 1620655200000, "3小时"] },

      //   // { name: "停飞", value: [1, 1620655200000, 1620658300000, "显示内容"] }, //1:表飞机B
      //   // { name: "停飞1", value: [1, 1620655200000, 1620658300000, "显示内容"] }, //1:表飞机B
      //   { name: "停飞1", value: [2, 1620655200000, 1620658300000, "显示内容"] }, //1:表飞机B
      //   {
      //     name: "f",
      //     value: [3, 1620655200000, 1620658300000, "显示内容111"],
      //   }, //1:表飞机B
      //   {
      //     name: "f",
      //     value: [4, 1620655200000, 1620658300000, "显示内容111"],
      //   }, //1:表飞机B
      // ];

      this_.dataE = this.chartData.sData;

      let dataELength =
        this_.dataE && this_.dataE.length ? this_.dataE.length : 0;
      for (var i = 0; i < dataELength; i++) {
        this_.dataE[i].itemStyle = {
          normal: { color: this_.colmap[this_.dataE[i].name] },
        };
      }
      let renderItem = function (params, api) {
        var categoryIndex = api.value(0);
        // console.log(categoryIndex, "categoryIndex");

        var start = api.coord([api.value(1), categoryIndex]);
        var end = api.coord([api.value(2), categoryIndex]);
        var height = api.size([0, 1])[1] * 0.6;

        var rectShape = echarts.graphic.clipRectByRect(
          {
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height,
          },
          {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height,
          }
        );
        return (
          rectShape && {
            type: "rect",
            transition: ["shape"],
            shape: rectShape,
            style: api.style(),
          }
        );
      };
      this_.renderItem = renderItem;
      // ${this.parseTime(params.value[1], "{y}-{m}-{d}")
      return {
        tooltip: {
          show: false,
          enterable: true,
          axisPointer: {
            animation: false,
          },
          trigger: "axis",
          formatter: function (params) {
            // console.log(params);
            return `
            ${params.marker + params.name}<br/>
            `;
            // 时间：${params.data.newtime}
            // if (params.value && params.value.length >= 4) {
            //   return (
            //     params.marker +
            //     this_.categories[params.value[0]] +
            //     ":" +
            //     params.name +
            //     "-" +
            //     params.value[3]
            //   );
            // } else {
            //   return "";
            // }
          },
        },
        // dataZoom: [
        //   //滚动条
        //   {
        //     type: "slider",
        //     // start: 0,
        //     // end: 100,
        //     maxspanvalue: 5,
        //     // maxValueSpan: this.max ? "" : 4,
        //     bottom: "10",
        //     left: "30",
        //     height: 5,
        //     borderColor: "rgba(0,0,0,0)",
        //     textStyle: {
        //       color: "#05D5FF",
        //     },
        //   },
        // ],
        grid: {
          containLabel: false,
          left: 45,
          right: 15,
          top: 14,
          bottom: 32,
        },
        xAxis: {
          min: this_.startTime,
          type: "time",
          scale: true,
          min: new Date().getFullYear() + "-01-01",
          axisLabel: {
            formatter: {
              // year: "{yyyy}年",
              month: "{M}月",
            },
            // formatter: function (val) {
            //   var da = new Date(Number(val));
            //   var s = da.getMonth() + 1 + "-" + da.getDate() + " ";
            //   return s;
            // },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#fff",
            },
          },
          axisPointer: {
            show: true,
            label: {
              formatter: function (params) {
                let a = parseInt(params.value);
                return new Date(a).toLocaleString();
              },
              color: "black",
            },
          },
        },
        yAxis: {
          data: this_.categories,
          nameGap: 15,
          axisLabel: {
            rotate: -40,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#fff",
            },
          },
        },
        series: [
          {
            type: "custom",
            renderItem: this_.renderItem,
            itemStyle: {
              opacity: 0.8,
            },
            encode: {
              x: [1, 2],
              y: 0,
            },
            data: this_.dataE,
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