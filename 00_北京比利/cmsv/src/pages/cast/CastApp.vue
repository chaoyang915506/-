<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <h2>投屏管理</h2>
            </div>
            <div class="col-12">
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            :class="{ active: view === 'device' }"
                            href="#"
                            @click="view = 'device'"
                            >设备</a
                        >
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            :class="{ active: view === 'server' }"
                            href="#"
                            @click="view = 'server'"
                            >代理服务器</a
                        >
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            :class="{ active: view === 'relay' }"
                            href="#"
                            @click="view = 'relay'"
                            >继电器</a
                        >
                    </li>
                </ul>
            </div>
            <div class="col-12">
                <CastDeviceApp v-show="view === 'device'" />
                <ProxyServer v-show="view === 'server'" />
                <SwitchRelayApp v-show="view === 'relay'" />
            </div>
        </div>
    </div>
</template>

<script>
import CastDeviceApp from './CastDeviceApp.vue'
import ProxyServer from './proxyServer/ProxyServer.vue'
import SwitchRelayApp from './switchRelay/SwitchRelayApp.vue'

export default {
    name: 'CastApp',
    components: { CastDeviceApp, ProxyServer, SwitchRelayApp },
    data() {
        return {
            view: 'device', // device, server
        }
    }
}
</script>

<style scoped lang="scss">
.nav-tabs .nav-link {
    color: var(--dark);

    &.active {
        color: var(--blue);
    }
}
</style>
