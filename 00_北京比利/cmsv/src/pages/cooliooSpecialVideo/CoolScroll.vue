<template>
  <div
    class="tbody"
    style="
       {
      }
    "
  >
    <div @click="goright" class="left">
      <i class="el-icon-arrow-left"></i>
    </div>
    <div @click="goleft" class="right">
      <i class="el-icon-arrow-right"></i>
    </div>

    <div class="area">
      <div
        ref="f"
        class="rail"
        :style="{
          height: height + 'px',
        }"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
// 宽度，高度，slot，偏移量
export default {
  name: "CoolScroll",
  props: {
    distance: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: false,
      default: 200,
    },
    len: Number,
  },
  data() {
    return {
      o: 0,
      max: 1,
      counter: 0,
    };
  },
  methods: {
    goleft: function () {
      if (this.counter >= this.len - 1) return false;
      this.counter += 1;
      this.o -= this.distance;
      this.$refs.f.style.transition = "all 0.5s ease-in-out";
      this.$refs.f.style.transform = "translateX(" + this.o + "px)";
    },
    goright: function () {
      this.counter -= 1;
      if (this.counter < 0) this.counter = 0;
      this.o += this.distance;
      this.o = this.o > 0 ? 0 : this.o;
      this.$refs.f.style.transition = "all 0.5s ease-in-out";
      this.$refs.f.style.transform = "translateX(" + this.o + "px)";
    },
  },
  mounted() {
    // let c = 0;
    // this.max = c;
  },
};
</script>

<style scoped lang="scss">
@mixin common {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 40%;
  text-align: center;
  cursor: pointer;
  z-index: 100;
}
.tbody {
  min-width: 1000px;
  position: relative;
}
.area {
  width: 1000px;
  overflow-x: hidden;
  margin: 0 auto;
}
.left {
  left: 0;
  @include common();
}

.right {
  right: 0px;
  @include common();
}

.rail {
  width: 10000px;
  display: flex;
  flex-direction: row;
}
</style>
