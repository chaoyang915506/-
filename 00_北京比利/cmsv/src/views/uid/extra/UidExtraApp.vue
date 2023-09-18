<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <h2>UID配置项</h2>
            </div>
            <div class="col-10" style="padding: 20px;">
                <form @submit.prevent="submit">
                    <div class="form-row form-group align-items-center">
                        <label class="col-form-label col-auto">选择UID</label>
                        <div class="col-auto">
                            <select class="form-control" v-model="uidIdx">
                                <option v-for="(u, i) in uids" :key="u.id" :value="i">{{ u.uid + ' - ' + u.name }}</option>
                            </select>
                        </div>
                    </div>
                    <div v-for="spec in specs" :key="spec.id" class="form-group form-row align-items-center">
                        <label class="col-form-label col-auto">名称</label>
                        <div class="col-auto">
                            <input class="form-control" disabled :value="spec.name" />
                        </div>
                        <label class="col-form-label col-auto">键</label>
                        <div class="col-auto col-2">
                            <input class="form-control" disabled :value="spec.key" />
                        </div>
                        <label class="col-form-label col-auto">值类型</label>
                        <div class="col-auto col-1">
                            <select class="form-control" disabled :value="spec.valueType">
                                <option value="text">文本</option>
                                <option value="number">数值</option>
                                <option value="color">颜色</option>
                            </select>
                        </div>
                        <label class="col-form-label col-auto">默认值</label>
                        <div class="col-auto col-2">
                            <input :type="spec.valueType" disabled class="form-control" :value="spec.defValue" />
                        </div>
                        <label class="col-auto col-form-label">设定</label>
                        <div class="col-auto col-2">
                            <input
                                :type="spec.valueType"
                                required
                                class="form-control"
                                step="0.01"
                                v-model="spec.value"
                                @input="$forceUpdate()"
                            />
                        </div>
                        <div class="btn btn-warning" @click="spec.value = spec.defValue;$forceUpdate()">重置</div>
                    </div>
                    <button type="submit" class="btn btn-primary">确定</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import common from '@/common'
import { UidExtraApi } from '@/api/UidApi'
import { mapMutations, mapState } from 'vuex'
import { UidExtra } from '../Uid'
import env from '@/env'

export default {
    name: 'UidExtraApp',
    data() {
        return {
            uidIdx: 0,
        }
    },
    computed: {
        ...mapState({
            uids: state => state.uids.sort((a, b) => a.id - b.id), extras: state => state.extras,
        }),
        uid() {
            return this.uids[this.uidIdx];
        },
        specs() {
            if (!this.uid) {
                return []
            }

            return this.uid.specs.map(spec => {
                const extra = this.extras.find(extra => extra.specId === spec.id);
                spec.value = extra ? extra.value : spec.defValue;
                spec.extraId = extra ? extra.id : 0;
                return spec;
            });
        },
    },
    methods: {
        ...mapMutations({
            setExtras: 'setExtras',
        }),
        refreshExtras() {
            UidExtraApi.list()
                .then(data => this.setExtras(data.list))
                .catch(err => common.error(err))
        },
        submit() {
            const extras = this.specs
                .filter(spec => spec.defValue !== spec.value)
                .map(spec => {
                    return {
                        id: spec.extraId, hotelId: env.hotelId, specId: spec.id, value: spec.value,
                    }
                });

            UidExtraApi.updateAll(extras)
                .then(data => {
                    common.info('更新成功', () => this.refreshExtras());
                })
                .catch(err => common.error(err))
        }
    },
    created() {
        this.refreshExtras();
    },
}
</script>

<style>
</style>