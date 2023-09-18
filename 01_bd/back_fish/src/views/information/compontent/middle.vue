<template>
  <div id="centerDiv" class="mapcontainer">
    <mars-map :url="configUrl" @onload="start" />
  </div>
</template>

<script>
import MarsMap from "@/components/mars-work/mars-map.vue";
import {
  多源数据按位置查询记录,
  多源数据按多位置查询记录,
} from "@/api/information/information.js";
let graphicLayer; // 矢量图层对象,用于graphic绑定展示
export default {
  name: "middle",
  components: {
    MarsMap,
  },
  props: {
    anypostionmap: {
      type: Array,
      default: () => [],
    },
    sourdata: {
      type: Array,
      default: () => [],
    },
    anydata: {
      type: Object,
      default: () => {},
    },
    mmsiGraphicArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const basePathUrl = window.basePathUrl || "";
    return {
      uBoatData: [],
      count: 0,
      isPoly: true, // 是否聚合，根据这个值来绘制
      isDrawOver: false, //
      configUrl: basePathUrl + "config/config.json",
      _map: null,
      _graphicLayer: null,
      htmldata: [],
      cloursToolTip: null,
    };
  },
  watch: {
    anypostionmap: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.onMapload(this._map);
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    clearmap() {
      if (this._graphicLayer) this._graphicLayer.clear();
    },
    start(map) {
      this._map = map;
      this.onMapload(this._map);
    },
    initGraphic(item, imgSrc) {
      console.log(item, "shenm");
      let graphic = new mars3d.graphic.BillboardEntity({
        name: item.name,
        position: [item.lng, item.lat, 1000],
        eveydata: item,
        style: {
          // image: "img/ui/tLAN.png",
          image: "img/marker/blue.png",
          scale: 0.18,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          clampToGround: false,
          label: {
            text: "1",
            // verticalOrigin: 1,
            pixelOffsetY: -16,
            pixelOffsetX: 1,
            visibleDepth: false,
            font_size: 20,
            color: "#fff",
          },
        },
        attr: item,
      });
      return graphic;
    },
    async onMapload(map) {
      let self = this;
      graphicLayer = new mars3d.layer.GraphicLayer({
        clustering: {
          enabled: true,
          pixelRange: 20,
          clampToGround: true,
          fontColor: "#fff",
        },
      });
      this._graphicLayer = graphicLayer;
      if (map) map.addLayer(graphicLayer);

      this.anypostionmap.forEach((item) => {
        let graphic;
        graphic = this.initGraphic(item);
        graphicLayer.addGraphic(graphic);
        graphic.openTooltip();
      });

      // 单击事件
      graphicLayer.on(mars3d.EventType.click, async function (event) {
        if (this.cloursToolTip) this.cloursToolTip.destroy();
        console.log("你单击了", event);
        if (map.camera.positionCartographic.height > 90000) {
          const graphic = event.graphic;
          window.scrollType = 2;
          let coorArr = [];
          if (graphic) {
            if (event.graphic.options.styleType === "polyline") {
              return;
            }
            if (event.graphic.options.mark) {
              event.graphic.flyTo({
                radius: 200000,
              });
              return;
            }
            // 单击了具体的点对象
            let latlng = {
              lat: event.graphic.options.eveydata.lat,
              lng: event.graphic.options.eveydata.lng,
            };
            coorArr.push(latlng);
          } else {
            // 单击了聚合的点
            event.pickedObject.id.forEach((item) => {
              let p = item._properties;
              let latlng = {
                lat: p._lat._value,
                lng: p._lng._value,
              };
              coorArr.push(latlng);
            });
          }
          window.coorArr = JSON.stringify(coorArr);
          let resluts = await 多源数据按多位置查询记录({
            dataSources: this.sourdata,
            pageNum: 0,
            pageSize: 20,
            positions: coorArr,
            // endTime: this.date2 ? this.date2.getTime() : new Date().getTime(),
            // startTime: this.date1
            //   ? this.date1.getTime()
            //   : new Date().setDate(new Date().getDate() - 7),
            userName: window.infoName ? window.infoName : "",
          });
          self.$parent.mediaInfo = resluts.rows;
          self.$parent.view = true;
        }
      });

      // 2.在layer上绑定监听事件
      graphicLayer.on(mars3d.EventType.mouseOver, async function (event) {
        if (this.cloursToolTip) this.cloursToolTip.destroy();
        const graphic = event.graphic;
        // graphic.closePopup()
        if (graphic) {
          console.log("划过了单点", event);
          // AIS特殊标记和标示线不调接口
          if (
            !event.graphic.options.mark &&
            event.graphic.options.styleType !== "polyline"
          ) {
            await self.getalldatar(event);
            console.log(self.htmldata, "reddd");
            self.htmldata.forEach((i) => {
              console.log(i, "red");
            });
          }
        } else {
          let coorArr = [];
          event.pickedObject.id.forEach((item) => {
            let p = item._properties;
            let latlng = {
              lat: p._lat._value,
              lng: p._lng._value,
            };
            coorArr.push(latlng);
          });
          console.log("划过了聚合点", event);
          let result = await 多源数据按多位置查询记录({
            dataSources: this.sourdata,
            pageNum: 0,
            pageSize: 5,
            positions: coorArr,
            userName: window.infoName ? window.infoName : "",
          });
          console.log(result);
          this.htmldata = result.rows;
          let html =
            "<div style='width:600px;background-color:gray;padding:20px;color:#fff;'><table>";
          if (result.rows && result.rows.length > 0) {
            result.rows.forEach((i, index) => {
              if (index <= 5)
                html += `<tr><td style='overflow:hidden;text-overflow:ellipsis;width:580px; margin-bottom:20px;'>${i.text}</td></tr>`;
            });
            html += "</table></div>";
            this.cloursToolTip = new mars3d.graphic.DivGraphic({
              position: [
                event.id[0]._properties._lat._value,
                event.id[0]._properties._lng._value,
                1000,
              ],
              style: {
                html: html,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                zIndex: 999999,
              },
            });
            graphicLayer.addGraphic(this.cloursToolTip);
          }
        }
      });
    },
    async getalldatar(event) {
      let resluts = await 多源数据按位置查询记录({
        dataSources: this.sourdata,
        lat: event.graphic.options.eveydata.lat,
        lng: event.graphic.options.eveydata.lng,
        pageNum: 0,
        pageSize: 10000,
        // endTime: this.date2 ? this.date2.getTime() : new Date().getTime(),
        // startTime: this.date1
        //   ? this.date1.getTime()
        //   : new Date().setDate(new Date().getDate() - 7),
        userName: window.infoName ? window.infoName : "",
      });
      this.htmldata = resluts.rows;
      console.log(resluts, "res");
      let html = "";
      if (resluts.rows && resluts.rows.length > 0) {
        resluts.rows.forEach((i, index) => {
          if (index <= 5)
            html += `<tr><td style='overflow:hidden;text-overflow:ellipsis;width:200px;'>${i.text}</td></tr>`;
        });
        event.graphic.bindTooltip(`<table>${html}</table>`);
      } else {
        html += `<tr><td>null</td></tr>`;
        event.graphic.bindTooltip(`<table>${html}</table>`);
      }
    },
    initPath(data) {
      // data = pathArr
      const property = new Cesium.SampledPositionProperty();
      property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
      let dataObj = data[0];
      let start;
      let stop;
      Object.keys(dataObj).forEach((data) => {
        for (let i = 0, len = dataObj[data].length; i < len; i++) {
          const item = dataObj[data][i];
          if (i < len - 1) {
            const itemNext = dataObj[data][i + 1];
            this.addArrow(item, itemNext);
          }

          const lng = Number(item.lng); // 经度
          const lat = Number(item.lat); // 纬度
          const height = 1000; // 高度
          const time = new Date(item.intime).toISOString(); // 时间

          let position = null;
          if (lng && lat) {
            position = Cesium.Cartesian3.fromDegrees(lng, lat, height);
          }
          let juliaDate = null;
          if (time) {
            juliaDate = Cesium.JulianDate.fromIso8601(time);
          }
          if (position && juliaDate) {
            property.addSample(juliaDate, position);
          }

          if (i === 0) {
            start = juliaDate;
          } else if (i === len - 1) {
            stop = juliaDate;
          }

          const graphic = new mars3d.graphic.PointPrimitive({
            position: position,
            style: {
              pixelSize: 10,
              color: "red",
            },
            mark: true,
            // popup: "名称:" + item.name + "<br/>地点:" + item.byname,
          });
          graphic.bindTooltip(
            "名称:" +
              item.name +
              "<br/>地点:" +
              item.byname +
              "<br/>时间:" +
              item.intime
          );

          this._graphicLayer.addGraphic(graphic);
        }
      });
    },
    addArrow(start, end) {
      const graphic = new mars3d.graphic.PolylineEntity({
        positions: [
          [start.lng, start.lat, start.height],
          [end.lng, end.lat, end.height],
        ],
        style: {
          width: 8,
          clampToGround: true,
          materialType: mars3d.MaterialType.PolylineArrow,
          materialOptions: {
            color: Cesium.Color.YELLOW,
          },
        },
        attr: { remark: "示例3" },
      });
      graphicLayer.addGraphic(graphic);
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
