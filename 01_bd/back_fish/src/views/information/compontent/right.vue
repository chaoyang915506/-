<template>
  <div class="recentData" v-infinite-scroll="loadMore">
    <div
      @click="clickModel(item, index)"
      class="model"
      v-for="(item, index) in template1"
      :key="index"
    >
      <div class="mo text">
        <img
          v-if="item.dataSource === 'FB'"
          class="icon"
          src="/img/ui/facebook.png"
        />
        <img
          v-if="item.dataSource === 'TT'"
          class="icon"
          src="/img/ui/twitter.png"
        />
        <span class="userName">{{ item.userName }}</span
        ><span class="time">{{ parseTime(item.time, "{y}年{m}月{d}日") }}</span>
        <div class="icon_download">
          <i
            @click="download(template1[currentIndex]._id)"
            class="el-icon-download"
          ></i>
        </div>
      </div>
      <div class="mo text">{{ item.text }}</div>
      <div class="mo imgs">
        <template v-if="item.imagePaths && item.imagePaths.length > 1">
          <div v-for="(img, i) in item.imagePaths" :key="i">
            <img width="100" :src="imageServerUri + img" />
          </div>
        </template>
        <template v-else-if="item.imagePaths && item.imagePaths.length === 1">
          <img width="200" :src="imageServerUri + item.imagePaths[0]"
        /></template>
      </div>
      <div class="mo video" v-if="item.videoPaths">
        <video width="100%" height="100%" controls>
          <source :src="videoServerUri + item.videoPaths" type="video/mp4" />
        </video>
      </div>
    </div>

    <elDialog v-model="show" title="近期数据" width="70%">
      <recent-data-copy
        page="multidata"
        is="RecentDataCopy"
        :imageServerUri="imageServerUri"
        :videoServerUri="videoServerUri"
        :itemdata="itemdata"
      ></recent-data-copy>
    </elDialog>
  </div>
</template>

<script>
import RecentDataCopy from "@/components/HtmlFragment/RecentData/index.vue";
import { 查询图片服务器地址 } from "@/api/situation/situation";
import { 多源数据导出 } from "@/api/information/information";
import elDialog from "@/components/Dialog/index.vue";
import { parseTime } from "@/utils/ruoyi";
import RecentData from "../../situation/comp/recentData.vue";
export default {
  name: "RecentData",
  props: {
    template1: {
      type: Array,
      default: function () {
        return [
          {
            _id: "",
            dataSource: "",
            imagePaths: null,
            lat: null,
            lng: null,
            recordId: "",
            remark: null,
            text: "",
            time: 0,
            userId: "",
            userName: "",
            videoPaths: null,
          },
        ];
      },
    },
  },
  components: {
    elDialog,
    RecentDataCopy,
  },
  data() {
    return {
      count: 10,
      loading: false,
      currentIndex: 0,
      show: false,
      imageServerUri: "",
      videoServerUri: "",
      timeout: 1,
      itemdata: null,
    };
  },
  // computed: {
  //   noMore() {
  //     return this.count >= 20;
  //   },
  //   disabled() {
  //     return this.loading || this.noMore;
  //   },
  // },
  async mounted() {
    let re = await 查询图片服务器地址();
    this.imageServerUri = re.data.imageServerUri;
    this.videoServerUri = re.data.videoServerUri;
    console.log('aaaaaaaaaaa',re)
    //     downloadServerUri: "http://192.168.1.50:18080/download/"
    // imageServerUri: "http://192.168.1.50:18080/imges/"
    // videoServerUri: "http://192.168.1.50:18080/"
    // this.imgSrc = re.data.imageServerUri + "jh/" + this.data.sideNum + ".png";
  },
  methods: {
    scroll() {
      console.log("gundong");
      //   this.throttle(this.scrollFn);
      // this.scrollFn();
    },
    scrollFn() {
      console.log("fangfazhixing");
      let windowH = document.documentElement.clientHeight; //浏览器高度
      let scrollH = document.querySelector(".recentData").scrollHeight;
      let scrolltop = document.querySelector(".recentData").scrollTop;

      console.log(windowH, "视口", scrollH, "滚动了", scrolltop);

      let distance = 500;
      if (scrolltop + windowH >= scrollH - distance) {
        // this.throttle(this.go, 1000);
        console.log("执行了");
        this.$parent.getinfo(1);
      }
    },
    throttle(fn) {
      let canRun = true;
      return function () {
        if (!canRun) return;
        canRun = false;
        setTimeout(() => {
          fn.apply(this, arguments);
          canRun = true;
        }, 1000);
      };
    },
    go() {
      console.log("go");
    },
    clickModel(item, index) {
      // console.log(item, "item");
      // this.currentIndex = index;
      this.itemdata = item;
      this.show = true;
      console.log(item, index);
    },
    async download(id) {
      let formData = new FormData();
      formData.append("ids", [id]);
      let res = await 多源数据导出(formData);
      let blob = new Blob([res]);
      let filename = "近期数据.zip";
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
    loadMore() {
      this.$parent.getinfo(1);
      // var self = this;
      // self.busy = true;
      // console.log("loading... " + new Date());
      // setTimeout(function () {
      //   var app = document.querySelector(".app1");
      //   var height = app.clientHeight;
      //   app.style.height = height + 300 + "px";
      //   console.log("end... " + new Date());
      //   self.busy = false;
      // }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.box_app {
  position: relative;
  border: 1px solid #241866;

  width: 100%;
  height: 100%;
}
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
.recentData {
  // box-shadow: inset 3px 3px 3px #054588, inset -3px -3px 3px #054588;

  width: 100%;
  height: calc(100% - 30px);
  color: #fff;
  overflow: auto;
  padding: 10px;

  // padding: 20px 30px;
  .innerModel {
    overflow-y: hidden;

    margin-top: 10px;
    padding-top: 30px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #fff;
    position: relative;
    padding-left: 50px;
    width: 86%;
    margin: 0 auto;
    font-size: 16px;
    color: #fff;
    // background: #0f1c40;

    .icon {
      width: 30px;
      height: 30px;
      margin-right: 5px;
      // position: absolute;
      // top: 20px;
      // left: 0px;
      // width: 40px;
      // height: 40px;
    }
    .mo {
      margin-bottom: 10px;
    }
    .imgs {
      width: 80%;
      text-align: center;
    }
    .video {
      width: 80%;
      text-align: center;
    }
    .userName {
      font-size: 14px;
    }
    .time {
      margin-left: 30px;
      font-size: 12px;
    }
    .elIcon {
      display: flex;
      justify-content: right;
      margin-top: -10px;
      margin-bottom: 0;
      cursor: pointer;
    }
  }
  .model {
    overflow: hidden;
    overflow-y: hidden;
    /* margin-top: 10px; */
    /* padding-top: 10px; */
    /* padding-bottom: 10px; */
    margin-bottom: 10px;
    border-bottom: 1px solid #122b54;
    /* padding-left: 10px; */
    // padding: 0 10px 0px;
    padding: 10px;
    position: relative;
    width: 100%;
    background-color: #122b54;

    //   // background: #0f1c40;
    .icon {
      // position: absolute;
      // top: 0px;
      // left: 0px;
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    .mo {
      position: relative;

      margin-bottom: 10px;
      // margin-left: 40px;
      display: flex;
      align-items: center;
      font-size: 12px;
      .icon_download {
        position: absolute;
        right: 0;
        top: 36%;
      }
    }
    .userName {
      font-size: 14px;
    }
    .time {
      margin-left: 10px;
      font-size: 12px;
    }
    .elIcon {
      display: flex;
      justify-content: right;
      margin-top: -10px;
      margin-bottom: 0;
      cursor: pointer;
    }
  }
}
</style>
