<template>
  <div class="app-box">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      v-show="filterShowMode()"
    >
      <el-tab-pane label="北斗三号" name="北斗三号"
        ><Beidou3 @sendbdsNumber="sendbdsNumber"></Beidou3
      ></el-tab-pane>
      <el-tab-pane label="北斗二号" name="北斗二号"
        ><Beidou2 @sendbdsNumber="sendbdsNumber"></Beidou2
      ></el-tab-pane>
      <el-tab-pane label="原始短报文" name="原始短报文"
        ><OriginalShortMessage></OriginalShortMessage
      ></el-tab-pane>
      <el-tab-pane label="统计分析" name="统计分析"
        ><Statistics :queryParams="queryParams"></Statistics
      ></el-tab-pane>
    </el-tabs>
    <!-- 统计分析日期 -->
    <div class="time_search" v-if="activeName == '统计分析'">
      <el-date-picker
        v-model="queryParams.endTime"
        type="year"
        style="width: 100px; margin-right: 10px"
        value-format="YYYY"
        placeholder=""
      ></el-date-picker>
      <el-select
        v-model="queryParams.beidou"
        style="width: 100px"
        clearable
        filterable
      >
        <el-option
          v-for="item in biedouList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <!-- 接收页面 -->
    <receiptBeiD v-if="filterShowMode('接收次数')" :bdsNumber="bdsNumber" />
    <!-- 发送次数 -->
    <sendBeiD v-if="filterShowMode('发送次数')" :bdsNumber="bdsNumber" />
  </div>
</template>
<script setup>
import { ref } from "@vue/reactivity";
import Beidou2 from "./page/beidou2.vue";
import Beidou3 from "./page/beidou3.vue";
import Statistics from "./page/statistics.vue";
import OriginalShortMessage from "./page/originalShortMessage.vue";
import receiptBeiD from "./components/receiptBeiD.vue";
import sendBeiD from "./components/sendBeiD.vue";
let activeName = ref("北斗二号");
let tabName = ref(null);
function handleClick(val) {
  tabName.value = val.name;
}

const options1 = ref([{ value: 2021, label: 2021 }]);
const biedouList = ref([
  { value: "北斗三号", label: "北3" },
  { value: "北斗二号", label: "北2" },
  { value: "全部", label: "全部" },
]);
const queryParams = ref({
  beidou: "全部",
});

//传递给接收和发送页面的 bdsNumber
const bdsNumber = ref("");
function sendbdsNumber(e) {
  bdsNumber.value = e;
}
</script>
<style lang="scss" scoped>
.time_search {
  position: absolute;
  top: 3px;
  right: 23px;
}
</style>


