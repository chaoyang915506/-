<template>
  <div class="bg_background">
    <div class="bg_color">
      <div class="title_info">
        <span>统计信息</span>
        <div></div>
      </div>
      <!-- v-if="view == 'zuzhi'" -->
      <Organizationd
        v-if="view == 'zuzhi'"
        :device="device"
        :sondata="sondata"
      ></Organizationd>
      <custom
        v-if="view == 'zidyi'"
        :selectzidiyi="selectzidiyi"
        :zdydata="sondata.zdydata"
        style="height: 100%"
      ></custom>
      <homeport
        v-if="view == 'mugang'"
        :sondata="sondata"
        :imgurl="imgurl"
        style="height: 100%; overflow-y: auto; overflow-x: hidden"
      ></homeport>

      <div v-if="view == 'bingli'">
        <div class="title"><span></span>&emsp;兵力布势对比图</div>

        <div
          class="echarts"
          @click="looktext('兵力布势对比图', 'areacolor', item)"
          v-for="item in sondata.troopslist"
          :key="item.color"
        >
          <areacolor style="height: 200px; width: 100%" :chartData="item" />
        </div>

        <div class="diafather">
          <div
            class="diamonds"
            v-for="item in sondata.troopslist"
            :key="item.color"
          >
            <div class="block" :style="{ background: item.color }"></div>
            &ensp;
            <div class="name">{{ item.front }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <eldog v-model="show" :title="didogtitle" width="70%">
      <component
        :is="currentIndex"
        :chartData="chartData"
        :max="true"
        :imgurl="imgurl"
        style="width: 100%; height: 400px"
      ></component>
    </eldog>
  </div>
</template>

<script>
import Organizationd from "./components/organizationd.vue";
import berthlocation from "./echarts/berthlocation.vue";
import eldog from "@/components/Dialog/index.vue";
import custom from "./components/custom.vue";
import homeport from "./components/homeport.vue";
import areacolor from "./echarts/areacolor.vue";
export default {
  props: {
    view: {
      type: String,
      default: "",
    },
    device: {
      type: String,
      default: "",
    },
    selectzidiyi: {
      type: Array,
      default: () => [],
    },
    sondata: {
      type: Object,
      default: null,
    },
    imgurl: {
      type: String,
      default: "",
    },
  },
  mounted() {},
  data() {
    return {
      currentIndex: berthlocation,
      didogtitle: "",
      show: false,
      chartData: {},
    };
  },
  methods: {
    looktext(title, val, data) {
      this.show = true;
      this.didogtitle = title;
      this.currentIndex = val;
      this.chartData = data;
    },
  },
  components: {
    Organizationd,
    berthlocation,
    eldog,
    custom,
    homeport,
    areacolor,
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
.diafather {
  height: 20px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.diamonds {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% / 3);
  height: 100%;
  .block {
    display: inline-block;
    margin-right: 1%;
    width: 40%;
    height: 50%;
    // background: #fff;
  }
  .name {
    // translate: ;
    transform: scale(0.8);
    display: inline-block;
    font-size: 12px;
    height: 100%;
    color: #fff;
  }
}
.bg_background {
  // position: relative;
  // width: 100%;
  // height: 100%;

  position: relative;
  width: 100%;
  height: calc(100vh - #{$base-hearder-height} - 80px);

  box-shadow: inset 3px 3px 3px #054588, inset -3px -3px 3px #054588;
  padding: 10px;

  // background-image: url("/img/ui/border21.png");
  // background-size: 100% 100%;
  // padding: 40px 25px 40px;
}
.bg_color {
  height: 100%;
  // background: #0b153c;
  // overflow: auto;
}
.echarts {
  // height: 200px;
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
</style>