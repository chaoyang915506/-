<template>
    <div class="layout">
        <div class="layout-header">
            <Header ref="header"></Header>
        </div>
        <div class="layout-banner">
            <router-link to="/simLayout"> {{ back }} </router-link>
        </div>
        <div class="layout-index">
            <div class="layout-menu">
                <Menu></Menu>
            </div>
            <div class="layout-router">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import Menu from '../components/Menu/mapManageMenu.vue'
import Header from '../components/Header/Header.vue'
const header = ref(null)
const back = '< 返回'
</script>

<style lang="less" scoped>
.layout {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    background: #3c3d3f;
}

.layout-header {
    width: 100%;
    height: 65px;
    background: #3c3d3f;
}
.layout-banner {
    width: 100%;
    height: 50px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    margin-left: 20px;
}
.layout-index {
    // flex:1;
    display: flex;
    // flex-direction: column;
    // width: calc(100% - 200px);
    height: 100%;
    .layout-menu {
        width: 200px;
        height: 100%;
        // float: left;
    }

    .layout-router {
        width: 100%;
        height: calc(100% - 65px);
        background: #3c3d3f;
        // box-sizing: content-box;
        padding: 20px;
        .layout-inner {
            width: 100%;
            height: 100%;
            background: #3c3d3f;
        }
    }
}
</style>
