<template>
    <form onsubmit="return false">
        <h3>洗衣分类</h3>
        <div class="form-row">
            <fieldset class="col-6" lang="0">
                <div class="form-group">
                    <label>分类名称：</label>
                    <input
                        v-model="model.classes[0].name"
                        class="form-control"
                        required
                    />
                </div>
                <div class="form-group">
                    <label>分类描述：</label>
                    <textarea
                        v-model="model.classes[0].desc"
                        class="form-control"
                    />
                </div>
            </fieldset>
            <fieldset class="col-6" lang="1">
                <div class="form-group">
                    <label>Class Name:</label>
                    <input
                        v-model="model.classes[1].name"
                        class="form-control"
                        required
                    />
                </div>
                <div class="form-group">
                    <label>Class Description:</label>
                    <textarea
                        v-model="model.classes[1].desc"
                        class="form-control"
                    />
                </div>
            </fieldset>
        </div>
        <button type="submit" class="btn btn-primary" @click="submit">
            确定</button
        >&nbsp;
        <button class="btn btn-secondary" @click="close">返回</button>
    </form>
</template>

<script>
import { LaundryClassApi, LaundryClassBody } from '@/api/LaundryApi'

export default {
    name: 'LaundryClassForm',
    data() {
        return {
            model: JSON.parse(JSON.stringify(this.value)),
        }
    },
    props: {
        value: {
            type: Object, default: () => new LaundryClassBody,
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
        submit() {
            if (this.model.id <= 0) {
                LaundryClassApi.create(this.model).then(() => {
                    return this.$info('新增成功')
                }).then(() => {
                    this.$emit('change')
                    this.close()
                }).catch(err => this.$error(err))
            } else {
                LaundryClassApi.update(this.model).then(() => {
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
