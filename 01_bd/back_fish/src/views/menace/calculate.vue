<template>
  <div id="centerDiv" class="mapcontainer">
    <div class="left_box">
      <div class="content_text" style="position: relative">
        <div class="left_content">
          <div class="mugang_title"><div class="infoh">预测</div></div>
          <el-tabs
            v-model="acitveName"
            tab-position="top"
            @tab-click="tabClick"
          >
            <el-tab-pane label="组织机构" name="one">
              <el-tree
                ref="tree"
                :default-expand-all="true"
                :data="treeData"
                :props="treeProps"
                @node-click="treeClick"
              ></el-tree>
            </el-tab-pane>
            <el-tab-pane label="母港" name="second">
              <ul class="ulCont">
                <li class="harborfont" v-for="i in harbor" :key="i.harborId">
                  <div class="ulstle" @click="mugangfn(i)">
                    &nbsp;
                    <div class="ponit_state"></div>

                    {{ i.harborNameZh }}
                  </div>
                  <!-- <div
                    v-for="item in i.bdsSubmaines"
                    :key="item.smId"
                    style="margin: 2px 0 0 10px"
                  >
                    <div class="ponit_state"></div>
                    &nbsp;{{ item.sideNum }}
                  </div> -->
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>

          <!-- <div>
            <div>组织机构</div>
            <div>母港</div>
            <hr />
          </div> -->
          <!-- <el-tree
            v-show="left_info == 'zuzhi'"
            ref="tree"
            :data="treeData"
            :props="treeProps"
            @node-click="treeClick"
          ></el-tree> -->
        </div>
      </div>
    </div>
    <mars-map
      :style="{
        width: device == 'standalone' ? '50%' : '75%',
        height: 'calc(100vh - 120px)',
      }"
      :url="configUrl"
      @onload="onMapload"
    />
    <div style="width: 25%" v-if="device == 'standalone'">
      <div class="right_nav">
        <!-- activeinofo -->
        <div class="left_title activeinofo">
          <a href="#">概况</a>
        </div>
      </div>
      <div class="right_box" v-if="device == 'standalone'">
        <div class="content_text" style="position: relative">
          <div class="left_content">
            <div class="mugang_title"><div class="infoh">预测</div></div>
            <div
              class="echarts"
              @click="lookchart('生命周期', 'customMenuEvent', sondata)"
            >
              <div class="title"><span></span>&emsp;生命周期</div>
              <customMenuSmall class="chart" :chartData="sondata" />
            </div>
            <div
              class="echarts"
              @click="lookchart('预测日历', 'calendar', calendarList)"
            >
              <div class="title"><span></span>&emsp;预测日历</div>
              <!-- <customMenuSmall class="chart" :chartData="sondata.lifedata" /> -->
              <calendar :calendarList="calendarList" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <eldog v-if="show" v-model="show" :title="didogtitle" width="70%">
      <component
        :messageshow="true"
        :max="true"
        :is="currentIndex"
        :chartData="lookdata"
        :calendarList="calendarList"
        :style="{
          width: ' 100%',
          height: currentIndex == 'customMenuEvent' ? '650px' : '100%',
        }"
      ></component>
    </eldog>
  </div>
</template>

<script>
import calendar from "./components/calendar";
import {
  查询组织机构,
  查询母港,
  查询自定义,
  查询兵力部署,
  单艇生命周期查询,
  通用查询舷号,
  态势模块状态信息根据弦号列表查询V3,
} from "@/api/analyse/analyse.js";
//以上暂时使用
import eldog from "@/components/Dialog/index.vue";
import table from "./components/table.vue";
import customMenuSmall from "@/components/Timeline/customMenuSmall.vue";
import MarsMap from "@/components/mars-work/mars-map.vue";
import customMenuEvent from "@/components/Timeline/customMenuEvent.vue";
import { parseTime } from "@/utils/ruoyi";
import {
  获取范围区域,
  威胁预测,
  预测根据弦号列表查询,
  预测根据弦号列表查询V2,
  威胁分析预测弦号日历集合,
} from "@/api/menace/menace";
let graphicLayer; // 矢量图层对象,用于graphic绑定展示
export default {
  name: "Calculate",
  components: {
    MarsMap,
    customMenuSmall,
    eldog,
    table,
    calendar,
    customMenuEvent,
  },
  data() {
    const basePathUrl = window.basePathUrl || "";
    return {
      lifeshow: false,
      show: false,
      value: "",
      didogtitle: "标题",
      currentIndex: MarsMap,
      lookdata: [],
      sondata: [],
      configUrl: basePathUrl + "config/config.json",
      acitveName: "one",
      customlist: "",
      treeData: [],
      device: "",
      harbor: [],
      treeProps: {
        children: "children",
        label: "name",
      },
      calendarList: {},
      _map: null,
      _graphicLayer: null,
      lonlatlist: [],
    };
  },
  created() {
    this.getLongItude();
    this.getframework();
    this.getdantinglife();
  },
  methods: {
    tabClick() {
      if (this.acitveName == "second") {
        this.device = "home";
      }
    },
    //查艇下的经纬度
    async getLongItude() {
      let res = await 态势模块状态信息根据弦号列表查询V3({
        startDate: "2022-08-18",
      });
      console.log(res, "red");
      this.lonlatlist = res.rows;
    },
    clearData() {
      this._graphicLayer.clear();
    },
    //获取艇的艇号
    async getSubMaineData(data) {
      let submaine;
      if (Array.isArray(data)) {
        submaine = data;
      } else {
        let res = await 通用查询舷号(data);
        submaine = res.rows;
      }
      let lastdata = submaine
        .map((item) => {
          let results = this.lonlatlist.find((i) => i.name == item.sideNum);
          // console.log(results, "results");
          return results ? results : null;
        })
        .filter((i) => i);
      console.log(lastdata, "lastdata");
      this.findSubMaine(lastdata);
    },

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

    async findSubMaine(subMaineData) {
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
        // console.log("你单击了", event);
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

    //日历图
    async getCalendar(idx) {
      // console.log("jinqu");
      let res = await 威胁分析预测弦号日历集合(idx);
      let resd = {
        wxCalendars: res.rows[0].wxCalendars.map((i) => {
          return parseTime(i, "{y}-{m}-{d}");
        }),
        bsCalendars: res.rows[0].bsCalendars.map((i) => {
          return parseTime(i, "{y}-{m}-{d}");
        }),
        fgCalendars: res.rows[0].fgCalendars.map((i) => {
          return parseTime(i, "{y}-{m}-{d}");
        }),
      };
      // console.log(resd, "redsf");
      this.calendarList = resd;
    },
    //单艇生命周期
    async getdantinglife(idx) {
      let res7 = await 单艇生命周期查询({ names: idx.name });
      // console.log(res7, "shenmingzhouqi");
      // let rd = this.sondata.lifedata;
      let reg = new RegExp("部署", "i");
      let reg2 = new RegExp("维修", "i");
      let reg3 = new RegExp("停泊", "i");
      let reg4 = new RegExp("行驶", "i");
      let reg5 = new RegExp("战斗", "i");
      let overReg = new RegExp("结束部署", "i");
      let rgb = res7.rows
        .map((i, j) => {
          let tooltipStyle;
          if (j % 2 == 0) {
            tooltipStyle = {
              top: "-10vw",
              bottom: 0,
              boxWidth: "",
            };
          } else {
            tooltipStyle = {
              bottom: "-10vw",
              top: "30px",
              boxWidth: "",
            };
          }
          return {
            ...i,
            startTime: this.parseTime(i.begintime, "{y}-{m}-{d}"),
            // eventType: "",
            timeLineWidth: "",
            // event: i.event,
            tooltipStyle,
          };
        })
        .map((i, index) => {
          if (reg.test(i.event)) {
            return { ...i, color: "#0eaac0", xueTop: "-150px" };
          } else if (reg2.test(i.event)) {
            return { ...i, color: "#ff0606", xueTop: "-50px" };
          } else if (reg3.test(i.event)) {
            //停泊
            return { ...i, color: "#78521a", xueTop: "-100px" };
          } else if (reg4.test(i.event)) {
            //行驶
            return { ...i, color: "#007acc", xueTop: "-200px" };
          } else if (reg5.test(i.event)) {
            //战斗
            return { ...i, color: "#f0a21b", xueTop: "-250px" };
          } else {
            return {
              ...i,
              color: "#878787",
              xueTop: "-250px",
            };
          }
        });
      // 如果是结束部署的事件，需要和下一个事件的时间作对比，如果下一个事件的开始时间小于结束部署的结束时间，就给两个元素换位置，然后再往下重复执行该操作。
      for (var i = 0; i < rgb.length; i++) {
        if (overReg.test(rgb[i].event)) {
          // 结束部署的开始时间，显示为结束时间
          rgb[i].startTime = this.parseTime(rgb[i].endtime, "{y}-{m}-{d}");
          for (var j = i; j < rgb.length; j++) {
            // console.log(
            //   "结束部署的结束时间",
            //   rgb[j].endtime,
            //   "后面时间的开始时间",
            //   rgb[j + 1].begintime
            // );
            if (rgb[j].endtime > rgb[j + 1].begintime) {
              // console.log(
              //   "结束部署的结束时间",
              //   rgb[j].endtime,
              //   "后面时间的开始时间",
              //   rgb[j + 1].begintime
              // );
              let temp = null;
              temp = rgb[j + 1];
              rgb[j + 1] = rgb[j];
              rgb[j] = temp;
              // console.log("交换位置", j);
            } else {
              // console.log("跳出内循环", j);
              break;
            }
            // console.log("结束部署", i, rgb[i]);
          }
        }
      }
      // console.log(rgb, "rgb");
      this.sondata = rgb;
    },
    mugangfn(i) {
      if (i.harborId) {
        this.getSubMaineData({ queryType: 2, id: i.harborId });
      }
      // console.log(i, "name");
      this.gettable({ params: 2, id: i.harborId });
    },
    lookchart(title, val, data) {
      this.lookdata = data;
      this.didogtitle = title;
      this.currentIndex = val;
      // console.log(data, "xsss");
      this.show = true;
    },

    async gettable(e) {
      let parasm;
      if (e.params == 3) {
        parasm = {
          queryType: 3,
          id: e.id,
        };
      } else {
        parasm = { queryType: 1, id: e.id };
      }
      let res = await 预测根据弦号列表查询V2(parasm);
      // console.log(res.rows);
      this.lookdata = res.rows;
      this.lookchart("舰艇预测详情", table, res.rows);
    },
    //树形点击
    async treeClick(e) {
      this.device = "detat";

      if (e.dataType != 2) {
        this.nextinfo = e.children;
      }
      if (new RegExp("司令").test(e.name)) {
        this.getSubMaineData({ queryType: 1, id: e.id });

        this.gettable(e);
      } else if (new RegExp("大队").test(e.name)) {
        this.getSubMaineData({ queryType: 1, id: e.id });

        this.gettable(e);
      } else if (new RegExp("中队").test(e.name)) {
        this.getSubMaineData({ queryType: 1, id: e.id });

        this.gettable(e);
      } else if (e.dataType == 2) {
        await this.getdantinglife(e);
        this.getSubMaineData([{ sideNum: e.name }]);

        await this.getCalendar(e.name);
        this.device = "standalone";
      } else if (new RegExp("潜艇部队").test(e.name)) {
        this.getSubMaineData({ queryType: 1, id: "" });

        this.gettable(e);
      }
    },
    async getframework() {
      const res = await 查询组织机构();
      const barbor = await 查询母港();
      const submaine = await 查询自定义();
      const disposition = await 查询兵力部署();
      // console.log(submaine, "自定义");
      // console.log(barbor, "母港");
      // console.log(res, "res");
      // console.log(disposition, "兵力部署");
      this.customlist = submaine.rows;
      this.treeData = res.rows;
      this.harbor = barbor.rows;
    },
    async onMapload(map) {
      // console.log(map, "map");
      this._map = map;
      let self = this;
      graphicLayer = new mars3d.layer.GraphicLayer();
      this._graphicLayer = graphicLayer;
      map.addLayer(graphicLayer);
    },
  },
  // async onMapload(map) {
  //   let self = this;
  //   graphicLayer = new mars3d.layer.GraphicLayer();
  //   map.addLayer(graphicLayer);

  //   // let res = await 查询舰艇实时状态();
  //   // console.log(res);
  //   // if (res.code === 200) {
  //   //   if (res.rows && res.rows.length > 0) {
  //   //     res.rows.forEach((item, index) => {
  //   //       if (item.state === "部署中") {
  //   //         this.totalArr.部署中.push(item);
  //   //       } else if (item.state === "维修中") {
  //   //         this.totalArr.维修中.push(item);
  //   //       } else if (item.state === "在港") {
  //   //         this.totalArr.在港.push(item);
  //   //       }
  //   //       const graphic = new mars3d.graphic.BillboardEntity({
  //   //         name: "测试图标",
  //   //         position: [item.lat, item.lon, 1000],
  //   //         style: {
  //   //           image: "img/marker/mark-blue.png",
  //   //           scale: 1,
  //   //           horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
  //   //           verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  //   //           clampToGround: true,
  //   //         },
  //   //         attr: {
  //   //           sideNum: item.sideNum,
  //   //           smName: item.smName,
  //   //           state: item.state,
  //   //           remark: item.sideNum,
  //   //         },
  //   //       });
  //   //       graphicLayer.addGraphic(graphic);
  //   //     });
  //   //   }
  //   // }

  //   // 2.在layer上绑定监听事件
  //   graphicLayer.on(mars3d.EventType.click, function (event) {
  //     console.log("监听layer，单击了矢量对象", event);
  //     // debugger
  //     self.$router.push({
  //       path: "/situationDetails",
  //       query: {
  //         sideNum: event.graphic.options.attr.sideNum,
  //         state: event.graphic.options.attr.state,
  //       },
  //     });
  //   });
  //   graphicLayer.on(mars3d.EventType.mouseOver, async function (event) {
  //     console.log("监听layer，鼠标移入了矢量对象", event);
  //     // let data = {
  //     //   sideNum: event.graphic.options.attr.sideNum,
  //     //   state: event.graphic.options.attr.state,
  //     // };
  //     // let res = await 查询舰艇实时状态详情(data);
  //     // console.log(res);
  //     // let inthtml;
  //     // if (res.code === 200) {
  //     //   if (event.graphic.options.attr.state === "部署中") {
  //     //     inthtml = `<table style="width:280px;">
  //     //               <tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">${res.data.sideNum}</th></tr>
  //     //               <tr><td >返港概率：</td><td >${res.data.fggl}% </td></tr><tr><td >返港时间：</td><td >${res.data.fgDate} </td></tr>
  //     //               <tr><td >维修概率：</td><td >${res.data.wxgl}% </td></tr><tr><td >维修时间：</td><td >${res.data.wxDate} </td></tr>
  //     //             </table>`;
  //     //   } else if (event.graphic.options.attr.state === "在港") {
  //     //     inthtml = `<table style="width:280px;">
  //     //               <tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">${res.data.sideNum}</th></tr>
  //     //               <tr><td >出港概率：</td><td >${res.data.cggl}% </td></tr>
  //     //               <tr><td >维修概率：</td><td >${res.data.wxgl}% </td></tr>
  //     //               <tr><td >母港停留时间：</td><td >${res.data.mgtlDate} </td></tr>
  //     //             </table>`;
  //     //   } else if (event.graphic.options.attr.state === "维修中") {
  //     //     inthtml = `<table style="width:280px;">
  //     //               <tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">${res.data.sideNum}</th></tr>
  //     //               <tr><td >维修开始时间：</td><td >${res.data.wxStartDate} </td></tr>
  //     //               <tr><td >维修内容：</td><td >${res.data.wxContext} </td></tr>
  //     //               <tr><td >维修时长：</td><td >${res.data.wxDuration} </td></tr>
  //     //             </table>`;
  //     //   }

  //     //   event.graphic.bindTooltip(inthtml);
  //     // }
  //     // graphicLayer.addGraphic(event.graphic);
  //   });
  //   graphicLayer.on(mars3d.EventType.mouseOut, function (event) {
  //     console.log("监听layer，鼠标移出了矢量对象", event);
  //   });

  //   // 可在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效
  //   graphicLayer.bindContextMenu([
  //     {
  //       text: "删除对象",
  //       iconCls: "fa fa-trash-o",
  //       callback: function (e) {
  //         const graphic = e.graphic;
  //         if (graphic) {
  //           graphicLayer.removeGraphic(graphic);
  //         }
  //       },
  //     },
  //   ]);
  // },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
.left_content {
  height: 100%;
  overflow: auto;
}
.mapcontainer {
  position: relative;
  display: flex;
  height: 100%;
  overflow: hidden;
}
.total {
  color: white;
  position: absolute;
  right: 0;
  top: 0;
}
.infoh {
  width: 100%;
  position: absolute;
  top: 5%;
  left: 0;
  text-align: center;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
}
.right_box {
  position: relative;
  padding: 40px 29px;
  background: url("/img/ui/border.png");
  background-size: 100% 100%;
  height: calc(100vh - 120px);
}
.right_box {
  position: relative;
  padding: 40px 29px;
  height: calc(100vh - 120px);
  // background: url("../../assets/icons/common/border.png");
  background: url("/img/ui/border.png");
  background-size: 100% 100%;
  .content_text {
    padding: 40px 25px 40px;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: url("/img/ui/border21.png");
    background-size: 100% 100%;

    .icon_inside {
      position: absolute;
      padding: 0px 27px 60px 27px;
      left: 0;
      top: 0;
      width: 100%;
      height: 104%;
    }
  }
}
.left_box {
  position: relative;
  padding: 40px 29px;
  width: 25%;
  height: calc(100vh - 120px);
  // background: url("../../assets/icons/common/border.png");
  background: url("/img/ui/border.png");
  background-size: 100% 100%;

  .content_text {
    padding: 40px 25px 40px;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: url("/img/ui/border21.png");
    background-size: 100% 100%;

    .icon_inside {
      position: absolute;
      padding: 0px 27px 60px 27px;
      left: 0;
      top: 0;
      width: 100%;
      height: 104%;
    }
  }
}
.mugang_title {
  position: absolute;
  left: 37%;
  top: 1%;
  width: 120px;
  height: 30px;
  background-size: 100% 100%;
  background-image: url("/img/ui/title.png");
}
::v-deep .el-tabs__item {
  color: #fff;
}
::v-deep .el-tabs__active-bar {
  height: 4px;
  background-color: #0eaac0;
}
::v-deep .el-tabs__item.is-active {
  color: #0eaac0;
}
::v-deep .el-tab-pane {
  color: #fff;
}
.ulCont {
  list-style: none;
  padding-left: 10px;

  .harborfont {
    position: relative;
    // display: flex;
    // align-items: center;
    color: #fff;
    height: 30px;
    margin-top: 5px;

    // line-height: 20px;
    .ponit_state {
      display: inline-block;
      width: 4px;
      height: 4px;
      line-height: 20px;
      border-radius: 50%;
      background-color: #0eaac0;
    }
  }
}
::v-deep .el-tree-node:focus > .el-tree-node__content {
  background: #04051a;
}
.left,
.right {
  width: 25%;
  // transition: identifier 5s;
  // transition-duration: 10s;
}

//右侧的nav标题
.right_nav {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  padding: 0 20px;

  .right_title {
    flex: 0.9;
    transform: skew(-40deg);
    width: 25%;
    height: 20px;
    background-color: #0eaac0;
    text-align: center;
    margin-right: 3%;
    font-weight: 500;

    a {
      font-size: 12px;
      display: inline-block;
      transform: skew(40deg);
    }
  }
}
.left_content {
  padding: 0px 0px 0px 0;
  height: 95%;
  width: 100%;
  overflow: auto;

  // background-color: #0b163b;
  //   background-image: url('@/assets/icons/common/border2.png');
  //   background-size: cover;
  .ti {
    display: flex;
    justify-content: center;
  }

  .ulCont {
    list-style: none;
    padding-left: 10px;

    .harborfont {
      position: relative;
      // display: flex;
      font-size: 14px;
      // align-items: center;
      color: #fff;
      // height: 20px;

      // line-height: 20px;
      .ponit_state {
        display: inline-block;
        width: 4px;
        height: 4px;
        line-height: 20px;
        border-radius: 50%;
        background-color: $btncolor;
      }
    }
  }

  .mugang_title {
    background-image: url("/img/ui/title.png");
    position: absolute;
    top: 1%;
    // left: 35%;
    width: 120px;
    height: 30px;
    background-size: 100% 100%;

    .infoh {
      width: 100%;
      position: absolute;
      top: 5%;
      left: 0;
      text-align: center;
      color: #fff;
      font-weight: 700;
      font-size: 15px;
    }
  }
}

.data {
  position: relative;
  // height: 50%;
  height: 100%;
  margin-bottom: 10%;
  padding: 40px 25px 40px;
  width: 100%;
  background-image: url("/img/ui/border21.png");
  background-size: 100% 100%;

  .ti {
    display: flex;
    justify-content: center;
  }
}

.echarts {
  height: 200px;
  width: 100% !important;
  margin-bottom: 10px;
  .title {
    display: flex;
    // background-color: #0b153c;
    // justify-content: center;

    height: 18px;
    color: #fff;
    line-height: 18px;
    font-size: 14px;
    span {
      margin-right: 2px;
      display: inline-block;
      width: 2px;
      height: 20px;
      background-color: #0c9eb5;
    }
  }
  .chart {
    width: 100%;
    height: calc(100% - 20px);
  }
}

.right_tile_gaikuang {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  // background-image: url("/img/ui/border21.png");
  // background-size: 100% 100%;

  .gaikuang {
    position: relative;
    padding: 40px 25px 30px;
    width: 100%;
    background-image: url("/img/ui/border21.png");
    background-size: 100% 100%;
    margin-bottom: 10%;

    .ti {
      display: flex;
      justify-content: center;
    }
  }

  .data {
    position: relative;
    // height: 50%;
    margin-bottom: 10%;
    padding: 40px 25px 40px;
    width: 100%;
    background-image: url("/img/ui/border21.png");
    background-size: 100% 100%;

    .ti {
      display: flex;
      justify-content: center;
    }
  }
}
.ulstle {
  cursor: pointer;
}
.ulstle:hover {
  background-color: #0f1c40;
}
</style>
