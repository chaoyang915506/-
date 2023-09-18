<template>
  <div id="app1">
    <div ref="containner" class="containner">
      <div
        class="baseCssBig"
        v-for="(item, i) in timeLineData"
        :key="i"
        :style="{
          backgroundColor: item.color,
        }"
        @click="itemClick(item)"
      >
        {{ item.begintime }}
      </div>
      <div class="currentTime">
        {{ parseTime(new Date(), "{y}年{m}月{d}日") }}
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
export default {
  props: {
    chartData: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    chartData: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && val.length > 0) this.initData(val);
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
    initData(val) {
      // debugger;
      if (!val) return;
      let newData = JSON.parse(JSON.stringify(val));
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
    itemClick(item) {
      console.log(item);
      this.$emit("drawAndMove", item);
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
  width: 100px;
  height: 20px;
  position: relative;
  border: 1px solid #000;
  z-index: 99999;
  box-sizing: border-box;
  cursor: pointer;
  color: #fff;
  text-align: center;
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
