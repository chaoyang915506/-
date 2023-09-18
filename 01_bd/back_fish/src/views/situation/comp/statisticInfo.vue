<template>
  <div class="bg_background">
    <div class="bg_color">
      <div>
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
          <customMenuSmall class="chart" :chartData="sondata.lifedata" />
        </div>
        <div
          class="echarts"
          @click="lookchart('停泊位置点', 'berthlocation', sondata.barthData)"
        >
          <div class="title"><span></span>&emsp;停泊位置点</div>
          <berthlocation class="chart" :chartData="sondata.barthData" />
        </div>
      </div>
      <eldog v-model="show" :title="didogtitle" width="70%">
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
  </div>
</template>

<script>
import Timeline from "@/components/Timeline/customMenu.vue";
import barcombat from "@/views/analyse/echarts/barcombat.vue";
import customMenuSmall from "@/components/Timeline/customMenuSmall.vue";
import fightingpie from "@/views/analyse/echarts/fightingpie.vue";
import berthlocation from "@/views/analyse/echarts/berthlocation.vue";
import lifecycle from "@/views/analyse/echarts/lifecycle.vue";
import barresponse from "@/views/analyse/echarts/barresponse.vue";
import piecommon from "@/views/analyse/echarts/piecommon.vue";
import eldog from "@/components/Dialog/index.vue";
import custom from "@/views/analyse/components/custom.vue";
import customMenuEvent from "@/components/Timeline/customMenuEvent.vue";
export default {
  props: {
    view: {
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
      show: false,
      didogtitle: "标题",
      currentIndex: barcombat,
      lookdata: {},
      // 战备出动率
      combatdata: {
        seriesdata: [100, 200, 300, 400, 300, 200, 100],
        toplabel: [100, 200, 300, 400, 300, 200, 100],
      },
      // 维修率
      fingthD: { value: 0.206666 },
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
      // 战备出动频率分析
      responsedata: {
        sdatatop: [
          67, 56, 55, 49, 47, 25, 20, 15, 15, 10, 20, 26, 20, 20, 21, 22, 23,
        ],
        sdatabottom: [
          0, 30, 23, 15, 13, 32, 20, 10, 10, 20, 32, 35, 30, 20, 25, 30, 20,
        ],
        xdata: [
          "东城",
          "西城",
          "朝阳",
          "丰台",
          "石景山",
          "海淀",
          "门头沟",
          "通州",
          "大兴",
          "昌平",
          "顺义",
          "房山",
          "怀柔",
          "平谷",
          "延庆",
          "密云",
          "经开",
        ],
      },
    };
  },
  components: {
    barcombat,
    fightingpie,
    berthlocation,
    lifecycle,
    barresponse,
    piecommon,
    eldog,
    custom,
    customMenuSmall,
    Timeline,
    customMenuEvent,
  },
  methods: {
    lookchart(title, val, data) {
      this.show = true;
      this.didogtitle = title;
      this.currentIndex = val;
      this.lookdata = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.bg_background {
  // position: relative;
  // width: 100%;
  // height: 100%;
  width: 100%;
  height: 100%;
  color: #fff;
  overflow: auto;
  padding: 20px 30px;
  // background-image: url("/img/ui/border21.png");
  // background-size: 100% 100%;
  // padding: 40px 25px 0;
}
.bg_color {
  widows: 100%;
  background: #0b153c;
  height: 100%;
  // overflow: auto;
}
.echarts {
  height: 200px;
  width: 100% !important;
  margin-bottom: 10px;
  .title {
    display: flex;
    background-color: #0b153c;
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

$btnbg: rgb(14, 170, 192);
$btncolor: #0eaac0;
$colorbg: #0c3c69;

.sketch {
  color: #fff;
  font-size: 12px;

  div {
    margin: 5px 0;
    margin-top: 10px;
  }
}

.content_right {
  height: 50%;
  padding: 40px 25px 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  // background: url('../../assets/icons/common/border2.png');
  background-image: url("/img/ui/border21.png");
  background-size: 100% 100%;
}

.right_tile_echarts {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.right_tile_gaikuang {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  // background-image: url("/img/ui/border21.png");
  // background-size: 100% 100%;

  .gaikuang {
    padding: 40px 25px 0;
    height: 35%;
    width: 100%;
    background-image: url("/img/ui/border21.png");
    background-size: 100% 100%;
    margin-bottom: 10%;

    .ti {
      display: flex;
      justify-content: center;
    }
  }

  .data {
    position: relative;
    height: 45%;
    padding: 40px 25px 0;
    width: 100%;
    background-image: url("/img/ui/border21.png");
    background-size: 100% 100%;

    .ti {
      display: flex;
      justify-content: center;
    }
  }
}

.left_box {
  position: relative;
  // padding: 40px 29px;
  padding: 22px 25px;
  width: 100%;
  height: calc(100% - 22px);
  background: url("../../../assets/icons/common/border.png");
  background-size: 100% 100%;

  .content_text {
    padding: 40px 25px 0;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-image: url("/img/ui/border21.png");
    background-size: 100% 100%;

    .icon_inside {
      position: absolute;
      padding: 0px 27px 60px 27px;
      left: 0;
      top: 0;
      width: 100%;
      height: 104%;
    }
  }
}

.left_content {
  padding: 0px 0px 0px 0;
  height: 95%;
  width: 100%;
  overflow: auto;

  // background-color: #0b163b;
  //   background-image: url('@/assets/icons/common/border2.png');
  //   background-size: cover;
  .ti {
    display: flex;
    justify-content: center;
  }

  .ulCont {
    list-style: none;
    padding-left: 10px;

    .harborfont {
      position: relative;
      // display: flex;
      // align-items: center;
      color: #fff;
      // height: 20px;
      margin-top: 5px;

      // line-height: 20px;
      .ponit_state {
        display: inline-block;
        width: 4px;
        height: 4px;
        line-height: 20px;
        border-radius: 50%;
        background-color: $btncolor;
      }
    }
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
}

.left_nav {
  display: flex;
  padding: 0 20px;
  justify-content: center;
  margin-bottom: 10px;
}

//右侧的nav标题
.right_nav {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  padding: 0 20px;

  .right_title {
    flex: 0.9;
    transform: skew(-40deg);
    width: 25%;
    height: 20px;
    background-color: #0eaac0;
    text-align: center;
    margin-right: 3%;
    font-weight: 500;

    a {
      font-size: 12px;
      display: inline-block;
      transform: skew(40deg);
    }
  }
}

.right_content {
  width: 100%;
  height: 100%;
  background-color: #0b163b;
  // background: url('../../assets/icons/common/border2.png');
  background-image: url("/img/ui/border21.png");
  background-size: 100% 100%;
}

// .middle_nav {
//   height: 100px;
//   width: 100%;

//   .search_time {
//     position: absolute;
//     left: 12%;
//     color: #0eaac0;
//     top: 4%;
//   }
// }

.bingli_style {
  color: #fff;
  margin-bottom: 30px;
  line-height: 1.2;
}

//公共的
//按钮的样式
.ponit_state {
  display: inline-block;
  width: 4px;
  height: 4px;
  line-height: 4px;
  border-radius: 50%;
  background-color: $btncolor;
}

.left_title {
  transform: skew(-40deg);
  flex: 1;
  margin-right: 10px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  background-color: $colorbg;
  text-align: center;
  color: $btncolor;
  border: 0px;

  a {
    font-weight: 500;
    display: block;
    transform: skew(40deg);

    font-size: 12px;
  }

  div {
    transform: skew(45deg);
    font-size: 12px;
  }
}

//复选框的样式
.checkbox_css {
  position: absolute;
  top: 0;
  right: 3%;
}

//选中的样式
.activeinofo {
  color: #0f1c40 !important;
  background-color: $btnbg !important;
}

.box_content {
  display: flex;
  width: 100%;
  height: calc(100vh - 100px);
}

.left,
.right,
.middle {
  position: relative;
  height: 100%;
}

.left,
.right {
  width: 25%;
}

.middle {
  width: 50%;
}

.middle_title {
  color: #0eaac0;
}
</style>
