<template>
  <div class="recentData" v-infinite-scroll="loadMore">
    <div class="model" v-for="(item, index) in template1" :key="index">
      <recent-data-copy
        @click.native="lookchart('近期数据', 'RecentDataCopy', item)"
        :itemdata="item"
        :imageServerUri="imageServerUri"
        :videoServerUri="videoServerUri"
      ></recent-data-copy>
    </div>
    <Dialog v-model="show" :title="didogtitle" width="70%" v-if="show">
      <component
        :is="currentIndex"
        style="width: 100%; height: 500px"
        :itemdata="lookdata"
        :imageServerUri="imageServerUri"
        :videoServerUri="videoServerUri"
        :max="true"
      ></component>
    </Dialog>
  </div>
</template>

<script>
import Dialog from "@/components/Dialog/index.vue";
import RecentDataCopy from "@/components/HtmlFragment/RecentData/index.vue";
import { 查询图片服务器地址 } from "@/api/situation/situation";
export default {
  name: "RecentData",
  props: {
    template1: Array,
  },
  components: { RecentDataCopy, Dialog },
  data() {
    return {
      imageServerUri: "",
      videoServerUri: "",
      currentIndex: "",
      show: false,
      didogtitle: "",
      lookdata: null,
    };
  },
  async mounted() {
    let re = await 查询图片服务器地址();
    this.imageServerUri = re.data.imageServerUri;
    this.videoServerUri = re.data.videoServerUri;
    //     downloadServerUri: "http://192.168.1.50:18080/download/"
    // imageServerUri: "http://192.168.1.50:18080/imges/"
    // videoServerUri: "http://192.168.1.50:18080/"
    // this.imgSrc = re.data.imageServerUri + "jh/" + this.data.sideNum + ".png";
  },
  methods: {
    loadMore() {
      console.log(55);
    },
    lookchart(title, val, data) {
      this.show = true;
      this.didogtitle = title;
      this.currentIndex = val;
      this.lookdata = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.recentData {
  width: 100%;
  height: 100%;
  color: #fff;
  overflow: auto;
  // padding: 20px 30px;

  // .model {
  //   overflow-y: hidden;

  //   margin-top: 10px;
  //   padding-top: 10px;
  //   padding-bottom: 10px;
  //   margin-bottom: 10px;
  //   border-bottom: 1px solid #fff;
  //   position: relative;
  //   padding-left: 50px;
  //   width: 100%;
  //   // background: #0f1c40;
  //   .icon {
  //     position: absolute;
  //     top: 0px;
  //     left: 0px;
  //     width: 40px;
  //     height: 40px;
  //   }
  //   .mo {
  //     margin-bottom: 10px;
  //   }
  //   .userName {
  //     font-size: 18px;
  //   }
  //   .time {
  //     margin-left: 30px;
  //     font-size: 12px;
  //   }
  //   .elIcon {
  //     display: flex;
  //     justify-content: right;
  //     margin-top: -10px;
  //     margin-bottom: 0;
  //     cursor: pointer;
  //   }
  // }
}
</style>
