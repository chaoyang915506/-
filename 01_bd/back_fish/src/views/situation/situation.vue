<template>
  <div id="centerDiv" class="mapcontainer">
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
    <div class="downLoad">
      <i @click="downLoad" class="el-icon-download xxxxxxxxxxxx"></i>
    </div>
  </div>
</template>

<script>
import MarsMap from "@/components/mars-work/mars-map.vue";
import {
  查询舰艇实时状态详情V2,
  查询舰艇实时状态详情V3,
  舰艇数据导出,
  舰艇数据导出V2
} from "@/api/situation/situation";
let graphicLayer; // 矢量图层对象,用于graphic绑定展示
export default {
  name: "Situation",
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
        // 在港: [],
        在港演训: [],
        在港备勤: [],
      },
      // 存储相同坐标的集合，用来判断是单点还是聚合点
      positionrGoup: [],
      cloursToolTip: null,
    };
  },
  methods: {
    initGraphic(item, imgSrc) {
      let graphic = new mars3d.graphic.BillboardEntity({
        name: item.name,
        position: [ item.lng, item.lat, 1],
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
    initFlatBillboard(item, imgSrc) {},
    async onMapload(map) {
      let self = this;
      graphicLayer = new mars3d.layer.GraphicLayer({
        clustering: {
          enabled: true,
          pixelRange: 20,
          clampToGround: false,
          // getImage: function (item) {
          //   return "img/ui/ting.png"
          // },
        },
      });
      map.addLayer(graphicLayer);

      // 初始化查询
      let data = {
        endDate: "",
        startDate: "2022-08-18",
      };
      // let res = await 查询舰艇实时状态详情(data);
      let res = await 查询舰艇实时状态详情V3(data);
      console.log(res);
      // debugger
      let arrData = [];
      if (res.code === 200) {
        if (res.rows && res.rows.length > 0) {
          self.uBoatData = res.rows;
          // let arrData = this.initFlatBillboard(res);
          // debugger
          // const flatBillboard = new mars3d.graphic.FlatBillboard({
          //   instances: arrData,
          // });
          // graphicLayer.addGraphic(flatBillboard);
          res.rows.forEach((item, index) => {
            // const position = [item.lat, item.lng, 1000];
            // const position = Cesium.Cartesian3.fromDegrees(
            //   item.lat,
            //   item.lng,
            //   1000
            // );
            // arrData.push({
            //   position: position,
            //   style: {
            //     width: 1000,
            //     height: 1000,
            //     image: "img/ui/tLAN.png",
            //   },
            //   scale3d: 0.2,
            //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            //     0,
            //     500000000
            //   ),
            // });

            let graphic;
            // debugger;
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
        // debugger
        // const flatBillboard = new mars3d.graphic.FlatBillboard({
        //   instances: arrData,
        // });
        // graphicLayer.addGraphic(flatBillboard);
      }

      // 2.在layer上绑定监听事件
      graphicLayer.on(mars3d.EventType.click, function (event) {
        //  if (self.cloursToolTip) self.cloursToolTip.destroy();
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
                  // sideNum: event.graphic.options.attr.sideNum,
                  // name: event.graphic.options.attr.name,
                  sideNum: event.graphic.options.attr.name,
                  // name: event.graphic.options.attr.name,
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
            self.addMenu(graphicLayer, event, self.count);
          }
        }
      });
      // graphicLayer.on(mars3d.EventType.clickMap, async function (event) {
      //   console.log(11111111111);
      //   if (self.cloursToolTip) self.cloursToolTip.destroy();
      // });
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
    addBlood(graphicLayer, item, index) {
      const graphic = new mars3d.graphic.DivGraphic({
        position: [item.lat, item.lng, 1000],
        style: {
          html: `<div class="marsRedGradientPnl" >
          <div class="marsRedGradientPnlIn"></div>
          </div>`,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          zIndex: 999999,
        },
      });

      graphicLayer.addGraphic(graphic);
    },
    addMenu(graphicLayer, event, index) {
      let self = this;
      let html = `<div id="accordion${index}">`;
      let p = null;
      // debugger
      event.pickedObject.id.forEach((item) => {
        p = item._properties;
        // console.log(p);
        let inthtml;
        let stateColor;
        if (p._state._value === "部署") {
          stateColor = `style='background:#28e2e3'`;
          inthtml = `<table style="width:280px;">
                      <tr><td >部署出发时间：</td><td >${p._begintime._value} ${
            p._flag._value === "1" ? "（判）" : ""
          }</td></tr><tr><td >已部署时长：</td><td >${
            p._duration._value
          } 天</td></tr>
                      <tr><td >预计结束时间：</td><td >${
                        p._endtime._value
                      } </td></tr><tr><td >备注：</td><td >${
            p._remark._value
          } </td></tr>
                    </table>`;
        } else if (p._state._value === "在港备勤") {
          stateColor = `style='background:#ebebeb'`;
          inthtml = `<table style="width:280px;">
                      <tr><td >在岗时间：</td><td >${p._begintime._value} ${
            p._flag._value === "1" ? "（判）" : ""
          }</td></tr><tr><td ></td><td ></td></tr>
                      <tr><td >已在港时长：</td><td >${
                        p._duration._value
                      } 天</td></tr>
                      <tr><td >预计部署时长（概率）：</td><td >${
                        p._percent._value
                      }% </td></tr>
                    </table>`;
        } else if (p._state._value === "在港演训") {
          stateColor = `style='background:orange'`;
          inthtml = `<table style="width:280px;">
                      <tr><td >在岗时间：</td><td >${p._begintime._value} ${
            p._flag._value === "1" ? "（判）" : ""
          }</td></tr><tr><td ></td><td ></td></tr>
                      <tr><td >已在港时长：</td><td >${
                        p._duration._value
                      } 天</td></tr>
                      <tr><td >预计部署时长（概率）：</td><td >${
                        p._percent._value
                      }% </td></tr>
                    </table>`;
        } else if (p._state._value === "维修") {
          stateColor = `style='background:#fe1e00'`;
          inthtml = `<table style="width:280px;">
                      <tr><td >维修开始时间：</td><td >${p._begintime._value} ${
            p._flag._value === "1" ? "（判）" : ""
          }</td></tr>
                      <tr><td >已维修时长：</td><td >${
                        p._duration._value
                      } 天</td></tr>
                    </table>`;
        }
        html += `<h3 ${stateColor}>${p._name._value}</h3>
                    <div class='tableContainner' style='background:azure;' sideNum='${p._name._value}'>
                    ${inthtml}
                    </div>`;
      });
      html += `</div>`;

      self.cloursToolTip = new mars3d.graphic.DivGraphic({
        position: [p._lat._value, p._lng._value, 1000],
        style: {
          html: html,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          zIndex: 999999,
        },
      });

      graphicLayer.addGraphic(self.cloursToolTip);
      console.log("aaaaa", self.cloursToolTip);
      $(`#accordion${index}`).accordion();

      const aa = document.getElementsByClassName(`tableContainner`);
      const arr = Array.from(aa);
      arr.forEach((item) => {
        item.addEventListener("click", function (e) {
          // debugger;
          let sideNum = e.currentTarget.getAttribute("sideNum");
          if (sideNum) {
            let target = self.uBoatData.find((item) => item.name === sideNum);
            self.$router.push({
              path: "/situationDetails",
              query: {
                sideNum: target.name,
                // name: target.name,
                state: target.states,
                lat: target.lat,
                lng: target.lng,
                dataDetails: target,
              },
            });
          }
        });
      });
    },
    async downLoad() {
      let formData = new FormData();
      formData.append("startDate", "2022-08-18");
      formData.append("endDate", "");
      let res = await 舰艇数据导出V2(formData);
      let blob = new Blob([res]);
      let filename = "态势评估报告.xlsx";
      let url = window.URL.createObjectURL(blob);
      let donloadElement = document.createElement("a");
      donloadElement.style.display = "none";
      donloadElement.href = url;
      donloadElement.download = filename;
      document.body.appendChild(donloadElement);
      donloadElement.click();
      document.body.removeChild(donloadElement);
      window.URL.revokeObjectURL(url);

      console.log(res);
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
.downLoad {
  color: white;
  position: absolute;
  right: 20px;
  top: 30px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  .xxxxxxxxxxxx {
    font-size: larger;
  }
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
