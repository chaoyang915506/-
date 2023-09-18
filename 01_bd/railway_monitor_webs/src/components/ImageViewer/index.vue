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

let url = ref(undefined)
let ZIndex = ref(99999)
let showViewer = ref(false)
let emit = defineEmits(['resetImgValue'])
let props = defineProps({
  imgUrl: {
    type: String,
    default: ''
  }
})
watch(() => props.imgUrl, (val) => {
  console.log(props.imgUrl, 'props.imgUrl')
  nextTick(() => {
    onPreview()
  })
})

const closeViewer = () => {
  showViewer.value = false
  emit('resetImgValue', '')
}
const onPreview = () => {
  url.value = [new URL('../../assets/images/realtimestatus/sceneBack.svg' ,import.meta.url).href]
  showViewer.value = true
}
</script>
<style scoped>

</style>