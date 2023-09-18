<template>
  <div class="app-container app_dev">
    <left
      class="left"
      :generic_data_source="generic_data_source"
      :accountlist="accountlist"
    />
    <!-- <div class="right" :style="{ width: view ? '50%' : '75%' }"> -->
    <div
      class="right"
      :style="{
        width: view
          ? '60%'
          : mediaInfo.length > 0 && view == false
          ? '78%'
          : '80%',
      }"
    >
      <middle
        class="middle"
        ref="middle"
        :anydata="{ date1, date2, userName }"
        :anypostionmap="anypostionmap"
        :sourdata="sourdata"
        :mmsiGraphicArr="mmsiGraphicArr"
      />
      <div class="search_time" :style="{ left: view ? '50%' : '38%' }">
        <el-date-picker
          type="date"
          size="mini"
          v-model="date1"
          placeholder="年/月/日"
        ></el-date-picker>
        &emsp;<span style="color: #e2e2ff">-</span>&emsp;
        <el-date-picker
          type="date"
          :disabled-date="getcreatetime"
          size="mini"
          v-model="date2"
          placeholder="年/月/日"
        ></el-date-picker>
        &emsp;
        <el-button @click="searchAll" type="primary" size="mini"
          >执行</el-button
        >
      </div>
      <div class="totalall">
        <div class="boxraduis" v-for="(i, j) in totallsit" :key="j">
          <div class="circle">{{ i.dataSource }} &emsp;{{ i.count }}</div>
        </div>
        <div class="line"></div>
      </div>
    </div>

    <!-- <div :style="{ width: view ? '25%' : '0%' }" class="right_all"> -->
    <div
      v-show="view"
      :style="{ width: view ? '20%' : '0%' }"
      class="right_all"
    >
      <!-- :class="[view ? 'right_box' : 'false_right', 'box_app']" -->

      <div
        style="
          height: 100%;
          box-shadow: inset 3px 3px 3px #054588, inset -3px -3px 3px #054588;
        "
      >
        <!-- v-if="view" -->
        <div class="title_info" v-if="view">
          <span>{{ userName ? userName : "近期数据" }} </span>
          <div></div>
          <i @click="download()" class="downAll el-icon-download"></i>
        </div>
        <right :template1="mediaInfo"> </right>
      </div>
      <!-- v-if="mediaInfo.length > 0" -->
      <div class="img_arrows" @click="view = !view">
        <img
          :class="[view ? 'imgopen' : 'imgclose']"
          src="/img/ui/arrows.svg"
          alt=""
        />
      </div>
    </div>
    <div
      class="ceshi_css"
      @click="view = !view"
      v-if="view == false && mediaInfo.length > 0"
    >
      <img
        :class="[view ? 'imgopen' : 'imgclose']"
        src="/img/ui/arrows.svg"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import left from "./compontent/left.vue";
import right from "./compontent/right.vue";
import middle from "./compontent/middle.vue";
import {
  多源数据列表查询,
  多源数据按位置统计,
  多源数据按多位置查询记录,
  重点账号列表用户账号,
  列表统计增量数据,
  多源数据导出,
  查询AIS数据,
} from "@/api/information/information.js";
import { parseTime } from "@/utils/ruoyi";
export default {
  components: {
    left,
    right,
    middle,
  },
  data() {
    return {
      date1: "", //开始时间
      date2: "", //结束时间
      mediaInfo: [],
      view: false,
      show: false,
      title: "近期数据",
      componentId: "",
      generic_data_source: [],
      paramsdata: {}, //right列表参数
      postionlist: {}, //地图的地址参数
      totaldata: {}, //数量的参数

      anypostionmap: [], //地图的数据
      sourdata: [], //数据源
      accountlist: [], //监控账号列表
      userName: "", //用户姓名
      // totallsit: [], //数量总量
      totallsit: [
        { dataSource: "WC", count: 0 },
        { dataSource: "STA", count: 0 },
        { dataSource: "IC", count: 0 },
        { dataSource: "SM", count: 0 },
        { dataSource: "AIS", count: 0 },
      ],
      mmsiGraphicArr: [], // ais数据
      currentTime: new Date().getTime(),
      sevenTime: new Date().setDate(new Date().getDate() - 7),
    };
  },

  created() {
    this.getalltotaldata();
    this.getinfo();
    this.getDicts("generic_data_source_type").then((res) => {
      this.generic_data_source = res.data;
    });
    this.getpostion();
    this.getallaccount();
    window.scrollType = 0;
  },
  methods: {
    searchAll() {
      // console.log(this.date1);
      if (!this.date1 || !this.date2) {
        this.$message.error(`请输入开始时间和结束时间`);
        return;
      }
      this.$refs.middle.clearmap();
      this.userName = window.infoName;
      this.getalltotaldata();
      this.getrefrsh();
      this.getpostion();
      this.getinfo();
      this.closewindow(true);
    },
    getcreatetime(time) {
      return this.date1.getTime() >= time.getTime();
    },
    // 刷新所有的数据
    getrefrsh() {
      this.anypostionmap = [];
      this.mediaInfo = [];
      // this.sourdata = [];
    },
    //获取经纬度的数据
    async getpostion(params) {
      // debugger
      console.log(this.sourdata);
      this.postionlist = {
        dataSources: this.sourdata,
        endTime: this.date2 ? this.date2.getTime() : this.currentTime,
        startTime: this.date1 ? this.date1.getTime() : this.sevenTime,
        userName: this.userName,
      };
      let results = await 多源数据按位置统计(this.postionlist);
      // console.log(results, "red");
      this.anypostionmap = results.rows;
    },
    //获取右侧的消息
    async getinfo(param) {
      // 有AIS或者全不选
      if (this.sourdata.includes("AIS") || this.sourdata.length === 0) {
        let reAis = await 查询AIS数据(
          this.date1 ? this.date1.getTime() : this.sevenTime,
          this.date2 ? this.date2.getTime() : this.currentTime
        );
        this.mmsiGraphicArr = reAis.rows;
        this.$refs.middle.initPath(this.mmsiGraphicArr);
        // console.log(reAis);
      }
      // param=null为执行查询，param=1为滚动查询，window.scrollType=2为点位的滚动查询
      if (param === 1) {
        if (window.scrollType === 2) {
          let results = await 多源数据按多位置查询记录({
            dataSources: this.sourdata,
            pageNum: 0,
            positions: JSON.parse(window.coorArr),
            pageSize: (this.paramsdata.pageSize += 10),
            endTime: this.date2 ? this.date2.getTime() : this.currentTime,
            startTime: this.date1 ? this.date1.getTime() : this.sevenTime,
            userName: window.infoName ? window.infoName : "",
          });
          if (results.rows && results.rows.length > 0)
            this.mediaInfo = results.rows;
        } else {
          this.paramsdata = {
            ...this.paramsdata,
            pageSize: (this.paramsdata.pageSize += 10),
            endTime: this.date2 ? this.date2.getTime() : this.sevenTime,
            startTime: this.date1 ? this.date1.getTime() : this.sevenTime,
            userName: this.userName,
            dataSources: this.sourdata,
          };
          let results = await 多源数据列表查询 (this.paramsdata);
          console.log(results, "右侧 数据");
          if (results.rows && results.rows.length > 0)
            this.mediaInfo = results.rows;
        }
      } else {
        this.paramsdata = {
          pageNum: 0,
          dataSources: this.sourdata,
          endTime: this.date2 ? this.date2.getTime() : this.sevenTime,
          startTime: this.date1 ? this.date1.getTime() : this.sevenTime,
          pageSize: 20,
          userName: window.infoName ? window.infoName : this.userName,
        };
        let results = await 多源数据列表查询(this.paramsdata);
        console.log(results, "右侧 数据");
        if (results.rows && results.rows.length > 0)
          this.mediaInfo = results.rows;
      }
    },
    // 打开或者关闭右侧
    closewindow(i) {
      this.view = i;
    },
    //获取数量
    async getalltotaldata(params) {
      // debugger
      // console.log(
      //   parseTime(
      //     new Date().setDate(new Date().getDate() - 7),
      //     "{y}年{m}月{d}日"
      //   )
      // );
      this.totaldata = {
        dataSources: this.sourdata,
        endTime: this.date2 ? this.date2.getTime() : new Date().getTime(),
        startTime: this.date1
          ? this.date1.getTime()
          : new Date().setDate(new Date().getDate() - 7),
        userName: this.userName,
      };

      this.totallsit = [
        { dataSource: "WC", count: 0 },
        { dataSource: "STA", count: 0 },
        { dataSource: "IC", count: 0 },
        { dataSource: "SM", count: 0 },
        { dataSource: "AIS", count: 0 },
      ];
      let res = await 列表统计增量数据(this.totaldata);
      console.log(res, "总量");
      // this.totallsit = res.rows;
      if (res.rows && res.rows.length > 0) {
        this.totallsit.forEach((item) => {
          let tar = res.rows.find((tl) => tl.dataSource === item.dataSource);
          if (tar) item.count = tar.count;
        });
      }
    },
    //获取重点账号列表
    async getallaccount() {
      let res = await 重点账号列表用户账号();
      // console.log(res, "zh");
      this.accountlist = res.rows;
    },
    // 下载右边全部数据
    async download() {
      let ids = [];
      this.mediaInfo.forEach((item) => {
        ids.push(item._id);
      });
      let formData = new FormData();
      formData.append("ids", ids);
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
  },
};
</script>

<style lang="scss" scoped>
.ceshi_css {
  display: flex;
  margin-left: 5px;
  justify-content: center;
  padding: 10px 0;
  text-align: center;
  display: flex;
  width: 2%;
  height: 100%;
  box-shadow: inset 3px 3px 3px #054588, inset -3px -3px 3px #054588;

  // background-color: red;
}
.right_all {
  position: relative;
  margin-left: 5px;
}
.app_dev {
  display: flex;
  padding: 5px !important;
  height: calc(100vh - 60px);
}
.left {
  //   display: inline-block;
  background-color: #0d183d;
  height: 100%;
  width: 20%;
  margin-right: 5px;
}

.right {
  display: inline-block;
  position: relative;
  height: 100%;
  // border: 1px solid #241866;
  //   background-color: orange;
  // width: 75%;
}
.middle {
  width: 100%;
  height: 100%;
  //   background-color: green;
}
.right_box {
  //   position: relative;
  width: calc(100% / 3);
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
  // position: absolute;
  // //   z-index: 99999;
  // left: -25px;
  // top: 10px;
  // height: 40px;
  // width: 25px;
  // background: #0d183d;
  // display: flex;
  // justify-content: center;
  // align-items: center;

  position: absolute;
  left: 93%;
  top: 15px;
  height: 4px;
  width: 5px;
  background: #0d183d;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.imgclose {
  // width: 15px;
  // height: 20px;
  width: 8px;
  height: 13px;
}
.imgopen {
  z-index: 999;
  // width: 15px;
  // height: 20px;
  transform: rotate(-180deg);

  width: 8px;
  height: 13px;
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
  // font-size: 17px;
  font-size: 15px;
  color: #fff;
  padding: 1px 10px;
  font-weight: 500;
  .downAll {
    cursor: pointer;
  }
  span {
    width: 30%;
    border-left: 4px solid #1487c8;
    padding-left: 4px;
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
.search_time {
  position: absolute;
  top: 20px;
  // left: 50%;
  left: 40%;
  transform: translate(-50%);
}
.totalall {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  left: 26%;
  bottom: 4%;
  width: calc(100% / 2);
  height: 40px;
  // background-color: red;
  .boxraduis {
    z-index: 1;
    width: calc(100% / 7);
    height: 30px;
    line-height: 25px;
    border-radius: 15px;
    border: 3px solid transparent;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;

    .circle {
      border-radius: 10px;
      color: #fff;
      text-align: center;
    }
  }
  .boxraduis:nth-child(1) {
    background-image: linear-gradient(to right, #222, #222),
      linear-gradient(90deg, #fe0606, #087cf4);
  }
  .boxraduis:nth-child(2) {
    background-image: linear-gradient(to right, #222, #222),
      linear-gradient(90deg, #f17418, #0280fa);
  }
  .boxraduis:nth-child(3) {
    background-image: linear-gradient(to right, #222, #222),
      linear-gradient(90deg, #06dbf6, #0082fc);
  }
  .boxraduis:nth-child(4) {
    background-image: linear-gradient(to right, #222, #222),
      linear-gradient(90deg, #fdfdfd, #0281fc);
  }
  .boxraduis:nth-child(5) {
    background-image: linear-gradient(to right, #222, #222),
      linear-gradient(90deg, #dfd306, #0781f9);
  }
  .line {
    z-index: 0;
    width: 100%;
    // background-color: ;
    background-image: linear-gradient(#079fc2, #fff);
    height: 2px;
    position: absolute;
    top: 20px;
    left: 0;
  }
}

::v-deep .search_time .el-input--mini .el-input__inner {
  background: #0f1c40;
  height: 32px;
  line-height: 32px;
  border: 1px solid #122b54;
}
::v-deep .search_time .el-input--mini .el-input__inner::placeholder {
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
