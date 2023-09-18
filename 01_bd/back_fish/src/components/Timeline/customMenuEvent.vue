<template>
  <div id="app1">
    <div ref="containner" class="containner">
      <div class="zuobiaozhou">
        <div class="zouUp">
          <div class="lenged" style="top: 175px">维修</div>
          <div class="lenged" style="top: 75px">部署</div>
          <div class="lenged" style="top: 125px">停泊</div>
          <div class="lenged" style="top: 25px">行驶</div>
          <div class="lenged" style="top: -25px">战斗</div>
        </div>
        <div class="zouDown"></div>
      </div>
      <div
        class="baseCssBig"
        v-for="(item, i) in timeLineData"
        :key="i"
        :style="{
          backgroundColor: item.color,
        }"
      >
        <div
          class="xuetiao"
          :style="{ top: item.xueTop, backgroundColor: item.color }"
        ></div>
        <div
          v-if="i === 0"
          :style="{
            height: item.tooltipStyle.boxWidth,
            top: item.tooltipStyle.top,
            bottom: item.tooltipStyle.bottom,
          }"
          class="context angleDown"
        >
          <div class="innerContext">
            <div class="contextTime">开始时间：{{ item.startTime }}</div>
            <div class="contextEvent">事件名称：{{ item.event }}</div>
            <div class="contextDetail">{{ item.detail }}</div>
          </div>
        </div>
        <div
          v-else-if="i % 2 !== 1 && i !== 0"
          :style="{
            height: item.tooltipStyle.boxWidth,
            top: item.tooltipStyle.top,
            bottom: item.tooltipStyle.bottom,
          }"
          class="context angleDown"
        >
          <div class="innerContext">
            <div class="contextTime">开始时间：{{ item.startTime }}</div>
            <div class="contextEvent">事件名称：{{ item.event }}</div>
            <div class="contextDetail">{{ item.detail }}</div>
          </div>
        </div>
        <div
          v-else
          :style="{
            height: item.tooltipStyle.boxWidth,
            top: item.tooltipStyle.top,
            bottom: item.tooltipStyle.bottom,
          }"
          class="context angleUp"
        >
          <div class="innerContext">
            <div class="contextTime">开始时间：{{ item.startTime }}</div>
            <div class="contextEvent">事件名称：{{ item.event }}</div>
            <div class="contextDetail">{{ item.detail }}</div>
          </div>
        </div>
      </div>
      <div class="currentTime">
        {{ parseTime(new Date(), "{y}年{m}月{d}日") }}
      </div>
      <div class="search_time">
        <el-date-picker
          type="date"
          size="mini"
          v-model="date1"
          value-format="yyyy-MM-dd"
          placeholder="年/月/日"
        ></el-date-picker>
        &emsp;至&emsp;
        <el-date-picker
          type="date"
          size="mini"
          v-model="date2"
          value-format="yyyy-MM-dd"
          placeholder="年/月/日"
        ></el-date-picker>
        &emsp;
        <el-button @click="search()" type="primary" size="mini">执行</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
export default {
  props: {
    messageshow: {
      type: Boolean,
      default: false,
    },
    chartData: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    messageshow: {
      deep: true,
      immediate: true,
      handler(val) {
        // debugger
        $(".popDiv").remove();
      },
    },
  },
  data() {
    return {
      boxWidth: "",
      clintWidth: "",
      topMargin: 0,
      timeLineData: [],
      // date1: new Date("1993-01-06"),
      // date2: new Date("1994-07-06"),
      date1: "",
      date2: "",
    };
  },
  mounted() {
    let clintWidth = this.$refs.containner.clientWidth;
    this.clintWidth = clintWidth;
    this.topMargin = clintWidth * 0.1 + 10 + "px";
    this.boxWidth = clintWidth * 0.1 + "px";
    this.initData();
  },
  methods: {
    initData() {
      let newData = JSON.parse(JSON.stringify(this.chartData));
      newData.forEach((item, i) => {
        // 持续时间是下次事件的开始时间减去当前事件的开始时间，最后一项就是当前时间减去最后一项的开始时间。
        if (i === newData.length - 1) {
          item.timeRange = this.getTimeRange(
            item.startTime,
            new Date().toISOString()
          );
        } else {
          item.timeRange = this.getTimeRange(
            item.startTime,
            newData[i + 1].startTime
          );
        }
        item.timeLineWidth = this.getTimeWidth(item.timeRange);
        item.timeLineWidthDays = this.getTimeWidthDays(item.timeRange);
        item.tooltipStyle.boxWidth = this.boxWidth;
        if (i % 2 !== 1) {
          item.tooltipStyle.top = "-" + this.topMargin;
          item.tooltipStyle.bottom = "-10px";
        } else {
          item.tooltipStyle.bottom = "-" + this.boxWidth;
          item.tooltipStyle.top = "40px";
        }
        let t = (this.clintWidth * 0.1) / 2;
        item.tooltipStyle.left = "-" + t + "px";
      });
      this.timeLineData = newData;
    },
    getTimeRange(bt, et) {
      // 两个日期相减
      let days =
        (new Date(et).getTime() - new Date(bt).getTime()) /
        (24 * 60 * 60 * 1000);
      return days;
    },
    getTimeWidth(days) {
      let pixel = 0;
      let index = 1;
      // 改为一天=1px
      for (var i = 0; i < days; i++) {
        pixel += index * 1;
      }
      pixel += "px";
      return pixel;
    },
    getTimeWidthDays(days) {
      let pixel = 0;
      let index = 1;
      // 改为一天=1px
      for (var i = 0; i < days; i++) {
        pixel += index * 1;
      }
      return pixel;
    },
    search() {
      //   console.log("开始时间", this.date1);
      //   console.log("结束时间", this.date2);
      let startIndex,
        endIndex = 0;

      // debugger;
      for (var i = 0; i < this.timeLineData.length; i++) {
        let eventTime = new Date(this.timeLineData[i].startTime).getTime();
        if (new Date(this.date1).getTime() === eventTime) {
          startIndex = i;
          break;
        }
        if (new Date(this.date1).getTime() < eventTime) {
          startIndex = i - 1;
          break;
        }
      }
      for (var i = this.timeLineData.length - 1; i >= 0; i--) {
        let eventTime = new Date(this.timeLineData[i].startTime).getTime();
        if (new Date(this.date2).getTime() === eventTime) {
          endIndex = i;
          break;
        }
        if (new Date(this.date2).getTime() > eventTime) {
          endIndex = i + 1;
          break;
        }
      }

      let startPx = startIndex * 50 + 100;
      let timeLineWidth = (endIndex - startIndex) * 50;
      // 加100px是padding
      let $html = $(
        `<div class='popDiv' style="position:absolute;left:${
          startPx + "px"
        };width:${timeLineWidth + "px"};height:50px;background: #ffe000;
    opacity: 0.3;"></div>`
      );
      $($(".containner")).append($html);
    },
  },
};
</script>

<style lang="scss" scoped>
#app1 {
  width: 100%;
  height: 100%;
}

.containner {
  display: flex;
  width: 100%;
  height: 80%;
  overflow: auto;
  align-items: center;
  padding: 0 100px;
  position: relative;
}
.zuobiaozhou {
  width: 5px;
  height: 500px;
  margin-right: 10px;
}
.zouUp {
  width: 5px;
  height: calc(50% - 15px);
  background-color: #fff;
  position: relative;
}
.lenged {
  width: 50px;
  position: absolute;
  word-break: break-all;
  left: -35px;
  color: #fff;
}
.zouDown {
  width: 100%;
  height: 50%;
  display: none;
}

.xuetiao {
  position: absolute;
  width: 100%;
  height: 2px;
  top: -200px;
  right: 0px;
  background: #8ea1cc;
  color: #fff;
}
.search_time {
  position: fixed;
  right: 30%;
  transform: translate(50%);
  top: 7%;
}
.baseCssBig {
  flex-shrink: 0;
  width: 50px;
  height: 20px;
  position: relative;
  border: 1px solid #000;
  z-index: 99999;
  box-sizing: border-box;
}
.baseCssBig:hover .context {
  transform: 1s;
  opacity: 1 !important;
}
.context {
  opacity: 0;
  position: absolute;
  left: -10px;
  background: #2f3953;
  color: #fff;
  width: 10vw !important;
  max-width: 50vw;
  // overflow: auto;
}
.innerContext {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.contextTime {
  margin: 10px 10px;
}
.contextEvent {
  margin: 10px 10px;
}
.contextDetail {
  margin: 10px 10px;
}
.angleUp:before {
  content: "";
  width: 0;
  height: 0;
  border-width: 0 10px 10px;
  border-style: solid;
  border-color: transparent transparent #2f3953;
  position: absolute;
  // left: 50%;
  left: 10px;
  transform: translate(-50%);
  top: -10px;
  z-index: 9999;
}
.angleDown:before {
  content: "";
  width: 0;
  height: 0;
  border-width: 10px;
  border-style: solid;
  border-color: #2f3953 transparent transparent;
  position: absolute;
  // left: 50%;
  left: 10px;
  transform: translate(-50%);
  bottom: -20px;
  z-index: 9999;
}
.currentTime {
  color: white;
  word-break: keep-all;
  margin: 10px;
}
</style>
