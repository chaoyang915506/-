<template>
  <div class="container">
    <cool-scroll :width="1200" :len="lens" :distance="540" :height="750">
      <StyleCard :item="item" v-show="item.status" v-for="item in lists" :key="item.langId" />
    </cool-scroll>
  </div>
</template>
<script>
// import CoolScroll from "./CoolScroll.vue";
import CoolScroll from "@/components/coolioo/CoolScroll.vue";
import StyleCard from "./StyleCard.vue";

export default {
  name: "MultipleLangCard",
  props: {
    lists: {},
    lens: Number,
  },
  components: {
    CoolScroll,
    StyleCard,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.container {
  width: 1000px;
  height: auto;
  margin-top: 40px;
  padding-bottom: 40px;
}
</style>
