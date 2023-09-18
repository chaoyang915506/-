<template>
  <el-dialog
    close-on-click-modal
    close-on-press-escape
    :show-close="false"
    :center="true"
    :title="title"
    :visible="value"
    :width="width"
    @close="$emit('change', false)"
  >
    <!-- v-model="value" -->
    <slot></slot>
  </el-dialog>
</template>

<script>
export default {
  name: "dialog_01",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    // show: {
    //   type: Boolean,
    //   default: false,
    // },
    width: {
      type: String,
      default: "30%",
    },
    value: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  background-color: #031032;
  .el-dialog__header {
    border: 1px solid #51cbcf;
  }
}
::v-deep .el-dialog__title {
  /* color: #303133; */
  color: #fff;
  font-weight: 700;
}
</style>