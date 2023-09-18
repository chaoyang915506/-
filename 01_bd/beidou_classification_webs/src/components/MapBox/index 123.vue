<template>
  <div id="map" ref="map"></div>
</template>

<script setup>
import proj4 from "proj4";
import { onMounted } from "@vue/runtime-core";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { XYZ ,WMTS} from "ol/source";
const { proxy } = getCurrentInstance();
import * as olTilegrid from "ol/tilegrid";
import { createXYZ } from "ol/tilegrid";
let targetView;
let targetMap;
let map_coverage;
// 定义海图坐标
// proj4.defs(
//   "EPSG:3395",
//   "+proj=merc +lon_0=0 +k=1 +x_0=1669 +y_0=3438 +datum=WGS84 +units=m +no_defs"
// );
onMounted(() => {
  initMap();
});
const initMap = async () => {
  map_coverage = new WMTS({
    preload: Infinity, // 预加载
    source: new XYZ({
      projection: "EPSG:3395",
      minZoom: 0,
      // url: `http://139.196.39.225:8081/service/rest/services/cf8cb8de21ad4acbad82699732eae3fc/wmts/tile/1.0.0/default/default028mm/12/1669/3438.png?token=5295504a3f1f4574889666d618bb5152`,
      url: `http://139.196.39.225:8081/service/rest/services/cf8cb8de21ad4acbad82699732eae3fc/wmts/tile/1.0.0/default/default028mm?{z}/{x}/{y}.png?token=5295504a3f1f4574889666d618bb5152`,
      // tileGrid: olTilegrid.createXYZ({
      //   extent: [
      //     -20037508.342789244, -20037508.342789244, 20037508.342789244,
      //     20037508.342789244,
      //   ],
      // }),
      // tileGrid: {
      // extent: [
      //   -20037508.342789244, -20037508.342789244, 20037508.342789244,
      //   20037508.342789244,
      // ],
      // },
    }),
    zIndex: -100,
  });
  // state.overlay = new Overlay({
  // 	element: proxy.$refs.popup, // 弹窗标签，在html里
  // 	positioning: "center-center",
  // 	autoPan: false, // 如果弹窗在底图边缘时，底图会移动
  // 	stopEvent: false,
  // });
  targetMap = new Map({
    target: proxy.$refs.map, // 指向对象
    layers: [map_coverage],
    // overlays: [state.overlay],
    view: new View({
      minZoom: 1,
      maxZoom: 18,
      center: [11278378, 4208063],
      zoom: 4,
    }),
  });
  // // 禁止双击地图放大
  // const dblClickInteraction = targetMap
  //   .getInteractions()
  //   .getArray()
  //   .find((interaction) => {
  //     return interaction instanceof DoubleClickZoom;
  //   });
  // targetMap.removeInteraction(dblClickInteraction);
  addLayerDataWMTS();
  targetMap.on("singleclick", (evt) => {
    console.log(evt.coordinate);
  });
};
// 添加wmts图层
const addLayerDataWMTS = () => {
  // if (map_coverage) targetMap.removeLayer(map_coverage);
  // 重置 中心点 放大倍数
  // targetMap.getView().setCenter([116.31830960512161, 39.991786032915115]);
  // targetMap.value.getView().setZoom(13);
  // http://139.196.39.225:8081/service/rest/services/cf8cb8de21ad4acbad82699732eae3fc/wmts/tile/1.0.0/default/default028mm/12/1669/3438.png?token=5295504a3f1f4574889666d618bb5152
  // targetMap.addLayer(map_coverage);
};
</script>

<style scoped lang='scss'>
#map {
  width: 100%;
  height: 60%;
}
</style>