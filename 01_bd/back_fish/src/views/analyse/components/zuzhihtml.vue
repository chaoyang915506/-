<template>
  <div >
    <!-- {{ image }} -->
    <div :class="['sketch', max ? 'bigfont' : '']">
      <img :src="imgurl + template1.smImagePath" alt="" class="imggaik" />
      <div>
        舰艇名称：
        <span>{{ template1.smName }}</span>
      </div>
      <div>
        舰艇弦号：
        <span>{{ template1.sideNum }}</span>
      </div>
      <div>
        级别、批次：
        <span>{{ template1.jbpc }}</span>
      </div>
      <div>
        入役时间：
        <span>{{ parseTime(template1.rysj, "{y}年{m}月{d}日") }}</span>
      </div>
      <div>
        建造方：
        <span>{{ template1.jzf }}</span>
      </div>
      <div>
        母港:
        <span>{{ template1.harborName }}</span>
      </div>
      <div>
        状态:
        <span>{{ template1.smStatus }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "zuzhihtml",
  props: {
    template1: {
      type: Object,
      default: null,
    },
    imgurl: {
      type: String,
      default: "",
    },
    max: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    image() {
      // console.log(this.imgurl);
      return this.imgurl;
    },
  },
};
</script>

<style lang="scss" scoped>
.sketch {
  color: #fff;
  font-size: 12px;

  div {
    margin: 5px 0;
    margin-top: 10px;
  }
}
.imggaik {
  width: 100px;
  height: 100px;
  float: right;
}
.bigfont {
  div {
    font-size: 18px;
    span {
      font-size: 16px;
    }
  }
}
</style>