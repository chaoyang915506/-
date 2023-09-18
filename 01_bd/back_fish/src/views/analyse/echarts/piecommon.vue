<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
  name: "piecommon",
  props: {
    chartData: {
      type: Array,
      default: () => [],
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
      const dataList = this.chartData;
      // console.log(dataList, "list");
      // const dataList = [
      //   { value: 1048, name: "水田" },
      //   { value: 735, name: "水浇地" },
      //   { value: 580, name: "旱地" },
      // ];
      // const handleData = {};
      let sum = 0;
      // 求和
      dataList.map((item) => {
        sum += item.value;
      });
      // 数据处理
      // dataList.map((item) => {
      //   handleData[item.name] = item;
      //   handleData[item.name].percentage = ((item.value / sum) * 100).toFixed(
      //     1
      //   );
      // });
      // console.log("处理后", dataList);

      return {
        grid: {
          left: "5%",
          right: "5%",
          bottom: "20%",
          top: 0,
          containLabel: false,
        },
        legend: {
          show: this.max,
          icon: "circle",
          right: "3%",
          // left: "center",
          // bottom: "-10%",
          top: 0,
          position: "top",
          itemWidth: 10,
          itemStyle: {
            borderColor: "none",
          },
          textStyle: {
            color: "#fff",
          },
        },
        tooltip: {
          trigger: "item",
          confine: true,
        },
        series: [
          {
            type: "pie",
            color: ["#4D88FE", "#50CCCB", "#FFBF3C"],
            radius: "80%",
            left: "center",
            data: dataList,
            // emphasis: {
            //   itemStyle: {
            // shadowBlur: 10,
            // shadowOffsetX: 0,
            // shadowColor: "rgba(0, 0, 0, 0.5)",
            //   },
            // },
            labelLine: {
              show: false,
              length: 5,
              length2: 10,
            },
            label: {
              show: true,
              align: "center",
              position: "inside",
              formatter: (params) => {
                return `${params.data.name}\n${params.data.value} `;
              },
              color: "#fff",
              rich: {
                name: {
                  fontSize: 12,
                },
                value: {
                  fontSize: 12,
                },
              },
            },
            // itemStyle: {
            //   borderColor: "#fff",
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