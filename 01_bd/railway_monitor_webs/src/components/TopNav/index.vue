<template>
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    @select="handleSelect"
  >
    <template v-for="(item, index) in topMenus">
      <el-menu-item
        :style="[{ '--theme': theme }]"
        :index="item.path"
        :key="index"
        v-if="index < visibleNumber"
        ><svg-icon :icon-class="item.meta.icon" />
        {{ item.meta.title }}</el-menu-item
      >
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-sub-menu
      :style="{ '--theme': theme }"
      index="more"
      v-if="topMenus.length > visibleNumber"
    >
      <template #title>更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item
          :index="item.path"
          :key="index"
          v-if="index >= visibleNumber"
          ><svg-icon :icon-class="item.meta.icon" />
          {{ item.meta.title }}</el-menu-item
        >
      </template>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { constantRoutes } from "@/router";
import { isHttp } from "@/utils/validate";

// 顶部栏初始数
const visibleNumber = ref(null);
// 是否为首次加载
const isFrist = ref(null);
// 当前激活菜单的 index
const currentIndex = ref(null);

const store = useStore();
const route = useRoute();
const router = useRouter();

// 主题颜色
const theme = computed(() => store.state.settings.theme);
// 所有的路由信息
const routers = computed(() => store.state.permission.topbarRouters);

// 顶部显示菜单
const topMenus = computed(() => {
  let topMenus = [];
  // debugger
  console.log("菜单", routers.value);
  routers.value.map((menu) => {
    // 手动屏蔽仿真推演的路由
    if (menu.hidden !== true) {
      // 兼容顶部栏一级菜单内部跳转
      if (menu.path === "/") {
        topMenus.push(menu.children[0]);
      } else {
        topMenus.push(menu);
      }
    }
  });
  return topMenus;
});

// 设置子路由
const childrenMenus = computed(() => {
  let childrenMenus = [];
  routers.value.map((router) => {
    for (let item in router.children) {
      if (router.children[item].parentPath === undefined) {
        if (router.path === "/") {
          router.children[item].path =
            "/redirect/" + router.children[item].path;
        } else {
          if (!isHttp(router.children[item].path)) {
            router.children[item].path =
              router.path + "/" + router.children[item].path;
          }
        }
        router.children[item].parentPath = router.path;
      }
      childrenMenus.push(router.children[item]);
    }
  });
  return constantRoutes.concat(childrenMenus);
});

// 默认激活的菜单
const activeMenu = computed(() => {
  // /redirect/realtimestatus
  const path = route.path;
  let activePath = defaultRouter.value;
  if (path !== undefined && path.lastIndexOf("/") > 0) {
    // console.log('1')
    const tmpPath = path.substring(1, path.length);
    activePath = "/" + tmpPath.substring(0, tmpPath.indexOf("/"));
  } else if ("/index" == path || "" == path) {
    // console.log('2')
    if (!isFrist.value) {
      isFrist.value = true;
    } else {
      activePath = "index";
    }
  } else {
    activePath = path;
  }
  let routes = activeRoutes(activePath);
  if (routes.length === 0) {
    if (path === "/realtimestatus") {
      activePath = "/redirect/realtimestatus";
    } else {
      activePath = currentIndex.value || defaultRouter.value;
    }
    activeRoutes(activePath);
  }
  // console.log('32',activePath)
  return activePath;
});
// 默认激活的路由
const defaultRouter = computed(() => {
  let router;
  Object.keys(routers.value).some((key) => {
    if (!routers.value[key].hidden) {
      router = routers.value[key].path;
      return true;
    }
  });
  return router;
});
function setVisibleNumber() {
  const width = document.body.getBoundingClientRect().width / 3;
  visibleNumber.value = parseInt(width / 85);
}
function handleSelect(key, keyPath) {
  console.log(key, "keye", keyPath);
  if (key == "index") {
    key = "/redirect/index";
  }
  currentIndex.value = key;
  if (isHttp(key)) {
    // http(s):// 路径新窗口打开
    window.open(key, "_blank");
  } else if (key.indexOf("/redirect") !== -1) {
    // /redirect 路径内部打开
    // console.log(key.replace("/redirect", ""), 'key.replace("/redirect", "")')
    router.push({ path: key.replace("/redirect", "") });
    store.dispatch("app/setShowMenu", false);
  } else {
    // 显示左侧联动菜单
    activeRoutes(key);
    store.dispatch("app/setShowMenu", true);
    // 跳转默认显示第一条菜单数据
    router.push({
      path:
        activeRoutes(key) && activeRoutes(key).length
          ? activeRoutes(key)[0].path
          : "/index",
    });
  }
}
function activeRoutes(key) {
  let routes = [];
  if (childrenMenus.value && childrenMenus.value.length > 0) {
    childrenMenus.value.map((item) => {
      if (key == item.parentPath || (key == "index" && "" == item.path)) {
        routes.push(item);
      }
    });
  }
  if (routes.length > 0) {
    store.commit("SET_SIDEBAR_ROUTERS", routes);
  }
  return routes;
}

onMounted(() => {
  window.addEventListener("resize", setVisibleNumber);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", setVisibleNumber);
});

onMounted(() => {
  setVisibleNumber();
});
</script>

<style lang="scss">
.topmenu-container.el-menu--horizontal > .el-menu-item {
  float: left;
  height: 80px !important;
  line-height: 80px !important;
  color: #fff !important;
  padding: 0 10px !important;
  margin: 0 10px !important;
  font-size: 18px;
}
.topmenu-container.el-menu--horizontal > .el-menu-item:hover {
  color: #43f4ff !important;
  background: none !important;
}
.topmenu-container.el-menu--horizontal > .el-menu-item.is-active,
.el-menu--horizontal > .el-sub-menu.is-active .el-submenu__title {
  border-bottom: none !important;
  color: #303133;
  background: none !important;
}

/* sub-menu item */
.topmenu-container.el-menu--horizontal > .el-sub-menu .el-submenu__title {
  float: left;
  height: 80px !important;
  line-height: 80px !important;
  color: #999093 !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
}
.el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
  height: 80px !important;
  line-height: 80px !important;
  color: #fff !important;
}
.el-menu--horizontal > .el-sub-menu .el-sub-menu__title:hover {
  color: #43f4ff !important;
  background: none !important;
}
.topmenu-container.el-menu--horizontal > .el-sub-menu__title.is-active {
  border-bottom: none !important;
  color: #43f4ff !important;
  background: none !important;
}
.el-sub-menu.is-active > .el-sub-menu__title {
  border-bottom: none !important;
  color: #43f4ff !important;
}
.el-menu--horizontal > .el-menu-item.is-active {
  color: #43f4ff !important;
}
</style>
