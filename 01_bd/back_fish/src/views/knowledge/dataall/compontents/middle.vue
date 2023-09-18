<template>
  <div class="contentmap">
    <mars-map :url="configUrl" @onload="onMapload" />
    <!-- <div class="middle_nav">
      <div class="middle_title">
        动态显示行驶轨迹 &ensp;
        <el-switch
          v-model="value"
          :active-value="true"
          style="--el-switch-on-color: #0eaac0"
        >
        </el-switch>
      </div>
      <div class="search_time" :style="{ left: right_box ? '27%' : '19%' }">
        <el-date-picker
          type="date"
          size="mini"
          v-model="date1"
          placeholder="年/月/日"
        ></el-date-picker>
        -
        <el-date-picker
          type="date"
          size="mini"
          v-model="date2"
          placeholder="年/月/日"
        ></el-date-picker>
        &emsp;
        <el-button @click="search()" type="primary" size="mini">执行</el-button>
      </div>
    </div> -->
    <!-- <eldog v-model="show" :title="didogtitle" width="70%">
      <div class="context" v-for="(item, i) in context" :key="i">
        {{ item }}
      </div>
    </eldog> -->
  </div>
</template>

<script>
import MarsMap from "@/components/mars-work/mars-map.vue";
import eldog from "@/components/Dialog/index.vue";
import {
  转港校验,
  单艇生命周期,
  单艇生命周期查询新,
} from "@/api/analyse/analyse.js";
import { parseTime } from "@/utils/ruoyi";
let graphicLayer; // 矢量图层对象,用于graphic绑定展示
let pathEntity = null;

export default {
  name: "middle",
  data() {
    const basePathUrl = window.basePathUrl || "";
    return {
      _map: null,
      _graphicLayer: null,
      show: false,
      didogtitle: "转岗提示",
      configUrl: basePathUrl + "config/analyse.json",
      value: "value",
      date1: "",
      date2: "",
      // date1: new Date().setDate(new Date().getDate() - 7),
      // date2: new Date(),
      context: "",
      arrowArr: [[]],
      mapOptions: {
        scene: {
          center: {
            lng: "",
            lat: "",
            // lng: 116.3257,
            // lat: 39.9085,
            alt: 3098707,
            heading: 5,
            pitch: -88,
          },
        },
      }, //自定义地球配置参数
    };
  },
  props: {
    sideName: Array,
    count: Number,
    right_box: {
      type: Boolean,
      default: false,
    },
    subMaineData: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    MarsMap,
    eldog,
  },
  watch: {
    count: {
      deep: true,
      immediate: true,
      handler(val) {
        this.clearData();
      },
    },
  },
  methods: {
    async onMapload(map) {
      // console.log(map, "map");
      this._map = map;
      let self = this;
      graphicLayer = new mars3d.layer.GraphicLayer();
      this._graphicLayer = graphicLayer;
      map.addLayer(graphicLayer);

      // 2.在layer上绑定监听事件
      graphicLayer.on(mars3d.EventType.click, function (event) {
        console.log("监听layer，单击了矢量对象", event);
        // debugger
      });
      graphicLayer.on(mars3d.EventType.mouseOver, async function (event) {
        console.log("监听layer，鼠标移入了矢量对象", event);
      });

      // this.initPath(123, map);
    },
    async search() {
      // 清除轨迹和艇
      this.clearData();
      console.log(this.sideName);
      let endTime = new Date(this.date2).getTime();
      let startTime = new Date(this.date1).getTime();
      // debugger
      let data = {
        endTime: endTime,
        sideNums: this.sideName,
        startTime: startTime,
      };
      let res = await 转港校验(data);
      if (res.rows && res.rows.length > 0) {
        this.show = true;
        this.context = res.rows;
      }
      // debugger
      let re = await 单艇生命周期查询新(
        // "2019-02-18",
        // "2022-09-18",
        // "SSN760,SSBN734"
        parseTime(this.date1, "{yyyy}-{mm}-{dd}"),
        parseTime(this.date2, "{yyyy}-{mm}-{dd}"),
        this.sideName
      );
      // if (re.data && re.data.length > 0) {
      //   // this._initPath(re.rows, this._map);
      //   // this.__initPath(re.rows, this._map);
      //   // this.initPath(re.rows, this._map);
      //   this.addDemoGraphic1(re.data, this._map);
      // }
      if (re.data.data && re.data.data.length > 0) {
        this.mutipleGraphics(re.data.data, this._map);
      }
    },

    initSubMain(item, imgSrc) {
      let graphic = new mars3d.graphic.BillboardEntity({
        name: item.name,
        position: [ item.lng, item.lat, 1000],
        style: {
          image: imgSrc,
          scale: 0.03,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          clampToGround: true,
          // label: {
          //   text: item.name,
          //   font_size: 19,
          //   font_family: "楷体",
          //   color: "#9ca5a5",
          //   outline: true,
          //   outlineColor: Cesium.Color.BLACK,
          //   // outlineWidth: 2,
          //   // horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          //   // verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          //   pixelOffset: new Cesium.Cartesian2(10, -25), // 偏移量
          // },
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
      console.log(subMaineData, "jieshou");
      if (subMaineData.length > 0) {
        // this.mapOptions.scene.center.lng = subMaineData[0].lng;
        // this.mapOptions.scene.center.lat = subMaineData[0].lat;
        // console.log(this.mapOptions, "mapOption");
        // this._map.flyHome({ duration: 2000 });
        // console.log(Cesium, "cesium");
        this._map.cancelFlyTo(Cesium.Entity, {
          duration: 20,
        });
        this._map.openFlyAnimation({
          callback: function () {
            // 动画播放完成后回调
          },
        });
      }
      // graphicLayer = new mars3d.layer.GraphicLayer();
      // this._map.addLayer(graphicLayer);
      // console.log(subMaineData, "接收到了 ");

      subMaineData.forEach((item, index) => {
        let graphic;
        // debugger;
        // if (item.states === "部署") {
        //   graphic = this.initSubMain(item, "img/ui/tLAN.png");
        //   this._graphicLayer.addGraphic(graphic);
        //   graphic.openTooltip();
        // } else if (item.states === "维修") {
        //   graphic = this.initSubMain(item, "img/ui/tHong.png");
        //   this._graphicLayer.addGraphic(graphic);
        //   graphic.openTooltip();
        // } else if (item.states === "在港") {
        //   graphic = this.initSubMain(item, "img/ui/ting.png");
        // this._graphicLayer.addGraphic(graphic);
        // graphic.openTooltip();
        // } else {
        //   // debugger
        //   // this.totalArr.在港.push(item);
        // }
        // console.log("zhixingl");
        graphic = this.initSubMain(item, "img/ui/ting.png");
        this._graphicLayer.addGraphic(graphic);
        graphic.openTooltip();
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
          console.log(event.graphic, "event.graphicc");
          if (event.graphic.options.attr) {
            let html = `<table><tr><td>${event.graphic.options.attr.name}</td></tr></table>`;
            event.graphic.bindTooltip(html);
          }
        }
      });
    },
    addDemoGraphic1(data, map) {
      const property = new Cesium.SampledPositionProperty();
      property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;

      let name = "";
      let tempTime;
      // 起点
      tempTime = map.clock.currentTime; // 飞行开始时间

      data.forEach((item, index) => {
        name = item.name;
        if (index === 0) {
          tempTime = map.clock.currentTime;
        } else {
          tempTime = Cesium.JulianDate.addSeconds(
            tempTime,
            20,
            new Cesium.JulianDate()
          );
        }
        let x = Number(item.c2.split(",")[1]);
        let y = Number(item.c2.split(",")[0]);
        property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(x, y, 50));
      });
      const graphic = new mars3d.graphic.PathEntity({
        position: property,
        style: {
          width: 2,
          color: "#409EFF",
          opacity: 1.0,
          // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
          // highlight: {
          //   type: mars3d.EventType.click,
          //   color: "#ff0000",
          // },
        },
        label: {
          text: name,
          font_size: 19,
          font_family: "楷体",
          color: Cesium.Color.AZURE,
          outline: true,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(10, -25), // 偏移量
        },
        point: {
          color: "#000",
        },
        // billboard: {
        //   image: "img/ui/ting.png",
        //   scale: 0.02,
        // },
        // model: {
        //   url: "lib/model/zhanji.glb",
        //   scale: 2,
        //   minimumPixelSize: 20,
        //   color:'#000'
        // },
        // attr: { remark: "示例1" },
      });
      this._graphicLayer.addGraphic(graphic); // 还可以另外一种写法: graphic.addTo(graphicLayer)
    },
    mutipleGraphics(datas, map) {
      let self = this;
      datas.forEach((items, index) => {
        let sideName = items.sideName;
        let data = items.data;

        const property = new Cesium.SampledPositionProperty();
        property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;

        let name = "";
        let tempTime;
        // 起点
        tempTime = map.clock.currentTime; // 飞行开始时间

        data.forEach((item, index) => {
          name = item.name;
          if (index === 0) {
            tempTime = map.clock.currentTime;
          } else {
            // debugger
            tempTime = Cesium.JulianDate.addSeconds(
              tempTime,
              20,
              new Cesium.JulianDate()
            );
          }
          let x = Number(item.c2.split(",")[1]);
          let y = Number(item.c2.split(",")[0]);
          property.addSample(
            tempTime,
            Cesium.Cartesian3.fromDegrees(x, y, 5000)
          );
        });

        let pixelOffset;

        if (index % 2 == 0) {
          pixelOffset = new Cesium.Cartesian2(
            10 + index * 10 + 1,
            -25 + index * 11
          ); // 偏移量
        } else {
          pixelOffset = new Cesium.Cartesian2(
            10 - index * 10 + 1,
            -25 - index * 11
          );
        }
        const graphic = new mars3d.graphic.PathEntity({
          position: property,
          style: {
            width: 2,
            color: self.randomColor(),
            opacity: 1.0,
          },
          label: {
            text: name,
            font_size: 19,
            font_family: "楷体",
            color: Cesium.Color.AZURE,
            outline: true,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: pixelOffset,
          },
          point: {
            color: "#000",
          },
        });
        this._graphicLayer.addGraphic(graphic); // 还可以另外一种写法: graphic.addTo(graphicLayer)
      });
    },
    clearData() {
      this._graphicLayer.clear();
    },
    randomColor() {
      let r = Math.floor(Math.random() * 255);
      let g = Math.floor(Math.random() * 255);
      let b = Math.floor(Math.random() * 255);
      return `rgb(${r},${g},${b})`;
    },
    _initPath(data, map) {
      console.log("路径数据", data);
      // let rows = data.length;
      let cols = 1;
      // for (let r = 0; r < rows; r++) {
      //   this.arrowArr[r] = Array.apply(null, Array(cols)).map(function (i) {
      //     return 0;
      //   });
      // }
      // this.arrowArr = new Array();
      data.forEach((item, index) => {
        //  let graphic = this.initGraphic(item, index);
        let graphic = new mars3d.graphic.BillboardEntity({
          name: item.name,
          position: [
            Number(item.c2.split(",")[1]),
            Number(item.c2.split(",")[0]),
            1000,
          ],
          style: {
            image: "img/ui/ting.png",
            scale: 0.03,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            clampToGround: true,
          },
        });
        let arr = [
          Number(item.c2.split(",")[1]),
          Number(item.c2.split(",")[0]),
          1000,
        ];
        // debugger
        this.arrowArr[index] = Array.apply(null, Array(cols)).map(function (i) {
          return arr;
        });

        //   this.arrowArr[index].push(arr);

        this._graphicLayer.addGraphic(graphic);
      });
      let a = [
        [-117.23761844578078, 32.69070828240868, 1000],
        [139.66109827551858, 35.29412496083174, 1000],
        [129.71569675513595, 33.15863340276688, 1000],
        [144.64890248312543, 13.449337925663981, 1000],
      ];
      console.log(this.arrowArr);
      const graphicc = new mars3d.graphic.StraightArrow({
        positions: a,
        style: {
          color: "#ff0000",
          opacity: 0.6,
          outline: true,
          outlineWidth: 1,
          outlineColor: "#ffffff",
          clampToGround: true,
        },
        attr: { remark: "示例1" },
      });
      this._graphicLayer.addGraphic(graphicc);
    },
    initGraphic(item, index) {
      let graphic = new mars3d.graphic.BillboardEntity({
        name: item.name,
        position: [
          Number(item.c2.split(",")[1]).toFixed(6),
          Number(item.c2.split(",")[0]).toFixed(6),
          1000,
        ],
        style: {
          image: "img/ui/ting.png",
          scale: 0.02,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          clampToGround: true,
        },
      });
      let arr = [
        Number(item.c2.split(",")[1]).toFixed(6),
        Number(item.c2.split(",")[0]).toFixed(6),
        500,
      ];
      this.arrowArr[index].push(arr);
      return graphic;
    },
    initPath(data, map) {
      let pathArr = [
        {
          id: 680,
          x: 117.35816650390625,
          y: 32.54057693481445,
          z: 162,
          time: "2021-07-01T07:22:14.000+0000",
        },
        {
          id: 681,
          x: 117.35816650390625,
          y: 32.54074287414551,
          z: 162,
          time: "2021-07-01T07:22:16.000+0000",
        },
        {
          id: 682,
          x: 117.35824279785156,
          y: 32.54142379760742,
          z: 160,
          time: "2021-07-01T07:22:19.000+0000",
        },
      ];
      // data = pathArr;
      const property = new Cesium.SampledPositionProperty();
      property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;

      for (let i = 0, len = data.length; i < len; i++) {
        const item = data[i];
        const lng = "";
        const lat = "";
        // const lng = Number(item.x.toFixed(6)); // 经度
        // const lat = Number(item.y.toFixed(6)); // 纬度
        // const height = item.z; // 高度
        // const time = item.time; // 时间
        try {
          lng = Number(item.c2.split(",")[1]).toFixed(6); // 经度
          lat = Number(item.c2.split(",")[0]).toFixed(6); // 纬度
        } catch (error) {
          console.log(error, item);
        }

        const height = 1000; // 高度
        const time = item.begintime; // 时间
        console.log("轨迹", lat, lng);
        console.log("时间", time);

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
      }
      console.log("路径属性列表", property);
      let tempTime;

      // 起点
      tempTime = map.clock.currentTime; // 飞行开始时间
      property.addSample(
        tempTime,
        Cesium.Cartesian3.fromDegrees(117.172852, 31.862736, 50)
      );

      // 移动到的第1个目标点
      tempTime = Cesium.JulianDate.addSeconds(
        tempTime,
        120,
        new Cesium.JulianDate()
      );
      property.addSample(
        tempTime,
        Cesium.Cartesian3.fromDegrees(117.251461, 31.856011, 50)
      );

      // 移动到的第2个目标点
      tempTime = Cesium.JulianDate.addSeconds(
        tempTime,
        120,
        new Cesium.JulianDate()
      );
      property.addSample(
        tempTime,
        Cesium.Cartesian3.fromDegrees(117.265321, 31.876336, 50)
      );

      tempTime = Cesium.JulianDate.addSeconds(
        tempTime,
        600,
        new Cesium.JulianDate()
      );
      property.addSample(
        tempTime,
        Cesium.Cartesian3.fromDegrees(117.160215, 31.890639, 50)
      );

      // 创建path对象
      pathEntity = new mars3d.graphic.PathEntity({
        position: property,
        style: {
          color: "#ff0000",
          width: 2,
          opacity: 1.0,
          resolution: 6,
        },
        label: {
          text: "潜艇",
          font_size: 19,
          font_family: "楷体",
          color: Cesium.Color.AZURE,
          outline: true,
          visibleDepth: false,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(10, -25), // 偏移量
        },
        model: {
          url: "lib/model/zhanji.glb",
          scale: 1,
          minimumPixelSize: 20,
        },
        popup: "潜艇1号",
      });
      graphicLayer.addGraphic(pathEntity);
    },
    __initPath(data, map) {
      console.log("路径数据", data);
      let arr = [];
      data.forEach((item, index) => {
        let graphic = new mars3d.graphic.BillboardEntity({
          name: item.name,
          position: [
            Number(item.c2.split(",")[1]),
            Number(item.c2.split(",")[0]),
            1000,
          ],
          style: {
            image: "img/ui/ting.png",
            scale: 0.03,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            clampToGround: true,
          },
        });
        this._graphicLayer.addGraphic(graphic);
        arr.push(
          Cesium.Cartesian3.fromDegrees(
            Number(item.c2.split(",")[1]),
            Number(item.c2.split(",")[0]),
            0
          )
        );
      });
      console.log("路径坐标", arr);
    },
  },
};
</script>

<style lang="scss" scoped>
// @import "./index.scss";
// @import "@/assets/styles/variables.scss";
::v-deep .el-switch__core .el-switch__action {
  background-color: #0eaac0;
}

.contentmap {
  position: relative;
  // height: 100%;
  height: 100vh;
}

.context {
  color: #fff;
  font-size: 16px;
}
::v-deep .el-input--mini .el-input__inner {
  background-color: #0f1c40;
  border: 1px solid #122b54;
}
::v-deep .el-input--mini .el-input__inner::-moz-placeholder {
  color: rgba(255, 255, 255, 0.3);
}

::v-deep .el-button--mini {
  font-size: 12px;
  border-radius: 3px;
  background: #122b54;
  border: 0;
  color: #1296db;
  box-shadow: inset 3px 3px 3px #054588, inset -3px -3px 3px #054588;
}
</style>
