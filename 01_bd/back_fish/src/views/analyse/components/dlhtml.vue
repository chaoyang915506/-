<template>
  <div>
    <div :class="['sketch', max ? 'bigfont' : '']">
      <img :src="imgdata" alt="" class="imggaik" />
      <div>
        地理位置:<span>{{ template1.address }}</span>
      </div>
      <div>
        基本信息:<span>{{ template1.basicInfo }}</span>
      </div>
      <div>
        下辖舰船:<span>{{ sideNum }}</span
        ><span style="color: #7a7a7a">{{ oldsideNum }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { 查询图片服务器地址 } from "@/api/situation/situation";
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
    sideNum: {
      type: String,
      default: "",
    },
    oldsideNum: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      imageServerUri: "",
    };
  },
  computed: {
    imgdata() {
      // console.log(this.imgUrl, "url");
      return this.imageServerUri + this.template1.imagePath;
    },
  },
  async mounted() {
    let re = await 查询图片服务器地址();
    this.imageServerUri = re.data.imageServerUri;
    // this.videoServerUri = re.data.videoServerUri;
    //     downloadServerUri: "http://192.168.1.50:18080/download/"
    // imageServerUri: "http://192.168.1.50:18080/imges/"
    // videoServerUri: "http://192.168.1.50:18080/"
    // this.imgSrc = re.data.imageServerUri + "jh/" + this.data.sideNum + ".png";
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