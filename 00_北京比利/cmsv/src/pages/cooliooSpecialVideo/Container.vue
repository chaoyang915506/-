<template>
  <div class="container">
    <slot></slot>
  </div>
</template>
<script>
// import Copyright from "./Copyright.vue";
import CoolScroll from "./CoolScroll.vue";

export default {
  name: "Container",
  components: {
    CoolScroll
  }
};
</script>

<style scoped lang="scss">
$fullwidth: 90%;
$middle: 0 auto;
$bg: #f7f9fc;

.container {
  width: $fullwidth;
  margin: $middle;
  // background: $bg;
  padding-top: 20px;
}
</style>
