<template>
  <div class="map">
    <mars-map :url="configUrl" @onload="onMapload" />
    <div class="total">
      <div class="containner bu">
        <span class="buT">部署中:</span
        ><span class="count"> {{ totalArr.部署中.length }}</span>
      </div>
      <div class="containner wei">
        <span class="weiT">维修中:</span>
        <span class="count">{{ totalArr.维修中.length }}</span>
      </div>
      <div class="containner zaiYan">
        <span class="zaiT">在港演训: </span
        ><span class="count">{{ totalArr.在港演训.length }}</span>
      </div>
      <div class="containner zai">
        <span class="zaiT">在港备勤: </span
        ><span class="count">{{ totalArr.在港备勤.length }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import MarsMap from "@/components/mars-work/mars-map.vue";
import {
  查询舰艇实时状态详情V2,
  查询舰艇实时状态详情V3,
} from "@/api/situation/situation";
import {
  获取范围区域V2,
  获取弦号列表V2,
  获取弦号列表V3,
  威胁预测V2,
} from "@/api/menace/menace";
let graphicLayer; // 矢量图层对象,用于graphic绑定展示
export default {
  name: "PlanimetricMap",
  components: {
    MarsMap,
  },
  data() {
    const basePathUrl = window.basePathUrl || "";
    return {
      count: 0,
      configUrl: basePathUrl + "config/index.json",
      totalArr: {
        部署中: [],
        维修中: [],
        在港演训: [],
        在港备勤: [],
      },
      checkList: ["SSN721", "SSN750"],
      currentDate: "2022-08-18",
    };
  },
  methods: {
    initGraphic(item, imgSrc) {
      let graphic = new mars3d.graphic.BillboardEntity({
        name: item.name,
        position: [item.lng, item.lat, 1],
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

    async onMapload(map) {
      let self = this;
      graphicLayer = new mars3d.layer.GraphicLayer({
        clustering: {
          enabled: true,
          pixelRange: 20,
          clampToGround: false,
        },
      });
      map.addLayer(graphicLayer);

      let ret = await 获取范围区域V2();
      if (ret.code == 200) {
        if (ret.rows && ret.rows.length > 0) {
          ret.rows.forEach((item, index) => {
            let graphic = new mars3d.graphic.PolygonEntity({
              positions: item.points,
              style: {
                color: `rgba(200, 54, 54)`,
                //  color: `transparent`,
                opacity: 0,
                outline: true,
                outlineWidth: 1,
                outlineColor: "rgba(0, 0, 0, 0.1)",
              },
              attr: { remark: item.geoNum },
            });
            graphicLayer.addGraphic(graphic);
          });
        }
      }
      // 热力图 图层
      let arrPoints = [];
      let ress = await 威胁预测V2(this.checkList.join(","), this.currentDate);
      ress.rows.forEach((item) => {
        let tar = ret.rows.find((se) => se.id === item.id);
        // tar.possibility = item.possibility;
        let heatData = {
          lng: tar.center[0],
          lat: tar.center[1],
          value: item.sum_value,
        };
        arrPoints.push(heatData);
      });
      // console.log("看一下热力数据", arrPoints);
      //  if (_heatLayer) this.clearHeatData();
      // 热力图 图层
      let heatLayer = new mars3d.layer.HeatLayer({
        positions: arrPoints,
        max: 2000,
        heatStyle: {
          radius: 60,
          minOpacity: 0,
          maxOpacity: 0.4,
          blur: 0.4,
          gradient: {
            0: "#e9ec36",
            0.25: "#ffdd2f",
            0.5: "#fa6c20",
            0.75: "#fe4a33",
            1: "#ff0000",
          },
        },
        // 以下为矩形矢量对象的样式参数
        // style: {
        //   opacity: 0.5,
        // },
      });
      map.addLayer(heatLayer);

      // 初始化查询
      let data = {
        endDate: "",
        startDate: this.currentDate,
      };
      let res = await 查询舰艇实时状态详情V3(data);
      if (res.code === 200) {
        if (res.rows && res.rows.length > 0) {
          res.rows.forEach((item, index) => {
            let graphic;
            if (item.states === "部署") {
              this.totalArr.部署中.push(item);
              graphic = this.initGraphic(item, "img/ui/tLAN.png");
              graphicLayer.addGraphic(graphic);
              graphic.openTooltip();
            } else if (item.states === "维修") {
              this.totalArr.维修中.push(item);
              graphic = this.initGraphic(item, "img/ui/tHong.png");
              graphicLayer.addGraphic(graphic);
              graphic.openTooltip();
            } else if (item.states === "在港演训") {
              this.totalArr.在港演训.push(item);
              graphic = this.initGraphic(item, "img/ui/tCheng.png");
              graphicLayer.addGraphic(graphic);
              graphic.openTooltip();
            } else if (item.states === "在港备勤") {
              this.totalArr.在港备勤.push(item);
              graphic = this.initGraphic(item, "img/ui/ting.png");
              graphicLayer.addGraphic(graphic);
              graphic.openTooltip();
            }
          });
        }
      }
      // 2.在layer上绑定监听事件
      graphicLayer.on(mars3d.EventType.click, function (event) {
        console.log("你单击了", event);
        // debugger;
        if (map.camera.positionCartographic.height > 90000) {
          const graphic = event.graphic;
          // graphic.closePopup()
          if (graphic) {
            console.log("单击了单点", event);
            // 点击divGraphic没有id
            if (event.id) {
              // 单击了具体的点对象
              self.$router.push({
                path: "/situationDetails",
                query: {
                  sideNum: event.graphic.options.attr.name,
                  state: event.graphic.options.attr.state,
                  lat: event.graphic.options.attr.lat,
                  lng: event.graphic.options.attr.lng,
                  dataDetails: event.graphic.attr,
                },
              });
            }
          } else {
            self.count++;
            // 单击了聚合的点
            console.log("单击了聚合点", event);
          }
        }
      });

      graphicLayer.on(mars3d.EventType.mouseOver, async function (event) {
        console.log("监听layer，鼠标移入了矢量对象", event);
        let inthtml;
        if (event.graphic) {
          let attr = event.graphic.options.attr;
          if (event.graphic.options.attr.state === "部署") {
            inthtml = `<table style="width:280px;">
                      <tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">${
                        attr.name
                      }</th></tr>
                      <tr><td >部署出发时间：</td><td >${attr.begintime} ${
              attr.flag === "1" ? "（判）" : ""
            }</td></tr><tr><td >已部署时长：</td><td >${
              attr.duration
            } 天</td></tr>
                      <tr><td >预计结束时间：</td><td >${
                        attr.endtime
                      } </td></tr><tr><td >备注：</td><td >${
              attr.remark
            } </td></tr>
                    </table>`;
          } else if (
            event.graphic.options.attr.state === "在港演训" ||
            event.graphic.options.attr.state === "在港备勤"
          ) {
            inthtml = `<table style="width:280px;">
                      <tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">${
                        attr.name
                      }</th></tr>
                      <tr><td >在岗时间：</td><td >${attr.begintime} ${
              attr.flag === "1" ? "（判）" : ""
            }</td></tr></tr><tr><td ></td><td ></td></tr>
                      <tr><td >已在港时长：</td><td >${
                        attr.duration
                      } 天</td></tr>
                      <tr><td >预计部署时长（概率）：</td><td >${
                        attr.percent
                      }% </td></tr>
                    </table>`;
          } else if (event.graphic.options.attr.state === "维修") {
            inthtml = `<table style="width:280px;">
                      <tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">${
                        attr.name
                      }</th></tr>
                      <tr><td >维修开始时间：</td><td >${attr.begintime} ${
              attr.flag === "1" ? "（判）" : ""
            }</td></tr>
                      <tr><td >已维修时长：</td><td >${
                        attr.duration
                      } 天</td></tr>
                    </table>`;
          }
          event.graphic.bindTooltip(inthtml);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.map {
  width: calc(80% - 5px);
  margin-left: 5px;
  height: calc(100% / 3 * 2 - 5px);
  margin-bottom: 5px;
  background-color: purple;
}
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
  .zaiYan {
    border-color: orange;
    // margin-right: 0px;
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
