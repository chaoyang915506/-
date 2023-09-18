<template>
  <div>
    <div :class="['sketch', max ? 'bigfont' : '']">
      <div>
        排水量:<span>{{ template1.psl }}</span>
      </div>
      <div>
        浮航排水:<span>{{ template1.fhps }}</span>
      </div>
      <div>
        潜航排水:<span>{{ template1.qhps }}</span>
      </div>
      <div>
        吃水深度:<span>{{ template1.cssd }}</span>
      </div>
      <div>
        舰长:<span>{{ template1.tz }}</span>
      </div>
      <div>
        舰宽:<span>{{ template1.tk }}</span>
      </div>
      <div>
        动力系统:<span>{{ template1.dlxt }}</span>
      </div>
      <div>
        航速:<span>{{ template1.sh }}</span>
      </div>
      <div>
        潜深:<span>{{ template1.qs }}</span>
      </div>
      <div>
        编制艇员:<span>{{ template1.bzty }}</span>
      </div>
      <div>
        武器装备:<span>{{ template1.wqzb }}</span>
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