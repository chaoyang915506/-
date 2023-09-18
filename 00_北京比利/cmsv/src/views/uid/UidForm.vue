<template>
    <form @submit.prevent="submit">
        <fieldset :disabled="this.formData.id !== 0">
            <!-- <div class="form-row">
                <div class="form-group form-check col">
                    <input type="checkbox" class="form-control-input mr-1" />
                    <label class="form-check-label">客户端自用</label>
                </div>
            </div>-->
            <div class="form-row">
                <div class="form-group col">
                    <label>
                        基础栏目类型
                        <a href="http://confluence.mycool.tv/pages/viewpage.action?pageId=2326547" target="_blank">
                            <i class="glyphicon glyphicon-new-window text-info"></i>
                        </a>
                    </label>
                    <select class="form-control" required v-model="formData.baseType" @change="onBaseTypeChange">
                        <option v-for="type in itemTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                </div>
                <div class="form-group col">
                    <label>UI配置类型</label>
                    <input type="number" id="checkOnChange" @change="uiConfigTypeChange(minConfigType)" class="form-control" required v-model="formData.configType" />
                </div>
                <div class="form-group col">
                    <label>UID</label>
                    <input class="form-control" required minlength="1" maxlength="10" v-model="formData.uid" />
                </div>
            </div>
        </fieldset>
        <div class="form-row">
            <div class="form-group col-4">
                <label>名称</label>
                <input class="form-control" required maxlength="45" v-model="formData.name" />
            </div>
            <div class="form-group col">
                <label>URI</label>
                <input class="form-control" maxlength="1024" v-model="formData.uri" />
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col">
                <label>备注</label>
                <textarea class="form-control" maxlength="512" v-model="formData.desc"></textarea>
            </div>
        </div>
        <div class="form-group">
            <button type="button" class="btn btn-info" @click="addSpec">添加UI配置</button>&nbsp;
            <button type="button" class="btn btn-warning" @click="restoreSpecs">重置UI配置</button>
        </div>
        <div style="max-height: 324px; overflow: hidden auto;">
            <div v-for="(spec, i) in formData.specs" :key="i" class="form-group form-row align-items-center">
                <label class="col-form-label col-auto">名称</label>
                <div class="col-auto">
                    <input class="form-control" required v-model="spec.name" />
                </div>
                <label class="col-form-label col-auto">键</label>
                <div class="col-auto col-2">
                    <input class="form-control" required pattern="^[a-zA-Z].*" title="字母开头" maxlength="32" v-model="spec.key" />
                </div>
                <label class="col-form-label col-auto">值类型</label>
                <div class="col-auto col-1">
                    <select class="form-control" required v-model="spec.valueType">
                        <option value="text">文本</option>
                        <option value="number">数值</option>
                        <option value="color">颜色</option>
                    </select>
                </div>
                <label class="col-form-label col-auto">默认值</label>
                <div class="col-auto col-2">
                    <input :type="spec.valueType" required class="form-control" step="0.01" v-model="spec.defValue" />
                </div>
                <button type="button" class="btn btn-danger" @click="removeSpec(i)">
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
            </div>
        </div>
        <button type="submit" class="btn btn-success">确定</button>&nbsp;
        <button type="button" class="btn btn-secondary" @click="close">取消</button>
    </form>
</template>

<script>
import { mapState } from 'vuex'
import { UidApi } from '@/api/UidApi'
import { UidExtraSpec } from './Uid'
import common from '@/common'

export default {
    name: 'UidForm',
    data() {
        return {
            formData: JSON.parse(JSON.stringify(this.value)),
            minConfigType: 0,
        }
    },
    props: {
        value: Object,
    },
    computed: {
        ...mapState({
            itemBasics: state => state.itemBasics, uids: state => state.uids,
        }),
        itemTypes() {
            let set = new Set();

            this.itemBasics.forEach(basic => set.add(basic.type));

            return set;
        },
    },
    methods: {
        onBaseTypeChange() {
            this.minConfigType = this.formData.configType = this.uids.filter(uid => uid.baseType === this.formData.baseType)
                .map(uid => uid.configType)
                .reduce((a, b) => a > b ? a : b, -1) + 1;
        },
        addSpec() {
            this.formData.specs.push(new UidExtraSpec());
        },
        restoreSpecs() {
            this.formData.specs = JSON.parse(JSON.stringify(this.value.specs));
        },
        removeSpec(_idx) {
            this.formData.specs.splice(_idx, 1);
        },
        uiConfigTypeChange(num) {
            if(num == this.formData.configType){
                $('#checkOnChange').addClass('is-invalid')
            } else {
                $('#checkOnChange').removeClass('is-invalid')
            }
        },
        submit() {
            if (this.formData.id !== 0) {
                // update
                UidApi.update(this.formData).then(data => {
                    common.info('更新成功', () => {
                        this.$emit('change');

                        this.close();
                    })
                }).catch(err => common.error(err))
            } else {
                // create
                UidApi.create(this.formData).then(data => {
                    common.info('新建成功', () => {
                        this.$emit('change');

                        this.close();
                    });
                }).catch(err => common.error(err));
            }

            return false;
        },
        close() {
            this.$emit('close');
        }
    },
}
</script>

<style scoped>
</style>>