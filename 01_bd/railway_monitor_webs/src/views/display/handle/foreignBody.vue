<template>
  <hasBackBar
    :chartData="chartDataRisk"
    style="width: 100%; height: 85%"
  ></hasBackBar>
</template>
<script setup>
import hasBackBar from "@/components/echarts/hasBackBar.vue";
import { getForeignBodyStatistics } from "@/api/display/display.js";
import { nextTick } from "@vue/runtime-core";

let { proxy } = getCurrentInstance();
let chartDataRisk = ref({
  title: "",
  xData: [],
  yData: [],
  yMaxData: [],
  isYaxisLabel: false,
  isToolTipLabel: false,
});
// 初始化
const getInitList = () => {
  getForeignBodyStatistics().then((res) => {
    // console.log("今日异物侵限高发监测点统计", res);
    if (res.code == 200) {
      if (res.data.data && res.data.data.length) {
        let xData = [];
        let yData = [];
        let yMaxData = [];
        res.data.data.forEach((item) => {
          xData.push(item.monitoringPointName);
          yData.push(item.count);
        });
        let maxNum = Math.max(...yData);
        console.log(maxNum, "are");
        yData.forEach((item, index) => {
          yMaxData[index] = parseFloat(maxNum) + 10;
          // yMaxData[index] = maxNum + 4;
        });
        // console.log(xData, yData, yMaxData, "什么数据");
        chartDataRisk.value.xData = xData;
        chartDataRisk.value.yData = yData;
        chartDataRisk.value.yMaxData = yMaxData;
      }
    }
  });
};
onMounted(() => {
  nextTick(() => {
    getInitList();
  })
})
defineExpose({ getInitList });
</script>
<style scoped>
</style>