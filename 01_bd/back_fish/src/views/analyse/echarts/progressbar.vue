<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
  name: "progressbar",
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
        grid: {
          left: 0,
          right: "0",
          bottom: "0",
          top: "30%",
          containLabel: true,
        },
        xAxis: {
          show: false,
          type: "value",
          max: 100,
        },
        yAxis: [
          {
            show: false,
            type: "category",
            inverse: true,
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: "14",
                color: "#fff",
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            data: [``],
          },
          {
            type: "category",
            inverse: true,
            axisTick: "none",
            axisLine: "none",
            show: true,
            data: [this.chartData.xdata],
          },
        ],
        series: [
          {
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "#02326e",
              borderRadius: 10,
            },
            label: {
              show: true,
              position: "inside",
              formatter: "{@score}%",
              textStyle: {
                color: "black",
                fontSize: "10",
              },
            },
            itemStyle: {
              barBorderRadius: 5,
              color: "#0eaac0",
            },
            barWidth: 15,
            data: [this.chartData.xdata],
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