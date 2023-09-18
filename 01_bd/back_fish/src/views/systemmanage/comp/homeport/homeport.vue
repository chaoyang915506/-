<template>
  <div class="app-container">
    <div class="formContainner">
      <el-form :model="homeportList" size="medium" label-width="100px">
        <el-form-item label="英文名称" prop="harborName">
          <el-input
            v-model="homeportList.harborName"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="中文名称" prop="harborNameZh">
          <el-input
            v-model="homeportList.harborNameZh"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="基本信息" prop="basicInfo">
          <el-input
            v-model="homeportList.basicInfo"
            rows="4"
            type="textarea"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imagePath">
          <el-upload
            :data="urlData"
            :headers="token"
            :file-list="homeportList.imagePathfileList"
            :action="imagePathAction"
            :auto-upload="true"
            :limit="imgLimit"
            :on-remove="(file, fileList) => imageRemove(file, fileList)"
            :on-success="
              (response, file, fileList) =>
                imageSuccess(response, file, fileList)
            "
            list-type="picture"
          >
            <el-button size="small" type="primary" icon="el-icon-upload"
              >点击上传</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="homeportList.address"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="经度" prop="lat">
          <el-input
            v-model="homeportList.lat"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="lon">
          <el-input
            v-model="homeportList.lon"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="homeportList.remark"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <el-button
      v-if="harborShowState === 'add'"
      type="primary"
      @click="submitForm"
      >新增提交</el-button
    >
    <el-button
      v-if="harborShowState === 'update'"
      type="primary"
      @click="updateForm"
      >修改提交</el-button
    >
    <el-button
      v-if="harborShowState === 'update'"
      type="danger"
      @click="deleteForm"
      >删除母港</el-button
    >
  </div>
</template>

<script>
import { 母港增加, 母港修改, 母港删除 } from "@/api/corpus/homeport.js";
import { resolve } from "path";
import { getToken } from "@/utils/auth";
export default {
  components: {},
  props: {
    barborObj: Object,
    harborShowState: String,
    imageServerUri: String,
  },
  watch: {
    barborObj: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log("母港数据", val);
        this.homeportList = val;
      },
    },
    harborShowState: {
      deep: true,
      // immediate: true,
      handler(val) {
        if (val === "add") {
          this.homeportList = {
            address: "",
            basicInfo: "",
            harborName: "",
            harborNameZh: "",
            imagePath: "",
            lat: 0,
            lon: 0,
            remark: "",
            imagePathfileList: [],
          };
        }
      },
    },
  },
  data() {
    return {
      imgLimit: 1,
      token: { Authorization: getToken() },
      urlData: {
        fileType: "1",
      },
      imagePathAction: process.env.VUE_APP_BASE_API + "/common/upload/media",
      homeportList: {
        address: "",
        basicInfo: "",
        harborName: "",
        harborNameZh: "",
        imagePath: "",
        lat: 0,
        lon: 0,
        remark: "",
        imagePathfileList: [],
      },
    };
  },
  created() {},
  methods: {
    imageSuccess(response, file, fileList) {
      this.homeportList.imagePath = response.data.fileUrl;
      console.log(response, file, fileList, index);
    },
    imageRemove(file, fileList) {
      this.homeportList.imagePath = null;
      this.homeportList.imagePathfileList = [];
    },
    async submitForm() {
      let res = await 母港增加(this.homeportList);
      if (res.code === 200) {
        this.$message.success(`母港增加成功`);
      }
    },
    async updateForm() {
      // 母港ID
      let res = await 母港修改(this.homeportList);
      if (res.code === 200) {
        this.$message.success(`母港修改成功`);
      }
    },
    async deleteForm() {
      let res = await 母港删除(this.homeportList.harborId);
      if (res.code === 200) {
        this.$message.success(`母港删除成功`);
        this.$emit("harborReset");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  width: 80%;
  margin: 0 auto;
}
.el-form-item {
  width: 60%;
}
.formContainner {
  width: 100%;
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid saddlebrown;
}
.el-form {
  width: 100%;
}
.iconContainner {
  display: flex;
}

.iconZi {
  font-size: 30px;
  color: #fff;
  cursor: pointer;
}
::v-deep .el-form-item__label {
  color: #fff;
}
::v-deep .el-input__inner {
  background-color: transparent;
  color: #fff;
}
::v-deep .el-textarea__inner {
  background-color: transparent;
  color: #fff;
}
</style>
