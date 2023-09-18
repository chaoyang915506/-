<template>
    <div>
        <div class="row">
            <div class="col-12">
                <cool-table
                    ref="relayTable"
                    :data="relays"
                    :columns="columns"
                    @update-row="updateRelay"
                    @del-row="deleteRelay"
                >
                    <button class="btn btn-primary" @click="createRelay">
                        添加
                    </button>
                    <button class="btn btn-danger ml-1" @click="deleteRelays">
                        删除
                    </button>
                </cool-table>
            </div>
        </div>
        <cool-modal
            :visible="visible"
            :footer="{ visible: false }"
            @hidden="visible = false"
        >
            <switch-relay-form
                v-if="visible"
                :value="relayModel"
                @change="refresh"
                @close="visible = false"
            />
        </cool-modal>
    </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import CoolModal from "@/components/CoolModal.vue";
import { mapState } from 'vuex'
import SwitchRelayForm from './SwitchRelayForm.vue'
import { SwitchRelay } from "./SwitchRelay";
import { CastSwitchRelayApi } from '@/api/CastApi';

export default {
    name: 'SwitchRelayApp',
    components: { CoolModal, CoolTable, SwitchRelayForm },
    data() {
        return {
            columns: [{
                checkbox: true
                // }, {
                //     field: 'csrType', title: '类型',
                //     formatter: (val, row, idx) => '串口'
            }, {
                field: 'csrTty', title: '连接串口'
            }, {
                field: 'csrRelayCount', title: '可控制路数'
            }, {
                field: 'csrId', title: '操作',
                formatter: (val, row, idx) => {
                    return `<button class='btn btn-primary btn-sm' data-val=${val} data-emit=update-row>修改</button>
                        <button class='btn btn-danger btn-sm' data-val=${val} data-emit=del-row>删除</button>`
                }
            }],
            visible: false,
            relayModel: new SwitchRelay(),
        }
    },
    computed: {
        ...mapState(['relays'])
    },
    methods: {
        createRelay() {
            this.relayModel = new SwitchRelay()

            this.visible = true
        },
        updateRelay(csrId) {
            this.relayModel = this.relays.find(relay => relay.csrId === csrId)

            this.visible = true
        },
        async deleteRelay(id) {
            try {
                const ok = await this.$confirm('删除')
                if (!ok) {
                    return
                }

                await CastSwitchRelayApi.delete([id])
                await this.$info('删除成功')
                this.refresh()
            } catch (error) {
                this.$error('删除失败')
            }
        },
        async deleteRelays() {
            try {
                const ok = await this.$confirm('删除')
                if (!ok) {
                    return
                }

                await CastSwitchRelayApi.delete(this.$refs.relayTable.getSelections().map(row => row.csrId))
                await this.$info('删除成功')
                this.refresh()
            } catch (error) {
                this.$error('删除失败')
            }
        },
        refresh() {
            this.$store.dispatch('getRelays')
        }
    }
}
</script>
