<template>
  <div class="base-info-title">监测点设备实时状况</div>
  <div class="base-info-equipment-class">
    <div>
      <span>设备总数</span>
      <span ref="counter1">{{ equipmentStatus.total }}</span>
    </div>
    <div>
      <div>
        <span>在线</span>
        <span ref="counter2" class="equipment-value">{{
          equipmentStatus.onlin
        }}</span>
      </div>
      <div style="margin-left: 10px">
        <span>异常</span>
        <span ref="counter3" class="equipment-danger-value">{{
          equipmentStatus.abno
        }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
let { proxy } = getCurrentInstance();
let props = defineProps({
  equipmentStatus: {
    type: Object,
    default: {},
  },
});
nextTick(() => {
  proxy.animateValue(
    proxy.$refs.counter1,
    0,
    props.equipmentStatus.total,
    2000
  );
  proxy.animateValue(proxy.$refs.counter2, 0, props.equipmentStatus.onlin, 2000);
  proxy.animateValue(
    proxy.$refs.counter3,
    0,
    props.equipmentStatus.abno,
    2000
  );
});
</script>
<style scoped>
.base-info-equipment-class {
  margin-top: 10px;
  font-size: 12px;
}
.base-info-equipment-class > div:nth-child(1) {
  width: 100%;
  box-shadow: 3px 3px 6px #909399, -3px -3px 6px #909399;
  padding: 13px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.base-info-equipment-class > div:nth-child(1):hover {
  box-shadow: 3px 3px 6px #eee, -3px -3px 6px #eee;
}
.base-info-equipment-class > div:nth-child(1) > span:nth-child(2) {
  margin-top: 7px;
  font-size: 22px;
  color: #fff;
  font-weight: bold;
}
.base-info-equipment-class > div:nth-child(2) {
  width: 100%;
  display: flex;
}
.base-info-equipment-class > div:nth-child(2) > div {
  margin-top: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 13px 0;
  box-shadow: 3px 3px 6px #909399, -3px -3px 6px #909399;
}
.base-info-equipment-class > div:nth-child(2) > div:hover {
  box-shadow: 3px 3px 6px #eee, -3px -3px 6px #eee;
}
.equipment-value {
  margin-top: 7px;
  font-size: 22px;
  color: #fff;
  font-weight: bold;
}
.equipment-danger-value {
  margin-top: 7px;
  font-size: 22px;
  color: #ff8686;
  font-weight: bold;
}
.base-info-title {
  font-size: 15px;
  /* font-weight: bold; */
  /* color: #1abcb8; */
}
</style>