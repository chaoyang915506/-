<template>
  <el-image-viewer
    class="out_image_viewer_box"
    :z-index="ZIndex"
    v-if="showViewer"
    @close="closeViewer"
    :url-list="url"
  />
</template>
<script setup>
import { nextTick } from "@vue/runtime-core";

let url = ref(undefined);
let ZIndex = ref(99999);
let showViewer = ref(false);

// update:modelValue
let emit = defineEmits(["resetImgValue"]);
// let emit = defineEmits(["update:imgUrl"]);
let props = defineProps({
  imgUrl: {
    type: String,
    default: "",
  },
});
const closeViewer = () => {
  showViewer.value = false;
  // emit("update:imgUrl", " ");
  emit("resetImgValue", "");
};
const onPreview = () => {
  nextTick(() => {
    url.value = [new URL(props.imgUrl, import.meta.url).href];
  });
  //   url.value = props.imgUrl;
  showViewer.value = true;
};
defineExpose({ onPreview });
</script>
<style scoped>
</style>