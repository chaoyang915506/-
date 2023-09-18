<template>
  <keep-alive>
    <home-page></home-page>
  </keep-alive>
</template>

<script>
import HomePage from "@/views/homepage/index.vue";
export default {
  components: {
    HomePage,
  },
};
</script>

<style lang="scss" scoped></style>
