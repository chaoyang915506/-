<template>
  <uploader
    :options="options"
    @file-success="onFileSuccess"
    class="uploader-example"
    @file-error="onFileError"
    :file-status-text="statusText"
    ref="uploader"
  >
    <uploader-unsupport></uploader-unsupport>
    <uploader-drop>
      <p class="updae">点击上传视频</p>
      <uploader-btn accept="mp4">上传视频</uploader-btn>
      <uploader-btn
        ref="meref"
        :attrs="attrs"
        style="display: none"
      ></uploader-btn>
    </uploader-drop>
    <uploader-list></uploader-list>
    <button @click="backU" class="btn btn-outline-primary btn-sm mt-2">
      返回上一级
    </button>
  </uploader>
</template>

<script>
import env from '@/env'
import Axios from 'axios'
export default {
  data () {
    return {
      options: {
        target: env.taikang + '/taikang/backend/upload/chunk?token=' + env.token,
        autoStart: false,
        testChunks: false,//上传前判断块是否已经存在
        simultaneousUploads: 20, //并发数
        chunkSize: 8 * 1024 * 1024, //块大小,
        successStatuses: [200],
        categoryMap: 'mp4',
        maxChunkRetries: 3,//最大失败上传次数
        processParams: function (params) {
          return {
            number: params.chunkNumber,
            chunkSize: params.chunkSize,
            currentSize: params.currentChunkSize,
            totalSize: params.totalSize,
            filename: params.filename,
            identifier: params.identifier,
            totalChunk: params.totalChunks,
          }
        }
      },
      attrs: {
        accept: 'video/*'
      },
      statusText: {
        success: '上传成功',
        error: '出错了',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      },
      // panelShow: false,   //选择文件后，展示上传panel
      // collapse: false,
    }
  },
  methods: {
    onFileSuccess (rootFile, file, message, chunk) {
      let url = this.mergeV + '?filename=' + file.name + '&identifier=' + file.uniqueIdentifier + '&token=' + env.token

      Axios.get(url).catch(error => {
        console.log(error)
      })
    },
    //返回上一级防止wu
    backU () {
      this.$confirm('确定返回到上一级').then((ok) => {
        if (ok) {
          this.$emit('close')
        }
      })
    },
    // clickupdate () {
    //   // console.log(54)
    //   this.$refs.meref.click()
    //   this.$nextTick(() => {

    //   })
    // },
    onFileError (rootFile, file, msg, chunk) {
      // console.log(chunk, 'chunk')
      if (chunk.xhr.status == 401) {
        // this.statusText.error = '重复上传'
        this.$error('文件格式错误')
      } else if (chunk.xhr.status == 402) {
        this.$error('文件已存在')
      } else {

      }
      // console.log(rootFile)
    }
    // computeMD5 (file) {
    //   console.log(file, 'file')
    // }

  },
  mounted () {
    this.$nextTick(() => {
      window.uploader = this.$refs.uploader.uploader
    })
  },
  computed: {
    mergeV () {
      return env.taikang + '/taikang/backend/upload/merge/medium'
    }
  },
}
</script>


<style lang="scss">
.uploader-example {
  width: 100%;
  height: 100%;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
.uploader-example .uploader-btn {
  margin-right: 4px;
}
.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
.updae {
  font-size: 18px;
  font-weight: 700;
}
</style>
