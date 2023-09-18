<template>
  <chinaGeoCoordMap
    ref="mapcharts"
    :chartData="chartData"
    :geoCoordMap="geoCoordMap"
    :chinaDatas="chinaDatas"
    :currentMoniter="copseDialogMonitorId"
    :isCheckPath="isCheckPath"
    :isMapOrSiteMap="isMapOrSiteMap"
    @handleLineClick="handleLineClick"
    @handleFzCheckClick="handleFzCheckClick"
    style="width: 100%; height: 90vh"
  ></chinaGeoCoordMap>
  <infoWindowCheck
    @handleCloseDialog="handleCloseDialog"
    :infoWindowData="infoWindowData"
    :isShowInfoWindow="isShowInfoWindow"
  ></infoWindowCheck>
</template>
<script setup>
import chinaGeoCoordMap from "@/components/echarts/chinaGeoCoordMap.vue";
import infoWindowCheck from "./infoWindowCheck.vue";
import {
  getAllLines,
  selectMonitor,
} from "@/api/simulationOverview/Overview.js";

let props = defineProps({
  isMapOrSiteMap: {
    type: Boolean,
    default: true,
  },
  sendSearchValue: {
    type: String,
    default: "",
  },
  checkedLines: {
    type: Array,
    default: [],
  },
});
let emit = defineEmits([
  "handleIsShowLenged",
  "getAllLinesData",
  "getSelectLineData",
  "handleIsShowLenged",
]);
let chartData = ref([]);
let allLinesData = ref([]);
let infoWindowData = ref({});
let copseDialogMonitorId = ref({});
let isCheckPath = ref(false);
let isShowInfoWindow = ref(false);
onMounted(() => {
  getInitList();
});
watch(
  () => props.checkedLines,
  () => {
    console.log(props.checkedLines, "checkedLines");
    isCheckPath.value = false;
    let arr = [];
    if (props.checkedLines && props.checkedLines.length) {
      allLinesData.value.forEach((item) => {
        props.checkedLines.forEach((val) => {
          if (item.id == val) {
            arr.push(item);
          }
        });
      });
      filterLines(arr);
    } else {
      filterLines([]);
    }
  }
);
watch(
  () => props.sendSearchValue,
  (val) => {
    // console.log(val, "valll");
    if (val) {
      handleLineClick(val);
    } else if (val == "") {
      getInitList();
    } else {
      filterLines(allLinesData.value);
    }
  }
);
// 初始化地图数据
async function getInitList() {
  let res = await getAllLines();
  if (res.code == 200) {
    emit("handleIsShowLenged", false);
    console.log(res, "res");
    allLinesData.value = res.data;
    emit("getAllLinesData", res.data);
    filterLines(res.data);
  }
}
// 过滤初始化线路
function filterLines(data) {
  let arr = [];
  if (data && data.length) {
    data.forEach((item) => {
      item.path = [];
    });
    data.forEach((item) => {
      if (item.site && item.site.length) {
        item.site.forEach((val) => {
          item.path.push([val.lon, val.lat]);
        });
      }
    });
    console.log(data, 'datatta')
    data.forEach((item) => {
      if (item.path && item.path.length) {
        arr.push({
          lineEnd: item.lineEnd,
          lineName: item.lineName,
          name: item.lineStart,
          lineId: item.id,
          path: item.path,
          siteNameArr: item.site.map((i) => {
            let reg = /\r\n/g;
            return i.siteName.replace(reg, "");
          }),
        });
      }
    });
  }
  chartData.value = arr;
}
// 线路点击
async function handleLineClick(val) {
  emit("handleIsShowLenged", true);
  console.log(val, "val");
  let res = await selectMonitor({
    lineId: val && val.lineId ? val.lineId : undefined,
    monitoringPointName: val && !val.lineId ? val : "",
  });
  if (res.code == 200) {
    isCheckPath.value = true;
    // emit('getSelectLineData', val.lineId)
    let clickLineData = allLinesData.value.find(
      (item) => item.id == val.lineId
    );
    console.log(clickLineData, 'clickLineData')
    if (res.data && res.data.length) {
      res.data.forEach((item) => {
        item.name = item.monitoringPointName;
        item.lnglat = [item.lon, item.lat];
      });
      if (clickLineData) {
        res.data.unshift({
          lnglat: [clickLineData.path[0].lng, clickLineData.path[0].lat],
          name: clickLineData.lineStart,
        });
        res.data.push({
          lnglat: [clickLineData.path[clickLineData.path.length - 1].lng, clickLineData.path[clickLineData.path.length - 1].lat],
          name: clickLineData.lineEnd,
        });
      }
      // let stationlist = allLinesData.value.find((i) => i.id == val.lineId);
      chartData.value = [
        {
          points: res.data,
          trainstatilist: clickLineData.path,
          lineName: val.lineName,
          stationlist: clickLineData?.site
            ? clickLineData.site.map((i) => {
                return i.siteName.replace(/\r\n/, "");
              })
            : [],
        },
      ];
    } else {
      // let stationlist = allLinesData.value.find((i) => i.id == val.lineId);

      chartData.value = [
        {
          points: [],
          trainstatilist: clickLineData.path,
          lineName: val.lineName,
          stationlist: clickLineData?.site
            ? clickLineData.site.map((i) => {
                return i.siteName.replace(/\r\n/, "");
              })
            : [],
        },
      ];
    }
    // console.log(chartData.value, "arrrrrr");
  }
}
// 查看详情
function handleFzCheckClick(val) {
  infoWindowData.value = val;
  isShowInfoWindow.value = true;
}
// 关闭弹框
function handleCloseDialog(val) {
  copseDialogMonitorId.value = {
    monitorId: val,
  };
  isShowInfoWindow.value = false;
}
let mapcharts = ref(null);
const expcloseInfoWindow = () => {
  mapcharts.value.expcloseInfoWindow();
};
defineExpose({ getInitList, expcloseInfoWindow });
</script>
<style scoped>
</style>