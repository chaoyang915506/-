<template>
  <div class="content">
    <div class="top">
      <DiscountEcharts :chartData="data.chartDataHistory_one"></DiscountEcharts>
      <DiscountEcharts :chartData="data.chartDataHistory_two"></DiscountEcharts>
    </div>
    <div class="bottom">
      <DiscountEcharts
        :chartData="data.chartDataHistory_three"
      ></DiscountEcharts>
    </div>
  </div>
</template>

<script setup>
import DiscountEcharts from "@/components/discountEcharts/index.vue";
import { reactive } from "@vue/reactivity";
let data = reactive({
  chartDataHistory_three: {
    title: "短报文年度统计",
    company: "",
    type: "bar",
    lineColor: ["#66FFCC"],
    legendList: [],
    dataZoom: false,
    gridStyle: {
      left: 10,
      right: 10,
      top: 100,
      bottom: 10,
      containLabel: true,
    },
    xaxisdate: [22, 3, 10, 7, 10, 7, 26, 30, 46, 50, 36, 50, 27, 30, 20],
    seriesone: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
  },
  chartDataHistory_two: {
    title: "短报文位置",
    company: "",
    type: "bar",
    lineColor: ["#66FFCC"],
    legendList: [],
    dataZoom: false,
    gridStyle: {
      left: 10,
      right: 10,
      top: 100,
      bottom: 10,
      containLabel: true,
    },
    xaxisdate: [22, 3, 10, 7, 11],
    seriesone: [
      "东部地区",
      "西部地区",
      "南部地区",
      "北部地区",
      "中部地区",
    ],
  },
  chartDataHistory_one: {
    title: "短报文分类",
    company: "",
    type: "bar",
    lineColor: ["#66FFCC"],
    legendList: [],
    dataZoom: false,
    gridStyle: {
      left: 10,
      right: 10,
      top: 100,
      bottom: 10,
      containLabel: true,
    },
    xaxisdate: [22, 3, 10, 7],
    seriesone: [
      "通信类",
      "气象类",
      "位置类",
      "数据传输类",
    ],
  },
});
</script>

<style scope lang='scss'>
.content {
  width: 100%;
    height: calc(100vh - 126px);
  .top,
  .bottom {
    height: 50%;
  }
  .top {
    display: flex;
    justify-content: space-between;
  }
  .bottom {
    width: 100%;
  }
}
</style>