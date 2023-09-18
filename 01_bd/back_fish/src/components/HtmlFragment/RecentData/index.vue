<template>
  <div class="innerModel">
    <div class="mo text">
      <img
        v-if="itemdata.dataSource === 'FB'"
        class="icon"
        src="/img/ui/facebook.png"
      />
      <img
        v-if="itemdata.dataSource === 'TT'"
        class="icon"
        src="/img/ui/twitter.png"
      />
      <span class="userName">{{ itemdata.userName }}</span
      ><span class="time">{{
        parseTime(itemdata.time, "{y}年{m}月{d}日")
      }}</span>
      <div class="icon_download">
        <i @click="download(itemdata._id)" class="el-icon-download"></i>
      </div>
      <!-- <div class="mo elIcon">
          <i
            @click="download(template1[currentIndex]._id)"
            class="el-icon-download"
          ></i>
        </div> -->
    </div>
    <div class="mo text">{{ itemdata.text }}</div>
    <div class="mo imgs">
      <template v-if="itemdata.imagePaths && itemdata.imagePaths.length > 1">
        <div v-for="(img, i) in itemdata.imagePaths" :key="i">
          <img width="100" :src="imageServerUri + img" />
        </div>
      </template>
      <template
        v-else-if="itemdata.imagePaths && itemdata.imagePaths.length === 1"
      >
        <img width="200" :src="imageServerUri + itemdata.imagePaths[0]"
      /></template>
    </div>
    <div class="mo video" v-if="itemdata.videoPaths">
      <video width="100%" height="100%" controls>
        <source :src="videoServerUri + itemdata.videoPaths" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script>
import {
  查询图片服务器地址,
  社交媒体数据数据导出,
} from "@/api/situation/situation";
import { 多源数据导出 } from "@/api/information/information";
import { parseTime } from "@/utils/ruoyi";
export default {
  props: {
    itemdata: {
      type: Object,
      default: () => ({}),
    },
    imageServerUri: {
      type: String,
      default: "",
    },
    videoServerUri: {
      type: String,
      default: "",
    },
    page: {
      type: String,
      default: "",
    },
  },
  methods: {
    async download(id) {
      let formData = new FormData();
      formData.append("ids", [id]);
      let filename, res, blob;

      if (this.page == "multidata") {
        res = await 多源数据导出(formData);
        blob = new Blob([res]);
        filename = "近期数据.zip";
      } else {
        res = await 社交媒体数据数据导出(formData);
        blob = new Blob([res]);
        filename = "社媒数据.zip";
      }

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
.title_info {
  position: relative;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 17px;
  color: #fff;
  padding: 1px 10px;
  font-weight: 500;
  span {
    width: 30%;
  }
  div {
    background-image: url("/img/ui/bias.svg");
    position: absolute;
    display: inline-block;
    top: 4px;
    width: 70%;
    height: 25px;
    background-size: inherit;
    background-position: 25px 2px;
    -webkit-transform: scale(0.7);
    transform: scale(0.7);
  }
}
.innerModel {
  overflow-y: hidden;
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
  font-size: 16px;
  color: #fff;

  .icon {
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }
  .mo {
    display: flex;
    position: relative;
    margin-bottom: 10px;
    align-items: center;
    position: relative;
    margin-bottom: 10px;
    .icon_download {
      position: absolute;
      right: 0;
      top: 42%;
    }
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
    font-size: 14px;
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
  overflow: hidden;
  overflow-y: hidden;
  /* margin-top: 10px; */
  /* padding-top: 10px; */
  /* padding-bottom: 10px; */
  margin-bottom: 10px;
  border-bottom: 1px solid #122b54;
  /* padding-left: 10px; */
  // padding: 0 10px 0px;
  padding: 10px;
  position: relative;
  width: 100%;
  background-color: #122b54;
  // background: #0f1c40;
  .icon {
    // position: absolute;
    // top: 0px;
    // left: 0px;
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
  .mo {
    position: relative;

    margin-bottom: 10px;
    // margin-left: 40px;
    display: flex;
    align-items: center;
    font-size: 12px;
    .icon_download {
      position: absolute;
      right: 0;
      top: 42%;
    }
  }
  .userName {
    font-size: 14px;
  }
  .time {
    margin-left: 10px;
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
</style>