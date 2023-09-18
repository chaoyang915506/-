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
      console.log(this.chartData, "chartDatachartDatachartData");
      let that = this;
      return {
        title: {
          // text: "无边",
        },
        tooltip: {
          show: true,
        },
        legend: {
          // data: ["啊啊啊啊啊"],
        },
        radar: {
          indicator: that.chartData.indicator,
        },
        series: [
          {
            type: "radar",
            areaStyle: {},
            data: [
              {
                value: that.chartData.value,
                // name: "aa",
              },
            ],
          },
        ],
      };
    },
  },
  methods: {
    init() {
      console.log(this.chartData);
      this.echarts = this.$echarts.init(this.$refs.echarts);
      this.echarts.setOption(this.option);
    },
    resize() {
      this.echarts.resize();
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.init();
    });
    window.addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    this.echarts = null;
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
