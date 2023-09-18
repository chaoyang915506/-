<template>
  <div
    :class="[
      classObj,
      $route.path == '/simAssess/overview' ? 'isDisplayBack' : '',
    ]"
    class="app-wrapper"
    :style="{ '--current-color': theme }"
  >
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" v-if="isShowMenu" />
    <div :class="{ 'fixed-header': fixedHeader }">
      <navbar @setLayout="setLayout" />
    </div>
    <!-- <div class="layout-banner">
      <router-link to="/simLayout">
        {{ back }}
      </router-link>
    </div> -->
    <div
      :class="{ hasTagsView: needTagsView }"
      class="main-container"
      :style="
        getters.sidebar.opened
          ? { 'margin-left': '200px' }
          : { 'margin-left': '54px' }
      "
    >
      <!-- :style="isShowMenu ? { 'margin-left': '200px' } : { 'margin-left': 0 }" -->
      <app-main />
      <settings ref="settingRef" />
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
import { useWindowSize } from "@vueuse/core";
import Sidebar from "./components/Sidebar/index.vue";
import { AppMain, Navbar, Settings, TagsView } from "./components";
import defaultSettings from "@/settings";
import { onMounted } from "@vue/runtime-core";
import { useRoute } from "vue-router";

const back = "< 返回";
const store = useStore();
const getters = computed(() => store.getters);
const theme = computed(() => store.state.settings.theme);
const sideTheme = computed(() => store.state.settings.sideTheme);
const sidebar = computed(() => store.state.app.sidebar);
const isShowMenu = computed(() => store.state.app.isShowMenu);
const device = computed(() => store.state.app.device);
const needTagsView = computed(() => store.state.settings.tagsView);
const fixedHeader = computed(() => store.state.settings.fixedHeader);

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === "mobile",
}));

const { width, height } = useWindowSize();
const WIDTH = 992; // refer to Bootstrap's responsive design

watchEffect(() => {
  if (device.value === "mobile" && sidebar.value.opened) {
    store.dispatch("app/closeSideBar", { withoutAnimation: false });
  }
  if (width.value - 1 < WIDTH) {
    store.dispatch("app/toggleDevice", "mobile");
    store.dispatch("app/closeSideBar", { withoutAnimation: true });
  } else {
    store.dispatch("app/toggleDevice", "desktop");
  }
});

function handleClickOutside() {
  store.dispatch("app/closeSideBar", { withoutAnimation: false });
}

const settingRef = ref(null);
function setLayout() {
  settingRef.value.openSetting();
}

onMounted(() => {
  console.log(route.path, "path");
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
@import "@/assets/styles/variables.module.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.layout-banner {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  top: 60px;
  // top: 10%;
  left: 0px;
  position: absolute;
  position: fixed;
  z-index: 999;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;

  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  // width: calc(100% - #{$base-sidebar-width});
  width: 100%;
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  // width: calc(100% - 54px);
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
.isDisplayBack {
  background: url(../assets/images/overview/home-back.svg);
  background-size: 100% 100%;
}
</style>
