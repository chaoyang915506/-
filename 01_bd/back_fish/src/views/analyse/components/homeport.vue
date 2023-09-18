<template>
  <div>
    <div
      class="echarts"
      @click="lookchart('战备出动频率分析', 'barresponse', sondata.mugangzb)"
    >
      <div class="title"><span></span>&emsp;战备出动频率分析</div>
      <barresponse class="chart" :chartData="sondata.mugangzb" />
    </div>
    <div
      class="echarts"
      style="height: 300px"
      @click="lookchart('部署密度分析', 'densitytable', sondata.mugangmidudata)"
    >
      <div class="title"><span></span>&emsp;部署密度分析</div>
      <!-- <div class="tietu1"></div> -->
      <densitytable class="chart" :chartData="sondata.mugangmidudata" />
    </div>
    <div
      class="echarts"
      @click="lookchart('船型占比', 'barshiptype', sondata.cxlbdata)"
    >
      <div class="title"><span></span>&emsp;船型占比</div>
      <barshiptype class="chart" :chartData="sondata.cxlbdata" />
    </div>
    <div
      class="echarts"
      @click="lookchart('船型占比', 'pierose', sondata.cxlbdata)"
    >
      <pierose class="chart" :chartData="sondata.cxlbdata" />
    </div>
    <div
      class="echarts"
      @click="lookchart('所有靠泊该港的船', 'piecommon', sondata.tgmgdata)"
    >
      <div class="title"><span></span>&emsp;所有靠泊该港的船</div>

      <piecommon class="chart" :chartData="sondata.tgmgdata" />
    </div>
    <Dialog v-model="show" :title="didogtitle" width="70%" v-if="show">
      <component
        :is="currentIndex"
        style="width: 100%; height: 500px"
        :chartData="lookdata"
        :imgurl="imgurl"
        :max="true"
      ></component>
    </Dialog>
  </div>
</template>

<script>
// import barresponse from "../echarts/barresponse.vue";
import barresponse from "../echarts/barresponse.vue";
import densitytable from "../echarts/densitytable.vue";
import barshiptype from "../echarts/barshiptype.vue";
import pierose from "../echarts/pierose.vue";
import piecommon from "../echarts/piecommon.vue";

export default {
  props: {
    sondata: {
      type: Object,
      default: null,
    },
    imgurl:{
      type:String,
      default:""
    }
    
    
  },
  data() {
    return {
      show: false,
      didogtitle: "标题",
      currentIndex: pierose,
      lookdata: {},
      // 船型占比
      shiptyped: {
        xdata: [
          "漏洞攻击",
          "网络扫描",
          "暴力破解",
          "进程外联",
          "钓鱼邮件",
          "启动",
        ],
        seriesdata: [40, 40, 15, 2, 2, 1],
      },
      // 停泊位置点
      barthData: {
        seriesdata: [
          20, 50, 15, 35, 50, 30, 40, 50, 60, 20, 50, 15, 35, 50, 30, 40, 50,
          60,
        ],
        xdata: [
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
          "XX街道",
        ],
      },
    };
  },
  methods: {
    lookchart(title, val, data) {
      this.show = true;
      this.didogtitle = title;
      this.currentIndex = val;
      this.lookdata = data;
    },
  },
  components: {
    barresponse,
    densitytable,
    barshiptype,
    pierose,
    // berthlocation,
    piecommon,
  },
};
</script>

<style lang="scss" scoped>
@import "../index.scss";
.tietu1 {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-image: url("/img/ui/blockchart.png");
}
.bg_background {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("/img/ui/border21.png");
  background-size: 100% 100%;
  padding: 40px 25px 40px;
}
.bg_color {
  height: 100%;
  // background: #0b153c;
  // overflow: auto;
}
.echarts {
  height: 200px;
  width: 100% !important;
  margin-bottom: 10px;
  .title {
    display: flex;
    // background-color: #0b153c;
    // justify-content: center;

    height: 18px;
    color: #fff;
    line-height: 18px;
    font-size: 14px;
    span {
      margin-right: 2px;
      display: inline-block;
      width: 2px;
      height: 20px;
      background-color: #0c9eb5;
    }
  }
  .chart {
    width: 100%;
    height: calc(100% - 20px);
  }
}
.ti {
  display: flex;
  justify-content: center;
}
.mugang_title {
  background-image: url("/img/ui/title.png");
  position: absolute;
  top: 1%;
  // left: 35%;
  width: 120px;
  height: 30px;
  background-size: 100% 100%;

  .infoh {
    width: 100%;
    position: absolute;
    top: 5%;
    left: 0;
    text-align: center;
    color: #fff;
    font-weight: 700;
    font-size: 15px;
  }
}
</style>