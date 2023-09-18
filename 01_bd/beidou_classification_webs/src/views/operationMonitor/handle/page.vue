<template>
  <div class="content">
    <div class="numbs" v-if="data.tab != '北斗卡二专用链路' && data.tab != '用户机'  && data.tab !== '运营管理02' && data.tab !== '基础支撑01'">
      <div class="numbs-item"  >
        <span>{{data.tab !== "数据库01" && data.tab !== "数据库02" && data.tab !== "运营管理01"   && data.tab !== "基础支撑02" && data.tab !=='服务器1' && data.tab !=='服务器2' && data.tab !=='服务器3' ? '收发总量':'CPU核数'}}</span>
        <span>{{data.monitorStatistics[0]}}</span>
      </div>
      <div class="numbs-item" >
        <span>{{data.tab !== "数据库01" && data.tab !== "数据库02" && data.tab !== "运营管理01"   && data.tab !== "基础支撑02" && data.tab !=='服务器1' && data.tab !=='服务器2' && data.tab !=='服务器3' ? '接收数量':'CPU使用率'}}</span>
        <!-- 正式版本后样式需要删掉 -->
        <span :style="data.tab ==='服务器1'||data.tab === null? 'color:red':null">{{data.monitorStatistics[1]}}</span>
      </div>
      <div class="numbs-item" >
        <span>{{data.tab !== "数据库01" && data.tab !== "数据库02" && data.tab !== "运营管理01"   && data.tab !== "基础支撑02" &&data.tab !=='服务器1' && data.tab !=='服务器2' && data.tab !=='服务器3' ? '发送数量':'内存使用率'}}</span>
        <!-- 正式版本后样式需要删掉 -->
        <span :style="data.tab ==='服务器2'?'color:red':null">{{data.monitorStatistics[2]}}</span>
      </div>
      <div class="numbs-item">
        <span>{{data.tab !== "数据库01" && data.tab !== "数据库02" && data.tab !== "运营管理01"   && data.tab !== "基础支撑02" &&data.tab !=='服务器1' && data.tab !=='服务器2' && data.tab !=='服务器3' ? '持续在线时长(h)':'最大使用率'}}</span>
        <span>{{data.monitorStatistics[3]}}</span>
      </div>
      </div>
      <!-- 北斗卡二专用链路 -->
    <div class="numbs" v-if="data.tab === '北斗卡二专用链路' || data.tab === '运营管理02'">
      <div class="numbs-item">
        <span>接收数量</span>
        <span>496</span>
      </div>
      <div class="numbs-item" >
        <span>链接状态</span>
        <span>在线</span>
      </div>
      </div>
      <!-- 用户机 -->
    <div class="numbs"  v-if="data.tab === '用户机' || data.tab === '基础支撑01'">
      <div class="numbs-item">
        <span>发送数量</span>
        <span>368</span>
      </div>
      <div class="numbs-item" >
        <span>回传数据量</span>
        <span>298</span>
      </div>
      <div class="numbs-item" >
        <span>链接状态</span>
        <span>在线</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

let props = defineProps(["tab","monitorStatistics"]);
watch(()=>props.tab,(val)=>{
    data.tab = val 
    console.log(val,'ppp')
})
watch(()=>props.monitorStatistics,(val)=>{
    data.monitorStatistics = val 
})
let data = reactive({
    tab:"服务器1",
    monitorStatistics:["2", "90.6%", "60.6%", "56.4%"]
})

</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  .numbs {
    width: 100%;
    height: 160px;
    border-top: 16px solid rgb(244, 247, 252);
    border-bottom: 16px solid rgb(244, 247, 252);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    .numbs-item {
      width: 100%;
      margin: 0 10px;
      align-items: center;
    }
    span {
      text-align: center;
      display: block;
      height: 34px;
      width: 100%;
      line-height: 34px;
    }
    .numbs-item span:first-child {
      font-weight: 700;
      background-color: rgb(236, 243, 251);
    }
    .numbs-item span:last-child {
      margin-top: 20px;
      background-color: rgb(247, 250, 252);

    }
  }
}
</style>