<template>
  <div class="app-container">
    <div class="left">
      <div class="left_nav">
        <div
          :class="['left_title', left_info == '预测' ? 'activeinofo' : '']"
          @click="leftFn('预测')"
        >
          <a>预测</a>
        </div>
        <div
          :class="['left_title', left_info == '威胁' ? 'activeinofo' : '']"
          @click="leftFn('威胁')"
        >
          <a>威胁</a>
        </div>
      </div>
    </div>
    <Calculate v-if="left_info === '预测'"></Calculate>
    <Menace v-else></Menace>
  </div>
</template>

<script>
import Menace from "./menace.vue";
import Calculate from "./calculate.vue";
export default {
  name: "Index",
  components: {
    Menace,
    Calculate,
  },
  data() {
    return {
      showTab: 2,
      left_info: "预测",
    };
  },
  methods: {
    leftFn(val) {
      this.left_info = val;
      if (val == "预测") {
      } else {
      }
    },
  },
};
// background-color: rgb(19,207,241);
//     border: 5px solid rgb(15,28,64); 
</script>

<style lang="scss" scoped>
::v-deep .el-tree-node__content:hover {
  /* background-color: #F5F7FA; */
  background-color: #0f1c40;
}
::v-deep .el-tree-node:focus > .el-tree-node__conten {
  background-color: null;
}
@import "../analyse/index.scss";
.mapcontainer {
  position: relative;
  height: 100%;
  overflow: hidden;
  padding: 10px;
}
</style>
