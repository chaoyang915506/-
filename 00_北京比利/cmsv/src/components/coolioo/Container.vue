<template>
  <div class="container">
    <slot name="header"></slot>
    <slot name="area"></slot>
  </div>
</template>
<script>
export default {
  name: "Container"
};
</script>

<style scoped lang="scss">
.container {
  width: 94%;
  // background-color: #f7f9fc;
  padding: 20px;
  margin: 0 auto;
}
.areas {
    width: 94%;
    padding: 50px;
    // background-color: #FFFFFF;
    margin-top: 20px;
}
</style>
