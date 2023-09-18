<template>
  <div>
    <div class="everyone_ship" v-for="item in 5" :key="item">
      <img :src="img" alt="" class="imgcss" />
      <div class="info">make C.</div>
      <div class="num">职位:<sapn>fu</sapn></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    max: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      img: "/img/ui/u1635.svg",
    };
  },
};
</script>

<style lang="scss" scoped>
.imgcss {
  float: left;
  height: 100px;
}
.everyone_ship {
  position: relative;
  display: flex;
  align-content: center;
  padding: 5px;
  height: 150px;
  border-bottom: 1px solid #4e5261;
}
.num {
  position: absolute;
  bottom: 20%;
  left: 35%;
  color: #707482;
}
.info {
  position: absolute;
  /* top: 10%; */
  width: 150px;
  bottom: 70%;
  left: 35%;
}
</style>