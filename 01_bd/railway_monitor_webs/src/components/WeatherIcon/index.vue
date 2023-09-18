<template>
  <div class="weather_style">
    <div class="info">{{ texture ? texture : "全部" }}</div>
    <div class="count">{{ count }}</div>
    <el-icon class="icon_style" :size="size" :color="color"
      ><Drizzling
    /></el-icon>
  </div>
</template>

<script setup>
const prop = defineProps({
  texture: {
    type: String,
    default: "",
  },
  count: {
    type: Number,
  },
  size: {
    type: String,
    default: "30",
  },
  color: {
    type: String,
    default: "white",
  },
});
</script>

<style>
.weather_style {
  position: relative;
  margin-right: 10px;
  width: 130px;
  height: 80px;
  box-shadow: 3px 3px 7px #bbb, -3px -3px 7px #bbb;
  margin-bottom: 10px;
}
.weather_style .info {
  position: absolute;
  top: 11%;
  right: 11%;
  font-weight: 700;
  color: white;
}
.weather_style .count {
  position: absolute;
  right: 8%;
  bottom: 24%;
  font-weight: 700;
  font-size: 14px;
  color: white;
}
.icon_style {
  position: absolute;
  left: 8%;
  bottom: 14%;
}
</style>