<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <div
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        @click="goHome"
      >
        <!-- to="/" -->
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1
          v-else
          class="sidebar-title"
          :style="{
            color:
              sideTheme === 'theme-dark'
                ? variables.logoTitleColor
                : variables.logoLightTitleColor,
          }"
        >
          {{ title }}
        </h1>
      </div>
      <div v-else key="expand" class="sidebar-logo-link" @click="goHome">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1
          class="sidebar-title"
          :style="{
            color:
              sideTheme === 'theme-dark'
                ? variables.logoTitleColor
                : variables.logoLightTitleColor,
          }"
        >
          {{ title }}
        </h1>
      </div>
    </transition>
  </div>
</template>

<script setup>
import variables from "@/assets/styles/variables.module.scss";
import logo from "@/assets/logo/logo.svg";

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

const title = ref("铁路自然灾害及异物侵限孪生仿真监测系统");
const store = useStore();
const sideTheme = computed(() => store.state.settings.sideTheme);

const router = useRouter();
const goHome = () => {
  store.dispatch("app/setShowMenu", false);
  router.push("/index");
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  // position: relative;
  // width: 100%;
  // height: 80px;
  // padding-left: 20px;
  // line-height: 80px;
  // text-align: center;
  // overflow: hidden;

  & .sidebar-logo-link {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    cursor: pointer;
    & .sidebar-logo {
      width: 42px;
      height: 42px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      // display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      // line-height: 2;
      font-size: 26px;
      // font-size: 26px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>