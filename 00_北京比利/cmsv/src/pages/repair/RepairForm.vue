<template>
    <form :class="{ 'was-validated': validated }" onsubmit="return false">
        <div class="form-row">
            <div class="form-group col-6">
                <label>报修类型：</label>
                <select
                    class="form-control"
                    name="repairType"
                    v-model="model.repairType"
                    required
                    data-bv-message=" "
                >
                    <option :value="1">客房维修</option>
                    <option :value="2">工程报修</option>
                </select>
            </div>
            <div class="form-group col-6">
                <label>对接系统编码：</label>
                <input
                    name="repairExternalCode"
                    class="form-control"
                    v-model="model.repairExternalCode"
                    data-bv-message=" "
                />
            </div>
        </div>
        <div class="form-row">
            <fieldset lang="0" class="col-6">
                <div class="form-group">
                    <label>报修名称：</label>
                    <input
                        name="repairLangName0"
                        class="form-control"
                        v-model="model.repairLangs[0].repairLangName"
                        required
                        data-bv-message=" "
                    />
                </div>
                <div class="form-group">
                    <label>报修描述：</label>
                    <textarea
                        name="repairLangDesc0"
                        class="form-control"
                        v-model="model.repairLangs[0].repairLangDesc"
                        data-bv-message=" "
                    />
                </div>
            </fieldset>
            <fieldset lang="1" class="col-6">
                <div class="form-group">
                    <label>Name:</label>
                    <input
                        name="repairLangName1"
                        class="form-control"
                        v-model="model.repairLangs[1].repairLangName"
                        required
                        data-bv-message=" "
                    />
                </div>
                <div class="form-group">
                    <label>Decription:</label>
                    <textarea
                        name="repairLangDesc1"
                        class="form-control"
                        v-model="model.repairLangs[1].repairLangDesc"
                        data-bv-message=" "
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
import RepairApi, { Repair } from '@/api/RepairApi'
import CoolValidator from '@/components/mixin/CoolValidator.vue'

export default {
    name: 'RepairForm',
    mixins: [CoolValidator],
    data() {
        return {
            model: JSON.parse(JSON.stringify(this.value))
        }
    },
    props: {
        value: {
            type: Object, default: () => new Repair
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
        submit() {
            this.validated = true
            this.$bv.validate()
            if (!this.$bv.isValid()) {
                return
            }

            if (this.model.repairId === 0) {
                // create
                RepairApi.create(this.model).then(() => {
                    return this.$info('新增成功')
                }).then(() => {
                    this.$emit('change')
                    this.close()
                }).catch(err => this.$error(err))
            } else {
                // update
                RepairApi.update(this.model).then(() => {
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