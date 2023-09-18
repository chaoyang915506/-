<template>
    <div id="app">
        <img src="~@/assets/logo.png" />
        <cool-sorter
            style="width: 640px"
            title="排序测试"
            :value="[
                { key: 0, label: '0000' },
                { key: 0, label: '0001' },
                { key: 0, label: '0002' },
            ]"
        />
        <CoolTransfer />
        <HelloWorld msg="Welcome to Your Vue.js App" />
    </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import CoolTransfer from '@/components/CoolTransfer.vue'
import CoolSorter from './components/CoolSorter.vue'

export default {
    name: 'app',
    components: { HelloWorld, CoolTransfer, CoolSorter }
}
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
