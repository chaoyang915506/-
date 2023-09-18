<template>
  <div class="recentData">
    <div
      @click="clickModel(item, index)"
      class="model"
      v-for="(item, index) in mediaInfo"
      :key="index"
    >
      <img
        v-if="item.dataSource === 'FB'"
        class="icon"
        src="/img/ui/facebook.png"
      />
      <img
        v-if="item.dataSource === 'TT'"
        class="icon"
        src="/img/ui/twitter.png"
      />
      <div class="mo text">
        <span class="userName">{{ item.userName }}</span
        ><span class="time">{{ parseTime(item.time, "{y}年{m}月{d}日") }}</span>
      </div>
      <div class="mo text">{{ item.text }}</div>
      <div class="mo imgs">
        <template v-if="item.imagePaths && item.imagePaths.length > 1">
          <div v-for="(img, i) in item.imagePaths" :key="i">
            <img width="100" :src="imageServerUri + img" />
          </div>
        </template>
        <template v-else-if="item.imagePaths && item.imagePaths.length === 1">
          <img width="200" :src="imageServerUri + item.imagePaths[0]"
        /></template>
        <!-- <template v-else>没图</template> -->
      </div>
      <div class="mo video" v-if="item.videoPaths">
        <video width="320" height="240" controls>
          <source :src="videoServerUri + item.videoPaths" type="video/mp4" />
        </video>
      </div>
      <div class="mo elIcon">
        <i @click="download(item._id)" class="el-icon-download"></i>
      </div>
    </div>
    <elDialog v-model="show" title="社媒数据" width="70%">
      <div class="innerModel">
        <img
          v-if="mediaInfo[currentIndex].dataSource === 'FB'"
          class="icon"
          src="/img/ui/facebook.png"
        />
        <img
          v-if="mediaInfo[currentIndex].dataSource === 'TT'"
          class="icon"
          src="/img/ui/twitter.png"
        />
        <div class="mo text">
          <span class="userName">{{ mediaInfo[currentIndex].userName }}</span
          ><span class="time">{{
            parseTime(mediaInfo[currentIndex].time, "{y}年{m}月{d}日")
          }}</span>
        </div>
        <div class="mo text">{{ mediaInfo[currentIndex].text }}</div>
        <div class="mo imgs">
          <template
            v-if="
              mediaInfo[currentIndex].imagePaths &&
              mediaInfo[currentIndex].imagePaths.length > 1
            "
          >
            <div
              v-for="(img, i) in mediaInfo[currentIndex].imagePaths"
              :key="i"
            >
              <img :src="imageServerUri + img" />
            </div>
          </template>
          <template
            v-else-if="
              mediaInfo[currentIndex].imagePaths &&
              mediaInfo[currentIndex].imagePaths.length === 1
            "
          >
            <img :src="imageServerUri + mediaInfo[currentIndex].imagePaths[0]"
          /></template>
        </div>
        <div class="mo video" v-if="mediaInfo[currentIndex].videoPaths">
          <video style="width: 100%" controls>
            <source
              :src="videoServerUri + mediaInfo[currentIndex].videoPaths"
              type="video/mp4"
            />
          </video>
        </div>
        <div class="mo elIcon">
          <i
            @click="download(mediaInfo[currentIndex]._id)"
            class="el-icon-download"
          ></i>
        </div>
      </div>
    </elDialog>
  </div>
</template>

<script>
import {
  查询图片服务器地址,
  社交媒体数据数据导出,
} from "@/api/situation/situation";
import elDialog from "@/components/Dialog/index.vue";
import { parseTime } from "@/utils/ruoyi";
export default {
  name: "RecentData",
  props: {
    mediaInfo: Array,
  },
  components: {
    elDialog,
  },
  data() {
    return {
      currentIndex: 0,
      show: false,
      imageServerUri: "",
      videoServerUri: "",
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
    clickModel(item, index) {
      this.currentIndex = index;
      this.show = true;
      // console.log(item, index);
    },
    async download(id) {
      let formData = new FormData();
      formData.append("ids", [id]);
      let res = await 社交媒体数据数据导出(formData);
      let blob = new Blob([res]);
      let filename = "社媒数据.zip";
      let url = window.URL.createObjectURL(blob);
      let donloadElement = document.createElement("a");
      donloadElement.style.display = "none";
      donloadElement.href = url;
      donloadElement.download = filename;
      document.body.appendChild(donloadElement);
      donloadElement.click();
      document.body.removeChild(donloadElement);
      window.URL.revokeObjectURL(url);
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
  padding: 20px 30px;

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
    margin-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #fff;
    position: relative;
    padding-left: 50px;
    width: 100%;
    background: #0f1c40;
    .icon {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 40px;
      height: 40px;
    }
    .mo {
      margin-bottom: 10px;
      word-break: break-word;
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
