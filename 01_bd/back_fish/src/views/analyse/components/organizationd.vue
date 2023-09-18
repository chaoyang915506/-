<template>
  <div v-if="device" style="height: 100%; padding: 10px">
    <!-- 判断是中队-->
    <div v-if="device == 'detachment'" style="height: 100%">
      <div
        class="echarts"
        @click="
          lookchart('战备出动频率分析', 'barresponse', sondata.zhanbeichudong)
        "
      >
        <div class="title"><span></span>&emsp;战备出动频率分析</div>
        <barresponse class="chart" :chartData="sondata.zhanbeichudong" />
      </div>
      <div
        class="echarts"
        @click="lookchart('战备出动频率分析', 'piecommon', sondata.piecommon)"
      >
        <piecommon class="chart" :chartData="sondata.piecommon" />
      </div>

      <div
        class="echarts"
        @click="lookchart('部署密度分析', 'densitytable', sondata.densitytable)"
      >
        <div class="title"><span></span>&emsp;部署密度分析</div>
        <densitytable class="chart" :chartData="sondata.densitytable" />
      </div>
      <div
        class="echarts"
        @click="lookchart('船型占比', 'barshiptype', sondata.barshiptype)"
      >
        <div class="title"><span></span>&emsp;船型占比</div>
        <barshiptype class="chart" :chartData="sondata.barshiptype" />
      </div>
      <div
        class="echarts"
        @click="lookchart('船型占比', 'piearch', sondata.piearch)"
      >
        <piearch class="chart" :chartData="sondata.piearch" />
      </div>
    </div>
    <!-- 单艇 -->
    <div v-if="device == 'standalone'" style="height: 100%">
      <div
        class="echarts"
        @click="lookchart('战备出动率', 'barcombat', sondata.combatdata)"
      >
        <div class="title"><span></span>&emsp;战备出动率</div>
        <barcombat class="chart" :chartData="sondata.combatdata" />
      </div>
      <!-- 战备率 -->
      <div
        class="echarts"
        @click="lookchart('战备率', 'fightingpie', sondata.fingthD)"
      >
        <div class="title"><span></span>&emsp;战备率</div>
        <fightingpie class="chart" :chartData="sondata.fingthD" />
      </div>

      <div
        class="echarts"
        @click="lookchart('生命周期', 'customMenuEvent', sondata.lifedata)"
      >
        <div class="title"><span></span>&emsp;生命周期</div>
        <customMenuSmall
          v-if="sondata.lifedata"
          class="chart"
          :chartData="sondata.lifedata"
        />
      </div>
      <div
        class="echarts"
        @click="lookchart('停泊位置点', 'berthlocation', sondata.barthData)"
      >
        <div class="title"><span></span>&emsp;停泊位置点</div>
        <berthlocation
          v-if="sondata.barthData"
          class="chart"
          :chartData="sondata.barthData"
        />
      </div>
    </div>
    <!-- 大队 -->
    <div
      v-if="device == 'brigade' || device == 'commander'"
      style="height: 100%"
    >
      <div
        class="echarts"
        @click="
          lookchart('战备出动频率分析', 'barresponse', sondata.zhanbeichudong)
        "
      >
        <div class="title"><span></span>&emsp;战备出动频率分析</div>
        <barresponse class="chart" :chartData="sondata.zhanbeichudong" />
      </div>
      <div
        class="echarts"
        @click="lookchart('战备出动频率分析', 'piecommon', sondata.piecommon)"
      >
        <piecommon class="chart" :chartData="sondata.piecommon" />
      </div>

      <div
        class="echarts"
        @click="lookchart('部署密度分析', 'densitytable', sondata.densitytable)"
      >
        <div class="title"><span></span>&emsp;部署密度分析</div>
        <densitytable class="chart" :chartData="sondata.densitytable" />
      </div>
      <div
        class="echarts"
        @click="lookchart('船型占比', 'barshiptype', sondata.barshiptype)"
      >
        <div class="title"><span></span>&emsp;船型占比</div>
        <barshiptype class="chart" :chartData="sondata.barshiptype" />
      </div>
      <div
        class="echarts"
        @click="lookchart('船型占比', 'pierose', sondata.pierose)"
      >
        <pierose class="chart" :chartData="sondata.pierose" />
      </div>
      <div
        class="echarts"
        v-if="device == 'commander'"
        @click="lookchart('部署时长', 'bartimedeploy', sondata.bartimedeploy)"
      >
        <div class="title"><span></span>&emsp;部署时长</div>
        <bartimedeploy class="chart" :chartData="sondata.bartimedeploy" />
      </div>
      {{ device }}
    </div>
    <eldog v-model="show" :title="didogtitle" width="70%" v-if="show">
      <component
        :is="currentIndex"
        :chartData="lookdata"
        :messageshow="true"
        :max="true"
        :style="{
          width: ' 100%',
          height: currentIndex == 'customMenuEvent' ? '650px' : '400px',
        }"
      ></component>
    </eldog>
  </div>
</template>

<script>
import Timeline from "@/components/Timeline/customMenu.vue";
import customMenuSmall from "@/components/Timeline/customMenuSmall.vue";
import customMenuEvent from "@/components/Timeline/customMenuEvent.vue";
import eldog from "@/components/Dialog/index.vue";
import pierose from "../echarts/pierose.vue";
import barcombat from "../echarts/barcombat.vue";
import fightingpie from "../echarts/fightingpie.vue";
import berthlocation from "../echarts/berthlocation.vue";
import lifecycle from "../echarts/lifecycle.vue";
import bartimedeploy from "@/components/eCharts/bartimedeploy/index.vue";
import barresponse from "../echarts/barresponse.vue";
import piecommon from "../echarts/piecommon.vue";
import barshiptype from "../echarts/barshiptype.vue";
import piearch from "../echarts/piearch.vue";
import densitytable from "../echarts/densitytable.vue";
export default {
  name: "organizationd",
  components: {
    barcombat,
    fightingpie,
    berthlocation,
    lifecycle,
    barresponse,
    piecommon,
    eldog,
    barshiptype,
    piearch,
    densitytable,
    pierose,
    bartimedeploy,
    Timeline,
    customMenuSmall,
    customMenuEvent,
  },
  watch: {
    device: {
      handler(v) {
        this.$forceUpdate();
        console.log(v, "redddd");
      },
      deep: true,
      immediate: true,
    },
  },
  props: {
    device: {
      type: String,
      default: "",
    },
    sondata: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      lifeshow: false,
      show: false,
      didogtitle: "标题",
      currentIndex: pierose,
      lookdata: {},
    };
  },
  mounted() {
    // console.log(this.sondata, "dag");
  },
  methods: {
    lookchart(title, val, data) {
      // if (title == "生命周期") {
      // this.lifeshow = true;
      // } else {
      this.show = true;
      // }
      this.didogtitle = title;
      this.currentIndex = val;
      this.lookdata = data;
    },
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
  padding: 10px;
  // background: #0b153c;
  // overflow: auto;
}
.echarts {
  // height: 200px;
  height: 25%;
  width: 100% !important;
  padding-bottom: 10px;
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
// ::v-deep .el-dialog__body {
//   width: 500px;
//   height: 500px;
// }
</style>
