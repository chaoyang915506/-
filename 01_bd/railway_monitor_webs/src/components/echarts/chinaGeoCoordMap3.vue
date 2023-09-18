  <!-- 中国地图 -->
<template>
  <div id="myEcharts" class="dbox"></div>
</template>
<script setup>
// import siteSysbomPng from './../../assets/images/emergencyplan/site-sysbom.png'
import AMapLoader from '@amap/amap-jsapi-loader';
import 'echarts-amap'
import * as echarts from "echarts"
import { registerMap } from "echarts/core";
import chainJson from './js/china.json'

/**
 * backgroundColor, // 背景
 * zoom // 地图缩放比
 * **/
let { proxy } = getCurrentInstance()
let props = defineProps({
  chartData: {
    type: Object,
    default: {}
  },
  geoCoordMap: {
    type: Object,
    default: {}
  },
  chinaDatas: {
    type: Array,
    default: []
  },
  isMapOrSiteMap: {
    type: Boolean,
    default: true
  }
})
let targerMap = null
let disCountry = null
let province = null
let siteLayer = null
window.addEventListener("resize", function () {
  if (!proxy.$refs.echart) return
  proxy.$refs.echart.resize()
})
watch(() => props.isMapOrSiteMap, (val) => {
  targerMap.remove(disCountry)
  targerMap.remove(province)
  targerMap.remove(siteLayer)
  if (props.isMapOrSiteMap) { // 非卫星地图加载样式
    targerMap.add(disCountry)  
    targerMap.add(province)
  } else {
    targerMap.add(siteLayer)
  }
})
// 配置安全密钥
// window._AMapSecurityConfig = { securityJsCode: 'a8502bec0dd3180a49925c99c0e27572' };
let planePath = 'path://M.6,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705';
onMounted(() => {
  // var obj = document.getElementById('amapjs')
  // if (obj) {
  //   // 先让它加载完
  //   setTimeout(() => initMap(proxy), 1000)
  // } else {
  //   var url =
  //     `https://webapi.amap.com/maps?v=1.4.14&key=${import.meta.env.VITE_AMSP_KEY}&callback=onLoad`;
  //   var jsapi = document.createElement("script");
  //   jsapi.charset = "utf-8";
  //   jsapi.src = url;
  //   jsapi.id = "amapjs";
  //   document.head.appendChild(jsapi);
  //   window.onLoad = function () { initMap(proxy) }
  // }
  AMapLoader.load({
    "key": import.meta.env.VITE_AMSP_KEY,  // 申请好的Web端开发者Key，首次调用 load 时必填
    // "version": "2.0",     // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    // "Loca":{                // 是否加载 Loca， 缺省不加载
    //     "version": '2.0'  // Loca 版本
    // },
    "plugins": ["AMap.Pixel", "AMap.MarkerClusterer", "AMap.ControlBar" , "AMap.DistrictLayer" ,"AMap.ToolBar", 'AMap.PlaceSearch', 'AMap.AutoComplete'],// 需要使用的的插件列表，如比例尺'AMap.Scale'等
  }).then((AMap) => {
    initMap()
  })
})
function initMap () {
  let domEcharts = document.getElementById('myEcharts')
  var myChart = echarts.init(domEcharts);
  myChart.setOption({
    // title: {
    //   text: '模拟迁徙',
    //   subtext: '数据纯属虚构',
    //   left: 'center',
    //   textStyle: {
    //     color: '#fff'
    //   }
    // },
    amap: {
      maxPitch: 60,
      pitch: 10, //45 俯仰角
      viewMode: '3D',
      zoom: 4.5,
      expandZoomRange: true,
      zooms: [3, 10],
      mapStyle: 'amap://styles/96866b90730665d461d33defc3eb7577', //地图主题
      center: [110, 33], //中心点
      rotation: 0,  //顺时针旋转角度
      resizeEnable: true,
    },
    animation: false,
    series: []
  })
  targerMap = myChart.getModel().getComponent('amap').getAMap();
  siteLayer = new AMap.TileLayer.Satellite()
  AMap.plugin(["AMap.ControlBar"], function () {
    var bar = new AMap.ControlBar();
    targerMap.addControl(bar);
  })
  // AMap.plugin(["AMap.ToolBar"], function () {
  //   targerMap.addControl(new AMap.ToolBar());
  // });
  // 创建图层
  AMap.plugin(["AMap.DistrictLayer"], function () {
    // var defaultLayer = new AMap.createDefaultLayer();
    disCountry = new AMap.DistrictLayer.Country({
      zIndex: 15,
      SOC: "CHN",
      depth: 0,
      styles: {
        "nation-stroke": "#bbdaf1",
        "coastline-stroke": "#bbdaf1",
        "province-stroke": "#bbdaf1",
        "city-stroke": "#bbdaf1",
        fill: "rgba(127,127,127,0.5)",
      },
    });
    province = new AMap.DistrictLayer.Province({
      zIndex: 20,
      depth: 0,
      styles: {
        "province-stroke": "#bbdaf1",
        "city-stroke": "#bbdaf1",
        fill: "#bbdaf1",
      },
    });
    // // disCountry 跟 defaultLayer 一定要搭配使用 不然只使用 disCountry 会导致不显示省市名称
    targerMap.add(disCountry)
    // targerMap.add(defaultLayer)
    targerMap.add(province)
  })



  // AMap.load(['ui/geo/DistrictExplorer', 'lib/$'], function (DistrictExplorer, $) {
  //     //创建一个实例
  //     var districtExplorer = window.districtExplorer = new DistrictExplorer({
  //       eventSupport: false, //打开事件支持
  //       targerMap: targerMap
  //     });
  //     districtExplorer.loadAreaNode(100000, function (error, areaNode) {
  //       //清除已有的绘制内容
  //       districtExplorer.clearFeaturePolygons();
  //       //绘制父区域
  //       districtExplorer.renderParentFeature(areaNode, {
  //         cursor: 'default',
  //         bubble: true,
  //         strokeColor: '#bbdaf1', //线颜色
  //         strokeOpacity: 1, //线透明度
  //         strokeWeight: 2, //线宽
  //         fillColor: "", //填充色
  //         fillOpacity: 0, //填充透明度
  //       });
  //     });
  //   })
  var layer = myChart.getModel().getComponent('amap').getLayer();
  // AMap.event.addListener(targerMap, 'zoomend', function () {
  //   console.log(targerMap, 'mapap')
  //   console.log('当前缩放级别：' + targerMap.getZoom());
  //   console.log('俯视视角' + targerMap.getPitch());
  //   console.log('俯视视角' + targerMap.getPitch());
  // });
  var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var fromCoord = props.geoCoordMap[dataItem[0].name];
      var toCoord = props.geoCoordMap[dataItem[1].name];
      if (fromCoord && toCoord) {
        res.push([{
          coord: fromCoord
        }, {
          coord: toCoord
        }]);
      }
    }
    return res;
  };
  let series = [{
    "name": "上海 Top10",
    "coordinateSystem": "amap",
    "type": "lines",
    "zlevel": 1,
    "effect": {
      "show": true,
      "period": 6,
      "trailLength": 0.7,
      "color": "#fff",
      "symbolSize": 3
    },
    "lineStyle": {
      "normal": {
        "color": "#a6c84c",
        "width": 0,
        "curveness": 0.2
      }
    },
    "data": [
      {
        "fromName": "上海",
        "toName": "包头",
        "coords": [
          [
            121.4648,
            31.2891
          ],
          [
            109.853634, 40.651412
          ]
        ],
        "value": 95
      }
    ]
  },
  {
    "name": "上海 Top10",
    "coordinateSystem": "amap",
    "type": "lines",
    "zlevel": 2,
    "symbol": [
      "none",
      "arrow"
    ],
    "symbolSize": 10,
    "lineStyle": {
      "normal": {
        "color": "#a6c84c",
        "width": 1,
        "opacity": 0.6,
        "curveness": 0.2
      }
    },
    "data": [
      {
        "fromName": "上海",
        "toName": "包头",
        "coords": [
          [
            121.4648,
            31.2891
          ],
          [
            109.853634, 40.651412
          ]
        ],
        "value": 95
      }
    ]
  },
  {
    "name": "上海 Top10",
    "type": "effectScatter",
    "coordinateSystem": "amap",
    "zlevel": 2,
    "rippleEffect": {
      "brushType": "stroke"
    },
    "label": {
      "normal": {
        "show": true,
        "position": "bottom",
        "formatter": "{b}"
      }
    },
    "itemStyle": {
      "normal": {
        "color": "#a6c84c"
      }
    },
    "data": [
      {
        "name": "包头",
        "value": [
          109.853634, 40.651412,
          95
        ]
      }
    ]
  }
  ];
  myChart.setOption({
    series: series
  });
  //下面是确保高德地图渲染的时候，echarts同时也需要再次渲染一次，保持位置的同步
  layer.render = function () {
    // let series = myChart.getOption().seriesIndexes;
    // myChart.setOption({
    //     series: []
    // });
    myChart.setOption({
      series: series
    });
    // console.log('当前缩放级别：' + targerMap.getZoom());
    // console.log('俯视视角：' + targerMap.getPitch());
    // console.log('顺时针：' + targerMap.getRotation());
    // var targerMap = new AMap.Map('myEcharts', {
    //   resizeEnable: true, //是否监控地图容器尺寸变化
    //   zoom: 11, //初始化地图层级
    //   center: [116.397428, 39.90923] //初始化地图中心点
    // });
    // // eslint-disable-next-line no-undef
    // AMap.plugin('AMap.ToolBar', function () {//异步加载插件
    //   // eslint-disable-next-line no-undef
    //   var toolbar = new AMap.ToolBar();
    //   targerMap.addControl(toolbar);
    // });
    // self.mapObj = targerMap;
  }
}

</script>
<style scoped>
#myEcharts :deep(.amap-controlbar-zoom) {
  display: none !important;
}
#myEcharts :deep(.amap-controlbar) {
  top: 0 !important;
  right: 5px !important;
}
/* //去掉高德地图logo */
#myEcharts :deep(.amap-logo){
  display: none!important;
}
/* //去掉高德的版本号 */
#myEcharts :deep(.amap-copyright) {
  opacity:0!important;
}
</style>