<template>
  <section id="textarea" v-html="value"></section>
</template>

<script>
import {
  通用上传请求单个多媒体数据,
  查询图片服务器地址,
} from "@/api/knowledge/knowledge.js";
export default {
  data() {
    return {
      imgurl: "",
    };
  },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  created() {
    查询图片服务器地址().then((res) => {
      this.imgurl = res.data.imageServerUri;
    });
  },
  methods: {
    hadleClick() {
      let res = tinymce.activeEditor.getContent();
      console.log(res, "结果");
    },
    cer() {
      tinymce.init({
        selector: "textarea#file-picker",
        plugins: "image code",
        toolbar: "undo redo | link image | code",
        /* enable title field in the Image dialog*/
        image_title: true,
        /* enable automatic uploads of images represented by blob or data URIs*/
        automatic_uploads: true,
        /*
    URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
    images_upload_url: 'postAcceptor.php',
    here we add custom filepicker only to Image dialog
  */
        file_picker_types: "image",
        /* and here's our custom image picker*/
        file_picker_callback: (cb, value, meta) => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");

          input.addEventListener("change", (e) => {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.addEventListener("load", () => {
              /*
          Note: Now we need to register the blob in TinyMCEs image blob
          registry. In the next release this part hopefully won't be
          necessary, as we are looking to handle it internally.
        */
              const id = "blobid" + new Date().getTime();
              const blobCache = tinymce.activeEditor.editorUpload.blobCache;
              const base64 = reader.result.split(",")[1];
              const blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);

              /* call the callback and populate the Title field with the file name */
              cb(blobInfo.blobUri(), { title: file.name });
            });
            reader.readAsDataURL(file);
          });

          input.click();
        },
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
      });
    },
  },

  mounted() {
    tinymce.init({
      selector: "#textarea",
      language: "zh-Hans",
      autosave_ask_before_unload: false, //刷新是否显示提醒
      paste_data_images: true, //判断是否可以复制图片
      file_picker_types: "image",
      file_picker_callback: (cb, value, meta) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");

        input.addEventListener("change", (e) => {
          const file = e.target.files[0];

          const reader = new FileReader();
          reader.addEventListener("load", async () => {
            /*
          Note: Now we need to register the blob in TinyMCEs image blob
          registry. In the next release this part hopefully won't be
          necessary, as we are looking to handle it internally.
        */
            let params = new FormData();
            params.append("file", file);
            params.append("fileType", 1);
            let res = await 通用上传请求单个多媒体数据(params);
            // console.log(res, "res");
            // this.$modal.msgSuccess("成功" + res);

            // const id = "blobid" + new Date().getTime();
            // const blobCache = tinymce.activeEditor.editorUpload.blobCache;
            // const base64 = reader.result.split(",")[1];
            // const blobInfo = blobCache.create(id, file, base64);
            // blobCache.add(blobInfo);

            /* call the callback and populate the Title field with the file name */
            // cb(blobInfo.blobUri(), { title: file.name });
            cb(this.imgurl + res.data.fileUrl, { title: res.data.fileName });
          });
          reader.readAsDataURL(file);
        });

        input.click();
      },
      content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",

      branding: false,
      toolbar:
        " print | save| preview  | link image | undo redo | formatselect | bold italic forecolor fontsizeselect | alignleft aligncenter alignright| bullist numlist lineheightselect | code fullscreen | removeformat | wordcount",

      plugins: "wordcount advlist autolink link image lists preview autosave",
      menu: {
        // file: { title: "File", items: "newdocument" },
        edit: {
          title: "Edit",
          items: "undo redo | cut copy paste pastetext | selectall",
        },
        insert: { title: "Insert", items: "link media | template hr" },
        view: { title: "View", items: "visualaid" },
        format: {
          title: "Format",
          items:
            "bold italic underline strikethrough superscript subscript | formats | removeformat",
        },
        table: {
          title: "Table",
          items: "inserttable tableprops deletetable | cell row column",
        },
        tools: { title: "Tools", items: "spellchecker code" },
      },
      templates: [
        {
          title: "some title1",
          description: "some desc 1",
          content: "my contetn",
        },
      ],
      //   setup: function (editor) {
      // editor.on("init", (e) => {
      //   console.log("init");
      //   editor.setContent(this.value);
      //   console.log(this, "this");
      //   this.$parent.editor = editor;
      //   this.$emit("changinti", editor);
      // });
      //   },
      //   init_instance_callback: (editor) => {
      //     editor.on("input", (e) => {
      //       console.log(1);
      //       this.$emit("input", e.target.innerHTML);
      //     });
      //     editor.on("change", (e) => {
      //       this.$emit("input", e.level.content);
      //     });
      //   },
      // zh-Hans
    });
    let ed = document.querySelector("#textarea");
    ed = tinymce.activeEditor;
    ed.on("input", () => {
      // console.log(ed.getContent());
      this.$emit("change", ed.getContent());
      //   console.log("lorme");
    });
  },
  destroyed() {
    tinymce.remove();
  },
};
</script>

<style lang="scss" scoped>
#textarea {
  width: 100%;
  height: 100%;
}
</style>