<template>
    <el-upload
        ref="elUpload"
        :accept="accept"
        :action="action"
        :limit="1"
        name="file"
        :show-file-list="showFileList"
        :data="{fileIdAttributeName: 'file'}"
        :on-progress="onProgress"
        :on-success="success"
        :on-exceed="exceed"
        :on-remove="handleRemove"
    >
        <el-col v-if="value !== ''" :span="10" style="text-align: left; height: 178px; margin-bottom: 5px;">
            <img v-if="type === 'image'" :src="value" />
            <video v-else-if="type === 'video'" :src="value" controls />
        </el-col>
        <el-input :value="value">
            <el-button slot="append" type="primary" :icon="value === '' ? 'el-icon-folder' : 'el-icon-delete'" @click="click" />
        </el-input>
    </el-upload>
</template>

<script>
import UploadApi from "@/api/UploadApi";

export default {
    name: "MyUpload",
    data() {
        return {
            showFileList: false,
            types: {
                image: ["image/png", "image/jpeg"],
                video: ["video/mp4", "video/ts"]
            }
        };
    },
    props: {
        type: {
            type: String,
            default: "image"
        },
        value: String
    },
    computed: {
        accept() {
            return this.type
                .split(",")
                .flatMap(t => this.types[t])
                .join(",");
        },
        action() {
            return UploadApi.getUrl(this.type);
        }
    },
    methods: {
        onProgress(ev, file, fileList) {
            this.showFileList = true;
        },
        success(response, file, fileList) {
            this.showFileList = false;

            this.$emit("input", response.data);
        },
        exceed(files, fileList) {
            console.log(files, fileList);
        },
        handleRemove(file, fileList) {},
        click(_ev) {
            if (this.value !== "") {
                _ev.stopPropagation();
                this.$refs.elUpload.clearFiles();
                this.$emit("input", "");
            }
        }
    },
    beforeDestroy() {
        this.$emit("input", "");
    }
};
</script>

<style scoped>
img,
video {
    height: 100%;
}
</style>