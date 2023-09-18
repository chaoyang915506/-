<template>
  <div class="base-info-title">情景风险综合分析</div>
  <div class="base-info-risk-class">
    <div class="img-class-risk">
      <img :src="formatterImg(monitorInfoData)" alt="" />
      <!-- 放大 -->
      <img
        src="../../../assets/images/realtimestatus/up-btn.svg"
        @click="handleImgPreview(formatterImg(monitorInfoData))"
        alt=""
      />
    </div>
    <div
      class="risk-class-text"
      v-if="
        monitorInfoData != null &&
        monitorInfoData != undefined &&
        monitorInfoData != {}
      "
    >
      <div>综合分析：</div>
      <div>
        {{ monitorInfoData.syn_analyse }}，建议采用《{{
          monitorInfoData.plan_name
        }}》。
      </div>
    </div>
  </div>
  <el-image-viewer
    class="out_image_viewer_box"
    :z-index="ZIndex"
    v-if="showViewer"
    @close="closeViewer"
    :url-list="imgUrl"
  />
</template>
<script setup>
import { getSynAnalyse } from "@/api/realtimestatus/realtimestatus.js";
let imgUrl = ref("");
let ZIndex = ref(99999);
let showViewer = ref(false);
let props = defineProps({
  monitorID: {
    type: Number,
    default: undefined,
  },
});
const { proxy } = getCurrentInstance();
let monitorInfoData = ref({});
onMounted(() => {
  getSynAnalyseData(props.monitorID);
});
watch(
  () => props.monitorID,
  () => {
    getSynAnalyseData(props.monitorID);
  }
);
const getSynAnalyseData = async (val) => {
  monitorInfoData.value = {};
  let res = await getSynAnalyse({
    monitorId: val,
  });
  if (res.code == 200) {
    monitorInfoData.value = res.data;
  }
};
// 放大图片
const handleImgPreview = (val) => {
  showViewer.value = true;
  imgUrl.value = [val];
};
const closeViewer = () => {
  showViewer.value = false;
};
// fomatter图片路径
const formatterImg = (item) => {
  // console.log(item.file.fileBytes, "imgurl");
  return item.file ? proxy.$arrayBufferToBlob(item.file.fileBytes) : "";
  // return new URL(imgUrl, import.meta.url).href;
};
</script>

<style scoped>
.base-info-title {
  font-size: 15px;
  /* font-weight: bold; */
  /* color: #1abcb8; */
}
.base-info-risk-class {
  margin-top: 10px;
  height: calc(100% - 10% - 10px);
}
.img-class-risk {
  height: 60%;
  position: relative;
}
.img-class-risk img:nth-child(1) {
  width: 100%;
  height: 100%;
}
.img-class-risk img:nth-child(2) {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
.risk-class-text {
  margin-top: 10px;
  font-size: 12px;
}
.risk-class-text div:nth-child(1) {
  font-size: 13px;
}
.risk-class-text div:nth-child(2) {
  margin-top: 8px;
  font-size: 10px;
  line-height: 25px;
}
</style>