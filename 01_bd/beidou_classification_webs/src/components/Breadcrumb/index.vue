<template>
  <el-breadcrumb class="app-breadcrumb" separator="">
    <transition-group name="breadcrumb">
      <img
        src="./../../assets/styles/breadcrumb-logo.png"
        style="
          position: absolute;
          top: 66px;
          left: 34px;
          width: 20px;
          height: 20px;
        "
      />
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="index == levelList.length - 1"
          class="no-redirect"
          @click.prevent="handleClear(item)"
          :style="
            item.meta.title === '首页'
              ? 'margin-left:37px'
              : item.meta.title === '运行监控' ||
                item.meta.title === '短报文管理'
              ? 'margin-left:20px'
              : 'margin-left:0px'
          "
          >{{ item.meta.title }}</span
        >
        <!-- <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span> -->
        <!-- <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a> -->
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
const store = useStore();
const route = useRoute();
const router = useRouter();
const levelList = ref([]);
let navigationRouter = computed(() => store.state.app.navigationRouter);
function getBreadcrumb() {
  // only show routes with meta.title
  let matched = route.matched.filter((item) => item.meta && item.meta.title);
  const first = matched[0];
  // 判断是否为首页
  if (!isDashboard(first)) {
    matched = [{ path: "/index", meta: { title: "首页" } }].concat(
      matched,
      navigationRouter.value
    );
  }

  levelList.value = matched.filter(
    (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
  );
}
function isDashboard(route) {
  const name = route && route.name;
  if (!name) {
    return false;
  }
  return name.trim() === "Index";
}
function handleLink(item) {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect);
    return;
  }
  let tempNavRouter = [];
  levelList.value.forEach((val, valIndex) => {
    if (!val.path && valIndex < index) {
      tempNavRouter.push(val);
    }
  });
  // console.log(tempNavRouter, 'tempNavRouter')
  store.dispatch("app/setNavigationRouter", tempNavRouter);
  store.dispatch("setDocumentRowId", undefined);
  store.dispatch("setBiddingRowId", undefined);
  if (path) {
    router.push(path);
  }
}
function handleClear() {
  store.dispatch("app/setNavigationRouter", []);
  // store.dispatch("setDocumentRowId", undefined);
  // store.dispatch("setBiddingRowId", undefined);
}
watchEffect(() => {
  // if you go to the redirect page, do not update the breadcrumbs
  if (route.path.startsWith("/redirect/")) {
    return;
  }
  getBreadcrumb();
});
getBreadcrumb();
</script>

<style lang='scss' scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #363535;
    cursor: text;
    font-size: 20px;
  }
}
</style>