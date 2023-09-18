<template>
    <Transfer
        :data="transferData"
        :filterable="true"
        :titles="['待选择', '已选择']"
        filter-placeholder="请输入房间号"
        :value="value"
        @change="onchange"
    ></Transfer>
</template>

<script>
import { Transfer } from 'element-ui'
import { mapState } from 'vuex'

export default {
    name: 'SetProxyRoom',
    components: { Transfer },
    props: {
        value: Array,
    },
    data() {
        return {
            start: 0,
        }
    },
    computed: {
        ...mapState({
            proxyServers: 'proxyServers'
        }),
        rooms() {
            return this.$store.state.rooms.filter(room => {
                if (this.value.indexOf(room.roomId) >= 0) {
                    // keep this.value
                    return true
                }

                for (let i = 0; i < this.proxyServers.length; i++) {
                    const proxyServer = this.proxyServers[i]

                    for (let j = 0; j < proxyServer.rooms.length; j++) {
                        if (proxyServer.rooms[j] === room.roomId) {
                            return false
                        }
                    }
                }

                return true
            })
        },
        transferData() {
            return this.rooms.map(room => {
                return {
                    key: room.roomId, label: room.roomNumber, disabled: false
                }
            })
        }
    },
    methods: {
        onchange(value, direction, movedKeys) {
            this.$emit('input', value)
        }
    }
}
</script>
