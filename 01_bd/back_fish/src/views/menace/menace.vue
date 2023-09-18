<template>
  <div class="appContainer">
    <div class="left_box">
      <div class="content_text">
        <div class="mugang_title"><div class="infoh">威胁</div></div>
        <div class="check" v-if="checkAll === true" @click="cancelAllFn">
          取消全选
        </div>
        <div class="check" v-else @click="checkAllFn">全选</div>
        <div class="left_content">
          <ul class="ulCont">
            <li class="harborfont" v-for="(item, i) in subList" :key="i">
              <div class="ponit_state"></div>
              &nbsp;
              {{ item.sideNum }}
              <el-checkbox
                class="checkbox_css"
                v-model="item.checked"
                @change="checkChange(item, i)"
              ></el-checkbox>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div id="centerDiv" class="mapcontainer">
      <div class="timeLineContainner">
        <TimelineSliderVue
          @change="sliderChange"
          @input="sliderInput"
          :date="currentDate"
        >
          <div slot="sliderContent" slot-scope="scope">{{ scope.data }}</div>
        </TimelineSliderVue>
      </div>

      <mars-map :url="configUrl" @onload="onMapload" />
      <div class="leftContainner">
        <span class="wubiantu" @click="showWubian">态势分析五边图</span>
      </div>
      <elDialog v-model="show" title="态势分析五边图" width="70%">
        <Wubiantu style="width: 100%; height: 600px" :chartData="combatdata" />
      </elDialog>
    </div>
  </div>
</template>

<script>
import MarsMap from "@/components/mars-work/mars-map.vue";
import elDialog from "@/components/Dialog/index.vue";
import TimelineSliderVue from "@/components/TimelineSliderVue/src/index.vue";
import {
  获取范围区域V2,
  威胁预测,
  威胁预测V2,
  态势分析五边图,
  获取弦号列表V2,
  获取弦号列表V3,
} from "@/api/menace/menace";
import Wubiantu from "./echarts/wubiantu.vue";
let _graphicLayer; // 矢量图层对象,用于graphic绑定展示
let _map;
let _heatLayer;
export default {
  name: "Menace",
  components: {
    MarsMap,
    Wubiantu,
    TimelineSliderVue,
    elDialog,
  },
  data() {
    const basePathUrl = window.basePathUrl || "";
    return {
      configUrl: basePathUrl + "config/config.json",
      subList: [],
      sixEdgeList: [],
      checkAll: true,
      combatdata: {
        indicator: [],
        value: [],
      },
      heatDataList: [],
      currentDate: "2022-08-18",
      currentSim: "SSN721",
      show: false,
    };
  },
  mounted() {
    this.$nextTick(function () {
      this.getEchartData();
    });
  },
  methods: {
    showWubian(val, data) {
      this.show = true;
    },
    sliderChange(data, value) {
      this.currentDate = data;
      console.log("数值改变", data, value);
    },
    sliderInput(data, value) {
      this.currentDate = data;
      console.log("拖拽", data, value);
      this.getHeatData(this.subList, data);
    },
    // 态势分析五边图
    async getEchartData() {
      let wu = await 态势分析五边图();
      if (wu.code == 200) {
        if (wu.data) {
          for (let key in wu.data) {
            this.combatdata.value.push(wu.data[key]);
          }
          for (let key in wu.data) {
            this.combatdata.indicator.push({
              name: key,
              max: Math.max.apply(null, this.combatdata.value),
            });
          }
        }
      }
    },
    clearHeatData() {
      _heatLayer.destroy();
    },
    async getHeatData(subList, date) {
      let checkList = [];
      subList.forEach((item) => {
        if (item.checked) {
          checkList.push(item.sideNum);
        }
      });
      console.log("选中的船啊", checkList);
      let arrPoints = [];
      let res = await 威胁预测V2(checkList.join(","), date);
      this.heatDataList = res.rows;
      console.log("热力值看一下", this.heatDataList);
      this.heatDataList.forEach((item) => {
        let tar = this.sixEdgeList.find((se) => se.id === item.id);
        // tar.possibility = item.possibility;
        let heatData = {
          lng: tar.center[0],
          lat: tar.center[1],
          value: item.sum_value,
        };
        arrPoints.push(heatData);
      });
      console.log("看一下热力数据", arrPoints);
      if (_heatLayer) this.clearHeatData();
      // 热力图 图层
      _heatLayer = new mars3d.layer.HeatLayer({
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
      _map.addLayer(_heatLayer);
      // _map.on(mars3d.EventType.mouseMove, (e) => {
      //   const point = mars3d.LngLatPoint.fromCartesian(e.cartesian);
      //   const data = _heatLayer.getPointData(point);
      //   // console.log(data);
      //   const inhtml = `
      // 经度: ${point.lng} <br />
      // 纬度: ${point.lat} <br />
      // X值: ${data.x} <br />
      // Y值: ${data.y} <br />
      // value值: ${data.value} <br />
      // 颜色:<span style="background-color: ${data.color};padding:2px 5px;">${data.color}</span>
      // `;
      //   _map.openSmallTooltip(e.windowPosition, inhtml);
      // });
    },
    async onMapload(map) {
      let self = this;
      _map = map;
      const submaine = await 获取弦号列表V3({
        startDate: this.currentDate,
        endDate: undefined,
      });
      if (submaine.rows && submaine.rows.length > 0) {
        submaine.rows.forEach((item) => {
          let data = {
            checked: true,
            sideNum: item.name,
          };
          self.subList.push(data);
        });
      }
      // debugger;
      _graphicLayer = new mars3d.layer.GraphicLayer();
      _map.addLayer(_graphicLayer);
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
            _graphicLayer.addGraphic(graphic);
          });
        }
        self.sixEdgeList = ret.rows;
      }
      console.time();
      this.getHeatData(this.subList, this.currentDate);
      console.timeEnd();
    },
    checkAllFn() {
      this.checkAll = true;
      this.subList.forEach((item, i) => {
        item.checked = true;
      });
      this.getHeatData(this.subList, this.currentDate);
    },
    cancelAllFn() {
      // debugger;
      this.checkAll = false;
      this.subList.forEach((item, i) => {
        item.checked = false;
      });
      this.getHeatData(this.subList, this.currentDate);
    },
    checkChange(item) {
      console.log(item);
      // 查询选中项
      this.subList.forEach((item, i) => {
        if (item.checked === true) {
        }
      });
      this.getHeatData(this.subList, this.currentDate);
    },
  },
};
</script>

<style lang="scss" scoped>
.appContainer {
  display: flex;
}
$btnbg: rgb(14, 170, 192);
$btncolor: #0eaac0;
$colorbg: #0c3c69;
.mapcontainer {
  position: relative;
  width: 80%;
  height: calc(100vh - 124px);
}
.left_box {
  margin: 20px;
  padding: 20px;
  width: 20%;
  background: rgba(122, 122, 143, 0.4);
  background: url("/img/ui/border.png");
  background-repeat: round;
  background-size: 100% 100%;

  .content_text {
    position: relative;
    height: 100%;
    width: 100%;
    // padding-top: 20px;
    padding: 40px 10px 10px;
    background-size: 100% 100% !important;
    background-repeat: no-repeat;
    background: url("/img/ui/border21.png");
    .mugang_title {
      position: absolute;
      top: 1%;
      font-weight: 700;
      color: #fff;
      font-size: 15px;
      left: 37%;
      // left: 23%;
      width: 120px;
      text-align: center;
      height: 30px;
      background-size: 100% 100%;
      background-image: url("/img/ui/title.png");
    }
    // overflow: auto;
    .icon_inside {
      position: absolute;
      padding: 0px 27px 60px 27px;
      left: 0;
      top: 0;
      width: 100%;
      height: 104%;
    }
    .checkbox_css {
      position: absolute;
      top: 0;
      right: 3%;
    }
  }
  .check {
    cursor: pointer;
    color: #fff;
    text-align: right;
    margin-right: 10px;
  }
  .left_content {
    position: relative;
    height: 100%;
    padding-bottom: 20px;
    .ulCont {
      list-style: none;
      padding-left: 10px;
      overflow: auto;
      height: 100%;
      .harborfont {
        position: relative;
        color: #fff;
        margin-top: 5px;
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
      position: absolute;
      height: 0;
      width: 118px;
      border-top: 26px solid #3cdaf7;
      border-left: 14px solid transparent;
      border-right: 14px solid transparent;
      .infoh {
        position: absolute;

        top: 0;
        left: 0;
      }
    }
  }
}
.dateSel {
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translate(-50%);
  display: flex;
}
.dateTime {
  width: 100px;
  height: 30px;
  background: rgb(12, 60, 105);
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
}
.total {
  color: white;
  position: absolute;
  right: 0;
  top: 0;
}

.leftContainner {
  width: 20%;
  position: absolute;
  right: 30px;
  top: 20px;
  text-align: right;
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
.active-class {
  background: #0eaac0;
}

.timeLineContainner {
  width: 100%;
  z-index: 99999;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%);
  color: #fff;
}

.wubiantu {
  color: #fff;
  cursor: pointer;
}
</style>
