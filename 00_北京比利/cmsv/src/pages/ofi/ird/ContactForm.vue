<template>
    <form :class="{ 'was-validated': validated }" onsubmit="return false">
        <div class="form-group">
            <label>名称：</label>
            <input
                name="name"
                class="form-control"
                v-model="model.name"
                required
                maxlength="8"
                data-bv-message=" "
            />
            <div class="invalid-feedback">请填写名称</div>
        </div>
        <div class="form-group">
            <label>联系方式：</label>
            <input
                name="phone"
                class="form-control"
                v-model="model.phone"
                required
                maxlength="11"
                pattern="^1[3|4|5|6|7|8|9]\d{9}$"
                data-bv-message=" "
            />
            <div class="invalid-feedback">请填写正确的手机号</div>
        </div>
        <div class="form-group float-right mt-1">
            <button type="submit" class="btn btn-primary mr-1" @click="submit">
                确定
            </button>
            <div class="btn btn-secondary" @click="close">关闭</div>
        </div>
    </form>
</template>

<script>
import { mapState } from 'vuex'
import CoolValidator from '@/components/mixin/CoolValidator.vue'
import OfiApi from '../OfiApi'

export default {
    name: 'ContactForm',
    mixins: [CoolValidator],
    data() {
        return {
            validated: false,
            model: JSON.parse(JSON.stringify(this.contact))
        }
    },
    props: {
        contact: Object,
    },
    methods: {
        submit() {
            this.validated = true

            this.$bv.validate()
            if (!this.$bv.isValid()) {
                return false;
            }

            if (this.model.id) {
                OfiApi.updateContact(this.model).then(data => {
                    this.close()
                    return this.$info('修改成功')
                }).then(() => {
                    this.$emit('submit')
                    return Promise.resolve()
                }).catch(err => this.$error(err))
            } else {
                OfiApi.createContact(this.model).then(data => {
                    this.close();
                    return this.$info('添加成功')
                }).then(() => {
                    this.$emit('submit');
                    return Promise.resolve()
                }).catch(err => this.$error(err));
            }
            return false;
        },
        close() {
            this.$emit('close');
        }
    }
}
</script>

<style>
</style>