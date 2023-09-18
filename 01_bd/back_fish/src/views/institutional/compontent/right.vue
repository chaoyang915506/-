<template>
  <div style="height: 100%">
    <div
      class="top"
      @click="looktext(armydata.orgName + '简介', 'jianjie', armydata)"
    >
      <jianjie :item="armydata" :imgurl="imgurl" />
    </div>

    <div class="bottom">
      <el-tabs v-model="activceName" tab-position="top">
        <el-tab-pane label="战例" name="first" class="qt_css">
          <specific
            :zldata="zldata"
            :imgurl="imgurl"
            @click.native="looktext('战例', 'specific', zldata)"
          />
        </el-tab-pane>
        <el-tab-pane label="所属潜艇" name="second" class="qt_css">
          <!-- <subordinate :zjinfodata="zjinfodata" /> -->
          <subord-inate
            v-for="(item, j) in zjinfodata"
            :key="j"
            :item="item"
            @click.native="looktext('所属潜艇', 'subord-inate', item)"
          ></subord-inate>
        </el-tab-pane>
        <el-tab-pane label="指挥官" name="three" class="qt_css">
          <!-- <navarchy /> -->
          <pic-componets
            :imgurl="imgurl"
            :zhgdata="zhgdata"
            class="everyone_ship"
          ></pic-componets>
        </el-tab-pane>
      </el-tabs>
    </div>
    <eldog v-model="show" :title="title" width="70%">
      <component
        :is="componentId"
        style="width: 100%; height: 400px"
        :item="itemd"
        :max="true"
        :imgurl="imgurl"
      ></component>
    </eldog>
  </div>
</template>

<script>
import navarchy from "./navarchy.vue";
import specific from "./specific.vue";
// import subordinate from "./subordinate.vue";
import eldog from "@/components/Dialog/index.vue";
import PicComponets from "./piccomponets.vue";
export default {
  props: {
    zjinfodata: {
      type: Array,
      default: () => [],
    },
    zhgdata: {
      type: Array,
      default: () => [],
    },
    //战例
    zldata: {
      type: Array,
      default: () => [],
    },
    imgurl: {
      type: String,
      default: "",
      // require: true,
    },
    armydata: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    specific,
    eldog,
    SubordInate: () => import("./subordinate.vue"),
    navarchy,
    PicComponets,
    jianjie: () => import("./jianjie.vue"),
  },
  data() {
    return {
      show: false,
      componentId: specific,
      itemd: null,
      title: "",
      // img: "/img/ui/u1635.svg",
      activceName: "first",
      timelinedata: [
        {
          content: "活动按期开始",
          timestamp: "2020-1-22",
          id: 1,
        },
        {
          content: "活动按期开始",
          timestamp: "2020-1-22 - 2022-8-6 | 美国",
          id: 11,
        },
      ],
    };
  },
  methods: {
    //打开弹框
    looktext(title, val, data) {
      console.log("出发");
      this.show = true;
      this.title = title;
      this.componentId = val;
      this.itemd = data;
    },
  },
  mounted() {
    console.log(this.armydata, "cewshifs ");
  },
};
</script>

<style lang="scss" scoped>
.top,
.bottom {
  padding: 20px;
  color: #fff;
  border: 1px solid #421b96;
}
.top {
  overflow: auto;
  height: 30%;
}
.bottom {
  // height: 70%;
}

.el-tabs__content {
  // height: -14% !important;
  /* height: 242px; */
  height: calc(80vh - 10px) !important;
  // overflow: auto;
}
.qt_css {
  height: calc(91vh - 414px);
  overflow: auto;
}
::v-deep .el-tabs__item {
  color: #fff;
}
::v-deep .el-tabs__active-bar {
  background-color: #223cb9;
}
.everyone_ship {
  display: block;
  // position: relative;
  // display: flex;
  // align-content: center;
  // padding: 5px;
  // height: 150px;
  // color: #fff;
  // border-bottom: 1px solid #4e5261;
}
</style>