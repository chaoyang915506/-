<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
  name: "pierose",
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
      handler(val) {
        // console.log("执行", val);
        if (val && this.echarts != null) {
          this.echarts.setOption(this.option);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      echarts: null,
    };
  },
  computed: {
    option() {
      let res = this.chartData.xdata.map((i, j) => {
        return [i, this.chartData.seriesdata[j]];
      });
      let label;

      // if (this.max == false) {
      // label = {
      //   show: true,
      //   align: "center",
      //   position: "inside",
      //   // formatter: (params) => {
      //   //   // return `${params.data.name}\n${params.data.value} `;
      //   // },
      //   color: "#fff",
      //   rich: {
      //     name: {
      //       fontSize: 12,
      //     },
      //     value: {
      //       fontSize: 12,
      //     },
      //   },
      // };
      // } else {
      label = { color: "#fff" };
      // }
      return {
        tooltip: {
          trigger: "item",
          confine: true,
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: 20,
          top: 60,
          containLabel: true,
        },
        dataset: [
          {
            dimensions: ["product", "count"],
            source: res,
          },
          {
            transform: {
              type: "sort",
              config: { dimension: "count", order: "desc" },
              print: true,
            },
          },
        ],
        series: [
          {
            name: "数量",
            type: "pie",
            radius: ["30%", "80%"],
            center: ["50%", "50%"],
            roseType: "area",
            datasetIndex: 1,
            itemStyle: {
              // barBorderRadius: [4, 4, 0, 0],
              // color: "#fff",
            },
            labelLine: {
              show: true,
              length: 5,
              length2: 10,
            },
            label: label,
            // encode: {
            //   itemName: "product",
            //   value: "count",
            // },
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