<template>
  <div>
    <input type="file" name="file" />
  </div>
</template>

<script>
import 'bootstrap-fileinput/css/fileinput.min.css'
import 'bootstrap-fileinput/js/fileinput'

const opt = {
  initialPreviewAsData: true,
  initialPreviewShowDelete: true,
  maxFilePreviewSize: 500 * 1024, // 500MB
  showClose: true,
  overwriteInitial: true,
  uploadAsync: true,
  browseOnZoneClick: true,
  browseLabel: '',
  removeLabel: '',
  uploadLabel: '',
  autoReplace: true,
  enctype: 'multipart/form-data',
  showUploadedThumbs: false,
  autoOrientImage: false,
  previewFileIcon: '',
  previewTemplates: {
    video:
      '<div class="file-preview-frame video-frame" id="{previewId}" data-fileindex="{fileindex}" data-template="{template}" title="{caption}" ' +
      '>\n' +
      '   <div class="kv-file-content" width="100%" height="100%">' +
      '       <video class="kv-preview-data" width="100%" height="100%" controls>\n' +
      '           <source src="{data}" type="{type}/mp4">\n' +
      '<div class="file-preview-other">\n' +
      '   <span class="{previewFileIconClass}">{previewFileIcon}</span>\n' +
      '</div>' +
      '\n' +
      '       </video>\n' +
      '   </div>\n' +
      '   {footer}\n' +
      '</div>\n',
  },
  fileActionSettings: {
    showUpload: false,
    showRemove: false,
    showZoom: false,
    showDrag: false,
  },
  layoutTemplates: {
    footer: '',
  },
  slugCallback: function(filename) {
    return filename
      .replace('(', '_')
      .replace(']', '_')
      .replace(' ', '')
  },
}

export default {
  name: 'CoolFileInput',
  data() {
    return {
      $fileinput: {},
      supportedMediaTypes: [
        { fileType: 'image', ext: ['jpg', 'png'] },
        { fileType: 'video', ext: ['mp4', 'ts'] },
        { fileType: 'audio', ext: ['mp3'] },
        { fileType: 'object', ext: undefined },
      ],
      ext: [],
      fileSize: 0,
      fileLength: 0,
      realFileType: '',
    }
  },
  props: {
    opts: {
      type: Object,
      required: false,
    },
    fileType: String,
    extensions: {
      type: Array,
      required: false,
    },
    uploadUrl: {
      type: String,
      required: true,
    },
    value: String,
  },
  watch: {
    fileType() {
      let mt = this.supportedMediaTypes.find(
        (v) => v.fileType === this.fileType
      )
      this.ext = this.extensions ? this.extensions : mt.ext

      this.$fileinput.refresh({
        initialPreview: [this.value],
        initialPreviewFileType: this.fileType,
        initialCaption:
          '<abbr title="' + this.value + '">' + this.value + '</abbr>',
        previewFileType: this.fileType,
        uploadUrl: this.uploadUrl, //上传访问的url
        uploadExtraData: { type: this.fileType },
        allowedPreviewTypes: [this.fileType],
        allowedFileExtensions: this.ext,
      })
    },
    // value(_new) {
    //     // let mt = this.supportedMediaTypes.find(v => v.fileType === this.fileType);
    //     // this.ext = this.extensions ? this.extensions : mt.ext;

    //     this.$fileinput.refresh({
    //         initialPreview: [_new],
    //         initialPreviewFileType: this.fileType,
    //         initialCaption: '<abbr title="' + _new + '">' + _new + "</abbr>",
    //         previewFileType: this.fileType,
    //         uploadUrl: this.uploadUrl, //上传访问的url
    //         uploadExtraData: { type: this.fileType },
    //         allowedPreviewTypes: [this.fileType],
    //         allowedFileExtensions: this.ext
    //     });
    // }
  },
  methods: {
    clear() {
      this.$fileinput.clear()
    },
    initFileInput() {
      let fileinput = $(this.$el).find('[type=file]')

      this.$fileinput = fileinput
        .fileinput({
          maxFileCount: 1,
          initialPreview: [this.value],
          initialPreviewFileType: this.fileType,
          initialCaption:
            '<abbr title="' + this.value + '">' + this.value + '</abbr>',
          previewFileType: this.fileType,
          uploadUrl: this.uploadUrl, //上传访问的url
          uploadExtraData: { type: this.fileType, fileIdAttributeName: 'file' },
          allowedPreviewTypes: [this.fileType],
          allowedFileExtensions: this.ext,
          showUpload: false,
          ...opt,
          ...this.opts,
        })
        .on('filepreupload', (e, data, previewId, index) => {
          let media = $('.kv-preview-data', '#' + previewId)[0]
          if (this.fileType === 'audio' || this.fileType === 'video') {
            this.fileLength = media.duration
          } else {
            this.fileLength = 0
          }
        })
        .on('filebatchselected', function(event, files) {
          //选中图片后，直接上传
          // event.preventDefault();
          $(this).fileinput('upload')
        })
        .on('fileuploaded', (event, data, previewId, index) => {
          // 上传到服务器完成后的事件
          event.preventDefault()

          if (data.response.code === '0x0000') {
            this.fileSize = data.files[0].size

            this.$emit('input', data.response.data)

            this.$emit(
              'file-uploaded',
              data.response.data,
              this.fileSize,
              this.fileLength
            )
          }
        })
        .on('change', (e) => {
          e.preventDefault()

          this.$emit('input', '')
          this.$emit('file-cleared')
        })
        .on('filecleared', (e) => {
          e.preventDefault()

          this.$emit('input', '')
          this.$emit('file-cleared')
        })
        .data('fileinput')
    },
  },
  created() {
    let mt = this.supportedMediaTypes.find((v) => v.fileType === this.fileType)
    this.ext = this.extensions ? this.extensions : mt.ext
  },
  mounted() {
    this.$nextTick(function() {
      this.initFileInput()
    })
  },
  destroyed() {
    this.$fileinput.destroy()
  },
  destroyedCreated() {
    this.destroyed()
    this.created()
    this.mounted()
  },
}
</script>

<style scoped lang="scss">
/deep/.fileinput-remove-button {
  display: block;
}
</style>
