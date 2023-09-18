<template>
  <div
    style="
      color: #fff;
      padding-left: 10px;
      padding-top: 10px;
      display: flex;
      align-items: center;
    "
  >
    <div>
      <span ref="counter1" style="font-size: 30px"></span
      ><span style="font-weight: bold; font-size: 14px; margin-left: 10px"
        >个</span
      >
    </div>
    <div style="margin-left: 50px; color: #34e0a8">
      <el-icon
        style="margin-right: 5px; vertical-align: middle; font-size: 16px"
        ><CaretTop
      /></el-icon>
      <span ref="counter2" style="font-size: 30px">{{ percent }}</span> %
    </div>
  </div>
  <handleLine
    style="width: 100%; height: 70%"
    :chartData="chartDataRisk"
  ></handleLine>
</template>
<script setup>
import handleLine from "@/components/echarts/handleLine.vue";
import { getBadWeatherStatistics } from "@/api/display/display.js";

let { proxy } = getCurrentInstance();

let chartDataRisk = ref({
  title: "",
  xData: [],
  yData: [],
  gridTop: 20,
  color: "#34E0A8",
  topColor: "#367863",
  bottomColor: "#363F3C",
  dashedColor: "#484848",
  showSymbol: false,
  isYAxisLabel: false,
  showMaxValue: false,
  isShowArea: true,
  isAnimation: false,
  isMmooth: false,
});
let percent = ref(0);
// 初始化
const getInitList = async () => {
  let res = await getBadWeatherStatistics();
  if (res.code == 200) {
    if (res.data.data && res.data.data.length) {
      let xData = [];
      let yData = [];
      let arr = res.data.data.sort(proxy.compareDate("createTime", "positive"));
      arr.forEach((item) => {
        xData.push(proxy.timestampToTime(new Date(item.createTime).getTime()));
        yData.push(item.count);
      });
      chartDataRisk.value.xData = xData;
      chartDataRisk.value.yData = yData;
    }
    nextTick(() => {
      proxy.animateValue(proxy.$refs.counter1, 0, res.data.count, 3000);
      percent.value = (res.data.percentage * 100).toFixed(2);

      // proxy.animateValue(
      //   proxy.$refs.counter2,
      //   0,
      //   (res.data.percentage * 100).substring(0, 5),
      //   3000
      // );
    });
  }
};
onMounted(() => {
  getInitList();
});
defineExpose({ getInitList });
</script>
<style scoped>
</style>