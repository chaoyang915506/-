<template>
  <div class="medium">
    <div class="custom_box">
      <div class="custom_title">社交媒体</div>
      <div class="custom_countent box_info" id="scroll">
        <div
          v-for="(i, j) in contentData"
          :key="j"
          class="every_info inner-container anim"
          id="content"
          ref="con1"
          @mouseenter="mouseEnter1"
          @mouseleave="mouseLeave1"
        >
          <img v-if="i.type == 'face'" src="/img/ui/contract.png" alt="" />
          <img v-if="i.type == 'camera'" src="/img/ui/camera.png" alt="" />
          <img v-if="i.type == 'place'" src="/img/ui/place.png" alt="" />
          <img v-if="i.type == 'social'" src="/img/ui/social.png" alt="" />
          <img
            v-if="i.type == 'satellite'"
            src="/img/ui/satellite.png"
            alt=""
          />
          <img v-if="i.type == 'facebook'" src="/img/ui/facebook.png" alt="" />
          <div class="content">
            {{ i.name }}&emsp;&emsp;{{ i.content }}
            <!-- <div class="overflow_css"></div> -->
          </div>
        </div>
        <div id="copyContent"></div>
        <!-- <div
          v-for="(i, j) in contentData"
          :key="j"
          class="every_info"
          ref="con1"
          :class="{ anim: animate == true }"
          @mouseenter="mouseEnter1"
          @mouseleave="mouseLeave1"
        >
          <img v-if="i.type == 'face'" src="/img/ui/contract.png" alt="" />
          <img v-if="i.type == 'camera'" src="/img/ui/camera.png" alt="" />
          <img v-if="i.type == 'place'" src="/img/ui/place.png" alt="" />
          <img v-if="i.type == 'social'" src="/img/ui/social.png" alt="" />
          <img
            v-if="i.type == 'satellite'"
            src="/img/ui/satellite.png"
            alt=""
          />
          <img v-if="i.type == 'facebook'" src="/img/ui/facebook.png" alt="" />
          <div class="content">
            {{ i.name }}&emsp;&emsp;{{ i.content }}
          </div>
        </div> -->
      </div>
    </div>
    <div class="custom_box">
      <div class="custom_title">卫星图片</div>
      <div class="custom_countent">
        <div
          class="swiper mySwiper"
          @mouseenter="mouseEnter"
          @mouseleave="mouseLeave"
        >
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(i, j) in picList" :key="j">
              <img :src="i" style="width: 100%; height: 100%" alt="" />
            </div>
            <!-- <div class="swiper-slide">
              <img src="/img/ui/testcopy.png" alt="" />
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  根据弦号查询详情,
  查询图片服务器地址,
  舰艇档案信息
} from "@/api/situation/situation";
import { 多源数据列表查询 } from "@/api/homepage/homepage.js";
export default {
  data() {
    return {
      animate: false,
      swiperdata: null,
      isRoll: false,
      imgurl: "",
      aa: {
        type: "face",
      },

      contentData: [
        // { type: "face", name: "Make", content: "fsdfsfsdf" },
        // { type: "camera", name: "Make", content: "sdf" },
        // { type: "place", name: "Jenney", content: "fsdfdddfsdfa" },
        // { type: "satellite", name: "maary", content: "dfddf" },
        // { type: "facebook", name: "ki", content: "fsdfsdfa" },
      ],
      timmer: null,
      timerout: null,
      rangeTime: {
        endTime: new Date().getTime(),
        startTime: new Date().setDate(new Date().getDate() - 1000),
        pageNum: 0,
        pageSize: 100,
      },
      picList: [],
    };
  },
  created() {
    查询图片服务器地址().then((res) => {
      // console.log(res.data.imageServerUri);
      this.imgurl = res.data.imageServerUri;
      // console.log(this.imgurl, "rrrr");
    });
    this.mouseLeave1();
    this.getMidel();
  },
  methods: {
    initContent() {
      let scroll = document.getElementById("scroll");
      let content = document.getElementById("content");
      let copyContent = document.getElementById("copyContent");
      copyContent.innerHTML = content.innerHTML;
      this.timmer = setInterval(() => {
        if (scroll.scrollTop >= copyContent.offsetTop - content.offsetTop) {
          scroll.scrollTop = 0;
        }
        scroll.scrollTop++;
      }, 60);
    },
    async getMidel() {
      let res1 = await 多源数据列表查询({
        dataSources: ["STA"],
        ...this.rangeTime,
      });
      let pic = [];
      res1.rows.forEach((i) => {
        pic.push(...i.imagePaths);
      });
      // console.log(pic);
      this.picList = pic.map((i) => {
        return this.imgurl + i;
      });
      // console.log(res1, "res1");

      let res = await 多源数据列表查询({
        dataSources: ["SM"],
        ...this.rangeTime,
      });
      // console.log(res.rows, "red");
      this.contentData = res.rows.map((i) => {
        let source = "";
        if (i.dataSource == "FB" || i.dataSource == "TT") {
          source = "social";
        } else if (i.dataSource == "WC") {
          source = "camera";
        } else if (i.dataSource == "IC") {
          source = "face";
        } else if (i.dataSource == "STA") {
          source = "satellite";
        } else if (i.dataSource == "AIS") {
          source = "place";
        }

        return {
          type: source,
          name: i.userName,
          content: i.text,
        };
      });
    },
    scroll() {
      this.timerout = setTimeout(() => {
        // this.animate = true;
        this.contentData.push(this.contentData[0]);
        this.contentData.shift();
        // this.animate = false;
      }, 500);
    },
    mouseEnter1() {
      console.log("清空");
      // this.animate = false;
      clearInterval(this.timmer);
      // clearTimeout(this.timerout);
    },
    mouseLeave1() {
      // console.log("什么");
      // this.timmer = setInterval(this.scroll, 2000);
    },
    mouseEnter() {
      // console.log("结束");
      this.swiperdata.stopAutoplay();
    },
    mouseLeave() {
      // console.log("开始");
      this.swiperdata.startAutoplay();
    },
  },
  mounted() {
    this.swiperdata = new Swiper(".mySwiper", {
      loop: true,
      speed: 2500,
      observer: true,
      observeParents: true,
      freeMode: true,
      spaceBetween: 20,
      freeModeMomentum: false,
      autoplayDisableOnInteraction: false,
      // mousewheelControl: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
    });
    // this.swiperdata.startAutoplay();
  },
};
</script>

<style lang="scss" scoped>
$customTitle: 30px;

.anim {
  transition: all 0.5s;
  margin-top: -30px;
}
.box_info {
  padding: 5px;
}

.every_info {
  display: flex;
  align-items: center;
  // height: calc(100% / 5);
  line-height: calc(100% / 5);
  padding: 5px;
  margin-top: 5px;
  color: #20c9d4;
  background-color: #032240;
  img {
    display: inline-block;
    // height: 100%;
    width: 50px;
  }
  .content {
    display: inline-block;
    // width: 50px;
    width: 100%;
    height: 100%;
    line-height: 100%;
    // margin-left: 10%;
    margin-left: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .overflow_css {
    display: inline-block;
    height: 100%;
    // width: calc(100% - 110px);
    // width: 100%;
    margin-left: 10%;
    // width: 50%;
    line-height: 100%;
    // display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.medium {
  display: flex;
  width: calc(100% / 3 * 2 - 10px);
  height: 100%;

  margin: 0px 5px 0;
  // background-color: skyblue;
  .custom_box {
    width: calc(100% / 2 - 2.5px);
    height: 100%;
    margin-right: 5px;
    padding: 5px;
    // background-color: red;
    .custom_title {
      height: $customTitle;
      // background-color: green;
      font-size: 14px;
      font-weight: 700;
      padding: 5px;

      color: #fff;
      font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
    }
    .custom_countent {
      overflow: hidden;
      margin-top: 5px;
      width: 100%;
      height: calc(100% - #{$customTitle} - 5px);
    }
  }
  .custom_box:nth-child(2) {
    margin-right: 0;
  }
}

.swiper {
  width: 100%;
  height: 100%;
  overflow: hidden !important;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.mySwiper .swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.inner-container {
  overflow: hidden;
  animation: myMove 5s linear infinite;
  animation-fill-mode: forwards;
}
@keyframes myMove {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-150px);
  }
}
.box_info:hover .inner-container {
  animation-play-state: paused;
}
// :hover {
//   animation-play-state: paused;
// }
</style>