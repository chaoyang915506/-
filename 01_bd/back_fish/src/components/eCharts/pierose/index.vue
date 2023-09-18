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
      let datas = [
        {
          name: "出租居住",
          value: 1,
        },
        {
          name: "自营",
          value: 2,
        },
        {
          name: "出租经营",
          value: 3,
        },
        {
          name: "合作入股",
          value: 4,
        },
      ];
      return {
        backgroundColor: "#061740",
        color: ["#F56463", "#00C6FF", "#F09615", "#0079E6"],
        legend: {
          itemHeight: 14,
          itemWidth: 14,
          icon: "rect",
          orient: "vertical",
          top: "1%",
          right: "5%",
          textStyle: {
            align: "left",
            color: "#",
            verticalAlign: "middle",
            rich: {
              name: {
                width: 50,
                fontSize: 12,
              },
              //   value: {
              //     width: 20,
              //     align: "right",
              //     fontFamily: "Medium",
              //     fontSize: 12,
              //   },
              //   rate: { width: 10, align: "right", fontSize: 12 },
            },
          },
          data: datas,
          formatter: (name) => {
            if (datas.length) {
              const item = datas.filter((item) => item.name === name)[0];
              return `{name|${name}} `;
              //  {value| ${item.value}} {rate| 宗}
            }
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{d}%",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["30%", "80%"],
            center: ["35%", "50%"],
            roseType: "radius",
            label: {
              show: false,
              formatter: "{d}%",
            },
            labelLine: {
              show: false,
              //   length: 1,
              //   length2: 20,
            },
            data: datas,
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