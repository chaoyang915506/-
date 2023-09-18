<template>
  <div class="items">
    <h4>*{{ item.langDesc }}</h4>
    <el-row>
      <el-col :span="6">名称</el-col>
      <el-col :span="16">
        <el-input v-model="item.name"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">描述</el-col>
      <el-col :span="16">
        <el-input v-model="item.desc" type="textarea" :rows="3"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">海外九宫格图标</el-col>
      <el-col :span="16">
        <el-upload
          :data="{
            type: 'image',
            fileIdAttributeName: 'file',
            file_id: '1',
          }"
          :on-success="uploadsuccess"
          :on-error="uploaderror"
          :action="uploadurl"
          :file-list="iconlist"
          list-type="picture"
          :on-preview="previews"
        >
          <el-button>点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            *PNG、JPG/JPEG格式，384 <b>X</b> 344，不超过100kb
          </div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">背景海报</el-col>
      <el-col :span="16">
        <el-upload
          :data="{
            type: 'image',
            fileIdAttributeName: 'file',
            file_id: '1',
          }"
          :on-success="uploadsuccess2"
          :on-error="uploaderror"
          :action="uploadurl"
          :file-list="posterlist"
          list-type="picture"
          :on-preview="previews"
        >
          <el-button>点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            *PNG、JPG/JPGE格式，1920 <b>X</b> 1080，不超过500kb
          </div>
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UploadApi from "@/api/UploadApi";

export default {
  name: "StyleCard",
  props: {
    item: Object,
  },
  data() {
    return {
      uploadurl: "",
      iconlist: [],
      posterlist: [],
    };
  },
  methods: {
    previews(val) {
      window.open(val.url);
    },
    makeiconfiles(item) {
      if (item.icon === "" || item.icon === null) return [];
      // this.obj.push(item)
      return [{ name: "图标", url: item.icon }];
    },
    makeposterfiles(item) {
      if (item.poster === "" || item.poster === null) return [];
      //   item.poster = "https://www.baidu.com/img/flexible/logo/pc/result.png";
      return [{ name: "海报", url: item.poster }];
    },
    uploadsuccess(res, file, flist) {
      console.log(res);
      //   this.props.item.icon = res.data;
      this.item.icon = res.data;
      this.iconlist = this.makeiconfiles(this.item);
    },
    uploadsuccess2(res, file, flist) {
      console.log(res);
      //   this.props.item.icon = res.data;
      this.item.poster = res.data;
      this.posterlist = this.makeposterfiles(this.item);
    },
    uploaderror(err, file, flist) {
      console.log(err);
    },
  },

  mounted() {
    this.uploadurl = UploadApi.getUrl("image");

    this.iconlist = this.makeiconfiles(this.item);
    this.posterlist = this.makeposterfiles(this.item);
  },
};
</script>

<style scoped>
.items {
  width: 500px;
  height: 600px;
  background-color: #ffffff;
  margin-left: 20px;
  padding-left: 20px;
  padding-bottom: 40px;
}
.el-row {
  margin-top: 20px;
}
::v-deep .el-upload {
  text-align: left !important;
}
</style>
