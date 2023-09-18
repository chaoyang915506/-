<template>
  <div>
    <el-row> {{ title }} </el-row>
    <div class="pic">
      <el-row>
        <el-col :span="6">竖版</el-col>
        <el-col :span="16">
          <el-upload
            :data="{
              type: 'image',
              fileIdAttributeName: 'file',
              file_id: '1',
            }"
            class="upload-demo"
            :action="url"
            list-type="picture"
            :file-list="flist1"
            :on-success="verticaluploadsuccess"
            :on-remove="verremove"
            :on-preview="previews"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">横板</el-col>
        <el-col :span="16">
          <el-upload
            :data="{
              type: 'image',
              fileIdAttributeName: 'file',
              file_id: '1',
            }"
            class="upload-demo"
            :action="url"
            list-type="picture"
            :file-list="flist2"
            :on-success="uploadsuccess"
            :on-remove="horremove"
            :on-preview="previews"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import Upload from "@/api/UploadApi";

export default {
  name: "Card",
  props: {
    fs: Object,
  },
  data() {
    return {
      flist1: [],
      flist2: [],
      url: "",
      title: "",
    };
  },
  methods: {
    previews(val) {
      window.open(val.url);
    },
    buildflist1() {
      if (this.fs.verPic === "") {
        this.flist1 = [];
      } else {
        this.flist1 = [{ name: "竖版", url: this.fs.verPic }];
      }
    },
    buildflist2() {
      if (this.fs.horPic === "") {
        this.flist2 = [];
      } else {
        this.flist2 = [{ name: "横版", url: this.fs.horPic }];
      }
    },
    verticaluploadsuccess(res, file, fileList) {
      // console.log(res);
      this.fs.verPic = res.data;
      this.flist1 = [{ name: "竖版", url: res.data }];
    },
    uploadsuccess(res, file, fileList) {
      this.fs.horPic = res.data;
      this.flist2 = [{ name: "横版", url: res.data }];
    },
    verremove(val) {
      // console.log(val);
      this.fs.verPic = "";
    },
    horremove(val) {
      // console.log(val);
      this.fs.horPic = "";
    },
  },
  mounted() {
    this.url = Upload.getUrl("image");
    // this.url = "http://localhost:3003/upload";

    if (this.fs.langId === 0) {
      this.title = "中文";
    } else {
      this.title = "英文";
    }

    // console.log(this.fs);
    this.buildflist1();
    this.buildflist2();
  },
};
</script>
<style scoped>
.pic {
  padding: 20px;
  background-color: #ebeef5;
  margin-top: 20px;
}
.pic .el-row {
  margin-top: 20px;
}
</style>
