<template>
    <vo v-slot="{ handleSubmit }">
        <form novalidate @submit.prevent="handleSubmit(submit)">
            <vp class="form-group" tag="div" v-slot="v">
                <label>所在位置</label>
                <select
                    class="custom-select"
                    v-model="model.location"
                    v-validate="v"
                    required
                >
                    <option :value="0">设备池</option>
                    <option :value="1">房间内</option>
                </select>
            </vp>
            <fieldset v-if="model.location === 1">
                <vp class="form-group" tag="div" v-slot="v" rules="min_value:0">
                    <label>房间号</label>
                    <select
                        class="form-control"
                        v-model="model.roomId"
                        v-validate="v"
                        required
                    >
                        <option :value="0" disabled>请选择</option>
                        <option
                            v-for="room in rooms"
                            :key="room.roomId"
                            :value="room.roomId"
                        >
                            {{ room.roomNumber }}
                        </option>
                    </select>
                </vp>
                <vp class="form-group" tag="div" v-slot="v">
                    <label>房间内位置</label>
                    <input
                        class="form-control"
                        v-model="model.devLocation"
                        v-validate="v"
                        required
                    />
                </vp>
            </fieldset>
            <vp class="form-group" tag="div" v-slot="v">
                <label>设备类型</label>
                <select
                    class="custom-select"
                    v-model="model.type"
                    v-validate="v"
                    required
                >
                    <option :value="0">Apple TV</option>
                    <option :value="1">Chromecast</option>
                    <option :value="2">TV Guo</option>
                </select>
            </vp>
            <vp class="form-group" tag="div" v-slot="v">
                <label>设备IP</label>
                <input
                    class="form-control"
                    v-model="model.ip"
                    v-validate="v"
                    required
                    :pattern="pattern.IP"
                />
            </vp>
            <vp class="form-group" tag="div" v-slot="v">
                <label>设备MAC</label>
                <input
                    class="form-control"
                    v-model="model.mac"
                    v-validate="v"
                    required
                    maxlength="17"
                    :pattern="pattern.MAC"
                />
            </vp>

            <vp class="form-group" tag="div" v-slot="v">
                <label>输出流地址</label>
                <input
                    class="form-control"
                    v-model="model.castAddr"
                    v-validate="v"
                    :pattern="pattern.IP"
                />
            </vp>
            <button type="submit" class="btn btn-primary">确定</button>
            <button type="button" class="btn btn-secondary ml-1" @click="close">
                返回
            </button>
        </form>
    </vo>
</template>

<script>
import CastApi from '@/api/CastApi'
import env from '@/env'
import { mapState } from 'vuex'
import { Pattern } from '@/validation'

export default {
    name: 'CastDeviceForm',
    props: {
        value: Object,
    },
    data() {
        return {
            model: JSON.parse(JSON.stringify(this.value)),
            pattern: Pattern,
        }
    },
    computed: {
        ...mapState(['rooms']),
    },
    methods: {
        async submit() {
            this.model.hotelId = env.hotelId

            if (this.model.id < 1) {
                // create
                try {
                    await CastApi.create(this.model)
                    await this.$info('添加投屏设备成功')
                    this.$emit('change')
                    this.close()
                } catch (error) {
                    this.$error('添加投屏设备失败')
                }
            } else {
                // update
                try {
                    await CastApi.update(this.model)
                    await this.$info('修改投屏设备成功')
                    this.$emit('change')
                    this.close()
                } catch (error) {
                    this.$error('修改投屏设备成功')
                }
            }
        },
        close() {
            this.$emit('close')
        }
    }
}
</script>
