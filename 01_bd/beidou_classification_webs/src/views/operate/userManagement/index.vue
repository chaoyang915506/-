<template>
    <div class="app-box">
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="已绑定" name="first"><Page :tab="clickTab" /></el-tab-pane>
            <el-tab-pane label="未绑定" name="second"><Page :tab="clickTab" /></el-tab-pane>
        </el-tabs> -->
        <Page />
    </div>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import Page from './page'
const activeName = 'first'
const clickTab = ref(null)
const handleClick = (tab, event) => {
    clickTab.value = tab.props.label
}
</script>

<style scoped></style>
