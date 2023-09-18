<template>
  <div id="centerDiv" class="mapcontainer">
    <mars-map :url="configUrl" @onload="onMapload" />
  </div>
</template>

<script>
import MarsMap from "@/components/mars-work/mars-map.vue";
import { 查询舰艇实时状态详情V3 } from "@/api/situation/situation";
let graphicLayer; // 矢量图层对象,用于graphic绑定展示
export default {
  name: "middle",
  components: {
    MarsMap,
  },
  data() {
    const basePathUrl = window.basePathUrl || "";
    return {
      // activeKey: '1',
      uBoatData: [],
      count: 0,
      isPoly: true, // 是否聚合，根据这个值来绘制
      isDrawOver: false, //
      configUrl: basePathUrl + "config/config.json",
      totalArr: {
        部署中: [],
        维修中: [],
        在港: [],
      },
      // 存储相同坐标的集合，用来判断是单点还是聚合点
      positionrGoup: [],
      _map: null,
      _graphicLayer: null,
    };
  },
  methods: {
    initSubMain(item, imgSrc) {
      let graphic = new mars3d.graphic.BillboardEntity({
        name: item.name,
        position: [item.lng, item.lat, 1000],
        style: {
          image: imgSrc,
          scale: 0.03,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          clampToGround: true,
        },
        attr: {
          name: item.name,
          // sideNum: item.sideNum,
          state: item.states,
          position: item.position,
          lng: item.lng,
          lat: item.lat,
          duration: item.duration, //持续时间
          begintime: item.begintime, //开始时间
          endtime: item.endtime, // 预计结束时间
          percent: item.percent, // 概率
          remark: item.remark, // 备注
          addr: item.addr,
          flag: item.flag,
        },
      });
      return graphic;
    },
    clearData() {
      this._graphicLayer.clear();
    },
    async findSubMaine(subMaineData) {
      console.log(subMaineData, "什么dd");
      this.clearData();

      subMaineData.forEach((item, index) => {
        let graphic;
        graphic = this.initSubMain(item, "img/ui/ting.png");
        this._graphicLayer.addGraphic(graphic);
        graphic.openTooltip();
      });
      let point = new mars3d.LngLatPoint(
        subMaineData.length > 0 ? subMaineData[0].lng : null,
        subMaineData.length > 0 ? subMaineData[0].lat : null,
        5000000
      );
      this._map.flyToPoint(point, {
        radius: 1000,
        duration: 3,
      });

      // 单击事件
      this._graphicLayer.on(mars3d.EventType.mouseOver, async function (event) {
        if (event.graphic.options.styleType === "polyline") {
          return;
        }
        if (event.graphic.options.mark) {
          event.graphic.flyTo({
            radius: 200000,
          });
          return;
        }
        console.log("你单击了", event);
        if (this._map.camera.positionCartographic.height > 90000) {
          // console.log(event.graphic, "event.graphicc");
          if (event.graphic.options.attr) {
            let itemd = event.graphic.options.attr;
            console.log(itemd, "itemd");
            let html = `<table style="width:280px;">
                      <tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">${itemd.name}</th></tr>
                      <tr><td >开始时间：</td><td >${itemd.begintime} </td></tr><tr><td >事件名称：</td><td >${itemd.state} </td></tr>
                    </table>`;
            event.graphic.bindTooltip(html);
          }
        }
      });
    },
    initGraphic(item, imgSrc) {
      let graphic = new mars3d.graphic.BillboardEntity({
        name: item.name,
        position: [item.lng, item.lat, 1000],
        style: {
          //   image: imgSrc,
          scale: 0.05,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          clampToGround: true,
        },
        attr: {
          name: item.name,
          // sideNum: item.sideNum,
          state: item.states,
          position: item.position,
          lng: item.lng,
          lat: item.lat,
          duration: item.duration, //持续时间
          begintime: item.begintime, //开始时间
          endtime: item.endtime, // 预计结束时间
          percent: item.percent, // 概率
          remark: item.remark, // 备注
          addr: item.addr,
          flag: item.flag,
        },
      });
      return graphic;
    },
    async onMapload(map) {
      // console.log(map, "map");
      this._map = map;
      let self = this;
      graphicLayer = new mars3d.layer.GraphicLayer();
      this._graphicLayer = graphicLayer;
      map.addLayer(graphicLayer);

      // 2.在layer上绑定监听事件
      // graphicLayer.on(mars3d.EventType.click, function (event) {
      //   console.log("监听layer，单击了矢量对象", event);
      //   // debugger
      // });
      // graphicLayer.on(mars3d.EventType.mouseOver, async function (event) {
      //   console.log("监听layer，鼠标移入了矢量对象", event);
      // });

      // this.initPath(123, map);
    },
  },
};
</script>

<style lang="scss" scoped>
.mapcontainer {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.total {
  color: white;
  width: 400px;
  position: absolute;
  right: 20%;
  top: 30px;
  display: flex;
  justify-content: center;
  border-top: 10px solid rgb(102, 204, 255);
  .containner {
    width: 80px;
    height: 100px;
    border: 1px solid;
    border-bottom-right-radius: 20%;
    border-bottom-left-radius: 20%;
    border-top-width: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    margin-right: 20px;
    margin-top: -10px;
  }
  .bu {
    border-color: rgb(40, 226, 227);
  }
  .buT {
    color: rgb(40, 226, 227);
  }
  .wei {
    border-color: rgb(254, 30, 0);
  }
  .weiT {
    color: rgb(254, 30, 0);
  }
  .zai {
    border-color: rgb(235, 235, 235);
    margin-right: 0px;
  }
  .zaT {
    color: rgb(235, 235, 235);
  }
  .count {
    font-size: 30px;
    margin-top: 4px;
  }
}
</style>
