<template>
    <section class="app-main">
        <router-view v-slot="{ Component, route }">
            <transition name="fade-transform" mode="out-in">
                <keep-alive :include="cachedViews">
                    <component :is="Component" :key="route.path" />
                </keep-alive>
            </transition>
        </router-view>
    </section>
</template>

<script setup>
let store = useStore()
const cachedViews = computed(() => {
    return store.state.tagsView.cachedViews
})
</script>

<style lang="scss" scoped>
.app-main {
    // height: 100vh;
    min-height: calc(100vh - 106px);
    width: 100%;
    position: relative;
    overflow: hidden;
    // background: rgba(244, 247, 252, 1);
    // border: 20px solid rgba(244, 247, 252, 1);
    border-top: 0px;
}

.fixed-header + .app-main {
    padding-top: 50px;
}

.hasTagsView {
    .app-main {
        /* 84 = navbar + tags-view = 50 + 34 */
        min-height: calc(100vh - 84px);
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
</style>
