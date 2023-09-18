<template>
    <div
        class="map-box"
        id="map"
        v-loading="loading"
        element-loading-text="Loading..."
        :element-loading-spinner="svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        element-loading-background="rgba(255, 255, 255, 0.5)"
    >
        <div class="my-class"></div>
        <el-tooltip
        class="box-item"
        effect="dark"
        content="批量选择船舶信息"
        placement="left"
      >
        <el-button id="drawLine" @click="drawLine()" icon="Share" circle></el-button>
      </el-tooltip>
        <el-tooltip
        class="box-item"
        effect="dark"
        content="清空框选路线"
        placement="left"
      >
        <el-button id="deleteLine" @click="deleteLine()" icon="Delete" circle></el-button>
      </el-tooltip>
    </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, provide, ref, watch } from '@vue/runtime-core'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { createApp } from 'vue'
import Thepopup from './popup.vue'
// const popupTemp = createApp(Thepopup)
import ElementPlus, { CommonProps } from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import { useStore } from 'vuex'
import * as turf from '@turf/turf'
import { 查询轨迹, 查询载体卡详情 } from '@/api/mapbox/index.js'
const { proxy } = getCurrentInstance()
// import StaticMode from '@mapbox/mapbox-gl-draw-static-mode';
const { carrier_type } = proxy.useDict('carrier_type')
const store = useStore()
var haitu = {
    version: 8,
    name: '黄骅_全国框架影像',
    metadata: {
        'mapbox:autocomposite': true,
        'mapbox:type': 'default',
        'maputnik:renderer': 'mbgljs',
    },
    center: [105.81, 35.1],
    zoom: 4.4,
    bearing: 0,
    pitch: 0,
    sources: {
        huanghua: {
            type: 'vector',
            tiles: ['http://114.255.136.222:8800/data/huanghua_china/{z}/{x}/{y}.pbf'],
            minZoom: 0,
            maxZoom: 24,
        },
        chart: {
            type: 'raster',
            tiles: ['http://www.yimasoftdemo.cc:800/mapimg/{z}/{y}/{x}.png'],
            minzoom: 0,
            maxzoom: 19,
        },
    },
    sprite: 'http://114.255.136.222:9200/styles/beijing_blue/sprite',
    glyphs: 'http://114.255.136.222:9200/fonts/{fontstack}/{range}.pbf',
    layers: [
        {
            id: 'background',
            type: 'background',
            paint: {
                'background-color': 'rgba(9, 26, 56, 1)',
            },
        },
        {
            id: 'chart',
            type: 'raster',
            source: 'chart',
            layout: {
                visibility: 'visible',
            },
        },
        {
            id: 'china_R',
            type: 'fill',
            source: 'huanghua',
            'source-layer': 'boundary_china_R',
            minzoom: 0,
            maxzoom: 3,
            layout: {
                visibility: 'none',
            },
            paint: {
                'fill-color': 'rgba(8, 26, 55, 1)',
            },
        },
        {
            id: 'china_taiwan_R',
            type: 'fill',
            source: 'huanghua',
            'source-layer': 'china_taiwan_county_R',
            minzoom: 5,
            maxzoom: 24,
            layout: {
                visibility: 'none',
            },
            paint: {
                'fill-color': 'rgba(10, 25, 54, 1)',
                'fill-outline-color': 'rgba(21, 47, 97, 0)',
            },
        },
        {
            id: 'china_province_R',
            type: 'fill',
            source: 'huanghua',
            'source-layer': 'china_boundary_province_R',
            minzoom: 3,
            maxzoom: 6,
            layout: {
                visibility: 'none',
            },
            paint: {
                'fill-color': 'rgba(9, 26, 56, 1)',
                'fill-outline-color': 'rgba(24, 71, 152, 1)',
            },
        },
        {
            id: 'china_city_R',
            type: 'fill',
            source: 'huanghua',
            'source-layer': 'china_boundary_city_R',
            minzoom: 6,
            maxzoom: 14,
            layout: {
                visibility: 'none',
            },
            paint: {
                'fill-color': 'rgba(8, 23, 52, 1)',
                'fill-outline-color': 'rgba(21, 62, 134, 1)',
            },
        },
        {
            id: 'china_water_R_1',
            type: 'fill',
            source: 'huanghua',
            'source-layer': 'china_water_R_1',
            minzoom: 2,
            maxzoom: 9,
            layout: {
                visibility: 'none',
            },
            paint: {
                'fill-color': 'rgba(4, 64, 98, 1)',
                'fill-outline-color': 'rgba(4, 64, 98, 1)',
            },
        },
        {
            id: 'china_province_L_2',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'china_boundary_province_L_2',
            minzoom: 6,
            maxzoom: 14,
            layout: {
                visibility: 'none',
            },
            paint: {
                'line-color': 'rgba(24, 71, 152, 1)',
                'line-width': 0.6,
            },
        },
        {
            id: 'china_L',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'boundary_china_L',
            minzoom: 0,
            maxzoom: 8,
            layout: {
                visibility: 'none',
            },
            paint: {
                'line-color': 'rgba(23, 97, 165, 1)',
                'line-width': 5,
            },
        },
        {
            id: 'china_road_kuaisu-3',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'china_road_kuaisu_CL',
            minzoom: 4,
            maxzoom: 10,
            layout: {
                visibility: 'none',
            },
            paint: {
                'line-color': 'rgba(14, 41, 90, 1)',
                'line-width': 0.8,
            },
        },
        {
            id: 'china_road_kuaisu-9',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'china_road_kuaisu_CL',
            minzoom: 9,
            maxzoom: 10,
            layout: {
                visibility: 'none',
            },
            paint: {
                'line-color': 'rgba(14, 41, 90, 1)',
                'line-width': 2,
            },
        },
        {
            id: 'china_road_gaosu-3',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'china_road_gaosu_CL',
            minzoom: 4,
            maxzoom: 10,
            layout: {
                visibility: 'none',
            },
            paint: {
                'line-color': 'rgba(14, 41, 90, 1)',
                'line-width': 0.8,
            },
        },
        {
            id: 'china_road_gaosu-9',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'china_road_gaosu_CL',
            minzoom: 9,
            maxzoom: 10,
            layout: {
                visibility: 'none',
            },
            paint: {
                'line-color': 'rgba(14, 41, 90, 1)',
                'line-width': 2,
            },
        },
        {
            id: 'china_poi_province',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'china_poi_province_center',
            minzoom: 3,
            maxzoom: 4,
            layout: {
                'text-field': '{NAME}',
                'text-size': 15,
                'icon-size': 0.1,
                visibility: 'visible',
            },
            paint: {
                'icon-color': 'rgba(247, 243, 243, 1)',
                'text-color': 'rgba(255, 255, 255, 1)',
                'text-halo-color': 'rgba(0, 0, 0, 1)',
                'text-halo-width': 1,
            },
        },
        {
            id: 'china_poi_省会',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'china_poi_province_capital',
            minzoom: 4,
            maxzoom: 6,
            filter: ['none'],
            layout: {
                'text-field': '{NAME}',
                visibility: 'none',
                'icon-image': 'circle-12',
                'text-anchor': 'bottom-left',
                'symbol-spacing': 100,
                'symbol-avoid-edges': false,
                'icon-allow-overlap': false,
                'icon-optional': false,
                'text-offset': [0.5, 0.5],
                'text-size': 15,
            },
            paint: {
                'text-color': 'rgba(255, 255, 255, 1)',
                'text-halo-color': 'rgba(0, 0, 0, 1)',
                'text-halo-width': 1,
            },
        },
        {
            id: 'china_poi_beijing',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'poi_beijing',
            minzoom: 3,
            maxzoom: 9,
            layout: {
                'text-field': '{NAME}',
                visibility: 'none',
                'icon-image': 'star-12',
                'text-anchor': 'bottom-left',
                'text-offset': [0.5, 0.5],
                'text-size': 16,
                'icon-rotation-alignment': 'auto',
            },
            paint: {
                'text-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-color': 'rgba(255, 255, 255, 0)',
                'text-halo-color': 'rgba(0, 0, 0, 1)',
                'icon-color': 'rgba(245, 5, 5, 1)',
                'icon-opacity': 1,
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
        {
            id: 'china_poi_city',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'china_poi_city',
            minzoom: 6,
            maxzoom: 8,
            layout: {
                'text-field': '{NAME}',
                visibility: 'none',
                'icon-image': 'circle-12',
                'text-anchor': 'bottom-left',
                'text-size': 14,
                'text-offset': [0.5, 0.5],
            },
            paint: {
                'text-color': 'rgba(255, 254, 254, 1)',
                'text-halo-color': 'rgba(0, 0, 0, 1)',
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_city_R',
            type: 'fill',
            source: 'huanghua',
            'source-layer': 'huanghua_city_R',
            minzoom: 10,
            maxzoom: 16,
            layout: {
                visibility: 'none',
            },
            paint: {
                'fill-color': 'rgba(8, 23, 52, 1)',
                'fill-outline-color': 'rgba(21, 62, 134, 1)',
            },
        },
        {
            id: 'huanghua_vegetation_R',
            type: 'fill',
            source: 'huanghua',
            'source-layer': 'huanghua_vegetation_R',
            minzoom: 10,
            maxzoom: 24,
            layout: {
                visibility: 'none',
            },
            paint: {
                'fill-color': 'rgba(7, 56, 72, 1)',
            },
        },
        {
            id: 'huanghua_water_R',
            type: 'fill',
            source: 'huanghua',
            'source-layer': 'huanghua_water_R',
            minzoom: 10,
            maxzoom: 24,
            layout: {
                visibility: 'none',
            },
            paint: {
                'fill-color': 'rgba(4, 64, 98, 1)',
                'fill-outline-color': 'rgba(4, 64, 98, 1)',
            },
        },
        {
            id: 'huanghua_city_L',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'huanghua_city_R',
            minzoom: 10,
            maxzoom: 24,
            layout: {
                visibility: 'none',
            },
            paint: {
                'line-color': 'rgba(24, 71, 152, 1)',
                'line-width': 1,
            },
        },
        {
            id: 'sz_road_L_1-10',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'huanghua_road_L_1',
            minzoom: 10,
            maxzoom: 11,
            layout: {
                visibility: 'none',
            },
            paint: {
                'line-color': 'rgba(14, 41, 90, 1)',
                'line-width': 2,
            },
        },
        {
            id: 'sz_road_L_1-11',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'huanghua_road_L_1',
            minzoom: 11,
            maxzoom: 14,
            layout: {
                visibility: 'none',
            },
            paint: {
                'line-color': 'rgba(14, 41, 90, 1)',
                'line-width': 3,
            },
        },
        {
            id: 'sz_road_L_1-14',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'huanghua_road_L_1',
            minzoom: 14,
            maxzoom: 24,
            layout: {
                visibility: 'none',
            },
            paint: {
                'line-color': 'rgba(14, 41, 90, 1)',
                'line-width': 5,
            },
        },
        {
            id: 'china_coastline',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'china_coastline',
            minzoom: 0,
            maxzoom: 24,
            layout: {
                visibility: 'visible',
            },
            paint: {
                'line-color': 'rgba(40, 125, 204, 1)',
                'line-width': 2,
            },
        },
        {
            id: 'huanghua_road2-14',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'huanghua_road_L_2',
            minzoom: 14,
            maxzoom: 24,
            layout: {
                visibility: 'none',
            },
            paint: {
                'line-color': 'rgba(14, 112, 177, 1)',
                'line-width': 4,
            },
        },
        {
            id: 'huanghua_road2_13',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'huanghua_road_L_2',
            minzoom: 13,
            maxzoom: 14,
            layout: {
                visibility: 'none',
            },
            paint: {
                'line-color': 'rgba(14, 112, 177, 1)',
                'line-width': 2,
            },
        },
        {
            id: 'huanghua_road2_11',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'huanghua_road_L_2',
            minzoom: 11,
            maxzoom: 13,
            layout: {
                visibility: 'none',
            },
            paint: {
                'line-color': 'rgba(14, 112, 177, 1)',
                'line-width': 1,
            },
        },
        {
            id: 'huanghua_road2-10',
            type: 'line',
            source: 'huanghua',
            'source-layer': 'huanghua_road_L_2',
            minzoom: 10,
            maxzoom: 11,
            layout: {
                visibility: 'none',
            },
            paint: {
                'line-color': 'rgba(14, 112, 177, 1)',
                'line-width': 1,
            },
        },
        {
            id: 'sz_road_label_L_2',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_road_label_L_2',
            minzoom: 14,
            maxzoom: 24,
            layout: {
                visibility: 'visible',
                'text-field': '{PathName}',
                'text-size': 14,
                'symbol-placement': 'line',
            },
            paint: {
                'icon-color': 'rgba(247, 243, 243, 1)',
                'text-color': 'rgba(236, 240, 247, 1)',
                'text-halo-color': 'rgba(2, 36, 62, 1)',
                'text-halo-width': 2,
            },
        },
        {
            id: 'sz_road_label_L_1',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_road_label_L_1',
            minzoom: 10,
            maxzoom: 24,
            layout: {
                visibility: 'visible',
                'text-field': '{PathName}',
                'text-size': 14,
                'symbol-placement': 'line',
            },
            paint: {
                'icon-color': 'rgba(247, 243, 243, 1)',
                'text-color': 'rgba(236, 240, 247, 1)',
                'text-halo-color': 'rgba(2, 36, 62, 1)',
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_building_R-13',
            type: 'fill-extrusion',
            source: 'huanghua',
            'source-layer': 'huanghua_building_R',
            minzoom: 11,
            maxzoom: 13,
            layout: {
                visibility: 'none',
            },
            paint: {
                'fill-extrusion-color': 'rgba(9, 30, 60, 0.73)',
                'fill-extrusion-height': 0,
            },
        },
        {
            id: 'huanghua_building_R-14',
            type: 'fill-extrusion',
            source: 'huanghua',
            'source-layer': 'huanghua_building_R',
            minzoom: 13,
            maxzoom: 24,
            layout: {
                visibility: 'none',
            },
            paint: {
                'fill-extrusion-color': 'rgba(9, 30, 60, 0.73)',
                'fill-extrusion-height': {
                    property: 'HEIGHT',
                    stops: [
                        [0, 0],
                        [24, 100],
                    ],
                },
            },
        },
        {
            id: 'huanghua_poi_town',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_poi_town',
            minzoom: 12,
            maxzoom: 24,
            layout: {
                'text-field': '{name}',
                'text-size': 11,
                'text-justify': 'left',
                'text-anchor': 'left',
                'icon-image': 'circle-12',
                visibility: 'visible',
                'text-transform': 'lowercase',
                'text-offset': [0.5, 0],
            },
            paint: {
                'text-halo-color': 'rgba(0, 32, 66, 1)',
                'text-color': 'rgba(236, 242, 251, 1)',
                'icon-color': 'rgba(255, 255, 255, 1)',
                'icon-opacity': 1,
                'icon-halo-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_poi_landmark1',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_poi_landmark1',
            minzoom: 12,
            maxzoom: 24,
            layout: {
                'text-field': '{name}',
                'text-size': 11,
                'text-justify': 'left',
                'text-anchor': 'left',
                'icon-image': 'circle-12',
                visibility: 'visible',
                'text-transform': 'lowercase',
                'text-offset': [0.5, 0],
            },
            paint: {
                'text-halo-color': 'rgba(0, 32, 66, 1)',
                'text-color': 'rgba(236, 242, 251, 1)',
                'icon-color': 'rgba(255, 255, 255, 1)',
                'icon-opacity': 1,
                'icon-halo-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_poi_gas_station',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_poi_gas_station',
            minzoom: 13,
            maxzoom: 24,
            layout: {
                'text-field': '{name}',
                'text-size': 12,
                'icon-image': 'circle-12',
                'text-justify': 'left',
                'text-anchor': 'left',
                'text-allow-overlap': false,
                'text-keep-upright': true,
                'text-optional': false,
                visibility: 'visible',
                'text-transform': 'lowercase',
                'text-offset': [0.5, 0],
            },
            paint: {
                'text-halo-color': 'rgba(0, 32, 66, 1)',
                'text-color': 'rgba(236, 242, 251, 1)',
                'icon-color': 'rgba(255, 255, 255, 1)',
                'icon-opacity': 1,
                'icon-halo-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_poi_transport_service',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_poi_transport_service',
            minzoom: 13,
            maxzoom: 24,
            layout: {
                'text-field': '{name}',
                'text-size': 12,
                'icon-image': 'circle-12',
                'text-justify': 'left',
                'text-anchor': 'left',
                'text-allow-overlap': false,
                'text-keep-upright': true,
                'text-optional': false,
                visibility: 'visible',
                'text-transform': 'lowercase',
                'text-offset': [0.5, 0],
            },
            paint: {
                'text-halo-color': 'rgba(0, 32, 66, 1)',
                'text-color': 'rgba(236, 242, 251, 1)',
                'icon-color': 'rgba(255, 255, 255, 1)',
                'icon-opacity': 1,
                'icon-halo-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_poi_public_service',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_poi_public_service',
            minzoom: 13,
            maxzoom: 24,
            layout: {
                'text-field': '{name}',
                'text-size': 12,
                'icon-image': 'circle-12',
                'text-justify': 'left',
                'text-anchor': 'left',
                'text-allow-overlap': false,
                'text-keep-upright': true,
                'text-optional': false,
                visibility: 'visible',
                'text-transform': 'lowercase',
                'text-offset': [0.5, 0],
            },
            paint: {
                'text-halo-color': 'rgba(0, 32, 66, 1)',
                'text-color': 'rgba(236, 242, 251, 1)',
                'icon-color': 'rgba(255, 255, 255, 1)',
                'icon-opacity': 1,
                'icon-halo-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_poi_medical_service',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_poi_medical_service',
            minzoom: 13,
            maxzoom: 24,
            layout: {
                'text-field': '{name}',
                'text-size': 12,
                'icon-image': 'circle-12',
                'text-justify': 'left',
                'text-anchor': 'left',
                'text-allow-overlap': false,
                'text-keep-upright': true,
                'text-optional': false,
                visibility: 'visible',
                'text-transform': 'lowercase',
                'text-offset': [0.5, 0],
            },
            paint: {
                'text-halo-color': 'rgba(0, 32, 66, 1)',
                'text-color': 'rgba(236, 242, 251, 1)',
                'icon-color': 'rgba(255, 255, 255, 1)',
                'icon-opacity': 1,
                'icon-halo-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_poi_hardware',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_poi_hardware',
            minzoom: 13,
            maxzoom: 24,
            layout: {
                'text-field': '{name}',
                'text-size': 12,
                'icon-image': 'circle-12',
                'text-justify': 'left',
                'text-anchor': 'left',
                'text-allow-overlap': false,
                'text-keep-upright': true,
                'text-optional': false,
                visibility: 'visible',
                'text-transform': 'lowercase',
                'text-offset': [0.5, 0],
            },
            paint: {
                'text-halo-color': 'rgba(0, 32, 66, 1)',
                'text-color': 'rgba(236, 242, 251, 1)',
                'icon-color': 'rgba(255, 255, 255, 1)',
                'icon-opacity': 1,
                'icon-halo-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_poi_government',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_poi_government',
            minzoom: 13,
            maxzoom: 24,
            layout: {
                'text-field': '{name}',
                'text-size': 12,
                'icon-image': 'circle-12',
                'text-justify': 'left',
                'text-anchor': 'left',
                'text-allow-overlap': false,
                'text-keep-upright': true,
                'text-optional': false,
                visibility: 'visible',
                'text-transform': 'lowercase',
                'text-offset': [0.5, 0],
            },
            paint: {
                'text-halo-color': 'rgba(0, 32, 66, 1)',
                'text-color': 'rgba(236, 242, 251, 1)',
                'icon-color': 'rgba(255, 255, 255, 1)',
                'icon-opacity': 1,
                'icon-halo-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_poi_vehicle',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_poi_vehicle',
            minzoom: 13,
            maxzoom: 24,
            layout: {
                'text-field': '{name}',
                'text-size': 12,
                'icon-image': 'circle-12',
                'text-justify': 'left',
                'text-anchor': 'left',
                'text-allow-overlap': false,
                'text-keep-upright': true,
                'text-optional': false,
                visibility: 'visible',
                'text-transform': 'lowercase',
                'text-offset': [0.5, 0],
            },
            paint: {
                'text-halo-color': 'rgba(0, 32, 66, 1)',
                'text-color': 'rgba(236, 242, 251, 1)',
                'icon-color': 'rgba(255, 255, 255, 1)',
                'icon-opacity': 1,
                'icon-halo-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_poi_traffic_facilities',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_poi_traffic_facilities',
            minzoom: 13,
            maxzoom: 24,
            layout: {
                'text-field': '{name}',
                'text-size': 12,
                'icon-image': 'circle-12',
                'text-justify': 'left',
                'text-anchor': 'left',
                'text-allow-overlap': false,
                'text-keep-upright': true,
                'text-optional': false,
                visibility: 'visible',
                'text-transform': 'lowercase',
                'text-offset': [0.5, 0],
            },
            paint: {
                'text-halo-color': 'rgba(0, 32, 66, 1)',
                'text-color': 'rgba(236, 242, 251, 1)',
                'icon-color': 'rgba(255, 255, 255, 1)',
                'icon-opacity': 1,
                'icon-halo-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_two_tower',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_two_tower',
            minzoom: 10,
            maxzoom: 24,
            layout: {
                'text-field': '{name}',
                'text-size': 12,
                'icon-image': 'circle-12',
                'text-justify': 'left',
                'text-anchor': 'left',
                'text-allow-overlap': false,
                'text-keep-upright': true,
                'text-optional': false,
                visibility: 'visible',
                'text-transform': 'lowercase',
                'text-offset': [0.5, 0],
            },
            paint: {
                'text-halo-color': 'rgba(0, 32, 66, 1)',
                'text-color': 'rgba(236, 242, 251, 1)',
                'icon-color': 'rgba(255, 255, 255, 1)',
                'icon-opacity': 1,
                'icon-halo-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_three_rader_tower',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_three_rader_tower',
            minzoom: 10,
            maxzoom: 24,
            layout: {
                'text-field': '{name}',
                'text-size': 12,
                'icon-image': 'circle-12',
                'text-justify': 'left',
                'text-anchor': 'left',
                'text-allow-overlap': false,
                'text-keep-upright': true,
                'text-optional': false,
                visibility: 'visible',
                'text-transform': 'lowercase',
                'text-offset': [0.5, 0],
            },
            paint: {
                'text-halo-color': 'rgba(0, 32, 66, 1)',
                'text-color': 'rgba(236, 242, 251, 1)',
                'icon-color': 'rgba(255, 255, 255, 1)',
                'icon-opacity': 1,
                'icon-halo-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_one_rod',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_one_rod',
            minzoom: 10,
            maxzoom: 24,
            layout: {
                'text-field': '{name}',
                'text-size': 12,
                'icon-image': 'circle-12',
                'text-justify': 'left',
                'text-anchor': 'left',
                'text-allow-overlap': false,
                'text-keep-upright': true,
                'text-optional': false,
                visibility: 'visible',
                'text-transform': 'lowercase',
                'text-offset': [0.5, 0],
            },
            paint: {
                'text-halo-color': 'rgba(0, 32, 66, 1)',
                'text-color': 'rgba(236, 242, 251, 1)',
                'icon-color': 'rgba(255, 255, 255, 1)',
                'icon-opacity': 1,
                'icon-halo-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
        {
            id: 'huanghua_four_tower_crane',
            type: 'symbol',
            source: 'huanghua',
            'source-layer': 'huanghua_four_tower_crane',
            minzoom: 10,
            maxzoom: 24,
            layout: {
                'text-field': '{name}',
                'text-size': 12,
                'icon-image': 'circle-12',
                'text-justify': 'left',
                'text-anchor': 'left',
                'text-allow-overlap': false,
                'text-keep-upright': true,
                'text-optional': false,
                visibility: 'visible',
                'text-transform': 'lowercase',
                'text-offset': [0.5, 0],
            },
            paint: {
                'text-halo-color': 'rgba(0, 32, 66, 1)',
                'text-color': 'rgba(236, 242, 251, 1)',
                'icon-color': 'rgba(255, 255, 255, 1)',
                'icon-opacity': 1,
                'icon-halo-color': 'rgba(255, 255, 255, 1)',
                'icon-halo-width': 1,
                'text-halo-width': 1,
            },
        },
    ],
    id: 'shenzhen_huanghua',
    owner: '',
}
let carrierLines = []
let popup = null
let map
let Draw
let sourceId = 'circle'
let mapSourceList = ref([])
let loading = ref(true)
let clickFeatures = null
let selectionFeatures = [] //框选得到的载体信息
const props = defineProps({
    mapData: Array,
    isToUpdate: Boolean,
    showSource: Object,
})
const emits = defineEmits(['editShowSource'])
import { LatlngCnvTool } from '@/utils/latlngCnvTool.js'
const images = ref('http://localhost/src/assets/images/wavesBg.png')
onMounted(() => {
    initMap()
})
watch(
    () => props.showSource,
    (val) => {
        if (val.lon) {
            map.setCenter([val.lon, val.lat])
            let latlng = LatlngCnvTool([val.lat + '', val.lon + ''])
            val.lat = latlng[0]
            val.lon = latlng[1]
            let popupTemp = createApp(Thepopup)
            popupTemp.use(ElementPlus, { locale: locale })
            popupTemp.use(store)
            popup
                .setLngLat([Number(val.lon), Number(val.lat)])
                .setHTML(`<div id='popupContent'> </div> `)
                .addTo(map)
            popupTemp.mount('#popupContent')
            popupTemp.popupMassage = val
        }
    }
)
watch(
    () => props.isToUpdate,
    (val) => {
        setTimeout(() => {
            addMapSource()
            loading.value = false
            proxy.$modal.msgSuccess('实时点位已更新')
        }, 1000)
    }
)
watch(
    () => props.mapData,
    (val) => {
        setTimeout(() => {
            mapSourceList.value = val
            removeMapSource()
            addMapSource()
            loading.value = false
        }, 1000)
    }
)
watch(
    () => store.state.mapbox.timer,
    (val) => {
        // --点击触发--
        if (!selectionFeatures.length) {
            let params = {
                startTime: val[0],
                endTime: val[1],
                id: [clickFeatures[0].properties.id],
            }
            // 清除之前绘制的路线
            if (
                map.getStyle().layers.filter((item) => {
                    return item.id === 'sourceLineId'
                }).length
            ) {
                removeMapLineSource()
            }
            // 绘制新路线
            查询轨迹(params).then((res) => {
                if (res.code !== 200) return proxy.$modal.msgWarning('获取路线失败！')
                if (res.code == 200 && !res.rows.length) return proxy.$modal.msgWarning('暂时无法获取详细路线！')
                if (res.code == 200 && res.rows.length) {
                    // 移除弹窗
                    carrierLines = res.rows
                    popup.remove()
                    addLineMap()
                }
            })
        }
        // --框选--
        if (selectionFeatures.length) {
            let carrierIds = selectionFeatures.map((item) => {
                return item.properties.id
            })
            let params = {
                startTime: val[0],
                endTime: val[1],
                id: carrierIds,
            }
            //     let 测试params = {
            //     "endTime": "2022-12-08 00:00:00",
            //     "id": [815,814],
            //     "startTime": "2022-12-07 00:00:00"
            // }
            // 清除之前绘制的路线
            if (
                map.getStyle().layers.filter((item) => {
                    return item.id === 'sourceLineId'
                }).length
            ) {
                removeMapLineSource()
            }
            // 绘制新路线
            查询轨迹(params).then((res) => {
                popup.remove()
                Draw.deleteAll()
                if (res.code !== 200) return proxy.$modal.msgWarning('获取路线失败！')
                if (res.code == 200 && !res.rows.length) return proxy.$modal.msgWarning('暂时无法获取详细路线！')
                if (res.code == 200 && res.rows.length) {
                    carrierLines = res.rows
                    addLineMap()
                }
            })
        }
        // 获取框选载体id
    }
)
function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA'
    map = new mapboxgl.Map({
        container: 'map',
        // maxZoom: 10,
        // minZoom: 4,
        // style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 10,
        center: [121.944027, 30.776832],
        // style: haitu,
    })
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    Draw = new MapboxDraw({ displayControlsDefault: false, touchEnabled: false, keybindings: false })
    map.addControl(Draw) //添加绘制控件
    popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
    })
    popup.on('close', () => {
        clickFeatures = null
    })
    map.on('load', function () {
        // 点击事件
        map.on('click', function (e) {
            clickMapSource(e)
        })
        getIcon()
        map.addLayer(
            {
                id: 'tilelayer1',
                type: 'raster',
                source: {
                    type: 'raster',
                    tiles: [
                        'http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=134e6b671b2b1f64c383628fbe12b4d1',
                    ],
                    tileSize: 256,
                },
                paint: {},
                layout: {},
            },
            'sourceLayer'
        )
        map.addLayer(
            {
                id: 'tilelayer',
                type: 'raster',
                source: {
                    type: 'raster',
                    // tiles: ["http://114.242.203.139:7001/htjbbz/{z}/{y}/{x}.png"],
                    tiles: [
                        'http://139.196.39.225:8081/service/rest/services/cf8cb8de21ad4acbad82699732eae3fc/wmts/tile/1.0.0/default/default028mm/{z}/{y}/{x}.png?token=5295504a3f1f4574889666d618bb5152',
                    ],
                    // tiles: ['http://139.196.39.225:8081/service/rest/services/cf8cb8de21ad4acbad82699732eae3fc/wmts/tile/1.0.0/default/default028mm/{z}/{y}/{x}.png?token=5295504a3f1f4574889666d618bb5152'],
                    tileSize: 256,
                },
                paint: {},
                layout: {},
            },
            'sourceLayer'
        )
    })
}
// 新增数据源
const addMapSource = () => {
    let featuresArry = []
    if (mapSourceList.value.length) {
        mapSourceList.value.forEach((item, index) => {
            let latlng = LatlngCnvTool([item.lat + '', item.lon + ''])
            var date = new Date(item.sendTime)
            let date_value =
                date.getFullYear() +
                '-' +
                (date.getMonth() + 1) +
                '-' +
                date.getDate() +
                ' ' +
                checkTime(date.getHours()) +
                ':' +
                checkTime(date.getMinutes()) +
                ':' +
                checkTime(date.getSeconds())
            featuresArry.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [item.lon, item.lat], // 图片位置
                },
                properties: {
                    id: item.id,
                    carrierName: item.carrierName, //载体名称
                    carrierType: item.carrierType, //载体类型
                    // carrierSerial: item.carrierSerial, //载体序列号
                    // activeArea: item.activeArea, //活动区域
                    // terminalCount: item.terminalCount, //搭载终端数量
                    // terminalType: item.terminalType, //搭载终端类型
                    lon: latlng[1], //经度
                    lat: latlng[0], //纬度
                    LON: item.lon, //经度
                    LAT: item.lat, //纬度
                    // deptName: item.deptName, //单位名称
                    // bdsNumber: item.bdsNumber ? item.bdsNumber : '暂无', //北斗卡号
                    // batterVoltage: item.batterVoltage, //蓄电池电压
                    // batteryLoadVoltage: item.batteryLoadVoltage, //负载电压
                    // temperature: item.temperature, //环境温度
                    // sunCurrent: item.sunCurrent, //太阳能充电电流
                    // loadCurrent: item.loadCurrent, //负载电流
                    // light: item.light, //灯光亮度设置值
                    // sendTime: date_value, //上报时间
                    bdsVersion: item.bdsVersion ? item.bdsVersion : '暂无', //北斗版本
                    iconType: item.carrierType === '1' ? 'cb' : 'hb',
                    // iconType:
                    //     item.batterVoltage !== '' && item.batteryLoadVoltage !== '' && item.temperature !== '' && item.sunCurrent !== '' && item.loadCurrent !== '' && item.light !== '' && item.date_value !== ''
                    //         ? item.bdsVersion === '北斗二号'
                    //             ? 'bd2Type'
                    //             : 'bd3Type'
                    //         : item.bdsVersion === '北斗二号'
                    //         ? 'bd2'
                    //         : 'bd3',
                },
            })
        })
        map.addSource(sourceId, {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: featuresArry,
            },
        })
        map.addLayer({
            id: 'sourceLayer',
            type: 'symbol',
            source: sourceId,
            layout: {
                'icon-image': ['get', 'iconType'],
            },
        })
    }
}
// 数据源点击事件
const clickMapSource = (e) => {
    store.commit('SET_ISSHOWSELECTTIMER', false)
    emits('editShowSource')
    var bbox = [
        [e.point.x, e.point.y],
        [e.point.x, e.point.y],
    ]
    clickFeatures = map.queryRenderedFeatures(bbox, {
        layers: ['sourceLayer'],
    })
    // 再次请求 clickFeatures[0].properties.id  545
    if (clickFeatures.length) {
        查询载体卡详情(clickFeatures[0].properties.id).then((res) => {
            if (res.code === 200 && res.rows.length === 1) {
                clickFeatures[0].properties.deptName = res.rows[0].deptName
                clickFeatures[0].properties.carrierName = res.rows[0].carrierName
                clickFeatures[0].properties.bdsNumber = res.rows[0].bdsNumber
                clickFeatures[0].properties.batterVoltage = res.rows[0].batterVoltage
                clickFeatures[0].properties.batteryLoadVoltage = res.rows[0].batteryLoadVoltage
                clickFeatures[0].properties.sunCurrent = res.rows[0].sunCurrent
                clickFeatures[0].properties.light = res.rows[0].light
                clickFeatures[0].properties.loadCurrent = res.rows[0].loadCurrent
                clickFeatures[0].properties.temperature = res.rows[0].temperature
                clickFeatures[0].properties.sendTime = res.rows[0].sendTime
                clickFeatures[0].properties.bdsVersion = res.rows[0].bdsVersion
                clickFeatures[0].properties.single = false
                clickFeatures[0].properties.carrierType = res.rows[0].carrierType
                clickFeatures[0].properties.bdsCardState = res.rows[0].bdsCardState
            }
            // // 载体有多个终端情况
            // if(res.code === 200 && res.rows.length > 1){
            //     clickFeatures[0].properties.carrierArr =  res.rows
            //    clickFeatures[0].properties.single =  true
            // }
            setTimeout(() => {
                if (clickFeatures.length) {
                    let popupTemp = createApp(Thepopup)
                    popupTemp.use(ElementPlus, { locale: locale })
                    popupTemp.use(store)
                    popup
                        .setLngLat([Number(e.lngLat.lng), Number(e.lngLat.lat)])
                        .setHTML(`<div id='popupContent'> </div> `)
                        .addTo(map)
                    popupTemp.mount('#popupContent')
                    popupTemp.popupMassage = clickFeatures[0].properties
                }
            }, 100)
        })
    }
}
const removeMapSource = () => {
    map.removeLayer('sourceLayer')
    map.removeSource(sourceId)
}
// 添加图标样式
const getIcon = () => {
    // 版本为北斗三的图表（有航标信息）
    const bd3Type = new Image()
    bd3Type.src = new URL('./../../assets/logo/bd3-type.png', import.meta.url).href
    bd3Type.onload = () => {
        map.addImage('bd3Type', bd3Type)
    }
    // 版本为北斗三的图表（无航标信息）
    const bd3 = new Image()
    bd3.src = new URL('./../../assets/logo/bd3.png', import.meta.url).href
    bd3.onload = () => {
        map.addImage('bd3', bd3)
    }
    // 版本为北斗二的图表（有航标信息）
    const bd2Type = new Image()
    bd2Type.src = new URL('./../../assets/logo/bd2-type.png', import.meta.url).href
    bd2Type.onload = () => {
        map.addImage('bd2Type', bd2Type)
    }
    // 版本为北斗二的图表（无航标信息）
    const bd2 = new Image()
    bd2.src = new URL('./../../assets/logo/bd2.png', import.meta.url).href
    bd2.onload = () => {
        map.addImage('bd2', bd2)
    }
    // 起点
    const start = new Image()
    start.src = new URL('./../../assets/logo/start.png', import.meta.url).href
    start.onload = () => {
        map.addImage('start', start)
    }
    // 终点
    const end = new Image()
    end.src = new URL('./../../assets/logo/end.png', import.meta.url).href
    end.onload = () => {
        map.addImage('end', end)
    }
    // 船舶
    const cb = new Image()
    cb.src = new URL('./../../assets/logo/cb.png', import.meta.url).href
    cb.onload = () => {
        map.addImage('cb', cb)
    }
    // 航标
    const hb = new Image()
    hb.src = new URL('./../../assets/logo/hb.png', import.meta.url).href
    hb.onload = () => {
        map.addImage('hb', hb)
    }
}
function checkTime(i) {
    if (i < 10) {
        i = '0' + i
    }
    return i
}
let lineStartArr = []
let lineEndArr = []
// 路线绘制
const addLineMap = () => {
    lineStartArr = []
    lineEndArr = []
    let featuresLineArry = []
    carrierLines.forEach((line, item) => {
        featuresLineArry.push([])
        lineStartArr.push([line[0].lon, line[0].lat])
        lineEndArr.push([line[line.length - 1].lon, line[line.length - 1].lat])
        line.forEach((xy) => {
            featuresLineArry[item].push([xy.lon, xy.lat])
        })
    })
    map.setCenter([featuresLineArry[0][0][0], featuresLineArry[0][0][1]]) // 设置中心点和层级
    map.setZoom(18)
    // 添加路线
    let featuresLineArrys = [
        {
            type: 'Feature',
            geometry: {
                coordinates: featuresLineArry,
                type: 'MultiLineString',
            },
            properties: {
                lineColor: '#f29766', //获取不同颜色的线
            },
        },
    ]
    map.addSource('sourceLineId', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: featuresLineArrys,
        },
    })
    map.addLayer({
        id: 'sourceLineId',
        type: 'line',
        source: 'sourceLineId',
        paint: {
            'line-color': ['get', 'lineColor'],
            'line-width': 3,
        },
    })
    // 绘制所有开始点 和结束点
    setLineStyle()
}
// 删除路线
const removeMapLineSource = () => {
    map.removeLayer('sourceLineId')
    map.removeSource('sourceLineId')
    map.removeLayer('sourceLineImage')
    map.removeSource('LineImageId')
}
// 添加路线起始点 图表样式
const setLineStyle = () => {
    let lineIcon = []
    lineStartArr.forEach((item) => {
        lineIcon.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: item,
            },
            properties: {
                iconType: 'start', //获取不同颜色的线
            },
        })
    })
    lineEndArr.forEach((item) => {
        lineIcon.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: item,
            },
            properties: {
                iconType: 'end', //获取不同颜色的线
            },
        })
    })

    map.addSource('LineImageId', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: lineIcon,
        },
    })
    map.addLayer({
        id: 'lineIcon',
        type: 'symbol',
        source: 'LineImageId',
        layout: {
            'icon-image': ['get', 'iconType'],
        },
    })
}
// 获取路线的颜色
const getLineColor = (num) => {
    let colorArr = ['#96aed8', '#6c5a3a', '#202124', '#fc5531', '#ccecf5', '#202d39', '#ff99a4', '#c0c0c0']
    return colorArr[num] ? colorArr[num] : '#f2fbff'
}
// 绘制线
const drawLine = () => {
    Draw.changeMode('draw_polygon') //绘制线
    map.on('draw.create', updateArea) //绘制后的回调函数
    map.on('draw.actionable', _debounce(uncombine, 200))
}
const deleteLine = () => {
    Draw.deleteAll()
    // removeMapLineSource()
    popup.remove()
    console.log(popupTemp, 'popupTemppopupTemp')
}
let carrierIds = []
const updateArea = (e) => {
    let userPolygon = e.features[0]
    let polygonBoundingBox = turf.bbox(userPolygon)
    let southWest = [polygonBoundingBox[0], polygonBoundingBox[1]]
    let northEast = [polygonBoundingBox[2], polygonBoundingBox[3]]
    let northEastPointPixel = map.project(northEast)
    let southWestPointPixel = map.project(southWest)
    selectionFeatures = map.queryRenderedFeatures([southWestPointPixel, northEastPointPixel], {
        layers: ['sourceLayer'],
    })
    // 判断若没框选到数据源 提示并清空框
    if (!selectionFeatures.length) Draw.deleteAll()
    if (!selectionFeatures.length) return proxy.$modal.msgSuccess('此框选区域暂无载体！')
}
const uncombine = (w) => {
    if (selectionFeatures.length) {
        selectionFeatures
        store.commit('SET_ISSHOWSELECTTIMER', true)
        map.setCenter([selectionFeatures[0].properties.LON, selectionFeatures[0].properties.LAT])
        let popupTemp = createApp(Thepopup)
        popupTemp.use(ElementPlus, { locale: locale })
        popupTemp.use(store)
        popup
            .setLngLat([selectionFeatures[0].properties.LON, selectionFeatures[0].properties.LAT])
            .setHTML(`<div id='popupContent'> </div> `)
            .addTo(map)
        popupTemp.mount('#popupContent')
    }
}
// 防抖
function _debounce(fn, delay) {
    var delay = delay || 200
    var timer
    return function () {
        var th = this
        var args = arguments
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(function () {
            timer = null
            fn.apply(th, args)
        }, delay)
    }
}
</script>

<style scoped lang="scss">
@import url('https://api.tiles.mapbox.com/mapbox-gl-js/v1.13.2/mapbox-gl.css');
@import url('https://iclient.supermap.io/dist/mapboxgl/iclient-mapboxgl.min.css');
@import url('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.css');

.map-box {
    width: 100%;
    height: 100%;
    position: relative;
    #drawLine,
    #deleteLine {
        position: absolute;
        top: 18%;
        right: 8px;
        z-index: 1000000;
    }
    #deleteLine {
        top: 22%;
    }
}
// 去掉logo
::v-deep .mapboxgl-ctrl-logo {
    display: none;
}
::v-deep .mapboxgl-popup-content {
    opacity: 0.9;
    width: 290px;
}
::v-deep .popupContent {
    display: flex;
    justify-content: space-between;
}
::v-deep .popupContent .left {
    margin-right: 20px;
}
::v-deep .popupContent .left,
::v-deep .popupContent .right {
    height: 100%;
    width: 50%;
}
::v-deep .item-div {
    margin-bottom: 2px;
}

// 原生按钮重写
::v-deep .btn {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    padding: 7px 10px;
    font-size: 12px;
    border-radius: 4px;
    margin-bottom: 4px;
}
::v-deep .btn:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
}
::v-deep #btn4 {
    width: 94px;
}
</style>
