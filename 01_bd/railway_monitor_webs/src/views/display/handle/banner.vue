<template>
  <div class="banner-content-class">
    <el-image-viewer
      class="out_image_viewer_box"
      :z-index="ZIndex"
      v-if="showViewer"
      @close="closeViewer"
      :url-list="imgUrl"
    />
    <div class="banner-title-class">
      <span
        style="
          color: #80ffff;
          padding-left: 8px;
          border-left: 4px solid #058e8a;
        "
        >关键监测点实况</span
      >
      <span style="cursor: pointer" @click="handleIcon">
        <img
          src="./../../../assets/images/display/down-select.svg"
          v-show="isBannerCollse"
          alt=""
        />
        <img
          src="./../../../assets/images/display/up-select.svg"
          v-show="!isBannerCollse"
          alt=""
        />
      </span>
      <span>
        <el-select
          v-model="moniterId"
          placeholder="请选择关键监测点"
          clearable
          filterable
          style="width: 140px"
          size="mini"
          @change="handleSelect"
          class="select-position-class"
        >
          <el-option
            v-for="(item, index) in bannerImg"
            :key="index"
            :label="item.monitorName"
            :value="item.monitorId"
          />
        </el-select>
      </span>
    </div>
    <div
      class="banner-content"
      :style="isBannerCollse ? { height: '80%' } : { height: 0 }"
    >
      <div class="swiper mySwiper">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            v-for="(item, index) in bannerImgCopy"
            :key="index"
          >
            <!-- <img :src="formatterImg(item)" alt="" /> -->
            <el-image
              :src="formatterImg(item)"
              fit="fill"
              @click="checkImg(formatterImg(item))"
              :lazy="true"
            ></el-image>

            <span style="margin: 5px 0; color: #ccf3f6; font-size: 14px">{{
              item.monitorName
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getCriMonitorScene } from "@/api/display/display.js";
import { computed } from "@vue/reactivity";
// Import Swiper Vue.js components
import Swiper, {
  Autoplay,
  EffectCoverflow,
  EffectCube,
  Pagination,
  Navigation,
} from "swiper";
// Import style (>= Swiper 6.x)
import "swiper/swiper-bundle.css";
Swiper.use([Autoplay, EffectCoverflow, EffectCube, Pagination, Navigation]);
let emit = defineEmits(["handleCollseIcon", "handleCurrentMoniter"]);
let { proxy } = getCurrentInstance();
let moniterId = ref(undefined);
let moniterOpt = ref([]);
let isBannerCollse = ref(true);
let bannerImg = ref([]);
let bannerImgCopy = computed(() => {
  return bannerImg.value.filter((i) => {
    return moniterId.value ? i.monitorId == moniterId.value : i;
  });
});
let imgUrl = ref("");
let ZIndex = ref(99999);
let showViewer = ref(false);
let currentMoniter = ref(null);
// let bannerImg = ref([
//   {
//     img: './../../../assets/images/display/bannerImg/u173.svg',
//     text: '监测点1'
//   },
//   {
//     img: './../../../assets/images/display/bannerImg/u174.svg',
//     text: '监测点2'
//   },
//   {
//     img: './../../../assets/images/display/bannerImg/u175.svg',
//     text: '监测点3'
//   },
//   {
//     img: './../../../assets/images/display/bannerImg/u176.svg',
//     text: '监测点4'
//   },
//   {
//     img: './../../../assets/images/display/bannerImg/u177.svg',
//     text: '监测点5'
//   },
//   {
//     img: './../../../assets/images/display/bannerImg/u178.svg',
//     text: '监测点6'
//   },
// ])
const handleSelect = (e) => {
  // console.log(e, "用户选择的");
  let result = bannerImg.value.find(
    (item) => item.monitorId == moniterId.value
  );
  if (result) {
    console.log(result, "点击");
    emit("handleCurrentMoniter", result);
  } else {
    emit("handleCurrentMoniter", null);
    return proxy.$model.msgError("当前线路不存在监测点");
  }
  // bannerImg.value.forEach((item) => {
  //   // console.log(item.monitorId, "item", moniterId.value);
  //   if (item.monitorId == moniterId.value) {
  //     // currentMoniter.value = item
  //     // console.log("zounage");
  //     console.log(item);
  //     emit("handleCurrentMoniter", item);
  //   } else {
  //   }
  // });
};
const checkImg = (val) => {
  showViewer.value = true;
  imgUrl.value = [val];
};
const closeViewer = () => {
  showViewer.value = false;
};
const initSwiper = () => {
  new Swiper(".mySwiper", {
    loop: true,
    slidesPerView: 6,
    spaceBetween: 20,
    speed: 2500,
    freeMode: true,
    freeModeMomentum: false,
    autoplay: true,
    observer: true, // 修改swiper自己或子元素时，自动初始化swiper
    observeParents: true, // 修改swiper的父元素时，自动初始化swiper
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
  });
};
// 初始化
async function getInitList() {
  try {
    let res = await getCriMonitorScene();
    if (res && res.code == 200) {
      // console.log(res.data, "检测点");
      bannerImg.value = res.data;
    }
  } catch (error) {
    console.log(error);
  }
}
onMounted(() => {
  getInitList();
  initSwiper();
});
// fomatter图片路径
const formatterImg = (item) => {
  // console.log(item.file.fileBytes, "imgurl");
  return item.file ? proxy.$arrayBufferToBlob(item.file.fileBytes) : "";
  // return new URL(imgUrl, import.meta.url).href;
};
const handleIcon = () => {
  isBannerCollse.value = !isBannerCollse.value;
  emit("handleCollseIcon", isBannerCollse.value);
};
function initmothod() {
  getInitList();
  initSwiper();
}
defineExpose({ initmothod });
</script>
<style scoped>
.banner-content-class {
  padding: 10px;
  width: 100%;
}
.banner-title-class {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.banner-content {
  margin-top: 10px;
  width: 100%;
  overflow: hidden;
  transition: height 0.3s;
  /* position: relative; */
}
.swiper {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>