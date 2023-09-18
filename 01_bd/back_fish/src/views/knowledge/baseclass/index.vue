<template>
  <div class="baseInfo">
    <div class="leftbox">
      <div class="title_info">
        <span>基地及设施</span>
        <div></div>
      </div>
      <div class="content">
        <div
          :class="[item.active ? 'activeColor' : '', 'baseItem']"
          v-for="(item, i) in baseData"
          :key="i"
          @click="clickItem(item, i)"
        >
          {{ item.dictLabel }}
        </div>
      </div>
    </div>
    <div class="marsContainner">
      <mars-map :url="configUrl" @onload="onMapload" />
    </div>
  </div>
</template>

<script>
import MarsMap from "@/components/mars-work/mars-map.vue";
import dataInfo from "./baseInfo.json";
export default {
  components: {
    MarsMap,
  },
  data() {
    const basePathUrl = window.basePathUrl || "";
    return {
      configUrl: basePathUrl + "config/base.json",
      baseData: [],
      _map: null,
      //用户点击的舰艇
      addData: [],
    };
  },

  created() {
    //  :class="[getcss(item.dictValue) ? 'activeColor' : '', 'baseItem']"
    this.getDicts("base_type").then((res) => {
      this.baseData = res.data;
      console.log(this.baseData);
      this.baseData.forEach((item) => {
        item.active = false;
      });
      console.log("aaaaaa", this.baseData);
    });
  },
  methods: {
    async onMapload(map) {
      this._map = map;
      let graphicLayer = new mars3d.layer.GraphicLayer();
      map.addLayer(graphicLayer);
      // 画港口和重点区域
      dataInfo.forEach((item) => {
        let portList = item.data.ports;
        let importList = item.data.important;
        portList.forEach((port) => {
          let graphic = new mars3d.graphic.PolygonEntity({
            positions: port.coord,
            style: {
              color: `rgba(200, 54, 54)`,
              opacity: 0,
              outline: true,
              outlineWidth: 2,
              outlineColor: "orange",
              label: {
                text: port.label,
                font_size: 16,
                color: "#000000",
                font_weight: "bold",
                outline: true,
                outlineColor: "#ffffff",
                outlineWidth: 5,
                outlineOpacity: 1,
                distanceDisplayCondition: true,
                distanceDisplayCondition_far: 50000,
                distanceDisplayCondition_near: 0,
              },
            },
            attr: { name: port.name, label: port.label, info: port.info },
          });
          graphicLayer.addGraphic(graphic);
        });
        importList.forEach((imp) => {
          let graphic = new mars3d.graphic.PolygonEntity({
            positions: imp.coord,
            style: {
              color: `rgba(200, 54, 54)`,
              opacity: 0,
              outline: true,
              outlineWidth: 2,
              outlineColor: "blue",
            },
          });
          graphicLayer.addGraphic(graphic);
        });
      });
    },
    // getcss(dictValue) {
    //   let res = this.addData.findIndex((i) => i == dictValue);
    //   console.log("看看", res == -1 ? false : true);
    //   return res == -1 ? false : true;
    // },
    clickItem(item, index) {
      // let res = this.addData.findIndex((i) => i == item.dictValue);
      // if (res == -1) {
      //   this.addData = [item.dictValue];
      // } else {
      //   this.addData = [];
      // }
      this.baseData.forEach((_item, _index) => {
        _item.active = false;
        this.$set(this.baseData, _index, _item);
      });
      item.active = true;
      this.$set(this.baseData, index, item);

      // console.log("bbbbb", this.baseData);
      let tar = dataInfo.find((i) => i.name === item.dictLabel);
      let center = tar.data.center;
      // let importList = tar.data.important[0].coord;
      console.log(tar);
      // 飞向这个区域
      let point = new mars3d.LngLatPoint(center.lat, center.lng, center.height);
      this._map.flyToPoint(point, {
        radius: 1000,
        duration: 3,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.baseInfo {
  height: calc(100vh - 110px);
  width: 100%;
  display: flex;
}
.leftbox {
  width: 25%;
  // height: calc(100vh - 20px);
  height: 97%;
  border: 1px solid #421b96;
  padding: 10px;
  .title_info {
    position: relative;
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 17px;
    color: #fff;
    padding: 1px 10px;
    font-weight: 500;
    span {
      width: 30%;
    }
    div {
      background-image: url("/img/ui/bias.svg");
      position: absolute;
      display: inline-block;
      top: 4px;
      width: 70%;
      height: 25px;
      background-size: inherit;
      background-position: 25px 2px;
      -webkit-transform: scale(0.7);
      transform: scale(0.7);
    }
  }
  .content {
    height: 97%;
    overflow: auto;
    .baseItem {
      cursor: pointer;
      color: #fff;
      margin: 10px;
    }
  }
}
.marsContainner {
  width: 75%;
  height: 100%;
}
.activeColor {
  color: #0eaac0 !important;
}
</style>
