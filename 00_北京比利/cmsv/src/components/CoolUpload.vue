<template>
    <div class="cool-upload">
        <el-upload
            ref="elUpload"
            :accept="accept"
            :action="mustHasTokenAction"
            :multiple="true"
            name="file"
            :on-preview="onPreview"
            :on-remove="onRemove"
            :on-error="onError"
            :on-progress="onProgress"
            :on-success="onSuccess"
            :on-exceed="onExceed"
            :on-change="onChange"
            :before-upload="beforeUpload"
            :before-remove="beforeRemove"
            :with-credentials="true"
            :auto-upload="autoUpload"
            :show-file-list="false"
            :file-list="files"
            :http-request="doPost"
        >
            <slot name="trigger"></slot>
            <div slot="tip" class="zone">
                <div v-for="(file, i) in files" :key="i">
                    <div class="progress" style="position: relative;">
                        <div
                            class="bg-success progress-bar progress-bar-striped progress-bar-animated active progress-bar-success"
                            :style="{width: file.percentage + '%'}"
                        >
                            <div class="file-name">{{ file.name }}</div>
                            <!-- <div class="percentage">{{ file.percentage.toFixed(0) + '%' }}</div> -->
                        </div>
                        <div class="close" @click="remove(i)">x</div>
                    </div>
                </div>
            </div>
        </el-upload>
    </div>
</template>

<script>

function getError(action, option, xhr) {
    let msg;
    if (xhr.response) {
        msg = `${xhr.response.error || xhr.response}`;
    } else if (xhr.responseText) {
        msg = `${xhr.responseText}`;
    } else {
        msg = `fail to post ${action} ${xhr.status}`;
    }

    const err = new Error(msg);
    err.status = xhr.status;
    err.method = 'post';
    err.url = action;
    return err;
}

function getBody(xhr) {
    const text = xhr.responseText || xhr.response;
    if (!text) {
        return text;
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

let curType = '';

function upload(option) {
    if (typeof XMLHttpRequest === 'undefined') {
        return;
    }

    const xhr = new XMLHttpRequest();
    const action = option.action;

    if (xhr.upload) {
        xhr.upload.onprogress = function progress(e) {
            if (e.total > 0) {
                e.percent = e.loaded / e.total * 100;
            }
            option.onProgress(e);
        };
    }

    const formData = new FormData();

    if (option.data) {
        Object.keys(option.data).forEach(key => {
            formData.append(key, option.data[key]);
        });
    }

    // 手动添加一个type参数，覆盖组件传过来的type
    formData.set('type', curType);

    formData.append(option.filename, option.file, option.file.name);

    xhr.onerror = function error(e) {
        option.onError(e);
    };

    xhr.onload = function onload() {
        if (xhr.status < 200 || xhr.status >= 300) {
            return option.onError(getError(action, option, xhr));
        }

        const result = getBody(xhr);
        if (result.code !== '0x0000') {
            const err = new Error(`post ${action} err: code = ${result.code}, msg = ${result.msg}`);
            err.status = 200;
            err.method = 'post';
            err.url = action;

            return option.onError(err);
        }

        option.onSuccess(getBody(xhr));
    };

    xhr.open('post', action, true);

    if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true;
    }

    const headers = option.headers || {};

    for (let item in headers) {
        if (headers.hasOwnProperty(item) && headers[item] !== null) {
            xhr.setRequestHeader(item, headers[item]);
        }
    }
    xhr.send(formData);
    return xhr;
}

const types = {
    image: [".png", ".jpg"],
    video: [".mp4", ".ts"],
    audio: [".mp3"],
    ppt: [".ppt", ".pptx"]
};

export default {
    name: 'CoolUpload',
    data() {
        return {
            types: types,
            files: [],
            doPost: upload,
            fileUidTypeMap: {},
            isUploading: false,
        };
    },
    props: {
        type: {
            type: String, required: true, default: 'image'
        },
        action: {
            type: String, required: true
        },
        data: {
            type: Object, required: false,
        },
        autoUpload: {
            type: Boolean, default: true, required: false
        },
        limit: {
            type: Number, required: false, validator: value => value >= 1
        },
    },
    computed: {
        accept() {
            return this.type.split(",").flatMap(t => this.types[t]).join(",")
        },
        mustHasTokenAction() {
            const url = new URL(this.action)
            url.searchParams.set('token', sessionStorage.getItem('token'));
            return url.toString()
        }
    },
    methods: {
        onPreview(file) {
        },
        onProgress(ev, file, fileList) {
        },
        onSuccess(response, file, fileList) {
            if (this.fileUidTypeMap[file.uid].type === 'video') {
                const video = document.createElement("video");
                video.src = file.response.data;
                video.onloadeddata = ev => {
                    this.fileUidTypeMap[file.uid].duration = video.duration;

                    this.isUploading = false;
                };
                video.load();
                video.remove();
            } else if (this.fileUidTypeMap[file.uid].type === 'audio') {
                const audio = document.createElement('audio');
                audio.src = file.response.data;
                audio.onloadeddata = ev => {
                    this.fileUidTypeMap[file.uid].duration = audio.duration;

                    this.isUploading = false;
                }

                audio.load();
                audio.remove();
            } else {
                this.isUploading = false;
            }
        },
        onError(err, file, fileList) {
            this.isUploading = false;
        },
        onChange(file, fileList) {
            this.files = fileList;
        },
        beforeUpload(file) {
            this.isUploading = true;

            const a = file.name.lastIndexOf('.')
            const ext = file.name.substr(a)

            for (let k in this.types) {
                const i = this.types[k].indexOf(ext)
                if (i != -1) {
                    curType = k;
                    if (curType !== 'image' && curType !== 'video' && curType !== 'audio') {
                        curType = 'static'
                    }

                    this.fileUidTypeMap[file.uid] = {
                        type: k, duration: 0
                    };
                    break
                }
            }
        },
        beforeRemove(file, fileList) {
        },
        onExceed(files, fileList) {
        },
        onRemove(file, fileList) {
        },
        remove(_idx) {
            this.files.splice(_idx, 1)
        },
        getFiles() {
            if (this.isUploading) {
                return [];
            }

            return this.files.map(file => {
                return {
                    type: this.fileUidTypeMap[file.uid].type,
                    name: file.name.substr(0, file.name.lastIndexOf('.')),
                    url: file.response.data,
                    size: file.size,
                    duration: this.fileUidTypeMap[file.uid].duration,
                };
            });
        }
    }
}
</script>

<style scoped>
.cool-upload >>> input[type="file"] {
    display: none;
}

.cool-upload .zone {
    border: 1px solid #dedede;
    border-radius: 3px;
    height: 282px;
    padding: 2px;
    overflow-y: auto;
}

.cool-upload .progress {
    height: 50px;
    margin-bottom: 5px;
}

.cool-upload .progress-bar {
    line-height: 50px;
}

.cool-upload .file-name {
    position: absolute;
    left: 10px;
    color: #fff;
}

.cool-upload .percentage {
    color: #fff;
}

.cool-upload .close {
    position: absolute;
    right: 5px;
    color: red;
    text-align: center;
    line-height: 46px;
    font-size: 16px;
    opacity: 0.8;
}
</style>