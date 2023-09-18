<template>
  <div class="app-container">
    <el-tabs
      v-model="activeName"
      tab-position="top"
      class="tabs_class"
      @tab-click="handleClick"
    >
      <el-tab-pane label="潜艇分类" name="classify" style="height: 100%">
      </el-tab-pane>
      <el-tab-pane label="基地及设施" name="baseClass" style="height: 100%">
      </el-tab-pane>
      <el-tab-pane label="资料" name="dataall" style="height: 100%">
      </el-tab-pane>
      <!-- <el-tab-pane label="人员列表" name="personnel"> </el-tab-pane> -->
    </el-tabs>
    <baseClass v-if="activeName == 'baseClass'"></baseClass>
    <classify v-if="activeName == 'classify'"></classify>
    <dataall v-if="activeName == 'dataall'"></dataall>
  </div>
</template>

<script>
import baseClass from "./baseclass/index.vue";
import classify from "./classify";
import dataall from "./dataall";
export default {
  components: {
    baseClass,
    classify,
    dataall,
  },
  data() {
    return {
      activeName: "baseClass",
    };
  },
  methods: {
    handleClick() {},
  },
};
</script>

<style lang="scss" scoped>
::v-deep .tabs_class {
  width: 20%;
  height: 50px;
}
::v-deep .tabs_class .el-tabs__content {
  display: none;
}

::v-deep .el-tabs__item {
  color: #fff;
}
::v-deep .el-tabs__active-bar {
  background-color: #223cb9;
}

</style>