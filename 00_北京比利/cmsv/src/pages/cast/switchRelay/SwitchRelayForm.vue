<template>
    <vo v-slot="{ handleSubmit }">
        <form novalidate @submit.prevent="handleSubmit(submit)">
            <vp class="form-group" tag="div" v-slot="v">
                <label>连接串口</label>
                <input
                    class="form-control"
                    v-model="model.csrTty"
                    v-validate="v"
                    required
                    maxlength="45"
                />
            </vp>
            <vp class="form-group" tag="div" v-slot="v">
                <label>可控制路数（最多16路）</label>
                <input
                    type="number"
                    class="form-control"
                    v-model.number="relayCount"
                    v-validate="v"
                    required
                    min="1"
                    max="16"
                />
            </vp>
            <div class="form-row">
                <vp
                    v-for="(i, k) in relayCount"
                    :key="i"
                    class="form-group col-3"
                    v-slot="v"
                >
                    <label>第{{ i }}路设备</label>
                    <select
                        class="custom-select"
                        v-validate="v"
                        :value="deviceIds[k]"
                        @change="onchange(k, $event.target.value)"
                    >
                        <option :value="0">无设备</option>
                        <option
                            v-for="castDevice in deviceOptions"
                            :key="castDevice.id"
                            :value="castDevice.id"
                        >
                            {{ castDevice.mac }}
                        </option>
                    </select>
                </vp>
            </div>
            <button type="submit" class="btn btn-primary">确定</button>
            <button type="button" class="btn btn-secondary ml-1" @click="close">
                返回
            </button>
        </form>
    </vo>
</template>

<script>
import { CastSwitchRelayApi } from '@/api/CastApi';
export default {
    name: 'SwitchRelayForm',
    props: {
        value: Object,
    },
    data() {
        return {
            model: JSON.parse(JSON.stringify(this.value)),
            relayCount: 0,
            deviceIds: [],
        }
    },
    computed: {
        deviceOptions() {
            return this.$store.state.castDevices;
        }
    },
    watch: {
        relayCount(newVal, oldVal) {
            if (newVal > 16) {
                return
            }

            if (newVal < oldVal) {
                this.deviceIds = this.deviceIds.slice(0, newVal)
            } else {
                this.deviceIds.push(...(new Array(newVal - oldVal).fill(0)))
            }
        }
    },
    methods: {
        async submit() {
            this.model.csrRelayCount = this.relayCount

            if (this.model.csrId === 0) {
                // create
                this.model.devices = this.deviceIds.map((castDeviceId, i) => {
                    return {
                        csrdId: 0, csrId: 0, castDeviceId, csrdRelayNum: i
                    }
                })

                try {
                    await CastSwitchRelayApi.create(this.model)
                    await this.$info('添加成功')
                    this.$emit('change')
                    this.close()
                } catch (error) {
                    this.$error('添加失败')
                }
            } else {
                this.deviceIds.forEach((castDeviceId, i) => {
                    if (i < this.model.devices.length) {
                        this.model.devices[i].castDeviceId = castDeviceId
                    } else {
                        this.model.devices.push({
                            csrdId: 0, csrId: this.model.csrId, castDeviceId, csrdRelayNum: i
                        })
                    }
                })

                // update
                try {
                    await CastSwitchRelayApi.update(this.model)
                    await this.$info('修改成功')
                    this.$emit('change')
                    this.close()
                } catch (error) {
                    this.$error('修改失败')
                }
            }
        },
        close() {
            this.$emit('close')
        },
        onchange(idx, castDeviceId) {
            this.$set(this.deviceIds, idx, parseInt(castDeviceId))
        }
    },
    mounted() {
        this.relayCount = this.value.csrRelayCount
        this.deviceIds = this.value.devices.map(device => device.castDeviceId)
    }
}
</script>
