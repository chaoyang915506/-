<template>
  <div ref="echarts"></div>
</template>

<script>
export default {
  name: "bartimedeploy",
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
      // var cityName = "";
      // //广东省每天的aqi监测数据
      // var baseData_0 = [
      //   { SSXZQ: "中山市", JCKSRQ: "2019/01/01", AQI: "49" },
      //   { SSXZQ: "潮州市", JCKSRQ: "2019/01/01", AQI: "30" },
      //   { SSXZQ: "揭阳市", JCKSRQ: "2019/01/01", AQI: "46" },
      //   { SSXZQ: "云浮市", JCKSRQ: "2019/01/01", AQI: "46" },
      //   { SSXZQ: "广州市", JCKSRQ: "2019/01/02", AQI: "38" },
      //   { SSXZQ: "韶关市", JCKSRQ: "2019/01/02", AQI: "26" },
      //   { SSXZQ: "深圳市", JCKSRQ: "2019/01/02", AQI: "40" },
      //   { SSXZQ: "珠海市", JCKSRQ: "2019/01/02", AQI: "53" },
      //   { SSXZQ: "汕头市", JCKSRQ: "2019/01/02", AQI: "42" },
      //   { SSXZQ: "佛山市", JCKSRQ: "2019/01/02", AQI: "36" },
      //   { SSXZQ: "江门市", JCKSRQ: "2019/01/02", AQI: "40" },
      //   { SSXZQ: "湛江市", JCKSRQ: "2019/01/02", AQI: "52" },
      //   { SSXZQ: "茂名市", JCKSRQ: "2019/01/02", AQI: "42" },
      //   { SSXZQ: "肇庆市", JCKSRQ: "2019/01/02", AQI: "22" },
      //   { SSXZQ: "惠州市", JCKSRQ: "2019/01/02", AQI: "33" },
      //   { SSXZQ: "梅州市", JCKSRQ: "2019/01/02", AQI: "29" },
      //   { SSXZQ: "汕尾市", JCKSRQ: "2019/01/02", AQI: "29" },
      //   { SSXZQ: "河源市", JCKSRQ: "2019/01/02", AQI: "25" },
      //   { SSXZQ: "阳江市", JCKSRQ: "2019/01/02", AQI: "32" },
      // ];

      // //处理图表数据
      // function getChartData(baseData, cityName) {
      //   var data = {
      //     baseData: [],
      //     xAxisData: [], //x轴
      //     realData: [], //实际数值
      //     stdplotData: [], //正态分布数值
      //   };
      //   var sumObj = {}; //保存每个aqi数值的出现次数
      //   baseData.forEach((v) => {
      //     if (!cityName || v.SSXZQ === cityName) {
      //       var aqi = Number(v.AQI);
      //       data.baseData.push(aqi);
      //       if (!sumObj[aqi]) {
      //         sumObj[aqi] = 1;
      //       } else {
      //         sumObj[aqi]++;
      //       }
      //     }
      //   });

      //   console.log(sumObj);
      //   var stdObj = getBebeQ(data.baseData);

      //   var max = stdObj.max;
      //   for (var i = 0; i <= max; i++) {
      //     //console.log(sumObj[i]);
      //     data.xAxisData.push(i);
      //     data.realData.push(sumObj[i] || 0);
      //   }

      //   var yArr = [];

      //   console.log(stdObj);
      //   var mean = Number(stdObj.avg); //均值
      //   var stdev = stdObj.stdDev; //标准差
      //   var x = data.xAxisData;
      //   for (var j = 0; j < x.length; j++) {
      //     var res = fun(x[j], mean, stdev).toFixed(2);
      //     yArr.push(res);
      //   }

      //   data.stdplotData = yArr;

      //   return data;
      // }

      // //求均值和标准差
      // function getBebeQ(numbers, digit = 2) {
      //   // 修复js浮点数精度误差问题
      //   const formulaCalc = function formulaCalc(formula, digit) {
      //     let pow = Math.pow(10, digit);
      //     return parseInt(formula * pow, 10) / pow;
      //   };
      //   let len = numbers.length;
      //   let sum = (a, b) => formulaCalc(a + b, digit);
      //   let max = Math.max.apply(null, numbers);
      //   let min = Math.min.apply(null, numbers);
      //   // 平均值
      //   let avg = numbers.reduce(sum) / len;
      //   // 计算中位数
      //   // 将数值从大到小顺序排列好，赋值给新数组用于计算中位数
      //   let sequence = [].concat(numbers).sort((a, b) => b - a);
      //   let mid =
      //     len & (1 === 0)
      //       ? (sequence[len / 2] + sequence[len / 2 + 1]) / 2
      //       : sequence[(len + 1) / 2];
      //   // 计算标准差
      //   // 所有数减去其平均值的平方和，再除以数组个数（或个数减一，即变异数）再把所得值开根号
      //   let stdDev = Math.sqrt(
      //     numbers.map((n) => (n - avg) * (n - avg)).reduce(sum) / len
      //   );
      //   return {
      //     max,
      //     min,
      //     avg: avg.toFixed(digit),
      //     mid: parseFloat(mid).toFixed(digit),
      //     stdDev: stdDev.toFixed(digit),
      //   };
      // }

      // //正态分布值
      // function fun(x, u, a) {
      //   return (
      //     (1 / Math.sqrt(2 * Math.PI)) *
      //     a *
      //     Math.exp((-1 * ((x - u) * (x - u))) / (2 * a * a))
      //   );
      // }

      // function addParam(arr, target) {
      //   //是否是等于
      //   var flag = false;
      //   var target = parseFloat(target);
      //   //最小
      //   if (target < parseFloat(arr[0])) {
      //     arr.unshift(target.toString());
      //     return arr;
      //   }

      //   //最大
      //   if (target > parseFloat(arr[arr.length - 1])) {
      //     arr.push(target.toString());
      //     return arr;
      //   }

      //   //中间
      //   for (var i = 0; i < arr.length; i++) {
      //     if (parseFloat(arr[i]) > target) {
      //       if (arr[i - 1] == target) flag = true;
      //       break;
      //     }
      //   }
      //   if (flag) {
      //     return arr;
      //   } else {
      //     arr.splice(i, 0, target.toString());
      //     return arr;
      //   }
      // }

      // var data = getChartData(baseData_0, cityName);
      let data = {};
      data.xAxisData = this.chartData.xAxisData;
      data.stdplotData = this.chartData.stdplotData;
      data.realData = this.chartData.stdplotData;
      return {
        legend: {
          show: false,
          type: "plain",
          itemStyle: {},
          textStyle: {
            fontSize: "10",
            color: "#fff",
          },
        },
        color: ["#2f4554", "#af3131"],
        //"color": ["#78b4ff", "#f66bc7", "#2bcba7", "#ff8896", "#79c628", "#6c93ee", "#a9abff", "#f7a23f", "#27bae7", "#ff6d9d", "#cb79ff", "#f95b5a", "#ccaf27", "#38b99c", "#93d0ff", "#bd74e0", "#fd77da", "#dea700"],
        grid: {
          left: "10%",
          right: "10%",
          top: "15%",
          bottom: "10%",
          containLabel: false,
        },
        xAxis: {
          data: data.xAxisData,
        },
        yAxis: [
          {
            name: "",
          },
          {
            name: "频率（%）",
            show: false,
          },
        ],

        series: [
          {
            name: "次数",
            data: data.realData,
            type: "bar",
            smooth: true,
            /*"areaStyle": {
                "normal": {
                    "color": "rgba(50, 255, 200, 0.5)"
                }
            }*/
          },
          {
            name: "",
            yAxisIndex: 1,
            data: data.stdplotData,
            type: "line",
            smooth: true,
            /*"areaStyle": {
                "normal": {
                    "color": "rgba(50, 255, 200, 0.5)"
                }
            }*/
          },
        ],
        tooltip: {
          trigger: "axis",
          confine: true,
          formatter: (params) => {
            return `${params[0].seriesName}<br/>
            ${params[0].marker}${params[0].data}`;
          },
        },
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