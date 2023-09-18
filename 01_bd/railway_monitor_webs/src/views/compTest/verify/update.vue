<template>
  <div>
    <el-upload
      v-loading="loading"
      :auto-upload="false"
      class="upload-demo"
      v-model="props.modelValue"
      :file-list="fileLists"
      :on-change="handleChange"
      :before-remove="beforeRemove"
      :list-type="format"
      :disabled="disabled"
      :on-preview="preview"
    >
      <!-- <span v-if="!disabled" class="info">{{ info }}</span> -->
      <span v-if="!disabled && fileLists.length !== 0" class="info">{{
        info
      }}</span>
      <div class="upload_css" v-if="fileLists.length == 0">
        <div>上传文件</div>
        <span>(支持jpg格式)</span>
      </div>
    </el-upload>
    <!-- <el-dialog title="预览文档" v-model="openDocument" width="70%">
      <iframe
        :src="pdfUrl"
        frameborder="0"
        style="width: 100%; height: 75vh"
      ></iframe>
    </el-dialog> -->
    <viewer :imgUrl="imgUrl" ref="viewers" />
  </div>
</template>

<script setup>
const showViewer = ref(false);
const disabled = ref(props.disabled);
const imgUrl = ref("");
import viewer from "./viewper.vue";
const pdfUrl = ref("");
const openDocument = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
let loading = ref(false);
let info = ref("上传文件");
let fileLists = ref([]);
let format = ref("picture");
import { addupdatefile } from "@/api/baseinfo/device.js";

const emits = defineEmits(["update:modelValue"]);

const handleChange = (file, fileList) => {
  let results = fileList[fileList.length - 1];
  let suffix = results.name.split(".").pop().toLowerCase();
  let imglist = ["png", "jpg", "jpeg"];

  if (suffix == "pdf") {
    format.value = " ";
  } else {
    format.value = "picture";
  }
  // console.log(file, results, "all");
  if (results.name && imglist.some((i) => i == suffix)) {
    fileLists.value = [results];
    loading.value = true;
    // console.log(file, "上传的文件");
    if (fileLists.value && fileLists.value.length > 0) {
      // console.log(11);
      // const parmas = new FormData();
      // console.log(fileLists.value[0].raw));
      // parmas.append("file", fileLists.value[0].raw);
      // console.log(fileLists.value[0].raw, file, "resss");
      // parmas.append("file", file);
      // parmas.append("file", file.rawq, file);
      // console.log(parmas, "ressss");
      emits("update:modelValue", fileLists.value[0].raw);
      loading.value = false;
      info.value = "更换文件";
    }
  } else {
    proxy.$modal.msgError("请上传格式为jpg格式文件");
    fileLists.value = [];
  }
};
const beforeRemove = () => {
  info.value = "上传文件";
  emits("update:modelValue", "");
  fileLists.value = [];
};

const preview = (e) => {
  if (e.url.split(":")[0] == "blob") {
    if (e.name && e.name.split(".").pop() == "pdf") {
      pdfUrl.value = proxy.$arrayBufferToBlob(
        props.modelValue[0].file.fileBytes,
        "application/pdf"
      );
      openDocument.value = true;
    } else {
      // console.log(e.url, "url");
      imgUrl.value = e.url;
      proxy.$refs["viewers"].onPreview();
      // viewers.value.onPreview();
    }
  }
};
// watch(
//   fileLists,
//   (val) => {
//     if (val.length > 0 && val[val.length - 1].name) {
//       let results = val[val.length - 1];
//       let suffix = results.name.split(".").pop().toLowerCase();

//       if (suffix == "pdf") {
//         format.value = " ";
//       } else {
//         format.value = "picture";
//       }
//     }

//     if (val.length == 0) {
//       info.value = "上传文件";
//     } else {
//       info.value = "更换文件";
//     }
//   },
//   {
//     deep: true,
//     immediate: true,
//   }
// );
</script>

<style lang="scss" scoped>
.info {
  font-size: 1.1875rem;
  color: #00bfbf;
  font-weight: 700;
}
.upload_css {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100px;
  width: 300px;
  color: #c0c0c0;
  box-shadow: 3px 3px 7px #bbb, -3px -3px 7px #bbb;
  div {
    font-size: 25px;
    font-weight: 500;
  }
}
</style>