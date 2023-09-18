<template>
  <div>
    <el-upload
      action="http://localhost:3003/upload"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :before-upload="bbb"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <div>
      <form method="post" action="http://localhost:3003/upload" enctype="multipart/form-data">
        <input type="file" name="pic" />
        <input type="submit" />
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    bbb(file) {
      console.log(file);
      let j = {
        file: file,
        id: 1,
      };
      console.log(j);
    },
  },
};
</script>

<style scoped>

</style>
