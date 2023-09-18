<template>
  <form novalidate @submit.prevent>
    <div class="row">
      <div class="col-6">
        <vp class="form-group " tag="div" v-slot="v">
          <label>是否有欢迎视频</label>

          <select class="form-control" v-model="model.hasWelcomeVideo" v-validate="v" required>
            <option value="1">是</option>
            <option value="0">否</option>
          </select>
        </vp>
        <vp class="form-group " tag="div" v-slot="v">
          <label>欢迎页logo</label>
          <cool-file-input
            fileType="image"
            :extensions="extensions"
            :uploadUrl="imageUploadUrl"
            v-model="model.logo"
            v-validate="v"
          />
        </vp>
        <vp class="form-group   " tag="div" v-slot="v">
          <label>欢迎词图片</label>
          <cool-file-input
            fileType="image"
            :extensions="extensions"
            :uploadUrl="imageUploadUrl"
            v-model="model.welcomeWordPic"
            v-validate="v"
          />
        </vp>
        <vp class="form-group   " tag="div" v-slot="v">
          <label>欢迎词文字</label>

          <textarea
            class="form-control "
            style="resize: none"
            placeholder="请输入欢迎词（可以为空）"
            rows="5"
            v-model="model.welcomeWord"
            v-validate="v"
            maxlength="1500"
          ></textarea>
        </vp>
      </div>
      <div class="col-6">
        <vp class="form-group " tag="div" v-slot="v">
          <label>背景音乐</label>
          <cool-file-input
            fileType="audio"
            :opts="opt"
            :uploadUrl="audioUploadUrl"
            v-validate="v"
            v-model="model.bgAudio"
          />
        </vp>
        <vp class="form-group " tag="div" v-slot="v">
          <label>背景图片</label>
          <cool-file-input
            fileType="image"
            :extensions="extensions"
            :uploadUrl="imageUploadUrl"
            v-model="model.bgPic"
            v-validate="v"
          />
        </vp>
        <vp class="form-group  " tag="div" v-slot="v">
          <label>欢迎视频</label>
          <cool-file-input
            fileType="video"
            :opts="opt"
            :extensions="videolist"
            :uploadUrl="videoUploadUrl"
            v-model="model.welcomeVideo"
            v-validate="v"
          />
          <div style="fontSize:12px;font-weight:500">
            请上传小于3M码率的视频
          </div>
        </vp>
      </div>

      <!-- <vp class="form-group" tag="div" v-slot="v" style="display:none">
      <label>视频起播logo</label>
      <cool-file-input
        :opts="opt"
        v-validate="v"
        :extensions="extensions"
        fileType="image"
        v-model="model.hotelLogo"
        :uploadUrl="imageUploadUrl"
      />
    </vp> -->

      <!-- <vp class="form-group " tag="div" v-slot="v" style="display:none">
      <label>总经理签名图片</label>
      <cool-file-input
        fileType="image"
        :extensions="extensions"
        :uploadUrl="imageUploadUrl"
        v-model="model.welcomeSignPic"
        v-validate="v"
      />
    </vp> -->

      <!-- <vp class="form-group  " tag="div" v-slot="v" style="display:none">
      <label>背景视频</label>
      <cool-file-input
        fileType="video"
        :opts="opt"
        :uploadUrl="videoUploadUrl"
        v-model="model.bgVideo"
        v-validate="v"
      />
    </vp> -->
    </div>
    <div class="col-4" style="position: fixed;right: 0;top:10%;">
      <div class="card">
        <div class="card-header" style="background-color:#fff">
          操作指南
        </div>
        <div
          class="card-body"
          :style="{ height: screenHeight }"
          style="display: flex; align-items: center;justify-content: center;
    padding: 2%;
"
        >
          <div :style="{ backgroundImage: 'url(' + instructionsImg + ')' }" class="imgStyle"></div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import CoolFileInput from "@/components/CoolFileInput.vue";
import UploadApi from "@/api/UploadApi";
import WelcomeApi from "@/api/WelcomeApi";
import env from "@/env";
export default {
  name: "WelcomeForm",
  components: { CoolFileInput },
  data() {
    return {
      videolist: ["mp4", "video"],
      extensions: ["png", "jpg"],
      model: JSON.parse(JSON.stringify(this.value)),
      imageUploadUrl: UploadApi.getUrl("image"),
      audioUploadUrl: UploadApi.getUrl("audio"),
      videoUploadUrl: UploadApi.getUrl("video"),
      screenHeight: document.documentElement.clientHeight / 1.3 + "px",
      instructionsImg: "",
      opt: {
        showClose: false,
        dropZoneEnabled: false,
        zoomIndicator: 10
      }
    };
  },
  props: {
    value: Object
  },
  created() {
    this.getinstructions();
  },
  methods: {
    async getinstructions() {
      try {
        const data = await WelcomeApi.checkBackgroundImg(env.hotelId);
        if (data == null || data == undefined) {
          this.instructionsImg = require("@/assets/images/bgc.jpg");
        } else {
          this.instructionsImg = data.sketch;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
label {
  font-size: 16px;
}
.imgStyle {
  // background-size: 'contain';
  background-size: contain;
  // background-repeat: 'no-repeat';
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
