<!-- 综合风险排名 -->
<template>
  <pictorialBar
    style="width: 100%; height: 100%"
    :chartData="chartData"
  ></pictorialBar>
</template>
<script setup>
import pictorialBar from "@/components/echarts/pictorialBar.vue";
import { getMonitorRiskRank } from "@/api/display/display.js";
let { proxy } = getCurrentInstance();
let chartData = ref({
  xData: [],
  yData: [],
});
async function getInitList() {
  let res = await getMonitorRiskRank();
  if (res.code == 200) {
    if (res.data && res.data.length) {
      res.data.forEach((item) => {
        chartData.value.xData.push(item.monitorName ? item.monitorName : "");
        chartData.value.yData.push(item.risk * 100);
      });
    }
  }
}

getInitList();
defineExpose({ getInitList });
</script>