<template>
  <div class="left_box">
    <div class="custom_block">
      <div class="custom_title">关岛部署密度分析</div>
      <div class="custom_countent">
        <video
          width="100%"
          height="100%"
          controls
          autoplay
          muted
          id="video"
          :src="videoServerUri + videolist"
          type="video/mp4"
        ></video>
        <!-- <video width="100%" height="100%" controls>
          <source :src="videoServerUri + videolist" type="video/mp4" />
        </video> -->
      </div>
    </div>
    <div class="custom_block">
      <div class="custom_title">西太平洋部署</div>
      <div class="custom_countent deploy_css">
        <div class="block_deploy">
          <div class="deploy_num">
            <img src="/img/ui/bluebar.svg" class="deploy_bar" alt="" />
            <div class="deploy_data_num">{{ numlist.today }}</div>
            <div class="deploy_data_info">今日部署数据</div>
          </div>
          <div class="deploy_num">
            <img src="/img/ui/greenbar.svg" class="deploy_bar" alt="" />
            <div class="deploy_data_num">{{ numlist.three }}</div>
            <div class="deploy_data_info">7日前部署数据</div>
          </div>
          <div class="deploy_num">
            <img src="/img/ui/redbar.svg" class="deploy_bar" alt="" />
            <div class="deploy_data_num">{{ numlist.seven }}</div>
            <div class="deploy_data_info">30日前部署数据</div>
          </div>
        </div>
        <div class="echarts_bar">
          <echarts-bar
            :chartData="chartData"
            style="width: 100%; height: 100%"
          ></echarts-bar>
        </div>
      </div>
    </div>
    <div class="custom_block">
      <div class="custom_title">视频</div>
      <div class="custom_countent">
        <!-- <div id="gantt_here" style="width: 100%; height: 100%"></div> -->
        <dhtml-bar
          :chartData="gdData"
          style="height: 100%; width: 100%"
        ></dhtml-bar>
      </div>
    </div>
  </div>
</template>

<script>
import {
  首页关岛当年舰艇部署信息查询,
  首页西太平洋部署统计,
  首页资源管理列表,
  首页西太平洋部署舰型统计V2,
} from "@/api/homepage/homepage.js";
import { 查询图片服务器地址 } from "@/api/situation/situation";

import EchartsBar from "./echartsBar.vue";
import DhtmlBar from "./dhtmlBar.vue";
export default {
  components: {
    EchartsBar,
    DhtmlBar,
  },
  async created() {
    let re = await 查询图片服务器地址();
    // this.imageServerUri = re.data.imageServerUri;
    this.videoServerUri = re.data.videoServerUri;
    this.getDhtml();
    this.getBarCont();
    this.getdepoy(3);
    this.getdepoy(7);
    this.getVideo();
  },
  data() {
    return {
      videoServerUri: "",
      chartData: {
        // xdata: [999, 9999, 99],
        // seriesdata: [99, 999, 9],
      },
      gdData: {},
      numlist: {
        today: 0,
        three: 0,
        seven: 0,
      },
      videolist: "",
      subScript: 0,
      totalVideo: 0,
      videoData: [],
    };
  },
  methods: {
    async getBarCont() {
      let params = {
        startDate: this.parseTime(
          new Date().setDate(new Date().getDate()),
          "{y}-{m}-{d}"
        ),
        // startDate: "2022-08-18",
      };
      let res = await 首页西太平洋部署舰型统计V2(params);
      if (res.code == 200) {
        this.chartData = {
          seriesdata: res.rows.map((i) => i.jtCount),
          xdata: res.rows.map((i) => i.sideType),
        };
      }
    },
    async getVideo() {
      let params = {
        display: 1,
        pageNum: 99999,
        pageSize: 1,
      };

      let res = await 首页资源管理列表(params);
      // console.log(res, "视频文件");

      this.videoData = res.rows;
      this.videolist = res.rows[0].fileUri;
      this.totalVideo = res.rows.length;
    },
    async getdepoy(val) {
      let params, res;

      if (val == 3) {
        params = {
          startDate: this.parseTime(
            new Date().setDate(new Date().getDate() - 3),
            "{y}-{m}-{d}"
          ),
        };
        res = await 首页西太平洋部署统计(params);
        this.$set(this.numlist, "three", res.rows.length);
      } else if (val == 7) {
        params = {
          startDate: this.parseTime(
            new Date().setDate(new Date().getDate() - 7),
            "{y}-{m}-{d}"
          ),
        };
        res = await 首页西太平洋部署统计(params);
        this.$set(this.numlist, "seven", res.rows.length);
      } else {
        params = {
          startDate: this.parseTime(new Date(), "{y}-{m}-{d}"),
        };
        res = await 首页西太平洋部署统计(params);
        this.$set(this.numlist, "today", res.rows.length);
      }
    },
    async getDhtml() {
      let res = await 首页关岛当年舰艇部署信息查询();
      // console.log(res);
      let data = {
        zData: res.rows.map((i) => i.name),
        sData: res.rows.map((i, j) => {
          // console.log(
          let time = new Date(i.begintime).getTime() + 24 * 60 * 60 * 1000 * 2;
          // );
          return {
            name: i.name,
            newtime: this.parseTime(i.begintime, "{y}-{m}-{d}"),
            value: [
              j,
              Date.parse(i.begintime),
              i.endtime ? Date.parse(i.endtime) : time,
              i.event,
            ],
          };
        }),
      };
      this.gdData = data;

      // console.log(rrrr, "ddddddd");
    },
  },
  mounted() {
    let elevideo = document.getElementById("video");
    let _this = this;

    elevideo.addEventListener(
      "ended",
      function () {
        // console.log(_this.totalVideo, "vide");
        // console.log(_this.videoData, "red");
        if (_this.totalVideo == _this.subScript + 1) {
          console.log(999, _this.videoData[0].fileUri);
          _this.subScript = 0;
          _this.videolist = _this.videoData[0].fileUri;
          document.querySelector("#video").play();
        } else {
          console.log(8888);
          _this.subScript += 1;
          console.log(_this.videoData, "reerere");
          _this.videolist = _this.videoData[_this.subScript].fileUri;
          document.querySelector("#video").play();
        }
        // console.log("播放结束");
      },
      false
    );
  },
};
</script>

<style lang="scss" scoped>
$customTitle: 30px;
.left_box {
  height: 100%;
  width: 25%;
  .custom_block {
    height: calc(100% / 3 - 5px);
    margin-bottom: 5px;
    // background-color: pink;
    padding: 5px;
    .custom_title {
      height: $customTitle;
      padding: 5px;
      // background-color: green;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
    }
    .custom_countent {
      margin-top: 5px;
      height: calc(100% - #{$customTitle} - 5px);
    }
  }
  .custom_block:nth-child(3) {
    height: calc(100% / 3);
  }
}
.deploy_css {
  display: flex;

  .block_deploy {
    position: relative;
    width: 30%;
    height: 100%;
    padding: 10px 0;
    .deploy_num {
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      border-width: 0px;
      width: calc(100% - 10px);
      margin: 0 5px 5px;
      height: calc(100% / 3 - 5px);
      border: none;
      border-radius: 5px;
      -moz-box-shadow: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      .deploy_bar {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0px;
      }
      .deploy_data_num {
        font-weight: 700;
        font-size: 25px;
        text-align: center;
        font-family: "Sylfaen Bold", "Sylfaen Regular", "Sylfaen", sans-serif;
        font-style: normal;
      }

      .deploy_data_info {
        text-align: center;
        color: #fff;
        font-size: 12px;
      }
    }

    .deploy_num:nth-child(1) .deploy_data_num {
      color: #03d9eb;
    }
    .deploy_num:nth-child(2) .deploy_data_num {
      color: #00c702;
    }
    .deploy_num:nth-child(3) .deploy_data_num {
      color: #dd3159;
    }
    .deploy_num:nth-child(1) {
      background: -webkit-linear-gradient(
        270deg,
        rgba(4, 37, 90, 1) 0%,
        rgba(4, 37, 90, 1) 0%,
        rgba(16, 35, 87, 1) 68%,
        rgba(2, 61, 101, 1) 100%,
        rgba(2, 61, 101, 1) 100%
      );
      background: -moz-linear-gradient(
        180deg,
        rgba(4, 37, 90, 1) 0%,
        rgba(4, 37, 90, 1) 0%,
        rgba(16, 35, 87, 1) 68%,
        rgba(2, 61, 101, 1) 100%,
        rgba(2, 61, 101, 1) 100%
      );
      background: linear-gradient(
        180deg,
        rgba(4, 37, 90, 1) 0%,
        rgba(4, 37, 90, 1) 0%,
        rgba(16, 35, 87, 1) 68%,
        rgba(2, 61, 101, 1) 100%,
        rgba(2, 61, 101, 1) 100%
      );
    }

    .deploy_num:nth-child(2) {
      background: -webkit-linear-gradient(
        270deg,
        rgba(4, 37, 90, 1) 0%,
        rgba(4, 37, 90, 1) 0%,
        rgba(16, 52, 77, 1) 68%,
        rgba(18, 69, 68, 1) 100%,
        rgba(18, 69, 68, 1) 100%
      );
      background: -moz-linear-gradient(
        180deg,
        rgba(4, 37, 90, 1) 0%,
        rgba(4, 37, 90, 1) 0%,
        rgba(16, 52, 77, 1) 68%,
        rgba(18, 69, 68, 1) 100%,
        rgba(18, 69, 68, 1) 100%
      );
      background: linear-gradient(
        180deg,
        rgba(4, 37, 90, 1) 0%,
        rgba(4, 37, 90, 1) 0%,
        rgba(16, 52, 77, 1) 68%,
        rgba(18, 69, 68, 1) 100%,
        rgba(18, 69, 68, 1) 100%
      );
    }
    .deploy_num:nth-child(3) {
      background: -webkit-linear-gradient(
        270deg,
        rgba(4, 37, 90, 1) 0%,
        rgba(4, 37, 90, 1) 0%,
        rgba(36, 38, 87, 1) 68%,
        rgba(59, 51, 100, 1) 100%,
        rgba(59, 51, 100, 1) 100%
      );
      background: -moz-linear-gradient(
        180deg,
        rgba(4, 37, 90, 1) 0%,
        rgba(4, 37, 90, 1) 0%,
        rgba(36, 38, 87, 1) 68%,
        rgba(59, 51, 100, 1) 100%,
        rgba(59, 51, 100, 1) 100%
      );
      background: linear-gradient(
        180deg,
        rgba(4, 37, 90, 1) 0%,
        rgba(4, 37, 90, 1) 0%,
        rgba(36, 38, 87, 1) 68%,
        rgba(59, 51, 100, 1) 100%,
        rgba(59, 51, 100, 1) 100%
      );
    }
  }
  .echarts_bar {
    width: 70%;
    height: 100%;
    background-color: black;
  }
}
::deep .el-tabs__item {
  color: #fff;
}
</style>