<template>
  <div
    :class="{ 'has-logo': showLogo }"
    style="margin-right: 100px"
    :style="{
      backgroundColor:
        sideTheme === 'theme-dark'
          ? variables.menuBackground
          : variables.menuLightBackground,
    }"
  >
    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="
          sideTheme === 'theme-dark'
            ? variables.menuBackground
            : variables.menuLightBackground
        "
        :text-color="
          sideTheme === 'theme-dark'
            ? variables.menuColor
            : variables.menuLightColor
        "
        :unique-opened="true"
        :active-text-color="theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <hamburger
          class="hamburger-container"
          :is-active="getters.sidebar.opened"
          @toggleClick="toggleSideBar"
        />

        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import style from "@/assets/styles/variables.module.scss";
import Hamburger from "@/components/Hamburger";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.module.scss";
const getters = computed(() => store.getters);

const route = useRoute();
const store = useStore();

const sidebarRouters = computed(() => store.getters.sidebarRouters);
const showLogo = computed(() => store.state.settings.sidebarLogo);
const sideTheme = computed(() => store.state.settings.sideTheme);
const theme = computed(() => store.state.settings.theme);
const isCollapse = computed(() => !store.state.app.sidebar.opened);

const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
function toggleSideBar() {
  store.dispatch("app/toggleSideBar");
}
</script>
<style lang="scss" scoped>
// @import "@/assets/styles/index.scss";
@import "@/assets/styles/variables.module.scss";

.hamburger-container {
  line-height: 46px;
  // height: 100%;
  width: $base-sidebar-width;
  // float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
</style>
