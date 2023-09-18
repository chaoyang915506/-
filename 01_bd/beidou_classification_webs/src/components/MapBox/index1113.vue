<template>
  <div id="map" ref="map"></div>
</template>

<script setup>
import proj4 from "proj4";
import { onMounted } from "@vue/runtime-core";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import { XYZ, WMTS } from "ol/source";
const { proxy } = getCurrentInstance();
import * as olTilegrid from "ol/tilegrid";
import { createXYZ } from "ol/tilegrid";
import { getWidth, getTopLeft } from "ol/extent";
import { get as getProjection } from "ol/proj";
var projection = getProjection("EPSG:3857");
var projectionExtent = projection.getExtent();
var size = getWidth(projectionExtent) / 256;
let targetView;
let targetMap;
let map_coverage;
var resolutions = new Array(14);
var matrixIds = new Array(14);
for (var z = 0; z < 14; ++z) {
  // generate resolutions and matrixIds arrays for this WMTS
  resolutions[z] = size / Math.pow(2, z);
  matrixIds[z] = z;
}
onMounted(() => {
  initMap();
});
const initMap = async () => {
  // url: `http://139.196.39.225:8081/service/rest/services/cf8cb8de21ad4acbad82699732eae3fc/wmts/tile/1.0.0/default/default028mm/12/1669/3438.png?token=5295504a3f1f4574889666d618bb5152`,
  // url: `http://139.196.39.225:8081/service/rest/services/cf8cb8de21ad4acbad82699732eae3fc/wmts/tile/1.0.0/default/default028mm?{z}/{x}/{y}.png?token=5295504a3f1f4574889666d618bb5152`,
  // map_coverage = new TileLayer({
  //   preload: Infinity, // 预加载
  //   source: new OSM(),
  //   opacity: 0.7,
  // });
  map_coverage = new TileLayer({
    opacity: 0.7,
    source: new WMTS({
      attributions: "Tiles © ArcGIS",
      // url:
      //   "https://services.arcgisonline.com/arcgis/rest/" +
      //   "services/Demographics/USA_Population_Density/MapServer/WMTS/",
      // url: `http://139.196.39.225:8081/service/rest/services/cf8cb8de21ad4acbad82699732eae3fc/wmts/tile/1.0.0/default/default028mm/12/1669/3438.png?token=5295504a3f1f4574889666d618bb5152`,
      // http://114.242.203.139:7001/jdjbbz/
      // url: `http://139.196.39.225:8081/service/rest/services/cf8cb8de21ad4acbad82699732eae3fc/wmts/tile/1.0.0/default/default028mm/{z}/{x}/{y}.png?token=5295504a3f1f4574889666d618bb5152`,
      url: `http://114.242.203.139:7001/jdjbbz/{z}/{x}/{y}.png`,
      layer: "0",
      matrixSet: "EPSG:3857",
      format: "image/png",
      projection: projection,
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions: resolutions,
        matrixIds: matrixIds,
      }),
      style: "default",
      wrapX: true,
    }),
  });
  targetMap = new Map({
    target: proxy.$refs.map, // 指向对象
    layers: [map_coverage],
    view: new View({
      center: [-11158582, 4813697],
      zoom: 0,
    }),
  });
};
</script>

<style scoped lang='scss'>
#map {
  width: 100%;
  height: 60%;
}
</style>