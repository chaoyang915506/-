<template>
    <div  class="map-box" id="map" v-loading="loading" element-loading-text="Loading..." :element-loading-spinner="svg" element-loading-svg-view-box="-10, -10, 50, 50" element-loading-background="rgba(255, 255, 255, 0.5)">
        <div class="my-class" id="my-class"></div>
    </div>
</template>
<script setup>
import { onMounted, ref, watch } from '@vue/runtime-core'
import mapboxgl from 'mapbox-gl'
import { createApp } from 'vue'
// import App from '@/App'
import Thepopup from './popup.vue'
const popups = createApp(Thepopup)
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
const { proxy } = getCurrentInstance()
var popup
var map
var sourceId = 'circle'
let mapSourceList = ref([])
let lsgj = ref(false)
let loading = ref(true)
let form = ref({})
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
    val => {
        if (val.lon) {
            map.setCenter([val.lon, val.lat])
            let latlng = LatlngCnvTool([val.lat + '', val.lon + ''])

            popup
                .setLngLat([Number(val.lon), Number(val.lat)])
                .setHTML(
                    ` <div style='text-align: center'>航标信息</div>` +
                        `<hr/>` +
                        `
        <div class='popupContent'>
        <div class='left'>

          <div class='item-div'><span class='item-span'>单位名称：</span><span>` +
                        `${val.deptName ? val.deptName : '暂无'}` +
                        `</span></div>

           <div class='item-div'><span class='item-span'>名称：</span><span>` +
                        `${val.carrierName}` +
                        `</span></div>
         

          <div class='item-div'><span class='item-span'>北斗卡号：</span><span >` +
                        `${val.bdsNumber ? val.bdsNumber : '暂无'}` +
                        `</span></div>

           <div class='item-div'><span class='item-span'>经度：</span><span >` +
                        `${latlng[1]}` +
                        `</span></div>

          <div class='item-div'><span class='item-span'>纬度：</span><span >` +
                        `${latlng[0]}` +
                        `</span></div>

          <div class='item-div'><span class='item-span'>蓄电池电压：</span><span >` +
                        `${val.batterVoltage + 'v'}` +
                        `</span></div>

          <div class='item-div'><span class='item-span'>负载电压：</span><span >` +
                        `${val.batteryLoadVoltage + 'v'}` +
                        `</span></div>

        </div>

        <div class='right'>

          <div class='item-div'><span class='item-span'>充电电池：</span><span >` +
                        `${val.sunCurrent}` +
                        `</span></div>

          <div class='item-div'><span class='item-span'>灯器亮度：</span><span >` +
                        `${val.light}` +
                        `</span></div>
          <div class='item-div'><span class='item-span'>负载电池：</span><span >` +
                        `${val.loadCurrent}` +
                        `</span></div>

          <div class='item-div'><span class='item-span'>环境温度：</span><span >` +
                        `${val.temperature + '℃'}` +
                        `</span></div>

          <div class='item-div'><span class='item-span'>时间：</span><span >` +
                        `${val.sendTime}` +
                        `</span></div>
          <div class='item-div'><span class='item-span'>北斗版本：</span><span >` +
                        `${val.bdsVersion}` +
                        `</span></div>
          
        </div>
        </div>
         <hr/>
         <button class='btn' id='btn1'>航标状态召测</button>
         <button class='btn' id='btn2' style='float: right'>灯器亮度设置</button>
         <button class='btn' id='btn3' >通信参数变更</button>
         <button class='btn' id='btn4' style='float: right'>历史查询</button>
         <button class='btn' id='btn5'>轨迹查询</button>
        `
                )
                .addTo(map)
            var btn1 = document.getElementById('btn1')
            var btn2 = document.getElementById('btn2')
            var btn3 = document.getElementById('btn3')
            var btn4 = document.getElementById('btn4')
            var btn5 = document.getElementById('btn5')
            

            btn1.onclick = function () {
                proxy.$modal.msgSuccess('发送成功')
            }
            btn2.onclick = function () {
                proxy.$modal.msgSuccess('发送成功')
            }
            btn3.onclick = function () {
                proxy.$modal.msgSuccess('发送成功')
            }
            btn4.onclick = function () {
                proxy.$modal.msgSuccess('发送成功')
            }
            btn5.onclick = function () {
                proxy.$modal.msgSuccess('111')
            }
        }
    }
)
watch(
    () => props.isToUpdate,
    val => {
        setTimeout(() => {
            addMapSource()
            loading.value = false
            proxy.$modal.msgSuccess('实时点位已更新')
        }, 1000)
    }
)
watch(
    () => props.mapData,
    val => {
        setTimeout(() => {
            mapSourceList.value = val
            addMapSource()
            loading.value = false
        }, 1000)
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
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
    popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        // focusAfterOpen: false
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
                    tiles: ["http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=134e6b671b2b1f64c383628fbe12b4d1"],
                    tileSize: 256,
                },
                    //   transparent: true,
                paint: {},
                layout: {},
            },
            sourceId
        )
        map.addLayer(
            {
                id: 'tilelayer',
                type: 'raster',
                source: {
                    type: 'raster',
                    // tiles: ["http://114.242.203.139:7001/htjbbz/{z}/{y}/{x}.png"],
                    tiles: ["http://139.196.39.225:8081/service/rest/services/cf8cb8de21ad4acbad82699732eae3fc/wmts/tile/1.0.0/default/default028mm/{z}/{y}/{x}.png?token=5295504a3f1f4574889666d618bb5152"],
                    // tiles: ['http://139.196.39.225:8081/service/rest/services/cf8cb8de21ad4acbad82699732eae3fc/wmts/tile/1.0.0/default/default028mm/{z}/{y}/{x}.png?token=5295504a3f1f4574889666d618bb5152'],
                    tileSize: 256,
                },
                paint: {},
                layout: {},
            },
            sourceId
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
            let date_value = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + checkTime(date.getHours()) + ':' + checkTime(date.getMinutes()) + ':' + checkTime(date.getSeconds())
            featuresArry.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [item.lon, item.lat], // 图片位置
                },
                properties: {
                    carrierName: item.carrierName, //载体名称
                    carrierType: item.carrierType, //载体类型
                    carrierSerial: item.carrierSerial, //载体序列号
                    activeArea: item.activeArea, //活动区域
                    terminalCount: item.terminalCount, //搭载终端数量
                    terminalType: item.terminalType, //搭载终端类型
                    lon: latlng[1], //经度
                    lat: latlng[0], //纬度
                    deptName: item.deptName, //单位名称
                    bdsNumber: item.bdsNumber ? item.bdsNumber : '暂无', //北斗卡号
                    batterVoltage: item.batterVoltage, //蓄电池电压
                    batteryLoadVoltage: item.batteryLoadVoltage, //负载电压
                    temperature: item.temperature, //环境温度
                    sunCurrent: item.sunCurrent, //太阳能充电电流
                    loadCurrent: item.loadCurrent, //负载电流
                    light: item.light, //灯光亮度设置值
                    sendTime: date_value, //上报时间
                    bdsVersion: item.bdsVersion ? item.bdsVersion : '暂无', //北斗版本
                    iconType:
                        item.batterVoltage !== '' && item.batteryLoadVoltage !== '' && item.temperature !== '' && item.sunCurrent !== '' && item.loadCurrent !== '' && item.light !== '' && item.date_value !== ''
                            ? item.bdsVersion === '北斗二号'
                                ? 'bd2Type'
                                : 'bd3Type'
                            : item.bdsVersion === '北斗二号'
                            ? 'bd2'
                            : 'bd3',
                },
            })
        })
        map.addSource(sourceId, {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: featuresArry,
            },
            // cluster: true,
            // clusterMaxZoom: 14, // Max zoom to cluster points on
            // clusterRadius: 50,
        })
        // // 添加圆形聚合图层
        // map.addLayer({
        //   id: "clusters",
        //   type: "circle",
        //   source: sourceId,
        //   filter: ["has", "point_count"],
        //   paint: {
        //     "circle-color": "#0000FF",
        //     "circle-radius": 12,
        //     "circle-stroke-width": 1, //边框
        //     "circle-stroke-color": "#ffffff", //边框颜色
        //   },
        // });
        // // 添加数字图层
        // map.addLayer({
        //   id: "cluster-count",
        //   type: "symbol",
        //   source: sourceId,
        //   filter: ["has", "point_count"],
        //   layout: {
        //     "text-field": "{point_count}",
        //     "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        //     "text-size": 12,
        //   },
        //   paint: {
        //     "text-color": "#fff",
        //     "text-opacity": 1,
        //   },
        // });
        // // 添加未聚合图层
        // map.addLayer({
        //   id: "unclustered-point",
        //   type: "circle",
        //   source: sourceId,
        //   filter: ["!", ["has", "point_count"]],
        //   paint: {
        //     "circle-color": ["get", "color"],
        //     "circle-radius": 8,
        //     "circle-stroke-width": 1,
        //     "circle-stroke-color": "#ffffff",
        //   },
        // });
        // 设置原点默认值
        // map.addLayer({
        //   id: sourceId,
        //   type: "circle",
        //   source: sourceId,
        //   paint: {
        //     "circle-color": ["get", "color"],
        //     "circle-radius": 8,
        //     "circle-stroke-width": 1, //边框
        //     "circle-stroke-color": "#ffffff", //边框颜色
        //   },
        //   layout: {
        //     // 布局类属性
        //     visibility: "visible",
        //     // 可见性（可选值为 none、visible，默认值visible）
        //   },
        // });

        map.addLayer({
            id: sourceId,
            type: 'symbol',
            source: sourceId,
            layout: {
                'icon-image': ['get', 'iconType'],
            },
        })
    }
}
// 时间选择器弹窗
const showTimer  = e => {
    var bbox = [
        [e.point.x, e.point.y],
        [e.point.x, e.point.y],
    ]
    const features = map.queryRenderedFeatures(bbox, {
        // layers: ["unclustered-point"],
        layers: [sourceId],
    })
    if (features.length) {
        popup
            .setLngLat([Number(e.lngLat.lng), Number(e.lngLat.lat)])
            .setHTML( `111 ` ).addTo(map)        
    }
}
// 数据源点击事件
const clickMapSource = e => {
    emits('editShowSource')
    var bbox = [
        [e.point.x, e.point.y],
        [e.point.x, e.point.y],
    ]
    const features = map.queryRenderedFeatures(bbox, {
        // layers: ["unclustered-point"],
        layers: [sourceId],
    })
    if (features.length) {

        popup
        .setLngLat([Number(e.lngLat.lng), Number(e.lngLat.lat)])
        .setDOMContent( popups ).addTo(map)
        
        popup
            .setLngLat([Number(e.lngLat.lng), Number(e.lngLat.lat)])
            .setHTML(
                ` <div style='text-align: center'>航标信息</div>` +
                    `<hr/>` +
                    `
        <div class='popupContent'>
        <div class='left'>

          <div class='item-div'><span class='item-span'>单位名称：</span><span>` +
                    `${features[0].properties.deptName ? features[0].properties.deptName : '暂无'}` +
                    `</span></div>

           <div class='item-div'><span class='item-span'>名称：</span><span>` +
                    `${features[0].properties.carrierName}` +
                    `</span></div>
         

          <div class='item-div'><span class='item-span'>北斗卡号：</span><span >` +
                    `${features[0].properties.bdsNumber}` +
                    `</span></div>

           <div class='item-div'><span class='item-span'>经度：</span><span >` +
                    `${features[0].properties.lon}` +
                    `</span></div>

          <div class='item-div'><span class='item-span'>纬度：</span><span >` +
                    `${features[0].properties.lat}` +
                    `</span></div>

          <div class='item-div'><span class='item-span'>蓄电池电压：</span><span >` +
                    `${features[0].properties.batterVoltage + 'v'}` +
                    `</span></div>

          <div class='item-div'><span class='item-span'>负载电压：</span><span >` +
                    `${features[0].properties.batteryLoadVoltage + 'v'}` +
                    `</span></div>

        </div>

        <div class='right'>

          <div class='item-div'><span class='item-span'>充电电池：</span><span >` +
                    `${features[0].properties.sunCurrent}` +
                    `</span></div>

          <div class='item-div'><span class='item-span'>灯器亮度：</span><span >` +
                    `${features[0].properties.light}` +
                    `</span></div>
          <div class='item-div'><span class='item-span'>负载电池：</span><span >` +
                    `${features[0].properties.loadCurrent}` +
                    `</span></div>

          <div class='item-div'><span class='item-span'>环境温度：</span><span >` +
                    `${features[0].properties.temperature + '℃'}` +
                    `</span></div>

          <div class='item-div'><span class='item-span'>时间：</span><span >` +
                    `${features[0].properties.sendTime}` +
                    `</span></div>
          <div class='item-div'><span class='item-span'>北斗版本：</span><span >` +
                    `${features[0].properties.bdsVersion}` +
                    `</span></div>
          
        </div>
        </div>
         <hr/>
         <button class='btn' id='btn1'>航标状态召测</button>
         <button class='btn' id='btn2' style='float: right'>灯器亮度设置</button>
         <button class='btn' id='btn3' >通信参数变更</button>
         <button class='btn' id='btn4' style='float: right'>历史查询</button>
         <button class='btn' id='btn5'>轨迹查询</button>
        `)
            .addTo(map)
        var btn1 = document.getElementById('btn1')
        var btn2 = document.getElementById('btn2')
        var btn3 = document.getElementById('btn3')
        var btn4 = document.getElementById('btn4')
        var btn5 = document.getElementById('btn5')

        btn1.onclick = function () {
            proxy.$modal.msgSuccess('发送成功')
        }
        btn2.onclick = function () {
            proxy.$modal.msgSuccess('发送成功')
        }
        btn3.onclick = function () {
            proxy.$modal.msgSuccess('发送成功')
        }
        btn4.onclick = function () {
            proxy.$modal.msgSuccess('发送成功')
        }
        btn5.onclick = function () {
            // showTimer()
        }
        //        popups.mount('.mapboxgl-popup-content')
        // console.log(popups)
    }
}
const removeMapSource = () => {
    map.removeLayer(sourceId)
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
}
function checkTime(i) {
    if (i < 10) {
        i = '0' + i
    }
    return i
}
</script>

<style scoped lang="scss">
@import url('https://api.tiles.mapbox.com/mapbox-gl-js/v1.13.2/mapbox-gl.css');
@import url('https://iclient.supermap.io/dist/mapboxgl/iclient-mapboxgl.min.css');
.map-box {
    width: 100%;
    height: 67%;
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
::v-deep #btn5{
    display: block;
}
</style>
