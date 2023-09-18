<template>
  <div id="app1">
    <div ref="containner" class="containner">
      <div
        class="baseCss"
        v-for="(item, i) in timeLineData"
        :key="i"
        :style="{
          backgroundColor: item.color,
          width: item.timeLineWidth,
        }"
      >
        <div
          v-if="i === 0"
          :style="{
            width: item.tooltipStyle.boxWidth,
            height: item.tooltipStyle.boxWidth,
            top: item.tooltipStyle.top,
            bottom: item.tooltipStyle.bottom,
            left: item.tooltipStyle.left,
          }"
          class="context angleDown"
        >
          <div class="contextTime">{{ item.startTime }}</div>
          <div class="contextEvent">{{ item.event }}</div>
        </div>
        <div
          v-else-if="i % 2 !== 1 && i !== 0"
          :style="{
            width: item.tooltipStyle.boxWidth,
            height: item.tooltipStyle.boxWidth,
            top: item.tooltipStyle.top,
            bottom: item.tooltipStyle.bottom,
            left: item.tooltipStyle.left,
          }"
          class="context angleDown"
        >
          <div class="contextTime">{{ item.startTime }}</div>
          <div class="contextEvent">{{ item.event }}</div>
        </div>
        <div
          v-else
          :style="{
            width: item.tooltipStyle.boxWidth,
            height: item.tooltipStyle.boxWidth,
            top: item.tooltipStyle.top,
            bottom: item.tooltipStyle.bottom,
            left: item.tooltipStyle.left,
          }"
          class="context angleUp"
        >
          <div class="contextTime">{{ item.startTime }}</div>
          <div class="contextEvent">{{ item.event }}</div>
        </div>
      </div>

      <!-- <div class="search_time">
        <el-date-picker
          type="date"
          size="mini"
          v-model="date1"
          placeholder="年/月/日"
        ></el-date-picker>
        &emsp;至&emsp;
        <el-date-picker
          type="date"
          size="mini"
          v-model="date2"
          placeholder="年/月/日"
        ></el-date-picker>
        &emsp;
        <el-button @click="search()" type="primary" size="mini">执行</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
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
  data() {
    return {
      boxWidth: "",
      clintWidth: "",
      topMargin: 0,
      timeLineData: [],
      date1: "",
      date2: "",
    };
  },
  mounted() {
    // console.log(this.chartData, "接收了");
    let clintWidth = this.$refs.containner.clientWidth;
    this.clintWidth = clintWidth;
    // debugger
    this.topMargin = clintWidth * 0.1 + 10 + "px";
    this.boxWidth = clintWidth * 0.1 + "px";
    // this.boxWidth = `0,0, (${clintWidth * 0.1} + 'px')`;
    // alert(this.boxWidth)
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
      // console.log(this.timeLineData, 66);
    },
    getTimeRange(bt, et) {
      //   console.log(bt, et, "shijiant");
      // 两个日期相减
      let days =
        (new Date(et).getTime() - new Date(bt).getTime()) /
        (24 * 60 * 60 * 1000);
      //   console.log(days, "仙剑");
      return days;
    },
    getTimeWidth(days) {
      let pixel = 0;
      // 自定义长度的策略
      // 如果天数小于10,1天=10px
      // 如果天数大于10小于30,1天=5px
      // 如果天数大于30小于100,1天=2px
      // 如果天数大于100,1天=1px
      let index = 1;
      for (var i = 0; i < days; i++) {
        if (i < 10) {
          pixel += index * 5;
        } else if (i >= 10 && i < 30) {
          pixel += index * 2.5;
        } else if (i >= 30 && i < 100) {
          pixel += index * 1;
        } else if (i >= 100) {
          pixel += index * 0.1;
        }
      }
      pixel += "px";
      return pixel;
    },
    getTimeColor(event) {
      // 根据事件类型返回不同颜色
      let color = "";
      return color;
    },
    search() {
      console.log("开始时间", this.date1);
      console.log("结束时间", this.date2);
      let index = 0;
      // 遍历数组，找哪一项
      for (var i = 0; i < this.timeLineData.length; i++) {
        let d1 = this.date1.getTime();
        let d2 = new Date(this.timeLineData[i].startTime).getTime();
        if (d1 < d2) {
          index = i;
          break;
        }
      }
      let cssArr = document.getElementsByClassName("baseCss");
      console.log(cssArr[index]);
      // let html = document.createElement(`<div>123321<div>`);
      // cssArr[index].appendChild(html);
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
  //   background-color: #ecf0f1;
  overflow: auto;
  // justify-content: center;
  align-items: center;
  padding: 0 100px;
  position: relative;
}
.search_time {
  position: absolute;
  right: 50px;
  top: 20px;
}
.baseCss {
  flex-shrink: 0;
  height: 20px;
  position: relative;
  border: 1px solid #000;
}
// .baseCss:hover .context {
//   transform: 1s;
//   opacity: 1 !important;
// }
.context {
  opacity: 0;
  position: absolute;
  right: 0px;
  background: #2f3953;
  color: #fff;
}
.contextTime {
  margin: 10px 10px;
}
.contextEvent {
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
  left: 50%;
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
  left: 50%;
  transform: translate(-50%);
  bottom: -20px;
  z-index: 9999;
}
// .triangle {
//   width: 0;
//   height: 0;
//   border-width: 10px;
//   border-style: solid;
//   border-color: #3fb58e transparent transparent;
//   z-index: 9999;
// }
</style>
