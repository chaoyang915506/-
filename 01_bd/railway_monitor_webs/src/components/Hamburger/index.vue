<template>
  <div style="padding: 0 15px" @click="toggleClick">
    <!-- <svg
      :class="{ 'is-active': isActive }"
      class="hamburger"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
    >
      <path
        d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
      />
    </svg> -->
    <svg
      t="1656322558844"
      :class="{ 'is-active': isActive }"
      class="hamburger"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="1798"
      data-spm-anchor-id="a313x.7781069.0.i1"
      width="64"
      height="64"
    >
      <path
        d="M408 442h480a8 8 0 0 0 8-8v-56a8 8 0 0 0-8-8H408a8 8 0 0 0-8 8v56a8 8 0 0 0 8 8z m-8 204a8 8 0 0 0 8 8h480a8 8 0 0 0 8-8v-56a8 8 0 0 0-8-8H408a8 8 0 0 0-8 8v56z m504-486H120a8 8 0 0 0-8 8v56a8 8 0 0 0 8 8h784a8 8 0 0 0 8-8v-56a8 8 0 0 0-8-8z m0 632H120a8 8 0 0 0-8 8v56a8 8 0 0 0 8 8h784a8 8 0 0 0 8-8v-56a8 8 0 0 0-8-8zM142.4 642.1L298.7 519a8.8 8.8 0 0 0 0-13.9L142.4 381.9a8.9 8.9 0 0 0-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
        p-id="1799"
        fill="#ffffff"
      ></path>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits();
const toggleClick = () => {
  emit("toggleClick");
};
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
