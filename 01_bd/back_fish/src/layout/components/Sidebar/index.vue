<template>
  <div :class="{ 'has-logo': showLogo }" style="background: #122b54">
    <!-- :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }" -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        style="background: #122b54"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :text-color="
          settings.sideTheme === 'theme-dark'
            ? variables.menuColor
            : variables.menuLightColor
        "
        :unique-opened="false"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
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

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["sidebarRouters", "sidebar"]),
    activeMenu() {
      // console.log(this.sidebarRouters, "什么");
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-menu-item.is-active {
  color: #13cbf1 !important;
  background-color: #0f1c40 !important;
}
::v-deep .el-submenu__title {
  color: red !important;
}
</style>
