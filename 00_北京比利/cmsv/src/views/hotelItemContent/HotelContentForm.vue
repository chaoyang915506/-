<template>
    <form @submit.prevent="submit">
        <div class="form-row">
            <div class="form-group col">
                <label>选择类型：</label>
                <select class="form-control" v-model="fileType">
                    <option value="image">图片</option>
                    <option value="object">PPT</option>
                </select>
            </div>
            <div class="form-group col">
                <label>选择语言：</label>
                <select class="form-control" v-model="formData.langId">
                    <option v-for="lang in langList" :key="lang.langId" :value="lang.langId">{{ lang.label }}</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label>内容名称：</label>
            <input name="miName" class="form-control" required maxlength="64" minlength="1" v-model="formData.miName" />
        </div>
        <div class="form-group">
            <label>选择文件：</label>
            <input name="miImage" class="invisible" v-model="formData.miImage" />
            <cool-file-input
                required
                :key="fileType"
                :fileType="fileType"
                :uploadUrl="uploadUrl"
                :extensions="fileType === 'object' ? ['ppt', 'pptx'] : undefined"
                v-model="formData.miImage"
                @file-uploaded="onFileUploaded"
            />
            <small v-show="submitted && formData.miImage === ''" class="form-text text-danger">需要上传文件</small>
        </div>
        <button type="submit" class="btn btn-outline-primary mr-1">确定</button>
        <button type="button" class="btn btn-outline-secondary" @click="close">取消</button>
    </form>
</template>

<script>
import CoolFileInput from '@/components/CoolFileInput.vue'
import UploadApi from '@/api/UploadApi'
import HotelContentApi from '@/api/HotelContentApi'
import { mapState } from 'vuex'

export default {
    name: 'HotelContentForm',
    components: { CoolFileInput },
    data() {
        return {
            fileType: 'image',
            submitted: false,
            formData: JSON.parse(JSON.stringify(this.value))
        }
    },
    props: {
        value: Object,
        items: Array,
    },
    computed: {
        ...mapState({
            langList: state => state.langList,
        }),
        itemId() {
            return this.items.find(item => item.langId === this.formData.langId).itemId;
        },
        uploadUrl() {
            return UploadApi.getUrl(this.fileType);
        }
    },
    methods: {
        submit() {
            this.submitted = true;

            if (this.formData.miImage === '') {
                return false;
            }

            this.formData.itemId = this.itemId;

            HotelContentApi.create(this.formData.itemId, this.formData)
                .then(data => {
                    return this.$info('添加成功');
                })
                .then(() => {

                    this.$emit('change');

                    this.close()
                })
                .catch(err => this.$error(err))
        },
        onFileUploaded(file) {
            this.formData.miImage = file;
        },
        close() {
            this.$emit('close');
        }
    }
}
</script>