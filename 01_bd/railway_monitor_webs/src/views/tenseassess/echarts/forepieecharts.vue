<template>
  <echarts :option="option" :update-options="{ notMerge: true }" autoresize />
  <div class="searchinput">
    <el-select
      v-model="props.chartData.lineValue"
      class="m-2"
      @change="changeSelect"
      placeholder=""
      size="small"
    >
      <el-option
        v-for="item in props.chartData.lineList"
        :key="item.id"
        :label="item.lineName"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script setup>
const emit = defineEmits(["changeDate", "lineChange"]);

const changeSelect = (e) => {
  // console.log(e, "red的说法");
  emit("lineChange", e);
};
const props = defineProps({
  chartData: Object,
});
let dateTime = ref("1");
function clickTime(val) {
  dateTime.value = val;
    emit("getDateTime",dateTime.value);
}
const option = computed(() => {
  const option = {
    legend: {
      top: "bottom",
      icon: "circle",
      //   width: "2px",
      itemWidth: 9,
      textStyle: {
        color: "white",
      },
    },
    title: {
      text: props.chartData.title,
      top: 7,
      right: 20,
      textStyle: {
        color: "#b7b7af",
        fontSize: 16,
        fontWeight: 300,
      },
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        radius: "25%",
        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
        data: props.chartData.onempeidata,
        // center: ["50%", "0%"],
        left: 0,
        datasetIndex: 1,
      },
      {
        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
        type: "pie",
        radius: "25%",
        center: ["50%", "50%"],
        datasetIndex: 2,
        data: props.chartData.twompeidata,
      },
      {
        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
        type: "pie",
        radius: "25%",
        center: ["50%", "100%"],
        data: props.chartData.threempeidata,

        datasetIndex: 3,
      },
    ],
    media: [
      {
        query: { minAspectRatio: 1 },
        option: {
          series: [
            { center: ["25%", "50%"] },
            { center: ["50%", "50%"] },
            { center: ["75%", "50%"] },
          ],
        },
      },
      {
        option: {
          series: [
            { center: ["50%", "25%"] },
            { center: ["50%", "50%"] },
            { center: ["50%", "75%"] },
          ],
        },
      },
    ],
  };
  return option;
});
</script>
<style lang="scss" scoped>
@import url("../css/echarts.css");
</style>