<template>
    <form :class="{ 'was-validated': validated }" onsubmit="return false">
        <h3>洗衣服务项</h3>
        <div class="form-row">
            <div class="form-group col-6">
                <label>所属分类：</label>
                <select
                    name="classId"
                    class="form-control"
                    v-model="model.classId"
                    required
                    data-bv-message=" "
                >
                    <option :value="0">未分类</option>
                    <option v-for="c in classes" :key="c.id" :value="c.id">
                        {{ c.classes[0].name + " / " + c.classes[1].name }}
                    </option>
                </select>
            </div>
            <div class="form-group col-6">
                <label>单价（分）：</label>
                <input
                    v-model="model.price"
                    name="price"
                    type="number"
                    class="form-control"
                    min="1"
                    required
                    data-bv-message=" "
                    data-bv-greaterThan-message=" "
                />
            </div>
            <fieldset class="col-6" lang="0">
                <div class="form-group">
                    <label>名称：</label>
                    <input
                        v-model="model.laundries[0].name"
                        name="name0"
                        class="form-control"
                        required
                        data-bv-message=" "
                    />
                </div>
                <div class="form-group">
                    <label>描述：</label>
                    <textarea
                        v-model="model.laundries[0].desc"
                        name="desc0"
                        class="form-control"
                    />
                </div>
            </fieldset>
            <fieldset class="col-6" lang="1">
                <div class="form-group">
                    <label>Name:</label>
                    <input
                        v-model="model.laundries[1].name"
                        name="name1"
                        class="form-control"
                        required
                        data-bv-message=" "
                    />
                </div>
                <div class="form-group">
                    <label>Description:</label>
                    <textarea
                        v-model="model.laundries[1].desc"
                        name="desc1"
                        class="form-control"
                    />
                </div>
            </fieldset>
        </div>
        <button class="btn btn-primary" @click="submit">确定</button>&nbsp;
        <button class="btn btn-secondary" @click="close">返回</button>
    </form>
</template>

<script>
import { LaundryApi } from '@/api/LaundryApi'
import CoolValidator from '@/components/mixin/CoolValidator.vue'
import { mapState } from 'vuex'

export default {
    name: 'LaundryForm',
    mixins: [CoolValidator],
    data() {
        return {
            model: JSON.parse(JSON.stringify(this.value))
        }
    },
    props: {
        value: Object,
    },
    computed: {
        ...mapState({
            classes: s => s.classes,
        }),
    },
    methods: {
        close() {
            this.$emit('close')
        },
        submit() {
            this.validated = true
            this.$bv.validate()
            if (!this.$bv.isValid()) {
                return;
            }

            if (this.model.id <= 0) {
                LaundryApi.create(this.model).then(() => {
                    return this.$info('新增成功')
                }).then(() => {
                    this.$emit('change');
                    this.close();
                }).catch(err => this.$error(err))
            } else {
                LaundryApi.update(this.model).then(() => {
                    return this.$info('更新成功')
                }).then(() => {
                    this.$emit('change')
                    this.close()
                }).catch(err => this.$error(err))
            }
        }
    }
}
</script>

<style scoped lang="scss">
</style>