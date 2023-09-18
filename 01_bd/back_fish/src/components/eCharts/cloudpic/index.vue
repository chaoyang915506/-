<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
  name: "cloudpic",
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
      let JosnList = [
        {
          name: "Jayfee",
          value: 666,
        },
        {
          name: "Nancy",
          value: 520,
        },
        {
          name: "生活资源",
          value: "999",
        },
        {
          name: "供热管理",
          value: "888",
        },
        {
          name: "供气质量",
          value: "777",
        },
        {
          name: "生活用水管理",
          value: "688",
        },
        {
          name: "一次供水问题",
          value: "588",
        },
        {
          name: "交通运输",
          value: "516",
        },
        {
          name: "城市交通",
          value: "515",
        },
        {
          name: "环境保护",
          value: "483",
        },
        {
          name: "房地产管理",
          value: "462",
        },
        {
          name: "城乡建设",
          value: "449",
        },
        {
          name: "社会保障与福利",
          value: "429",
        },
        {
          name: "社会保障",
          value: "407",
        },
        {
          name: "文体与教育管理",
          value: "406",
        },
        {
          name: "公共安全",
          value: "406",
        },
        {
          name: "公交运输管理",
          value: "386",
        },
        {
          name: "出租车运营管理",
          value: "385",
        },
        {
          name: "供热管理",
          value: "375",
        },
        {
          name: "市容环卫",
          value: "355",
        },
        {
          name: "自然资源管理",
          value: "355",
        },
      ];
      return {
        // title: {
        //   text: "热点分析",
        //   //   link: "https://www.baidu.com/s?wd=" + encodeURIComponent("ECharts"),
        //   x: "center",
        //   textStyle: {
        //     fontSize: 23,
        //   },
        // },
        // backgroundColor: "#F7F7F7",
        tooltip: {
          show: true,
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {
        //       iconStyle: {
        //         normal: {
        //           color: "#FFFFFF",
        //         },
        //       },
        //     },
        //   },
        // },
        series: [
          {
            // name: "热点分析",
            type: "wordCloud",
            //size: ['9%', '99%'],
            sizeRange: [6, 66],
            //textRotation: [0, 45, 90, -45],
            rotationRange: [-45, 90],
            //shape: 'circle',
            textPadding: 0,
            autoSize: {
              enable: true,
              minSize: 6,
            },
            textStyle: {
              normal: {
                color: function () {
                  return (
                    "rgb(" +
                    [
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                    ].join(",") +
                    ")"
                  );
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: "#333",
              },
            },
            data: JosnList,
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