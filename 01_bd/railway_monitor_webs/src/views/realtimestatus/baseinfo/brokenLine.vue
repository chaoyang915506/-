<template>
  <div>
    <handleLine :chartData="chartDataRisk"></handleLine>
  </div>
  <div style="position: relative">
    <el-select
      v-model="textureType"
      placeholder="请选择异物类型"
      clearable
      filterable
      @change="handleTextureType"
      style="width: 140px"
      size="small"
      class="select-position-class"
    >
      <el-option
        v-for="dict in texture"
        :key="dict.value"
        :label="dict.label"
        :value="dict.value"
      />
    </el-select>
    <handleLine :chartData="chartDataForeign"></handleLine>
  </div>
  <div style="position: relative">
    <el-select
      v-model="trobuleWeather"
      placeholder="请选择恶劣天气"
      clearable
      filterable
      @change="handleWeather"
      class="select-position-class"
      style="width: 140px"
      size="small"
    >
      <el-option
        v-for="(item, index) in weatherOpt"
        :key="index"
        :label="item.dict_label"
        :value="item.dict_label"
      />
    </el-select>
    <handleLine :chartData="chartDataWeather"></handleLine>
  </div>
</template>
<script setup>
import handleLine from "@/components/echarts/handleLine.vue";
import {
  getRiskStat,
  getAllSevWeather,
} from "@/api/realtimestatus/realtimestatus.js";
const { proxy } = getCurrentInstance();
const { texture } = proxy.useDict("texture");
let props = defineProps({
  monitorID: {
    type: Number,
    default: undefined,
  },
});
let weatherOpt = ref([]);
let textureType = ref("");
let trobuleWeather = ref("");
let chartDataRisk = ref({
  title: "综合风险统计",
  xData: [],
  yData: [],
  color: "#2077C8",
  showSymbol: false,
  isShowArea: false,
  showMaxValue: true,
  isMmooth: true,
});
let chartDataForeign = ref({
  title: "实时异物侵限风险统计",
  xData: [],
  yData: [],
  color: "#CACB1D",
  showSymbol: false,
  showMaxValue: false,
  isShowArea: true,
  isMmooth: true,
});
let chartDataWeather = ref({
  title: "实时恶劣天气风险统计",
  xData: [],
  yData: [],
  color: "#CACB1D",
  showSymbol: true,
  showMaxValue: false,
  isShowArea: false,
  isMmooth: true,
});
onMounted(() => {
  getRiskStatData(props.monitorID, "1,2,4");
  getAllSevWeatherData();
});
watch(
  () => props.monitorID,
  () => {
    chartDataForeign.value.xData = [];
    chartDataForeign.value.yData = [];
    chartDataWeather.value.xData = [];
    chartDataWeather.value.yData = [];
    chartDataRisk.value.xData = [];
    chartDataRisk.value.yData = [];
    textureType.value = "";
    trobuleWeather.value = "";
    getRiskStatData(props.monitorID, "1,2,4");
  }
);
// 获取全部恶劣天气
const getAllSevWeatherData = async () => {
  let res = await getAllSevWeather();
  if (res.code == 200) {
    weatherOpt.value = res.data;
  }
};

// 异物风险选择
const handleTextureType = () => {
  console.log(textureType.value, "什么");
  getRiskStatData(props.monitorID, "1", textureType.value);
};
// 恶劣天气选择
const handleWeather = () => {
  console.log(weatherOpt.value, trobuleWeather.value);
  let contam = "";
  let weather = "";
  weatherOpt.value.forEach((item) => {
    if (item.dict_label == trobuleWeather.value) {
      contam = item.dict_value;
      weather = item.dict_type;
    }
  });
  getRiskStatData(props.monitorID, "2", contam, weather);
};
// 获取风险统计
const getRiskStatData = async (val, riskType, contam, weather) => {
  let res = await getRiskStat({
    monitorId: val,
    riskType,
    contam,
    weather,
  });
  if (res.code == 200) {
    // console.log(res, "异物feng");
    // 1 异物风险
    if (res.data[1] && res.data[1].length) {
      let xData = [];
      let yData = [];
      let arr = res.data[1].sort(proxy.compareDate("createTime", "positive"));
      arr.forEach((item) => {
        xData.push(proxy.timestampToTime(new Date(item.createTime).getTime()));
        yData.push(item.risk * 100);
      });
      chartDataForeign.value.xData = xData;
      chartDataForeign.value.yData = yData;
    }
    // 2 恶劣天气
    if (res.data[2] && res.data[2].length) {
      let xData = [];
      let yData = [];
      let arr = res.data[2].sort(proxy.compareDate("createTime", "positive"));
      arr.forEach((item) => {
        xData.push(proxy.timestampToTime(new Date(item.createTime).getTime()));
        yData.push(item.risk * 100);
      });
      chartDataWeather.value.xData = xData;
      chartDataWeather.value.yData = yData;
    }
    // 4 综合风险
    if (res.data[4] && res.data[4].length) {
      let xData = [];
      let yData = [];

      let arr = res.data[4].sort(proxy.compareDate("createTime", "positive"));
      arr.forEach((item) => {
        xData.push(proxy.timestampToTime(new Date(item.createTime).getTime()));
        yData.push(item.risk * 100);
      });
      chartDataRisk.value.xData = xData;
      chartDataRisk.value.yData = yData;
    }
  }
};
</script>
<style scoped>
.broken-line-class > div {
  flex: 1;
  padding: 10px;
  background: #3c3d3f;
  box-shadow: 2px 2px 6px #909399, -2px -2px 6px #909399;
}
.broken-line-class > div:nth-child(2) {
  margin-left: 1px;
}
.select-position-class {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 11;
}
</style>