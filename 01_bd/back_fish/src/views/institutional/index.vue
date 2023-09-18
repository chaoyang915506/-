<template>
  <div class="app-container app_div" style="display: flex">
    <!-- <div v-if="page == 'home'"> -->
    <left
      class="left"
      v-if="page == 'home'"
      @getjianting="getjianting"
      @saveLonlat="saveLonlat"
    />
    <div class="right" v-if="page == 'home'">
      <middle class="middle" ref="middle" />
    </div>

    <div
      v-if="page == 'home'"
      :style="{ width: view ? '25%' : '0%' }"
      class="right_all"
    >
      <div
        @click="lookcart"
        :class="[view ? 'right_box' : 'false_right', 'box_app']"
      >
        <div class="title_info" v-if="view">
          <span v-if="dttitle">{{ dttitle }}</span>
          <span v-else> {{ armydata ? armydata.orgName : "" }}简介</span>

          <div></div>
        </div>

        <right
          v-if="view && showpersonage == false"
          :template1="mediaInfo"
          :zjinfodata="zjinfodata"
          :zhgdata="zhgdata"
          :armydata="armydata"
          :zldata="zldata"
          :imgurl="imgurl"
        >
        </right>
        <piccomponets
          v-if="view && showpersonage"
          :imgurl="imgurl"
          :zhgdata="zhgdata"
        ></piccomponets>
      </div>

      <div v-show="iconshow" class="img_arrows" @click="view = !view">
        <img
          :class="[view ? 'imgopen' : 'imgclose']"
          src="/img/ui/arrows.svg"
          alt=""
        />
      </div>
    </div>
    <!-- </div> -->

    <personageinfo
      style="width: 100%"
      v-if="page == 'personageinfo'"
      :id="ids"
    />
    <infrlistdata
      style="width: 100%"
      :imgurl="imgurl"
      v-if="page == 'infrlistdata'"
    />
    <eldog :show="show" :title="title" width="70%" v-if="show">
      <component
        :is="componentId"
        :template1="mediaInfo"
        style="height: 700px; width: 100%"
      ></component>
    </eldog>
  </div>
</template>

<script>
import bus from "@/utils/bus.js";
import left from "./compontent/left.vue";
import right from "./compontent/right.vue";
import middle from "./compontent/middle.vue";
import eldog from "@/components/Dialog/index.vue";
import piccomponets from "./compontent/piccomponets.vue";
import {} from "@/api/information/information.js";
import { 社交媒体信息, 查询图片服务器地址 } from "@/api/situation/situation";
import {
  查询母港信息,
  组织机构模块所属舰艇查询,
  组织机构指挥官查询,
  组织人员列表,
  组织机构查询,
  根据舷号获取人物详情,
  组织机构战例查询,
} from "@/api/institutional/institutional.js";
export default {
  components: {
    left,
    right,
    middle,
    eldog,
    piccomponets,
    personageinfo: () => import("./personageinfo/index.vue"),
    infrlistdata: () => import("./inofrlistdata.vue"),
  },
  data() {
    return {
      page: "home",
      mediaInfo: [],
      iconshow: false, //点击展开的按钮默认不展示
      view: false,
      show: false,
      title: "近期数据",
      componentId: "",
      mugangdata: [], //母港数据
      zjinfodata: [], //舰艇信息
      showpersonage: false,
      imgurl: "",
      zhgdata: [], //指挥官数据
      armydata: {}, //军队的数据
      ids: "",
      tags: false, //判断是从home进还是人员进
      dttitle: "",
      zldata: [], //战例的数据
    };
  },
  created() {
    // localStorage.removeItem("peoplelist");
    查询图片服务器地址().then((res) => {
      // console.log(res.data.imageServerUri);
      this.imgurl = res.data.imageServerUri;
      // console.log(this.imgurl, "rrrr");
    });

    查询母港信息().then((res) => {
      // console.log(res, "母港");
      this.mugangdata = res.rows;
    });
    this.getmeitiinfo();
  },
  mounted() {
    //清除缓存数据
    window.localStorage.removeItem("peoplelist");

    let _this = this;
    bus.$on("updateid", function (val) {
      // console.log(val, "接收");
      _this.ids = val;
      _this.page = "personageinfo";
    });
    bus.$on("closeuserinfo", function (val) {
      console.log(_this.tags, "tag");
      // if(_this.page=='')
      if (_this.tags) {
        _this.page = "infrlistdata";
      } else {
        _this.page = "home";
      }
      // if (_this == "home") {
      //   localStorage.removeItem("peoplelist");
      // }
      _this.ids = "";
    });
  },
  methods: {
    // 组织机构战例查询
    async getzldata(id) {
      let res = await 组织机构战例查询(id ? id : "");
      // console.log(res, "red");
      this.zldata = res.rows;
      // this.zldata = [
      //   {
      //     event: "活动按期开始",
      //     begintime: "2020-1-22",
      //     endtime: "2020-1-22",
      //     id: 1,
      //   },
      // ];
    },
    // 组织机构查询除单艇外全部
    async getzzjg(id) {
      let res = await 组织机构查询(id ? id : "");
      // console.log(res, "执行后结果");
      this.armydata = res.rows.length > 0 ? res.rows[0] : {};
      // console.log(this.armydata, "res");
    },
    cleardata() {
      this.template1 = [];
      this.zjinfodata = [];
      this.zhgdata = [];
      this.armydata = {};
    },
    //显示关闭单艇信息
    personage(val) {
      // 判断点击显示右侧
      val ? (this.view = true) : false;
      // console.log("open");
      this.showpersonage = val;
    },
    // console.log(单艇或者指挥官);
    async getdantingzhg(num) {
      let res = await 根据舷号获取人物详情(num);
      // console.log(res);
      this.zhgdata = res.rows;
    },
    //指挥官
    async getzhgdata(id) {
      // console.log(id, "id");
      let res = await 组织机构指挥官查询({ id });
      console.log(res, "res");
      this.zhgdata = res.rows;
    },
    saveLonlat(data) {
      this.$refs.middle.findSubMaine(data);
    },
    //中队大队舰艇
    async getjianting(id) {
      let res = await 组织机构模块所属舰艇查询({ id });
      // console.log(res, "舰艇信息");
      this.zjinfodata = res.rows;
      // this.view = true;
    },
    lookcart() {
      this.componentId = "right";
      this.show = true;
    },
    //打开或者关闭右侧
    closewindow(i) {
      this.view = i;
    },
    async getmeitiinfo(i) {
      // console.log(i, "单停");
      let res = await 社交媒体信息(i ? i : null);
      if (res.rows && res.rows.length > 0) {
        res.rows.forEach((item) => {
          let data = { ...item };
          this.mediaInfo.push(data);
        });
        // console.log(this.mediaInfo);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app_div {
  //   height: calc(90vh - 50px);
  height: calc(100vh - 50px);
  width: 100%;
}
.left {
  //   display: inline-block;
  //   background-color: #0d183d;
  padding: 10px;
  //   height: 100vh;
  width: 25%;
}
.right_all {
  position: relative;
}
.right {
  display: inline-block;
  position: relative;
  // height: calc(100vh - 100px);
  border: 1px solid #241866;
  //   background-color: orange;
  width: 75%;
}
.middle {
  width: 100%;
  height: 100%;
  //   background-color: green;
}
.right_box {
  //   position: relative;
  // width: calc(100% / 3);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  //   background-color: blue;
}
.false_right {
  width: 0;
}

.img_arrows {
  position: absolute;
  //   z-index: 99999;
  left: -25px;
  top: 10px;
  height: 40px;
  width: 25px;
  background: #0d183d;
  display: flex;
  justify-content: center;
  align-items: center;
}
.imgclose {
  width: 15px;
  height: 20px;
}
.imgopen {
  width: 15px;
  height: 20px;
  transform: rotate(-180deg);
}

// .box_app {
//   position: relative;
//   border: 1px solid #241866;

//   width: 100%;
//   height: 100%;
// }
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

::v-deep .el-tabs__content {
  height: 100% !important;
}
</style>