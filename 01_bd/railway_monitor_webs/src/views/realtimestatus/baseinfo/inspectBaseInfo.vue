<template>
  <div class="base-info-title">监测点基本信息</div>
  <div class="base-info-class">
    <ul>
      <li>名称：{{ monitorInfoData.monitorName }}</li>
      <li>站点路段：{{ monitorInfoData.lineName }}</li>
      <li>
        铁路场景类型：{{ findscene(monitorInfoData.sceneType, scene_type) }}
      </li>
      <li>
        监测点等级：{{
          formatterMonitoringPointGrade(monitorInfoData.monitorGrade)
        }}
      </li>
      <li>
        经纬度：E {{ floatToLonLat(monitorInfoData.lon) }} N
        {{ floatToLonLat(monitorInfoData.lat) }}
      </li>
      <li>
        监测对象：{{
          findscene(monitorInfoData.monitoring_scene, monitoring_scene)
        }}
      </li>
      <li>添加时间：{{ timeToSplit(monitorInfoData.addTime) }}</li>
    </ul>
  </div>
</template>
<script setup>
import { getMonitorInfo } from "@/api/realtimestatus/realtimestatus.js";
let props = defineProps({
  monitorID: {
    type: Number,
    default: undefined,
  },
});
const { proxy } = getCurrentInstance();
const { monitoring_point_grade, scene_type, monitoring_scene } = proxy.useDict(
  "scene_type",
  "monitoring_point_grade",
  "monitoring_scene"
);
let monitorInfoData = ref({});

const findscene = (val, dictvalue) => {
  let result = dictvalue.find((i) => i.value == val);
  return result?.label ? result.label : "";
};
onMounted(() => {
  getMonitorInfoData(props.monitorID);
});
watch(
  () => props.monitorID,
  () => {
    getMonitorInfoData(props.monitorID);
  }
);
// 获取监测点基本信息
const getMonitorInfoData = async (val) => {
  let res = await getMonitorInfo({
    monitorId: val,
  });
  if (res.code == 200) {
    console.log(res.data[0], "监测点基本信息");
    monitorInfoData.value = res.data[0];
  }
};
function floatToLonLat(val) {
  if (val) {
    let result = val.toString().split(".");
    // return result[0] + '°' + result[1] + '′'
    let resultwto = result[1] ? result[1] : " ";
    return result[0] + "°" + resultwto + "′";
  } else {
    return "";
  }
}
const formatterMonitoringPointGrade = (val) => {
  let result = monitoring_point_grade.value.find((item) => item.value == val);
  if (result) {
    return result.label;
  } else {
    return "";
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
</script>
<style scoped>
.base-info-class {
  margin-top: 10px;
  font-size: 13px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.base-info-class li {
  padding: 7px 0;
}
.base-info-title {
  font-size: 15px;
  /* font-weight: bold; */
  /* color: #1abcb8; */
}
</style>