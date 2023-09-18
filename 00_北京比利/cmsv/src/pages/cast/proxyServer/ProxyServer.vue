<template>
    <div>
        <div class="row">
            <div class="col-12">
                <cool-table
                    ref="serverTable"
                    :data="servers"
                    :columns="columns"
                    @proxy-row="showProxy"
                    @update-row="update"
                    @del-row="deleteServer"
                >
                    <button class="btn btn-primary" @click="create">
                        添加
                    </button>
                    <button class="btn btn-danger ml-1" @click="deleteServers">
                        删除
                    </button>
                </cool-table>
            </div>
            <div class="col-12"></div>
        </div>
        <cool-modal
            :title="visible === 'form' ? '代理服务器' : '代理房间'"
            :visible="visible !== 'none'"
            :footer="{ visible: visible === 'proxy' }"
            @hidden="visible = 'none'"
        >
            <proxy-server-form
                v-if="visible === 'form'"
                :value="serverModel"
                @change="refresh"
                @close="visible = 'none'"
            />
            <div
                v-if="visible === 'proxy'"
                class="d-flex justify-content-center"
            >
                <set-proxy-room v-model="proxyRooms" />
            </div>
            <div slot="footer">
                <button class="btn btn-primary" @click="updateProxy">
                    确定
                </button>
                <button
                    class="btn btn-secondary ml-1"
                    @click="visible = 'none'"
                >
                    返回
                </button>
            </div>
        </cool-modal>
    </div>
</template>

<script>
import { mapState } from "vuex";
import CoolTable from '@/components/CoolTable.vue'
import CoolModal from '@/components/CoolModal.vue';
import { CastProxyServer } from '../CastDevice';
import ProxyServerForm from './ProxyServerForm.vue';
import { CastProxyServerApi } from '@/api/CastApi';
import SetProxyRoom from './SetProxyRoom.vue';

export default {
    name: 'ProxyServer',
    components: { CoolTable, CoolModal, ProxyServerForm, SetProxyRoom },
    data() {
        return {
            columns: [{
                checkbox: true,
            }, {
                field: 'name', title: '名称'
            }, {
                field: 'ipInIptvLan', title: 'IPTV LAN IP'
            }, {
                field: 'ipInGuestLan', title: 'Guest LAN IP'
            }, {
                field: 'id', title: '操作',
                formatter: (val, row, idx) => {
                    return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit=update-row>修改</button>
                        <button class="btn btn-primary btn-sm" data-val=${val} data-emit=proxy-row>覆盖房间</button>
                        <button class="btn btn-danger btn-sm" data-val=${val} data-emit=del-row>删除</button>`
                }
            }],
            visible: 'none', // none form proxy
            serverModel: new CastProxyServer,
            proxyRooms: [],
        }
    },
    computed: {
        ...mapState({
            servers: 'proxyServers', rooms: 'rooms', castDevices: 'castDevices'
        })
    },
    methods: {
        create() {
            this.serverModel = new CastProxyServer

            this.visible = 'form'
        },
        update(id) {
            this.serverModel = this.servers.find(server => server.id === id)

            this.visible = 'form'
        },
        showProxy(id) {
            this.serverModel = this.servers.find(server => server.id === id)
            this.proxyRooms = this.serverModel.rooms;

            this.visible = 'proxy'
        },
        async updateProxy() {
            try {
                await CastProxyServerApi.updateProxy(this.serverModel.id, this.proxyRooms)
                this.$info('设置代理房间成功')
                this.refresh()
            } catch (error) {
                this.$error('设置代理房间失败')
            } finally {
                this.visible = 'none'
            }
        },
        async deleteServer(id) {
            try {
                const ok = await this.$confirm('删除投屏服务器', '投屏设备将不再使用该投屏服务器')
                if (!ok) {
                    return
                }

                await CastProxyServerApi.delete([id])
                await this.$info('删除投屏服务器成功')
                this.refresh()
            } catch (error) {
                this.$error('删除投屏服务器失败')
            }
        },
        async deleteServers() {
            try {
                const ok = await this.$confirm('删除投屏服务器', '投屏设备将不再使用该投屏服务器')
                if (!ok) {
                    return
                }

                await CastProxyServerApi.delete(this.$refs.serverTable.getSelections().map(server => server.id))
                this.$info('删除投屏服务器成功')
                this.refresh()
            } catch (error) {
                this.$error('删除投屏服务器失败')
            }
        },
        refresh() {
            this.$store.dispatch('getProxyServers')
        }
    }
}
</script>
