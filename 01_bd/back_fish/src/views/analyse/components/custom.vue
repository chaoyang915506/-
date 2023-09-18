<template>
  <div>
    <div
      class="echarts"
      @click="lookchart('状态对比统计', 'areachart', zdydata)"
    >
      <div class="title"><span></span>&emsp;状态对比统计</div>

      <areachart
        v-show="selectzidiyi.length == 2"
        class="chart"
        :chartData="zdydata"
      />
    </div>
    <Dialog v-model="show" :title="didogtitle" width="70%">
      <component
        :is="currentIndex"
        style="width: 100%; height: 500px"
        :chartData="lookdata"
        :max="true"
      ></component>
    </Dialog>
  </div>
</template>

<script>
import areachart from "../echarts/areachart.vue";

export default {
  props: {
    selectzidiyi: {
      type: Array,
      default: () => [],
    },
    zdydata: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      show: false,
      didogtitle: "标题",
      currentIndex: areachart,
      lookdata: {},
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
    areachart,
  },
};
</script>

<style lang="scss" scoped>
@import "../index.scss";

.echarts {
  height: 300px;
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
</style>