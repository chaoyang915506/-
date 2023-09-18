<template>
  <div class="app-container">
    <div class="app-dev">
      <left-box></left-box>
      <div class="right_box">
        <data-info></data-info>
        <planimetric-map></planimetric-map>
        <div class="bottom">
          <medium-info></medium-info>
          <submarine-pic></submarine-pic>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LeftBox from "./leftBox/index.vue";
import DataInfo from "./dataInfo/index.vue";
import PlanimetricMap from "./planimetricMap/index.vue";
import MediumInfo from "./mediumInfo/index.vue";
import SubmarinePic from "./submarinePic/index.vue";
export default {
  components: {
    LeftBox,
    DataInfo,
    PlanimetricMap,
    MediumInfo,
    SubmarinePic,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
.app-dev {
  display: flex;
  height: calc(100vh - #{$base-hearder-height} - 20px);
  flex-wrap: wrap;
}
.right_box {
  width: 75%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  .bottom {
    display: flex;
    width: 100%;
    // height: 40%;
    height: calc(100% / 3);
  }
}
</style>