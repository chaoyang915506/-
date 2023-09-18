<template>
  <div class="human">
    <div
      @click="clickHuman(item)"
      class="model"
      v-for="(item, index) in humanInfo"
      :key="index"
    >
      <div>
        <img class="imgs" :src="imageServerUri + item.imagePath" />
      </div>
      <div class="textDetails">
        <div class="textName">{{ item.zhName }}</div>
        <div class="textZhiwei">职位：{{ item.zw }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { 查询图片服务器地址 } from "@/api/situation/situation";
export default {
  name: "Human",
  components: {},
  props: {
    humanInfo: Array,
  },
  data() {
    return {
      imageServerUri: "",
      testData: [
        {
          name: "Make C Luis",
          img: "",
          zhiwei: "艇长",
          type: "一级",
        },
        {
          name: "Make C Luis",
          img: "",
          zhiwei: "艇长",
          type: "一级",
        },
        {
          name: "Make C Luis",
          img: "",
          zhiwei: "艇长",
          type: "一级",
        },
        {
          name: "Make C Luis",
          img: "",
          zhiwei: "艇长",
          type: "一级",
        },
        {
          name: "Make C Luis",
          img: "",
          zhiwei: "艇长",
          type: "一级",
        },
        {
          name: "Make C Luis",
          img: "",
          zhiwei: "艇长",
          type: "一级",
        },
        {
          name: "Make C Luis",
          img: "",
          zhiwei: "艇长",
          type: "一级",
        },
        {
          name: "Make C Luis",
          img: "",
          zhiwei: "艇长",
          type: "一级",
        },
        {
          name: "Make C Luis",
          img: "",
          zhiwei: "艇长",
          type: "一级",
        },
        {
          name: "Make C Luis",
          img: "",
          zhiwei: "艇长",
          type: "一级",
        },
      ],
    };
  },
  async created() {
    let re = await 查询图片服务器地址();
    this.imageServerUri = re.data.imageServerUri;
  },
  methods: {
    clickHuman(item) {
      console.log(item);
      this.$router.push({
        name: "situationPersonageInfo",
        query: { id: item.orgUserId },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.human {
  width: 100%;
  height: 100%;
  color: #fff;
  overflow: auto;
  padding: 20px 30px;
  .model {
    margin-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    position: relative;
    width: 100%;
    background: #0f1c40;
    display: flex;
    cursor: pointer;
    .imgs {
      width: 160px;
      margin-right: 10px;
    }
    .textDetails {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 8px;
      .textName {
        margin-top: 10px;
      }
      .textZhiwei {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
