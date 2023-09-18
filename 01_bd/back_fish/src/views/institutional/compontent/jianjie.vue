<template>
  <div :class="[max ? 'max' : 'commoncss']">
    <img :src="imgurl + item.imagePath" alt="" class="imgcss" />
    <!-- onerror="this.src='/img/ui/u1635.svg'" -->
    <div>国家/地区：{{ item.area }}</div>
    <div>级别：{{ item.level }}</div>
    <div>总部：{{ item.hq }}</div>
    <div>职能：{{ item.zn }}</div>
  </div>
</template>

<script>
export default {
  props: {
    imgurl: {
      type: String,
      default: "",
      require: true,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    max: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    // console.log(this.imgurl, "red");
  },
  mounted() {
    console.log(this.imgurl, "red");
  },
};
</script>

<style lang="scss" scoped>
.imgcss {
  float: right;
  width: 100px;
}
.max {
  font-size: 20px;
  color: #fff;
}
.commoncss {
  color: #fff;
}
</style>