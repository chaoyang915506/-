<template>
  <div>
    <div :class="['sketch', max ? 'bigfont' : '']">
      <img :src="imgurl + template1.data1.imagePath" alt="" class="imggaik" />
      <div>
        简介:<span>{{ template1.data1.intro }}</span>
      </div>
      <div>
        <span v-if="device == 'commander'">下辖大队：</span>
        <span v-if="device == 'brigade'">下辖中队：</span>
        <span v-if="device == 'detachment'"> 下辖舰船：</span>
        <div style="word-break: break-word">
          <span v-for="i in template1.data2" :key="i.id"
            >{{ i.name }} <br v-if="device != 'detachment'" />
            <span v-else>&emsp;/&emsp;</span>
          </span>
        </div>
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
    device: {
      type: String,
      default: "",
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