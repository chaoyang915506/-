<template>
    <vo v-slot="{ handleSubmit }">
        <form novalidate @submit.prevent="handleSubmit(submit)">
            <vp class="form-group" v-slot="v">
                <label>ID：</label>
                <input
                    name="ID"
                    class="form-control"
                    type="number"
                    v-model="model.itemBasicId"
                    v-validate="v"
                    required
                    min="1"
                />
                <div class="invalid-feedback">
                    {{ v.errors[0] }}
                </div>
            </vp>
            <vp class="form-group" v-slot="v">
                <label>类型：</label>
                <input
                    name="type"
                    class="form-control"
                    type="number"
                    v-validate="v"
                    v-model="model.type"
                    required
                    min="1"
                />
                <div class="invalid-feedback">
                    {{ v.errors[0] }}
                </div>
            </vp>
            <vp class="form-group" v-slot="v">
                <label>标题：</label>
                <input
                    v-validate="v"
                    v-model="model.itemBasicDesc"
                    name="itemBasicDesc"
                    class="form-control"
                    required
                    minlength="1"
                />
                <div class="invalid-feedback">
                    {{ v.errors[0] }}
                </div>
            </vp>
            <vp class="form-group" tag="div" v-slot="v">
                <label>状态：</label>
                <select
                    v-validate="v"
                    v-model="model.isEnable"
                    class="custom-select"
                    required
                    aria-invalid="0"
                >
                    <option :value="1">激活</option>
                    <option :value="0">未激活</option>
                </select>
            </vp>
            <button type="submit" class="btn btn-primary mr-1">确定</button>
            <button type="button" class="btn btn-light" @click="close">
                返回
            </button>
        </form>
    </vo>
</template>

<script>
import ItemBasicApi from '@/api/ItemBasicApi'

export default {
    name: 'EditItem',
    data() {
        return {
            model: JSON.parse(JSON.stringify(this.value)),
        };
    },
    props: {
        value: Object,
        method: String,
    },
    methods: {
        async submit() {
            if (this.method == "add") {
                // create
                ItemBasicApi.create(this.model).then(() => {
                    this.$info('添加成功')
                    this.close()
                    this.$emit('change')
                }).catch(err => {
                    console.error(err)

                    this.$error('添加失败')
                })
            } else {
                // update
                ItemBasicApi.update(this.model).then(() => {
                    this.$info('修改成功')
                    this.close()
                    this.$emit('change')
                }).catch(err => {
                    console.error(err)

                    this.$error('修改失败')
                })
            }
        },
        close() {
            this.$emit('close');
        }
    }
}
</script>
