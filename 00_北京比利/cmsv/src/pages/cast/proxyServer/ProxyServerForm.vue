<template>
    <vo v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submit)">
            <vp class="form-group" tag="div" v-slot="v">
                <label>名称</label>
                <input
                    class="form-control"
                    v-model="model.name"
                    v-validate="v"
                    required
                    maxlength="32"
                />
            </vp>
            <vp class="form-group" tag="div" v-slot="v">
                <label>IPTV LAN IP</label>
                <input
                    class="form-control"
                    v-model="model.ipInIptvLan"
                    v-validate="v"
                    required
                    pattern="((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}"
                />
            </vp>
            <vp class="form-group" tag="div" v-slot="v">
                <label>Guest LAN IP</label>
                <input
                    class="form-control"
                    v-model="model.ipInGuestLan"
                    v-validate="v"
                    required
                    pattern="((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}"
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
import { CastProxyServerApi } from '@/api/CastApi'
import env from '@/env'

export default {
    name: 'ProxyServerForm',
    props: {
        value: Object,
    },
    data() {
        return {
            model: JSON.parse(JSON.stringify(this.value))
        }
    },
    methods: {
        async submit() {
            this.model.hotelId = env.hotelId

            if (this.model.id < 1) {
                // create
                try {
                    await CastProxyServerApi.create(this.model)
                    await this.$info('添加投屏服务器成功')
                    this.$emit('change')
                    this.close()
                } catch (error) {
                    this.$error('添加投屏服务器失败')
                }
            } else {
                // update
                try {
                    await CastProxyServerApi.update(this.model)
                    await this.$info('修改投屏服务器成功')
                    this.$emit('change')
                    this.close()
                } catch (error) {
                    this.$error('修改投屏服务器失败')
                }
            }
        },
        close() {
            this.$emit('close')
        }
    }
}
</script>
