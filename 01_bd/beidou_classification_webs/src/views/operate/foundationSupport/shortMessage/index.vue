<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="北斗二号" name="first"><Beidou2></Beidou2></el-tab-pane>
    <el-tab-pane label="北斗3号" name="second"
      ><Beidou3></Beidou3
    ></el-tab-pane>
    <el-tab-pane label="统计分析" name="third"><Statistics></Statistics></el-tab-pane>
  </el-tabs>
</template>
<script setup>
import Beidou2 from "./page/beidou2.vue";
import Beidou3 from "./page/beidou3.vue";
import Statistics from "./page/statistics.vue";
let activeName = "second";
function handleClick(tab, event) {
  console.log(tab, event);
}
</script>