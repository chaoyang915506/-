<template>
  <ul class="ul-class">
    <li
      @click="handClick(1, forMatWarnData.length)"
      v-if="activeIndex == 1 || activeIndex == -1"
      :class="activeIndex == 1 ? 'active-li' : ''"
    >
      <span>异物侵限</span>
      <span
        class="circle-class-wrap"
        :class="
          forMatWarnData.length > 0
            ? 'wraning-circle-class'
            : 'info-circle-class'
        "
        >{{ forMatWarnData.length }}</span
      >
    </li>
    <li
      @click="handClick(2, weatherWarnData.length)"
      v-if="activeIndex == 2 || activeIndex == -1"
      :class="activeIndex == 2 ? 'active-li' : ''"
    >
      <span>恶劣天气预警</span>
      <span
        class="circle-class-wrap"
        :class="
          weatherWarnData.length > 0
            ? 'wraning-circle-class'
            : 'info-circle-class'
        "
        >{{ weatherWarnData.length }}</span
      >
    </li>
    <li
      @click="handClick(3, facilityWarnData.length)"
      v-if="activeIndex == 3 || activeIndex == -1"
      :class="activeIndex == 3 ? 'active-li' : ''"
    >
      <span>设备数据异常预警</span>
      <span
        class="circle-class-wrap"
        :class="
          facilityWarnData.length > 0
            ? 'wraning-circle-class'
            : 'info-circle-class'
        "
        >{{ facilityWarnData.length }}</span
      >
    </li>
    <li
      @click="handClick(4, synWarnData.length)"
      v-if="activeIndex == 4 || activeIndex == -1"
      :class="activeIndex == 4 ? 'active-li' : ''"
    >
      <span>综合风险分析</span>
      <span
        class="circle-class-wrap"
        :class="
          synWarnData.length > 0 ? 'wraning-circle-class' : 'info-circle-class'
        "
        >{{ synWarnData.length }}</span
      >
    </li>
    <li
      v-if="activeIndex == 5 || activeIndex == -1"
      :class="activeIndex == 5 ? 'active-li' : ''"
    >
      <div>
        <span>预警</span>
        <span></span>
      </div>
      <div>
        <span>未处理</span>
        <span style="margin-left: 5px; font-size: 15px; color: #e15c5c">{{
          warningCount.unfin
        }}</span>
      </div>
      <div>
        <span>处理中</span>
        <span style="margin-left: 5px; font-size: 15px; color: #d2ed06">{{
          warningCount.under
        }}</span>
      </div>
      <div>
        <span>已处理</span>
        <span style="margin-left: 5px; font-size: 15px; color: #34e0a8">{{
          warningCount.finish
        }}</span>
      </div>
    </li>
  </ul>
  <el-collapse-transition>
    <div v-show="show">
      <!-- 异物侵限 -->
      <div class="transition-box" v-show="activeIndex == 1">
        <div
          v-for="(item, index) in forMatWarnData"
          :key="index"
          style="margin-bottom: 10px"
        >
          <div style="margin-bottom: 10px">
            <img
              src="./../../../assets/images/display/risk-logo.svg"
              alt=""
              style="vertical-align: middle"
            />
            异物侵限预警
          </div>
          <div class="content-risk-class">
            预警事件编号：<span>{{ item.eventNumber }}</span>
          </div>
          <div class="content-risk-class">
            监测点：<span>{{ item.monitorName }}</span>
          </div>
          <div class="content-risk-class">
            报警级别：<span>{{ formatterRiskGrade(item.risk) }}</span>
          </div>
          <div class="content-risk-class">
            材质：<span>{{ item.texture }}</span>
          </div>
          <div class="content-risk-class">
            体积：<span>{{ item.volume }} 平方厘米</span>
          </div>
          <div class="content-risk-class">
            位置：<span>{{ item.location }}</span>
          </div>
          <div class="content-risk-class">
            报警发生时间：<span>{{ timeToSplit(item.begin_time) }}</span>
          </div>
          <div class="content-risk-class">
            报警解除时间：<span>{{ timeToSplit(item.end_time) }}</span>
          </div>
        </div>
      </div>
      <!-- 恶劣天气预警 -->
      <div class="transition-box" v-show="activeIndex == 2">
        <div
          v-for="(item, index) in weatherWarnData"
          :key="index"
          style="margin-bottom: 10px"
        >
          <div style="margin-bottom: 10px">
            <img
              src="./../../../assets/images/display/risk-logo.svg"
              alt=""
              style="vertical-align: middle"
            />
            恶劣天气预警
          </div>
          <div class="content-risk-class">
            预警事件编号：<span>{{ item.eventNumber }}</span>
          </div>
          <div class="content-risk-class">
            监测点：<span>{{ item.monitorName }}</span>
          </div>
          <div class="content-risk-class">
            报警级别：<span>{{ formatterRiskGrade(item.risk) }}</span>
          </div>
          <div class="content-risk-class">
            气温：<span>{{ item.airTemp }}</span>
          </div>
          <div class="content-risk-class">
            相对湿度：<span>{{ item.humidity }}</span>
          </div>
          <div class="content-risk-class">
            大气压强：<span>{{ item.atmoPressure }}</span>
          </div>
          <div class="content-risk-class">
            风向：<span>{{ item.windDirection }}</span>
          </div>
          <div class="content-risk-class">
            风速：<span>{{ item.windSpeed }}</span>
          </div>
          <div class="content-risk-class">
            能见度：<span>{{ item.visibility }}</span>
          </div>
          <div class="content-risk-class">
            雨量：<span>{{ item.rainfall }}</span>
          </div>
          <div class="content-risk-class">
            雪深：<span>{{ item.sowsDepth }}</span>
          </div>
          <div class="content-risk-class">
            风级别：<span>{{ formatterWeather(item.windStatus, "wind") }}</span>
          </div>
          <div class="content-risk-class">
            雨级别：<span>{{ formatterWeather(item.rainStatus, "rain") }}</span>
          </div>
          <div class="content-risk-class">
            雾级别：<span>{{ formatterWeather(item.fogStatus, "fog") }}</span>
          </div>
          <div class="content-risk-class">
            雪级别：<span>{{ formatterWeather(item.snowStatus, "snow") }}</span>
          </div>
          <div class="content-risk-class">
            报警发生时间：<span>{{ timeToSplit(item.begin_time) }}</span>
          </div>
          <div class="content-risk-class">
            报警解除时间：<span>{{ timeToSplit(item.end_time) }}</span>
          </div>
        </div>
      </div>
      <!-- 设备数据异常预警 -->
      <div class="transition-box" v-show="activeIndex == 3">
        <div
          v-for="(item, index) in facilityWarnData"
          :key="index"
          style="margin-bottom: 10px"
        >
          <div style="margin-bottom: 10px">
            <img
              src="./../../../assets/images/display/risk-logo.svg"
              alt=""
              style="vertical-align: middle"
            />
            设备数据异常预警
          </div>
          <!-- <div class="content-risk-class">
            预警事件编号：<span>{{ item.eventNumber }}</span>
          </div> -->
          <div class="content-risk-class">
            监测点名称：<span>{{ item.monitorName }}</span>
          </div>
          <div class="content-risk-class">
            设备名称：<span>{{ item.facilityName }}</span>
          </div>
          <div class="content-risk-class">
            设备类型：<span>{{ item.facility_type }}</span>
          </div>
          <div class="content-risk-class">
            设备状态：<span>{{
              formatterState(item.facility_state, facility_state)
            }}</span>
          </div>
          <div class="content-risk-class">
            位置：<span>E {{ item.lon }} N {{ item.lat }}</span>
          </div>
          <!-- <div class="content-risk-class">
            报警发生时间：<span>{{ timeToSplit(item.begin_time) }}</span>
          </div>
          <div class="content-risk-class">
            报警解除时间：<span>{{ timeToSplit(item.end_time) }}</span>
          </div> -->
        </div>
      </div>
      <!-- 综合风险分析 -->
      <div class="transition-box" v-show="activeIndex == 4">
        <div
          v-for="(item, index) in synWarnData"
          :key="index"
          style="margin-bottom: 10px"
        >
          <div style="margin-bottom: 10px">
            <img
              src="./../../../assets/images/display/risk-logo.svg"
              alt=""
              style="vertical-align: middle"
            />
            综合风险分析
          </div>
          <div class="content-risk-class">
            预警事件编号：<span>{{ item.eventNumber }}</span>
          </div>
          <div class="content-risk-class">
            监测点：<span>{{ item.monitorName }}</span>
          </div>
          <div class="content-risk-class">
            报警级别：<span>{{ formatterRiskGrade(item.risk) }}</span>
          </div>
          <div class="content-risk-class">
            气温：<span>{{ item.airTemp }}</span>
          </div>
          <div class="content-risk-class">
            相对湿度：<span>{{ item.humidity }}</span>
          </div>
          <div class="content-risk-class">
            大气压强：<span>{{ item.atmoPressure }}</span>
          </div>
          <div class="content-risk-class">
            风向：<span>{{ item.windDirection }}</span>
          </div>
          <div class="content-risk-class">
            风速：<span>{{ item.windSpeed }}</span>
          </div>
          <div class="content-risk-class">
            能见度：<span>{{ item.visibility }}</span>
          </div>
          <div class="content-risk-class">
            雨量：<span>{{ item.rainfall }}</span>
          </div>
          <div class="content-risk-class">
            雪深：<span>{{ item.sowsDepth }}</span>
          </div>
          <div class="content-risk-class">
            风级别：<span>{{ formatterWeather(item.windStatus, "wind") }}</span>
          </div>
          <div class="content-risk-class">
            雨级别：<span>{{ formatterWeather(item.rainStatus, "rain") }}</span>
          </div>
          <div class="content-risk-class">
            雾级别：<span>{{ formatterWeather(item.fogStatus, "fog") }}</span>
          </div>
          <div class="content-risk-class">
            雪级别：<span>{{ formatterWeather(item.snowStatus, "snow") }}</span>
          </div>
          <div class="content-risk-class">
            流域面积：<span>{{ item.wa }}</span>
          </div>
          <div class="content-risk-class">
            岩土类型：<span>{{ item.rocksoil }}</span>
          </div>
          <div class="content-risk-class">
            松散物质储量：<span>{{ item.lmsc }}</span>
          </div>
          <div class="content-risk-class">
            平均坡度：<span>{{ item.aves }}</span>
          </div>
          <div class="content-risk-class">
            植物覆盖率：<span>{{ item.pc }}</span>
          </div>
          <div class="content-risk-class">
            报警发生时间：<span>{{ timeToSplit(item.begin_time) }}</span>
          </div>
          <div class="content-risk-class">
            报警解除时间：<span>{{ timeToSplit(item.end_time) }}</span>
          </div>
        </div>
      </div>
      <!-- 预警 -->
      <!-- <div class="transition-box" v-show="activeIndex == 5">预警</div> -->
    </div>
  </el-collapse-transition>
</template>
<script setup>
import {
  getForMatWarn,
  geSevWeatherWarn,
  getFacilityWarn,
  getSynWarn,
  getWarnState,
} from "@/api/display/display.js";
const { proxy } = getCurrentInstance();
const {
  risk_grade,
  WindStatus,
  RainStatus,
  FogStatus,
  SnowStatus,
  facility_state,
} = proxy.useDict(
  "risk_grade",
  "WindStatus",
  "RainStatus",
  "FogStatus",
  "SnowStatus",
  "facility_state"
);
let activeIndex = ref(-1);
let show = ref(false);
let warningCount = ref({
  finish: "",
  under: "",
  unfin: "",
});
let forMatWarnData = ref([]);
let weatherWarnData = ref([]);
let facilityWarnData = ref([]);
let synWarnData = ref([]);
const formatterState = (val, data) => {
  let findata = data.find((i) => i.value == val);
  return findata ? findata.label : "";
};
// 手风琴头部点击
const handClick = (val, length) => {
  if (length < 1) return;
  show.value = !show.value;
  if (show.value) {
    activeIndex.value = val;
  } else {
    activeIndex.value = -1;
  }
};
// 异物侵限
async function getForMatWarnData() {
  let res = await getForMatWarn();
  if (res.code == 200) {
    forMatWarnData.value = res.data;
  }
}
// 恶劣天气预警
async function geSevWeatherWarnData() {
  let res = await geSevWeatherWarn();
  if (res.code == 200) {
    weatherWarnData.value = res.data;
  }
}
// 设备数据异常预警
async function getFacilityWarnData() {
  let res = await getFacilityWarn();
  if (res.code == 200) {
    facilityWarnData.value = res.data;
  }
}
// 综合风险分析
async function getSynWarnData() {
  let res = await getSynWarn();
  if (res.code == 200) {
    synWarnData.value = res.data;
  }
}
// 预警统计
async function getWarnStateData() {
  let res = await getWarnState();
  if (res.code == 200) {
    warningCount.value = res.data;
  }
}
// 格式化风险等级
const formatterRiskGrade = (val) => {
  let result = risk_grade.value.find((item) => item.value == val);
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
// 格式化天气
const formatterWeather = (val, type) => {
  // 风
  if (type == "wind") {
    let result = WindStatus.value.find((item) => item.value == val);
    if (result) {
      return result.label;
    } else {
      return "";
    }
  }
  // 雨
  if (type == "rain") {
    let result = RainStatus.value.find((item) => item.value == val);
    if (result) {
      return result.label;
    } else {
      return "";
    }
  }
  // 雾
  if (type == "fog") {
    let result = FogStatus.value.find((item) => item.value == val);
    if (result) {
      return result.label;
    } else {
      return "";
    }
  }
  // 雪
  if (type == "snow") {
    let result = SnowStatus.value.find((item) => item.value == val);
    if (result) {
      return result.label;
    } else {
      return "";
    }
  }
};
const timeToSplit = (val) => {
  if (val) {
    let result = val.split("T");
    return result[0] + " " + result[1];
  } else {
    return "";
  }
};
onMounted(() => {
  getForMatWarnData();
  geSevWeatherWarnData();
  getFacilityWarnData();
  getSynWarnData();
  getWarnStateData();
});

function getInitList() {
  getForMatWarnData();
  geSevWeatherWarnData();
  getFacilityWarnData();
  getSynWarnData();
  getWarnStateData();
}
defineExpose({ getInitList });
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
.ul-class {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.ul-class li {
  height: calc(20% - 8px);
  background: #363636;
  box-shadow: 3px 3px 6px #909399, -3px -3px 6px #909399;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px 0 20px;
  color: #d4d4d4;
  font-size: 14px;
  border: 2px solid #363636;
}
.ul-class li:nth-child(1) {
  margin-top: 0px;
}
.ul-class li:hover {
  box-shadow: 3px 3px 6px #eee, -3px -3px 6px #eee;
  box-sizing: border-box;
}
.ul-class .active-li {
  box-shadow: 3px 3px 6px #eee, -3px -3px 6px #eee;
  border: 2px solid #00bfbf;
}
.ul-class li:nth-child(5) {
  padding-right: 20px;
}
.circle-class-wrap {
  border-radius: 50%;
  min-width: 25px;
  min-height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wraning-circle-class {
  background: #e15c5c;
}
.info-circle-class {
  background: #878787;
}
.transition-box {
  position: absolute;
  top: 56px;
  left: 0;
  width: 100%;
  overflow-y: auto;
  background: #363636;
  box-shadow: 3px 3px 6px #909399, -3px -3px 6px #909399;
  height: calc(100% - 57px);
  z-index: 20;
  color: #d5d5d5;
  font-size: 14px;
  padding: 10px 10px 0 10px;
}
.content-risk-class {
  margin-bottom: 10px;
  padding-left: 22px;
}
</style>