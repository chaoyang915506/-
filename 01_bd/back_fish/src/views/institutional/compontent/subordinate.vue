<template>
  <div
    style="color: #fff; padding: 10px"
    :class="[max ? 'maxall' : '', 'border_css']"
  >
    <div :class="[max ? 'max' : 'info']">{{ item.jbpc }}</div>
    <div class="num">
      数量:<span>{{ item.shipCount }}</span
      >艘
    </div>
    <div class="jtcss">
      <div class="jtname" style="width: 40px">舰艇:</div>
      <div class="jtbox">
        <div
          v-for="(i, j) in item.sideNum"
          :key="j"
          :class="[max ? 'maxeverybox' : 'everybox']"
        >
          {{ i.sideNum + "  " }} &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "subordinate",
  props: {
    max: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => {},
    },
    max: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      img: "/img/ui/u1635.svg",
      // zjinfodata: [
      //   {
      //     jbpc: "red",
      //     shipCount: 1,
      //     sideNum: [
      //       {
      //         sideNum: 1,
      //       },
      //     ],
      //   },
      // ],
    };
  },
  methods: {
    looktext() {
      // console.log(this.$parent, "fuji");
      // this.$emit("loocktext", ("所属潜艇", "subordinate", this.item));
      // this.$parent.looktext("所属潜艇", "subordinate", this.item);
    },
  },
};
</script>

<style lang="scss" scoped>
.everybox {
  width: calc((100% / 2) - 5px);
  margin-right: 5px;
  text-align: center;
}
.maxeverybox {
  width: calc((100% / 6) - 25px);
  margin-right: 5px;
  text-align: center;
}
.maxeverybox:nth-child(6n) {
  margin-right: 0;
}
.everybox:nth-child(3n) {
  margin-right: 0;
}
.border_css {
  border-bottom: 1px solid #6b6c71;
}
.imgcss {
  float: left;
  height: 100px;
}
.maxall {
  font-size: 18px;
}
.num {
  font-size: 16px;
  margin-bottom: 10px;
  // position: absolute;
  // bottom: 20%;
  // left: 35%;
}
.jtcss {
  display: flex;
  font-size: 16px;
}
.max {
  margin-bottom: 10px;
  font-size: 20px;
}
.info {
  font-size: 18px;
  margin-bottom: 10px;

  // position: absolute;
  /* top: 10%; */
  // width: 150px;
  // bottom: 70%;
  // left: 35%;
}
.jtbox {
  display: flex;

  width: calc(100% - 40px);
  display: flex;
  // justify-content: space-around;
  flex-wrap: wrap;
}
</style>