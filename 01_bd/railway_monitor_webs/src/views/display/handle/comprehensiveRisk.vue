<template>
  <div style="color: #fff; padding-left: 10px; font-size: 15px">
    <div>异物侵限 <span ref="counter1"></span> 次</div>
    <div style="margin: 8px 0">恶劣天气 <span ref="counter2"></span> 次</div>
  </div>
  <handleLine
    style="width: 100%; height: 60%"
    :chartData="chartDataRisk"
    :dataZoom="false"
  ></handleLine>
</template>
<script setup>
import handleLine from "@/components/echarts/handleLine.vue";

import { getRealTimeComprehensiveRiskTrend } from "@/api/display/display.js";

let { proxy } = getCurrentInstance();

let chartDataRisk = ref({
  title: "",
  xData: [],
  yData: [],
  gridTop: 10,
  color: "#34A1A1",
  dashedColor: "#484848",
  topColor: "#2D5172",
  bottomColor: "#2D5172",
  showSymbol: false,
  isYAxisLabel: false,
  showMaxValue: false,
  isShowArea: true,
  isAnimation: false,
  isMmooth: true,
});
// 初始化
const getInitList = async () => {
  let res = await getRealTimeComprehensiveRiskTrend();
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
      proxy.animateValue(
        proxy.$refs.counter1,
        0,
        res.data.foreignBodyCount,
        3000
      );
      proxy.animateValue(
        proxy.$refs.counter2,
        0,
        res.data.badWeatherCount,
        3000
      );
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