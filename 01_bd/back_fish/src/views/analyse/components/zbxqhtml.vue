<template>
  <div>
    <div :class="['sketch', max ? 'bigfont' : '']">
      <div style="display: flex; align-items: center">
        <span style="width: 30%"> 战备详情:{{ template1.data1 }}%</span
        ><span style="display: inline-block; width: 70%"
          ><progressbar
            :chartData="{ xdata: template1.data1 }"
            style="height: 50px; width: 100%"
        /></span>
      </div>
      <div
        style="width: 100%; height: 20px; display: flex; margin-bottom: 20px"
      >
        <div
          v-for="(i, j) in template1.data3"
          :key="j"
          :style="{
            background: i.color,
            height: '100%',
            width: i.person,
            textAlign: 'center',
            lineHeight: '20px',
            color: 'black',
          }"
          :class="[template1.data3.length == 1 ? 'one_css' : 'any_css']"
        >
          <span>{{ i.name }}&nbsp;{{ i.length }}</span>
        </div>
      </div>
      <div v-for="i in template1.data2" :key="i.name" style="margin-top: 10px">
        {{ i.name }}:<span>{{ i.states }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import progressbar from "../echarts/progressbar.vue";
export default {
  name: "zuzhihtml",
  components: {
    progressbar,
  },
  props: {
    template1: {
      type: Object,
      default: null,
    },
    imgurl: {
      type: String,
      default: "",
    },
    max: {
      type: Boolean,
      default: false,
    },
    device: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.sketch {
  color: #fff;
  font-size: 12px;

  div {
    margin: 5px 0;
    margin-top: 10px;
  }
}
.imggaik {
  width: 100px;
  height: 100px;
  float: right;
}
.bigfont {
  div {
    font-size: 18px;
    span {
      font-size: 16px;
    }
  }
}
.one_css {
  border-radius: 3px;
}
.any_css:nth-child(1) {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
.any_css:last-child {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
</style>