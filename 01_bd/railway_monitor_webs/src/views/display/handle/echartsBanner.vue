<template>
  <div class="listTab">
    <ul>
      <li
        v-for="(item, index) in listTab"
        :key="index"
        @click="clickTba(index)"
        :class="{ current: currentIndex == index }"
      >
        <div>{{ item.name }}</div>
      </li>
    </ul>
  </div>
  <div class="banner" @mouseover="mouseover" @mouseout="mouseout">
    <doubleLine
      style="width: 100%; height: 100%; display: block"
      :chartData="bannerContent[currentIndex].chartData"
    ></doubleLine>
  </div>
</template>
<script setup>
import doubleLine from "@/components/echarts/doubleLine.vue";
import { getHisAndForecast } from "@/api/display/display.js";

// 轮播图图片
let bannerContent = ref([
  // 气象风险
  {
    chartData: {
      title: "",
      xData: [],
      yDataing: [],
      yDataed: [],
      gridTop: 20,
      color: "#34E0A8",
      itemLineStyling: "#FFFF00",
      itemLineStyled: "#9F6DCD",
      topColor: "#367863",
      bottomColor: "#363F3C",
      dashedColor: "#484848",
      showSymbol: true,
      isToolTipLabel: true,
      isYaxisLabel: true,
      showMaxValue: true,
      isShowArea: true,
      isAnimation: true,
      isMmooth: false,
    },
  },
  {
    // 异物风险
    chartData: {
      title: "",
      xData: [],
      yDataing: [],
      yDataed: [],
      gridTop: 20,
      color: "#34E0A8",
      itemLineStyling: "#FF5C5C",
      itemLineStyled: "#1890FF",
      topColor: "#367863",
      bottomColor: "#363F3C",
      dashedColor: "#484848",
      showSymbol: true,
      isToolTipLabel: true,
      isYaxisLabel: true,
      showMaxValue: true,
      isShowArea: true,
      isAnimation: true,
      isMmooth: false,
    },
  },
  {
    // 综合风险
    chartData: {
      title: "",
      xData: [],
      yDataing: [],
      yDataed: [],
      gridTop: 20,
      color: "#34E0A8",
      itemLineStyling: "#95F204",
      itemLineStyled: "#00FFFF",
      topColor: "#367863",
      bottomColor: "#363F3C",
      dashedColor: "#484848",
      showSymbol: true,
      isToolTipLabel: true,
      isYaxisLabel: true,
      showMaxValue: true,
      isShowArea: true,
      isAnimation: true,
      isMmooth: false,
    },
  },
]);
// tab切换
let listTab = ref([
  {
    name: "异物事件风险",
  },
  {
    name: "气象事件风险",
  },
  {
    name: "综合事件风险",
  },
]);
let currentIndex = ref(0); //默认显示图片
let timer = ref(null); //定时器
// 计算当前图片位置
let current = computed(() => {
  // 如果当前index等等于数组length-1 就return0 否则就当前index加1
  if (currentIndex.value == bannerContent.value.length - 1) {
    return 0;
  } else {
    return currentIndex.value + 1;
  }
});
// 初始化
const getInitList = async () => {
  let res = await getHisAndForecast();
  // console.log(res, "shuju");
  if (res.code == 200) {
    // console.log( bannerContent.value)
    bannerContent.value[0].chartData.xData = [];
    bannerContent.value[0].chartData.yDataing = []; //未来
    bannerContent.value[0].chartData.yDataed = []; //历史

    bannerContent.value[1].chartData.xData = [];
    bannerContent.value[1].chartData.yDataing = [];
    bannerContent.value[1].chartData.yDataed = [];

    bannerContent.value[2].chartData.xData = [];
    bannerContent.value[2].chartData.yDataing = [];
    bannerContent.value[2].chartData.yDataed = [];

    if (res.data.hisMaps) {
      let sortend = res.data.hisMaps
        .map((i) => {
          return {
            ...i,
            sort: new Date(i.createTime).getMonth() + 1,
            month: new Date(i.createTime).getMonth() + 1 + "月",
          };
        })
        .sort((a, b) => a.sort - b.sort);
      // console.log(sortend, "排序后");

      sortend.forEach((item) => {
        // 气象风险
        bannerContent.value[1].chartData.xData.push(item.month);
        bannerContent.value[1].chartData.yDataed.push(item.weather);

        bannerContent.value[0].chartData.xData.push(item.month);
        bannerContent.value[0].chartData.yDataed.push(item.foreignMatter);

        //  综合风险
        bannerContent.value[2].chartData.xData.push(item.month);
        bannerContent.value[2].chartData.yDataed.push(item.synthesis);
      });
    }
    if (res.data.forecast) {
      let sortend = res.data.forecast
        .map((i) => {
          return {
            ...i,
            sort: new Date(i.createTime).getMonth() + 1,
            month: new Date(i.createTime).getMonth() + 1 + "月",
          };
        })
        .sort((a, b) => a.sort - b.sort);
      sortend.forEach((item) => {
        bannerContent.value[0].chartData.yDataing.push(item.foreignMatter);
        bannerContent.value[1].chartData.yDataing.push(item.weather);
        bannerContent.value[2].chartData.yDataing.push(item.synthesis);
      });
    }

    // if (res.data.forecast && res.data.hisMaps) {
    //   res.data.forecast.forEach((item) => {
    //     res.data.hisMaps.forEach((val) => {
    //       if (item.fdtime == val.createTime) {
    //         // 气象风险
    //         bannerContent.value[0].chartData.xData.push(item.createTime);
    //         bannerContent.value[0].chartData.yDataing.push(item.weather);
    //         bannerContent.value[0].chartData.yDataed.push(val.weather);
    //         // 异物风险
    //         bannerContent.value[1].chartData.xData.push(item.createTime);
    //         bannerContent.value[1].chartData.yDataing.push(item.foreignMatter);
    //         bannerContent.value[1].chartData.yDataed.push(val.foreignMatter);
    //         // 综合风险
    //         bannerContent.value[2].chartData.xData.push(item.createTime);
    //         bannerContent.value[2].chartData.yDataing.push(item.synthesis);
    //         bannerContent.value[2].chartData.yDataed.push(val.synthesis);
    //       }
    //     });
    //   });
    // }
  }
  console.log(bannerContent.value, "banner");
};
// 当点击后 当前索引等于点击的index
function clickTba(index) {
  currentIndex.value = index;
}
// 定时器函数
function autoPlay() {
  timer.value = setInterval(() => {
    clickTba(current.value);
  }, 4000);
}
const mouseover = () => {
  clearInterval(timer.value);
  timer.value = null;
};
const mouseout = () => {
  autoPlay();
};
onMounted(() => {
  getInitList();
  // 执行定时器
  autoPlay();
});

defineExpose({ getInitList });
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

ul li {
  list-style: none;
  float: left;
  width: 30px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
}
.listTab {
  width: 100%;
  height: 40px;
  margin: 0 auto;
}

.listTab ul li {
  width: 33%;
  font-size: 12px;
  height: 40px;
}
.banner {
  width: 100%;
  height: calc(100% - 40px);
  margin: 0 auto;
  position: relative;
  min-height: 150px;
}

.current {
  /* color: #34e0a8; */
  color: #43f4ff;
}
</style>