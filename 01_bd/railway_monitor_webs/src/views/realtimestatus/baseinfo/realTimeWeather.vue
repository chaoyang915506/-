<template>
  <div class="base-info-title">实时天气情况</div>
  <div class="base-info--weather-class">
    <ul>
      <li>
        积雪深度：<span>{{ weatherObj.snows_depth }}cm</span>
      </li>
      <li>
        能见度：<span>{{ weatherObj.visibility }}</span>
      </li>
      <li>
        大气压强：<span>{{ weatherObj.atmospheric_pressure }}</span>
      </li>
      <li>
        气温：<span>{{ weatherObj.air_temperature }}℃</span>
      </li>
    </ul>
    <div class="weather-back">
      <div>
        <img src="./../../../assets/images/realtimestatus/weather.png" alt="" />
      </div>
      <div class="weather-text">
        <div
          style="
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            align-items: center;
            justify-content: center;
          "
        >
          <!-- 风 -->
          <div class="weather-risk-class" v-if="weatherObj.windStatus">
            {{ formatterWeather(weatherObj.windStatus, "wind") }}
          </div>
          <!-- 雨 -->
          <div class="weather-risk-class" v-if="weatherObj.rainStatus">
            {{ formatterWeather(weatherObj.rainStatus, "rain") }}
          </div>
          <!-- 雾 -->
          <div class="weather-risk-class" v-if="weatherObj.fogStatus">
            {{ formatterWeather(weatherObj.fogStatus, "fog") }}
          </div>
          <!-- 雪 -->
          <div class="weather-risk-class" v-if="weatherObj.snowStatus">
            {{ formatterWeather(weatherObj.snowStatus, "snow") }}
          </div>
        </div>
        <!-- <div class="risk-class">{{ formatterRisk(weatherObj.risk) }}</div> -->
        <div class="risk-class">{{ weatherObj.warnName }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getRealTimeWeather } from "@/api/realtimestatus/realtimestatus.js";
const { proxy } = getCurrentInstance();
const { warning_grade, WindStatus, RainStatus, FogStatus, SnowStatus } =
  proxy.useDict(
    "warning_grade",
    "WindStatus",
    "RainStatus",
    "FogStatus",
    "SnowStatus"
  );
let props = defineProps({
  monitorID: {
    type: Number,
    default: undefined,
  },
});
let weatherObj = ref({});
onMounted(() => {
  getRealTimeWeatherData(props.monitorID);
});
watch(
  () => props.monitorID,
  () => {
    getRealTimeWeatherData(props.monitorID);
  }
);
// 获取天气情况
const getRealTimeWeatherData = async (val) => {
  let res = await getRealTimeWeather({
    monitorId: val,
  });
  if (res.code == 200) {
    console.log(res.data[0], "shuju");
    weatherObj.value = res.data && res.data.length ? res.data[0] : {};
  }
};
function getBit(value, bit = 3) {
  let str = value.toString();
  let strIndex = str.indexOf(".");
  if (strIndex === -1) return str;
  str = str.substring(0, strIndex + bit);
  return str;
}

// 格式化风险等级
// const formatterRisk = (val) => {
//   if (val) {
//     let result = warning_grade.value.find(
//       (item) => item.value == getBit(val, 2)
//     );
//     if (result) {
//       return result.label;
//     } else {
//       return "无预警";
//     }
//   } else {
//     return "无预警";
//   }
// };
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
</script>
<style scoped>
.base-info--weather-class {
  margin-top: 10px;
  font-size: 12px;
  display: flex;
}
.base-info-title {
  font-size: 15px;
  /* font-weight: bold; */
  /* color: #1abcb8; */
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.base-info--weather-class li {
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.base-info--weather-class ul {
  width: 50%;
}
.base-info--weather-class span {
  color: #1abcb8;
  font-weight: bold;
}
.weather-back {
  background-image: url("./../../../assets/images/realtimestatus/weather-back.svg");
  background-size: 100% 100%;
  width: 40%;
  margin-left: 10%;
  display: flex;
  flex-direction: column;
  /* justify-content: space-around; */
  align-items: center;
}
.weather-text {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
}
.weather-text .weather-risk-class {
  font-size: 17px;
  margin-left: 10px;
}
.weather-text .risk-class {
  font-size: 18px;
  color: #ff8686;
}
</style>