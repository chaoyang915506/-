<template>
    <vo v-slot="{ handleSubmit }">
        <form novalidate @submit.prevent="handleSubmit(submit)">
            <div class="form-row">
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>名称</label>
                    <input
                        class="form-control"
                        v-model="model.grpName"
                        v-validate="v"
                        required
                        maxlength="64"
                    />
                </vp>
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>英文名称</label>
                    <input
                        class="form-control"
                        v-model="model.grpEnName"
                        v-validate="v"
                        maxlength="64"
                    />
                </vp>
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>类型</label>
                    <select
                        class="custom-select"
                        v-model="model.grpType"
                        v-validate="v"
                        required
                    >
                        <option value="0">酒店集团</option>
                        <option value="1">业主集团</option>
                    </select>
                </vp>
            </div>
            <div class="form-row">
                <vp tag="div" v-slot="v" class="form-group col-6">
                    <label>描述</label>
                    <textarea
                        class="form-control"
                        v-model="model.grpDesc"
                        v-validate="v"
                        maxlength="256"
                    ></textarea>
                </vp>
            </div>
            <div class="form-row">
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>联系人</label>
                    <input
                        class="form-control"
                        v-model="model.grpContactor"
                        v-validate="v"
                        required
                        maxlength="32"
                    />
                </vp>
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>联系电话</label>
                    <input
                        class="form-control"
                        v-model="model.grpPhone"
                        v-validate="v"
                        required
                        maxlength="20"
                    />
                </vp>
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>联系地址</label>
                    <input
                        class="form-control"
                        v-model="model.grpAddr"
                        v-validate="v"
                        required
                        maxlength="128"
                    />
                </vp>
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>联系邮箱</label>
                    <input
                        type="email"
                        class="form-control"
                        v-model="model.grpEmail"
                        v-validate="v"
                        required
                        maxlength="64"
                    />
                </vp>
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>传真号</label>
                    <input
                        class="form-control"
                        v-model="model.grpFax"
                        v-validate="v"
                        maxlength="20"
                    />
                </vp>
            </div>
            <div class="form-row">
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>备用联系人</label>
                    <input
                        class="form-control"
                        v-model="model.grpBakContactor"
                        v-validate="v"
                        maxlength="32"
                    />
                </vp>
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>备用联系电话</label>
                    <input
                        class="form-control"
                        v-model="model.grpBakPhone"
                        v-validate="v"
                        maxlength="20"
                    />
                </vp>
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>备用联系地址</label>
                    <input
                        class="form-control"
                        v-model="model.grpBakAddr"
                        v-validate="v"
                        maxlength="128"
                    />
                </vp>
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>备用联系邮箱</label>
                    <input
                        type="email"
                        class="form-control"
                        v-model="model.grpBakEmail"
                        v-validate="v"
                        maxlength="64"
                    />
                </vp>
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>备用传真号</label>
                    <input
                        class="form-control"
                        v-model="model.grpBakFax"
                        v-validate="v"
                        maxlength="20"
                    />
                </vp>
            </div>
            <div class="form-row">
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>合作开始时间</label>
                    <input
                        type="date"
                        class="form-control"
                        v-model="startDate"
                        v-validate="v"
                        required
                    />
                </vp>
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>合作结束时间</label>
                    <input
                        type="date"
                        class="form-control"
                        v-model="endDate"
                        v-validate="v"
                    />
                </vp>
                <vp tag="div" v-slot="v" class="form-group col-2">
                    <label>合作状态</label>
                    <select
                        class="custom-select"
                        v-model="model.grpStatus"
                        v-validate="v"
                    >
                        <option value="0">正常</option>
                        <option value="1">注销</option>
                    </select>
                </vp>
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary">确定</button>
                <button class="btn btn-secondary ml-1" @click="close">
                    取消
                </button>
            </div>
        </form>
    </vo>
</template>

<script>
import HotelGroupApi from '@/api/HotelGroupApi'

export default {
    name: 'HotelGroupForm',
    props: {
        value: Object,
    },
    data() {
        return {
            model: JSON.parse(JSON.stringify(this.value)),
            startDate: new Date(this.value.grpStartTime).format('yyyy-MM-dd'),
            endDate: this.value.grpEndTime ? new Date(this.value.grpEndTime).format('yyyy-MM-dd') : this.value.grpEndTime,
        }
    },
    methods: {
        async submit() {
            this.model.grpStartTime = new Date(this.startDate).getTime()
            this.model.grpEndTime = this.endDate ? new Date(this.endDate).getTime() : this.endDate

            if (this.model.grpId === 0) {
                // create
                try {
                    await HotelGroupApi.create(this.model)
                    await this.$info('新增成功')

                    this.$emit('change')
                    this.close()
                } catch (error) {
                    console.error(error)

                    this.$error('新增失败')
                }
            } else {
                // update
                try {
                    await HotelGroupApi.update(this.model)
                    await this.$info('修改成功')
                    this.$emit('change')
                    this.close()
                } catch (error) {
                    console.error(error)

                    this.$error('修改失败')
                }
            }
        },
        close() {
            this.$emit('close')
        }
    }
}
</script>
