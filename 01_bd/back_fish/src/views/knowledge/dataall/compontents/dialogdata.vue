<template>
  <div class="innerModel">
    <img
      v-if="template1[currentIndex].dataSource === 'FB'"
      class="icon"
      src="/img/ui/facebook.png"
    />
    <img
      v-if="template1[currentIndex].dataSource === 'TT'"
      class="icon"
      src="/img/ui/twitter.png"
    />
    <div class="mo text">
      <span class="userName">{{ template1[currentIndex].userName }}</span
      ><span class="time">{{
        parseTime(template1[currentIndex].time, "{y}年{m}月{d}日")
      }}</span>
    </div>
    <div class="mo text">{{ template1[currentIndex].text }}</div>
    <div class="mo imgs">
      <template
        v-if="
          template1[currentIndex].imagePaths &&
          template1[currentIndex].imagePaths.length > 1
        "
      >
        <div v-for="(img, i) in template1[currentIndex].imagePaths" :key="i">
          <img width="100" :src="imageServerUri + img" />
        </div>
      </template>
      <template
        v-else-if="
          template1[currentIndex].imagePaths &&
          template1[currentIndex].imagePaths.length === 1
        "
      >
        <img :src="imageServerUri + template1[currentIndex].imagePaths[0]"
      /></template>
    </div>
    <div class="mo video" v-if="template1[currentIndex].videoPaths">
      <video style="width: 100%" controls>
        <source
          :src="videoServerUri + template1[currentIndex].videoPaths"
          type="video/mp4"
        />
      </video>
    </div>
    <div class="mo elIcon">
      <i
        @click="download(template1[currentIndex]._id)"
        class="el-icon-download"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    template1: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.recentData {
  width: 100%;
  height: calc(100% - 30px);
  color: #fff;
  overflow: auto;
  padding: 10px;

  // padding: 20px 30px;
  .innerModel {
    overflow-y: hidden;

    margin-top: 10px;
    padding-top: 30px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #fff;
    position: relative;
    padding-left: 50px;
    width: 86%;
    margin: 0 auto;
    font-size: 16px;
    color: #fff;
    // background: #0f1c40;
    .icon {
      position: absolute;
      top: 20px;
      left: 0px;
      width: 40px;
      height: 40px;
    }
    .mo {
      margin-bottom: 10px;
    }
    .imgs {
      width: 80%;
      text-align: center;
    }
    .video {
      width: 80%;
      text-align: center;
    }
    .userName {
      font-size: 18px;
    }
    .time {
      margin-left: 30px;
      font-size: 12px;
    }
    .elIcon {
      display: flex;
      justify-content: right;
      margin-top: -10px;
      margin-bottom: 0;
      cursor: pointer;
    }
  }
  .model {
    overflow-y: hidden;

    margin-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #fff;
    position: relative;
    padding-left: 50px;
    width: 100%;
    // background: #0f1c40;
    .icon {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 40px;
      height: 40px;
    }
    .mo {
      margin-bottom: 10px;
    }
    .userName {
      font-size: 18px;
    }
    .time {
      margin-left: 30px;
      font-size: 12px;
    }
    .elIcon {
      display: flex;
      justify-content: right;
      margin-top: -10px;
      margin-bottom: 0;
      cursor: pointer;
    }
  }
}
</style>