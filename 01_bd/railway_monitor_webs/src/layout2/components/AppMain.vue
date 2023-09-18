<template>
    <section class="app-main">
        <!-- 有点问题-----刷新页面会消失 -->
        <router-view v-slot="{ Component, route }">
            <transition name="fade-transform" mode="out-in">
                <keep-alive :include="cachedViews[0]">
                    <component :is="Component" :key="route.path" />
                </keep-alive>
            </transition>
        </router-view>
    </section>
</template>

<script setup>
let store = useStore()
const emits = defineEmits()
const cachedViews = computed(() => {
    return store.state.tagsView.cachedViews
})
</script>

<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    // overflow-y: auto;
    // overflow-x: hidden;
}

.fixed-header + .main-container .app-main {
    margin-top: 84px;
    overflow: auto;
}

.hasTagsView {
    .app-main {
        /* 84 = navbar + tags-view = 50 + 34 */
        height: calc(100vh - 84px);
    }

    .fixed-header + .app-main {
        padding-top: 84px;
    }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 17px;
    }
}
.singleton-tooltip-openlayer {
    padding: 0 !important;
    border: none;
}
</style>
