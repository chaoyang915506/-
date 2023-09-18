<template>
  <div class="content">
    <div class="top">
      <div
        class="all_card"
        v-if="
          props.queryParams.beidou == '北斗二号' ||
          props.queryParams.beidou == '全部'
        "
      >
        <DiscountEcharts
          class="top_left"
          :chartData="data.chartDataHistory_one"
        ></DiscountEcharts>
        <DiscountEcharts
          class="top_right"
          :chartData="data.chartDataHistory_two"
        ></DiscountEcharts>
      </div>
      <div class="beidou_card" v-else>
        <StatisticsTopCharts :chartDataList="chartDataList" />
      </div>
    </div>
    <div class="bottom">
      <StatisticsBarEcharts :chartData="barChart" />
    </div>
  </div>
</template>

<script setup>
import StatisticsTopCharts from "../components/statisticsTopCharts.vue";
import DiscountEcharts from "@/components/discountEcharts/index.vue";
import StatisticsBarEcharts from "@/components/StatisticsBarEcharts/index.vue";
import {
  统计短报文位置,
  统计短报文分类,
  短报文年度统计,
} from "@/api/shortMessage/index.js";
import { reactive } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
const props = defineProps({
  queryParams: {
    type: Object,
    default: {},
  },
});

const chartDataList = reactive({
  //短报文分类北二value name
  twoPieChart: {
    sData: [],
    sData1: [],
  },
  threePieChart: [
    // { title: "东海", value: 89, limit: 235, total: 100 },
  ],
});
const barChart = ref({
  xData: [],
  sData: [],
  sData1: [],
});

const queryParams = ref({
  ishour: 1, //默认30天
  bdsVersion: "北斗二号",
  year: "",
});

watch(
  () => props.queryParams,
  (val) => {
    // console.log(val, "接收");
    queryParams.value.bdsVersion = val.beidou;
    queryParams.value.year = val.endTime;
    getshortMessageLocation();
    shortMessageClassify();
    getShortMsgStat();
  },
  {
    deep: true,
  }
);

let data = reactive({
  chartDataHistory_two: {
    title: "短报文位置",
    company: "",
    type: "bar",
    lineColor: ["#0080ff"],
    legendList: [],
    dataZoom: false,
    gridStyle: {
      left: 10,
      right: 10,
      top: 100,
      bottom: 10,
      containLabel: true,
    },
    xaxisdate: [],
    seriesone: [],
  },
  chartDataHistory_one: {
    title: "短报文分类",
    company: "",
    type: "bar",
    lineColor: ["#0085ff"],
    legendList: [],
    dataZoom: false,
    gridStyle: {
      left: 10,
      right: 10,
      top: 100,
      bottom: 10,
      containLabel: true,
    },
    xaxisdate: [],
    seriesone: [],
  },
});
async function getshortMessageLocation() {
  let res = await 统计短报文位置({
    ishour: 1, //默认30天
    bdsVersion: queryParams.value.bdsVersion,
    year: queryParams.value.year,
  });
  if (res.rows.length > 0) {
    let xData = res.rows.map((i) => {
      return i.deptName ? i.deptName : "无";
    });
    let sData = res.rows.map((i) => {
      return i.statisticsCount ? i.statisticsCount : 0;
    });
    data.chartDataHistory_two.seriesone = xData;
    data.chartDataHistory_two.xaxisdate = sData;

    if (res.rows.length >= 3) {
      // console.log(res.rows, "res.rows");
      let treeData = res.rows.map((i) => {
        return {
          total: i.statisticsCount,
          title: i.deptName || "无",
          value: i.statisticsCount || "0",
          limit: i.statisticsCount || "0",
        };
      });
      chartDataList.threePieChart = treeData;
    }
  }
}

async function getShortMsgStat() {
  let res = await 短报文年度统计({
    bdsCardType: queryParams.value.bdsVersion,
    year: queryParams.value.year,
  });
  // console.log(res, "短报文年度统计");
  if (res.data.length > 0) {
    barChart.value.xData = res.data.map((i) => {
      return new Date(i.to_char).getMonth() + 1 + "月";
    });
    barChart.value.sData = res.data.map((i) => i.count);
    barChart.value.sData1 = new Array(res.data.length).fill(0);
  }
}

async function shortMessageClassify() {
  const res = await 统计短报文分类({
    ishour: 1, //默认30天
    bdsVersion: queryParams.value.bdsVersion,
    year: queryParams.value.year,
  });
  // console.log(res, "统计短报文分类");
  if (res.rows.length > 0) {
    // 目前接口返回的全部为位置类数据
    let count = eval(res.rows.map((i) => i.sendCount).join("+"));
    // console.log(count, "count");
    // let xData = res.rows.map((i) => {
    //   return i.deptName ? i.deptName : "无";
    // });

    let labelList = ["位置类", "气象类", "通信类", "数据传输类"];
    let result = [count, 0, 0, 0].map((i, j) => {
      return {
        value: i,
        name: labelList[j],
      };
    });
    chartDataList.twoPieChart.sData = result;
    chartDataList.twoPieChart.sData1 = result;

    data.chartDataHistory_one.xaxisdate = [count, 0, 0, 0];
    data.chartDataHistory_one.seriesone = labelList;
  }
}
onMounted(() => {
  getshortMessageLocation();
  shortMessageClassify();
  getShortMsgStat();
});
</script>

<style scope lang='scss'>
.content {
  width: 100%;
  height: calc(100vh - 7.875rem);
  background-color: #f4f7fc;
  .top,
  .bottom {
    height: 50%;
  }
  .top {
    display: flex;
    justify-content: space-between;
  }
  .bottom {
    margin-top: 0.625rem;
    width: 100%;
    background-color: #fff;
  }
}
.all_card,
.beidou_card {
  width: 100%;
  height: 100%;
}
.all_card {
  display: flex;
}
.top_right {
  height: 100%;
  width: 50%;
  background-color: #fff;
}
.top_left {
  margin-right: 0.625rem;
  background-color: #fff;
  height: 100%;
  width: calc(50% - 0.625rem);
}
</style>