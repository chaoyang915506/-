<template>
  <div style="width: 100%">
    <div
      class="everyone_ship"
      v-for="(i, j) in zhgdata"
      :key="j"
      @click="addpage(i)"
    >
      <!-- $router.push({
          path: '/institutional/personageinfo',
          query: { id: i.orgUserId },
        }) -->
      <img
        :src="imgurl + i.imagePath"
        alt=""
        class="imgcss"
        onerror="this.src='/img/ui/u1635.svg'"
      />
      <div class="content">
        <div class="info">
          {{ i.zhName }}&nbsp;
          <!-- <sub>{{ i.gender }}</sub> -->
        </div>
        <div class="num">
          职位:<span>{{ i.zw }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "@/utils/bus.js";
export default {
  name: "piccomponets",
  props: {
    max: {
      type: Boolean,
      default: false,
    },
    imgurl: {
      type: String,
      default: "",
    },
    zhgdata: {
      type: Array,
      default: () => [],
    },
  },
  // watch: {
  //   zhgdata(val) {
  //     console.log(val, "red");
  //   },
  // },
  methods: {
    addpage(i) {
      // this
      bus.$emit("updateid", i.orgUserId);
    },
  },
  data() {
    return {
      img: "/img/ui/u1635.svg",
      //   zhgdata:[{
      //     zhName:'rdd',
      //     zw:'rd'
      //   }]
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  margin-left: 5px;
  padding: 5px;
}
.imgcss {
  //   float: left;
  height: 100px;
  width: 100px;
}
.everyone_ship {
  position: relative;
  display: flex;
  //   align-content: center;
  padding: 5px;
  //   height: 150px;
  border-bottom: 1px solid #4e5261;
}
.num {
  font-size: 12px;
  //   position: absolute;
  //   bottom: 20%;
  //   left: 35%;
  color: #707482;
  margin-top: 10px;
}
.info {
  margin-top: 10px;
  //   position: absolute;
  //   /* top: 10%; */
  width: 150px;
  color: #fff;
  //   bottom: 70%;
  //   left: 35%;
}
</style>