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
      console.log(this.chartData, "props");
      return {
        // tooltip: {
        //   trigger: "axis",
        //   axisPointer: {
        //     type: "cross",
        //     crossStyle: {
        //       color: "#999",
        //     },
        //   },
        // },
        // toolbox: {
        //   feature: {
        //     dataView: { show: true, readOnly: false },
        //     magicType: { show: true, type: ["line", "bar"] },
        //     restore: { show: true },
        //     saveAsImage: { show: true },
        //   },
        // },
        // color: ["#00FFF5", "#893941", "#003CFF"],
        // legend: {
        //   data: ["蒸发量", "降水量", "降水量2", "平均温度"],
        backgroundColor: "#061740",
        // },
        grid: {
          top: "15%",
          bottom: "5%",
          left: "5%",
          right: "5%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月",
            ],
            // axisPointer: {
            //   type: "shadow",
            // },
            axisLabel: {
              color: "#fff",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            // name: "水量",
            // min: 0,
            // max: 250,
            // interval: 50,
            axisLabel: {
              color: "#fff",
            },
            // axisLabel: {
            //   formatter: "{value} ml",
            // },
          },
          //   {
          //     type: "value",
          //     name: "温度",
          //     min: 0,
          //     max: 25,
          //     interval: 5,
          //     axisLabel: {
          //       formatter: "{value} °C",
          //     },
          //   },
        ],
        series: [
          {
            // name: "蒸发量",
            type: "bar",
            itemStyle: {
              color: "#2b4152",
            },
            barWidth: 7,
            barGap: "-100%",
            barCategoryGap: "0%",
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4,
              3.3,
            ],
          },
          {
            name: "降水量",
            type: "line",
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0,
              2.3,
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