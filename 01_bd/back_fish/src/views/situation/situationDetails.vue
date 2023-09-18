<template>
  <div class="app-container">
    <div class="situationDetails">
      <div class="textContainner">
        <div class="tabContainner">
          <div class="tabNav">
            <div
              :class="[
                'tabTitle',
                leftTabInfo == '基础信息' ? 'activeInfo' : '',
              ]"
              @click="leftTabFn('基础信息')"
            >
              <a>基础信息</a>
            </div>
            <div
              :class="[
                'tabTitle',
                leftTabInfo == '当前状态' ? 'activeInfo' : '',
              ]"
              @click="leftTabFn('当前状态')"
            >
              <a>当前状态</a>
            </div>
            <div
              :class="[
                'tabTitle',
                leftTabInfo == '舰艇档案' ? 'activeInfo' : '',
              ]"
              @click="leftTabFn('舰艇档案')"
            >
              <a>舰艇档案</a>
            </div>
          </div>
        </div>
        <!-- 基础信息 -->
        <div v-if="leftTabInfo === '基础信息'" class="innerContainner">
          <div class="text">{{ data.sideNum }}</div>
          <div class="shortContainner">
            <div class="title">基础信息</div>
            <div class="context">
              <div class="context-info">
                <span v-for="(item, key, i) in baseInfo" :key="i">
                  {{ key }} : {{ item }}
                </span>
              </div>
              <div class="context-photo">
                <img :src="imgSrc" />
              </div>
            </div>
          </div>
          <div class="middelContainner">
            <div class="title">舰艇参数</div>
            <div class="context">
              <div class="context-Biginfo">
                <span v-for="(item, key, i) in tingInfo" :key="i">
                  {{ key }} : {{ item }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 当前状态 -->
        <div v-if="leftTabInfo === '当前状态'" class="innerContainner">
          <div class="text">{{ data.sideNum }}</div>
          <div class="longContainner">
            <div class="title">当前状态</div>
            <div class="context">
              <div class="context-info-state">
                <!-- <span v-for="(item, key, i) in data" :key="i">
                  {{ key }} : {{ item }}
                </span> -->
                <span>状态:{{ data.state }}</span>
                <template v-if="data.state === '部署'">
                  <span>部署地点 : {{ data.dataDetails.position }}</span
                  ><span>部署时长 : {{ data.dataDetails.duration }} 天</span>
                  <span>出发时间 : {{ data.dataDetails.begintime }}</span
                  ><span>经过地点 :</span>
                </template>
                <template
                  v-if="data.state === '在港演训' || data.state === '在港备勤'"
                >
                  <span>在港地点 : {{ data.dataDetails.position }}</span
                  ><span>在港时长 : {{ data.dataDetails.duration }} 天</span>
                </template>
                <template v-if="data.state === '维修'">
                  <span>维修种类 :</span
                  ><span>维修地点 : {{ data.dataDetails.position }}</span
                  ><span>开始时间 : {{ data.dataDetails.begintime }}</span>
                  <span
                    >发动机维修时长 : {{ data.dataDetails.duration }} 天</span
                  >
                  <span
                    >信号雷达维修时长 : {{ data.dataDetails.duration }} 天</span
                  >
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- 舰艇档案 -->
        <div v-if="leftTabInfo === '舰艇档案'" class="innerContainner">
          <div class="text">{{ data.sideNum }}</div>
          <div class="middelContainner">
            <div class="title">演习训练</div>
            <div class="context">
              <div class="context-Biginfo">
                <el-timeline>
                  <el-timeline-item v-for="(item, i) in fileList" :key="i">
                    {{ item.time }}<br />
                    {{ item.content }}
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
          </div>
          <div class="shortContainner">
            <div class="title">特殊事件</div>
            <div class="context">
              <div class="context-Biginfo"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="centerContainner">
        <div class="middleTitle">
          <span style="margin-right: 10px">显示AIS数据</span>
          <el-switch
            v-model="AISOPEN"
            :active-value="true"
            @change="switchChange"
            style="--el-switch-on-color: #0eaac0"
          >
          </el-switch>
        </div>
        <mars-map :url="configUrl" :options="mapOptions" @onload="onMapload" />
        <div class="lifeDate">
          <customMenuSituation
            :chartData="this.sondata.lifedata"
            @drawAndMove="drawAndMove"
          ></customMenuSituation>
        </div>
      </div>
      <div class="textContainner">
        <div class="tabContainner">
          <div class="tabNav">
            <div
              :class="[
                'tabTitle',
                rightTabInfo == '近期数据' ? 'activeInfo' : '',
              ]"
              @click="rightTabFn('近期数据')"
            >
              <a>近期数据</a>
            </div>
            <div
              :class="[
                'tabTitle',
                rightTabInfo == '统计信息' ? 'activeInfo' : '',
              ]"
              @click="rightTabFn('统计信息')"
            >
              <a>统计信息</a>
            </div>
            <div
              :class="[
                'tabTitle',
                rightTabInfo == '人员信息' ? 'activeInfo' : '',
              ]"
              @click="rightTabFn('人员信息')"
            >
              <a>人员信息</a>
            </div>
          </div>
        </div>
        <div v-if="rightTabInfo === '近期数据'" class="innerContainner">
          <div class="longContainner">
            <div class="title">社媒数据</div>
            <i @click="download()" class="downAll el-icon-download"></i>
            <RecentData :mediaInfo="mediaInfo"></RecentData>
          </div>
        </div>
        <div v-if="rightTabInfo === '统计信息'" class="innerContainner">
          <div class="longContainner">
            <div class="title">统计信息</div>
            <StatisticInfo :sondata="sondata"></StatisticInfo>
          </div>
        </div>
        <div v-if="rightTabInfo === '人员信息'" class="innerContainner">
          <div class="longContainner">
            <div class="title">人员信息</div>
            <Human :humanInfo="humanInfo"></Human>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import path from "lib/pathdata.json";
import MarsMap from "@/components/mars-work/mars-map.vue";
import Human from "./comp/human.vue";
import RecentData from "./comp/recentData.vue";
import StatisticInfo from "./comp/statisticInfo.vue";
import customMenuSituation from "@/components/Timeline/customMenuSituation.vue";
import { parseTime } from "@/utils/ruoyi";
import {
  根据弦号查询详情,
  查询图片服务器地址,
  舰艇档案信息,
  社交媒体信息,
  查询MMIS数据,
  社交媒体数据数据导出,
  根据弦号查询人员,
} from "@/api/situation/situation";
import {
  单艇战备率,
  单艇停泊位置点,
  单艇战备出动率,
  潜艇信息根据舷号查询,
  单艇生命周期查询,
  单艇生命周期查询新时间轴调用,
} from "@/api/analyse/analyse.js";
let graphicLayer; // 矢量图层对象,用于graphic绑定展示
let pathEntity = null;

export default {
  name: "SituationDetails",
  components: {
    MarsMap,
    Human,
    RecentData,
    StatisticInfo,
    customMenuSituation,
  },
  data() {
    const basePathUrl = window.basePathUrl || "";
    return {
      _map: null,
      AISOPEN: false,
      leftTabInfo: "基础信息",
      rightTabInfo: "近期数据",
      configUrl: basePathUrl + "config/situationDetails.json",
      mapOptions: {
        scene: {
          center: {
            lng: this.$route.query.lng,
            lat: this.$route.query.lat,
            // lng: 116.3257,
            // lat: 39.9085,
            alt: 5098707,
            heading: 5,
            pitch: -88,
          },
        },
      }, //自定义地球配置参数
      data: this.$route.query,
      imgSrc: "",
      baseInfo: {
        舰艇名称: "",
        舰艇弦号: "",
        级别批次: "",
        入役时间: "",
        建造方: "",
        母港: "",
        状态: "",
      },
      tingInfo: {
        排水量: "",
        浮航排水: "",
        潜航排水: "",
        吃水深度: "",
        舰长: "",
        舰宽: "",
        动力系统: "",
        航速: "",
        潜深: "",
        编制艇员: "",
        武器装备: "",
      },
      mmsi: "",
      mmsiData: [],
      mmsiGraphicArr: [],
      mediaInfo: [],
      humanInfo: [],
      fileList: [],
      sondata: {
        fingthD: { value: 0.206666 },
        barthData: {
          seriesdata: [],
          xdata: [],
        },
        combatdata: {},
        zdydata: {
          leftdata: [{ value: 3, ddd: 99 }, { value: 20 }, { value: 62 }],
          rightdata: [11, 38, 23],
          ydata: ["部署次数", "维修次数", "停靠点"],
        },
        lifedata: [],
      },
    };
  },
  async mounted() {
    console.log(this.$route.query);
    // alert(this.$route.query.lat);
    // alert(this.$route.query.lng);
    let res = await 社交媒体信息(this.data.sideNum);
    if (res.rows && res.rows.length > 0) {
      res.rows.forEach((item) => {
        let data = { ...item };
        this.mediaInfo.push(data);
      });
      console.log(this.mediaInfo);
    }
    let re = await 根据弦号查询人员(this.data.sideNum);
    if (re.rows && re.rows.length > 0) {
      re.rows.forEach((item) => {
        let data = { ...item };
        this.humanInfo.push(data);
      });
      console.log(this.humanInfo);
    }
  },
  methods: {
    async onMapload(map) {
      this._map = map;
      map.flyHome({ duration: 2000 });
      map.openFlyAnimation({
        callback: function () {
          // 动画播放完成后回调
        },
      });
      // alert(2);
      let self = this;
      graphicLayer = new mars3d.layer.GraphicLayer();
      map.addLayer(graphicLayer);
      let graphic;
      if (this.data.state === "部署") {
        graphic = this.drawGraphic(this.data, "img/ui/tLAN.png");
      } else if (this.data.state === "维修") {
        graphic = this.drawGraphic(this.data, "img/ui/tHong.png");
      } else if (this.data.state === "在港演训") {
        graphic = this.drawGraphic(this.data, "img/ui/tCheng.png");
      } else if (this.data.state === "在港备勤") {
        graphic = this.drawGraphic(this.data, "img/ui/ting.png");
      }
      graphicLayer.addGraphic(graphic);
      let re = await 查询图片服务器地址();
      this.imgSrc = re.data.imageServerUri + "jh/" + this.data.sideNum + ".png";
      let res = await 根据弦号查询详情(this.data.sideNum);
      console.log(res);
      if (res.rows && res.rows.length > 0) {
        this.baseInfo.舰艇名称 = res.rows[0].smName;
        this.baseInfo.舰艇弦号 = res.rows[0].sideNum;
        this.baseInfo.级别批次 = res.rows[0].jbpc;
        this.baseInfo.入役时间 = parseTime(res.rows[0].rysj, "{y}年{m}月{d}日");
        this.baseInfo.建造方 = res.rows[0].jzf;
        this.baseInfo.母港 = res.rows[0].harborName;
        this.baseInfo.状态 = res.rows[0].smStatus;
        this.tingInfo.排水量 = res.rows[0].psl;
        this.tingInfo.浮航排水 = res.rows[0].fhps;
        this.tingInfo.潜航排水 = res.rows[0].qhps;
        this.tingInfo.吃水深度 = res.rows[0].cssd;
        this.tingInfo.舰长 = res.rows[0].tz;
        this.tingInfo.舰宽 = res.rows[0].tk;
        this.tingInfo.动力系统 = res.rows[0].dlxt;
        this.tingInfo.航速 = res.rows[0].sh;
        this.tingInfo.潜深 = res.rows[0].qs;
        this.tingInfo.编制艇员 = res.rows[0].bzty;
        this.tingInfo.武器装备 = res.rows[0].wqzb;
        this.mmsi = res.rows[0].mmsi;
      }
      // debugger
      self.getdanting(self.data.sideNum);
      // debugger  this.mmsi  369970220
      let mmres = await 查询MMIS数据(this.mmsi, 0, 16538273740002);
      this.mmsiData = mmres.rows;
      console.log("mmis", mmres);
      // if (mmres.rows && mmres.rows.length > 0) {
      //   this.initPath(mmres.rows, map);
      // }

      // debugger
      // self.data.sideNum
      let ress = await 舰艇档案信息(this.data.sideNum);
      if (ress.rows && ress.rows.length > 0) {
        ress.rows.forEach((item) => {
          let data = {
            createBy: item.createBy,
            createTime: item.createTime,
            shortContainnerdateBy: item.shortContainnerdateBy,
            shortContainnerdateTime: item.shortContainnerdateTime,
            remark: item.remark,
            id: item.id,
            name: item.name,
            time: parseTime(item.time, "{y}-{m}-{d}"),
            content: item.content,
            position: item.position,
            category: item.category,
            priority: item.priority,
          };
          self.fileList.push(data);
        });
      }
    },
    drawAndMove(item) {
      let self = this;
      item.lat = item.c2.split(",")[0];
      item.lng = item.c2.split(",")[1];
      let graphic;
      if (this.data.state === "部署") {
        graphic = this.drawGraphic(item, "img/ui/tLAN.png");
      } else if (this.data.state === "维修") {
        graphic = this.drawGraphic(item, "img/ui/tHong.png");
      } else if (this.data.state === "在港演训") {
        graphic = this.drawGraphic(item, "img/ui/tCheng.png");
      } else if (this.data.state === "在港备勤") {
        graphic = this.drawGraphic(item, "img/ui/ting.png");
      }
      graphicLayer.addGraphic(graphic);
      graphic.openTooltip();
      graphicLayer.on(mars3d.EventType.mouseOver, async function (event) {
        let inthtml;
        let attr = event.graphic.options.attr;
        inthtml = `<table style="width:280px;">
                      <tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">${self.data.sideNum}</th></tr>
                      <tr><td >开始时间：</td><td >${item.startTime} </td></tr><tr><td >事件名称：</td><td >${item.event} </td></tr>
                    </table>`;

        event.graphic.bindTooltip(inthtml);
      });
      let point = new mars3d.LngLatPoint(item.lng, item.lat, 5000000);
      this._map.flyToPoint(point, {
        radius: 1000,
        duration: 3,
      });
    },
    //单停查询
    async getdanting(i) {
      // console.log(i, "shemgou");

      let res = await 单艇战备率(i);
      console.log(res);
      // console.log(res.slice(0, res.length - 1) / 100);
      this.sondata.fingthD = {
        value: res.slice(0, res.length - 1) / 100,
      };
      let res1 = await 单艇停泊位置点(i);
      let apaa = res1.rows.sort((a, b) => b.berthCount - a.berthCount);
      // console.log(res1, "地点");
      this.sondata.barthData = {
        seriesdata: apaa.map((i) => i.berthCount),
        xdata: apaa.map((i) => i.addr),
      };
      // console.log(this.sondata.barthData, "reds");

      let res2 = await 单艇战备出动率(i);
      let date = new Date().getFullYear() - 9;
      let arr = [];
      for (let i = date; i <= new Date().getFullYear(); i++) {
        arr.push(i);
      }
      let time = arr.map((i) => {
        let ddd = res2.rows.find((idx) => idx.year == i);
        return {
          xdata: i,
          seriesdata: ddd ? ddd.deployCount : 0,
        };
      });
      this.sondata.combatdata = {
        xdata: time.map((i) => i.xdata),
        seriesdata: time.map((i) => i.seriesdata),
      };
      //生命周期
      this.getdantinglife(i);
    },
    async getdantinglife(idx) {
      // let res7 = await 单艇生命周期查询新时间轴调用({ names: idx });
      let res7 = await 单艇生命周期查询({ names: idx });
      console.log(res7, "shenmingzhouqi");
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
        .map((i) => {
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
            if (rgb[j].endtime > rgb[j + 1].begintime) {
              console.log(
                "结束部署的结束时间",
                rgb[j].endtime,
                "后面时间的开始时间",
                rgb[j + 1].begintime
              );
              let temp = null;
              temp = rgb[j + 1];
              rgb[j + 1] = rgb[j];
              rgb[j] = temp;
              console.log("交换位置", j);
            } else {
              console.log("跳出内循环", j);
              break;
            }
            console.log("结束部署", i, rgb[i]);
          }
        }
      }
      // console.log(rgb, "rgb");
      this.sondata.lifedata = rgb;
    },
    leftTabFn(val) {
      this.leftTabInfo = val;
    },
    rightTabFn(val) {
      this.rightTabInfo = val;
    },
    drawGraphic(item, imgSrc) {
      let graphic = new mars3d.graphic.BillboardEntity({
        // name: item.name,
        position: [item.lng, item.lat, 1000],
        style: {
          image: imgSrc,
          scale: 0.03,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          clampToGround: true,
        },
      });
      return graphic;
    },
    switchChange(e) {
      // console.log(e)
      if (e === true) {
        this.initPath(this.mmsiData, this._map);
      } else {
        this.mmsiGraphicArr.forEach((item) => {
          item.destroy();
          // item.remove(true);
        });
      }
    },

    initPath(data, map) {
      // data = pathArr
      const property = new Cesium.SampledPositionProperty();
      property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;

      let start;
      let stop;
      for (let i = 0, len = data.length; i < len; i++) {
        const item = data[i];
        // const lng = Number(item.x.toFixed(6)); // 经度
        // const lat = Number(item.y.toFixed(6)); // 纬度
        // const height = item.z; // 高度
        // const time = item.time; // 时间
        const lng = Number(item.lng.toFixed(6)); // 经度
        const lat = Number(item.lat.toFixed(6)); // 纬度
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
          // popup: "名称:" + item.name +"<br/>时间:" + item.intime,
        });
        this.mmsiGraphicArr.push(graphic);
        graphic.bindTooltip("名称:" + item.name + "<br/>时间:" + item.intime);
        graphicLayer.addGraphic(graphic);
      }
    },
    // 下载右边全部数据
    async download() {
      let ids = [];
      this.mediaInfo.forEach((item) => {
        ids.push(item._id);
      });
      let formData = new FormData();
      formData.append("ids", ids);
      let res = await 社交媒体数据数据导出(formData);
      let blob = new Blob([res]);
      let filename = "全部社媒数据.zip";
      let url = window.URL.createObjectURL(blob);
      let donloadElement = document.createElement("a");
      donloadElement.style.display = "none";
      donloadElement.href = url;
      donloadElement.download = filename;
      document.body.appendChild(donloadElement);
      donloadElement.click();
      document.body.removeChild(donloadElement);
      window.URL.revokeObjectURL(url);
    },
  },
};
</script>

<style lang="scss" scoped>
$btnbg: rgb(14, 170, 192);
$btncolor: #0eaac0;
$colorbg: #0c3c69;
.situationDetails {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: calc(100vh - 124px);
}
.textContainner {
  display: flex;
  flex-direction: column;
  width: 30%;
  height: 100%;
  overflow: auto;
  .tabContainner {
    position: relative;
    width: 100%;
    .tabNav {
      display: flex;
      padding: 0 20px;
      justify-content: center;
      margin-bottom: 10px;
      .tabTitle {
        transform: skew(-40deg);
        flex: 1;
        margin-right: 10px;
        height: 30px;
        line-height: 30px;
        display: inline-block;
        background-color: $colorbg;
        text-align: center;
        color: $btncolor;
        border: 0px;
        a {
          font-weight: 500;
          display: block;
          transform: skew(40deg);

          font-size: 12px;
        }
        div {
          transform: skew(45deg);
          font-size: 12px;
        }
      }
      .activeInfo {
        color: #0f1c40 !important;
        background-color: $btnbg !important;
      }
    }
  }
}
.innerContainner {
  width: 100%;
  height: 100%;
  background-image: url("/img/ui/border.png");
  background-repeat: round;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
  margin-right: 20px;
  .text {
    color: #fff;
    height: 50px;
    line-height: 75px;
    text-align: left;
    align-self: self-start;
    margin-left: 32px;
  }
  .shortContainner {
    width: 90%;
    height: 30%;
    margin-top: 10px;
    margin-bottom: 20px;
    background-image: url("/img/ui/border21.png");
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .middelContainner {
    width: 90%;
    height: calc(70% - 50px);
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("/img/ui/border23.png");
    background-size: 100% 100%;
    position: relative;
  }
  .longContainner {
    width: 90%;
    height: calc(100% - 50px);
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("/img/ui/border23.png");
    background-size: 100% 100%;
    position: relative;
  }
  .title {
    color: #fff;
    background-image: url("/img/ui/title.png");
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    width: 120px;
    height: 30px;
    text-align: center;
  }
  .downAll {
    cursor: pointer;
    position: absolute;
    top: 8px;
    right: 40px;
    color: #fff;
  }
  .context {
    background: rgb(15, 28, 64);
    width: calc(100% - 36px);
    height: calc(100% - 40px);
    color: #fff;
    display: flex;
    padding-top: 15px;
    padding-left: 6px;
    overflow: auto;
    .context-info {
      display: flex;
      flex-direction: column;
      width: 65%;
      line-height: 30px;
    }
    .context-info-state {
      display: flex;
      flex-direction: column;
      width: 90%;
      line-height: 30px;
    }
    .context-photo {
      width: 35%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
.centerContainner {
  width: 100%;
  height: 100%;
  position: relative;
  .middleTitle {
    position: absolute;
    left: 20px;
    top: 10px;
    z-index: 100;
    color: #0eaac0;
    display: flex;
    align-items: center;
  }
  .lifeDate {
    width: 80%;
    height: 120px;
    position: absolute;
    background: rgb(37, 49, 82);
    border: 1px solid #fff;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    z-index: 10000;
    // color: #0eaac0;
    // display: flex;
    // align-items: center;
  }
}
.right {
  width: 20%;
  height: 85%;
  background-image: url("/img/ui/border.png");
  background-repeat: round;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
  margin-left: 20px;
}

.context-Biginfo {
  display: flex;
  flex-direction: column;
  width: 100%;
  line-height: 30px;
}

::v-deep .el-timeline-item__content {
  color: #fff;
}
::v-deep .el-switch.is-checked .el-switch__core {
  background-color: #0eaac0;
}
</style>
