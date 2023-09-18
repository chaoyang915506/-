<template>
  <div class="app-container">
    <div>
      <el-row :gutter="15">
        <el-form
          ref="elForm"
          :model="formData"
          size="medium"
          label-width="100px"
        >
          <el-form-item label="组织机构名称" prop="orgName">
            <el-input
              v-model="formData.orgName"
              show-word-limit
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>

          <el-form-item label="父级机构" prop="parentOrgId">
            <el-select
              v-model="formData.parentOrgId"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in fatherList"
                :key="index"
                :label="item.orgName"
                :value="item.orgId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="图片" prop="imagePath">
            <el-upload
              ref="imagePath"
              :file-list="imagePathfileList"
              :action="imagePathAction"
              :limit="imgLimit"
              :auto-upload="false"
              list-type="picture"
            >
              <el-button size="small" type="primary" icon="el-icon-upload"
                >点击上传</el-button
              >
            </el-upload>
          </el-form-item>

          <el-form-item label="国家地区" prop="area">
            <el-input
              v-model="formData.area"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="级别" prop="level">
            <el-input
              v-model="formData.level"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="总部" prop="hq">
            <el-input
              v-model="formData.hq"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="职能" prop="zn">
            <el-input
              v-model="formData.zn"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="简介" prop="intro">
            <el-input
              v-model="formData.intro"
              rows="4"
              type="textarea"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>

          <el-form-item label="地址" prop="address">
            <el-input
              v-model="formData.address"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>

          <el-col :span="24">
            <el-form-item size="large">
              <el-button
                v-if="orgShowState === 'add'"
                type="primary"
                @click="submitForm"
                >新增提交</el-button
              >
              <el-button
                v-if="orgShowState === 'update'"
                type="primary"
                @click="updateForm"
                >修改提交</el-button
              >
              <el-button
                v-if="orgShowState === 'update'"
                type="danger"
                @click="deleteForm"
                >删除</el-button
              >
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import { 多媒体数据上传 } from "@/api/corpus/human.js";
import { 组织机构增加, 组织机构修改, 组织机构删除 } from "@/api/corpus/org";
export default {
  components: {},
  props: {
    currentOrgObj: Object,
    orgShowState: String,
    orgList: Array,
    imageServerUri: String,
  },
  watch: {
    orgShowState: {
      deep: true,
      // immediate: true,
      handler(val) {
        if (val === "add") {
          this.resetForm();
          this.imagePathfileList = [];
        }
      },
    },
    currentOrgObj: {
      deep: true,
      immediate: true,
      handler(val) {
        // debugger
        this.formData = val;
        if (this.formData.parentOrgId)
          this.formData.parentOrgId = Number(this.formData.parentOrgId);
        if (val.imagePath) {
          if (this.imagePathfileList.length === 0) {
            this.imagePathfileList.push({
              name: val.imagePath,
              url: this.imageServerUri + val.imagePath,
            });
          }
          if (
            this.imagePathfileList.length > 0 &&
            this.imagePathfileList[0].name !== val.imagePath
          ) {
            this.imagePathfileList = [];
            this.imagePathfileList.push({
              name: val.imagePath,
              url: this.imageServerUri + val.imagePath,
            });
          }
        }
      },
    },
  },
  computed: {
    fatherList: function () {
      let reg = new RegExp("中队");
      return this.orgList.filter((item) => !reg.test(item.orgName));
    },
    // 机构层级返回父级层级+1
    orgClass: function () {
      if (this.formData.parentOrgId) {
        let tar = this.orgList.find(
          (item) => item.orgId === this.formData.parentOrgId
        );
        return tar.orgClass + 1;
      } else {
        return undefined;
      }
    },
  },
  data() {
    return {
      imgLimit: 1,
      userId: "",
      imgFormData: null,
      formData: {
        address: "",
        ancestors: "",
        area: "",
        code: "",
        hq: "",
        imagePath: "",
        intro: "",
        level: "",
        orderNum: "",
        orgClass: 0,
        orgName: "",
        parentOrgId: "",
        zn: "",
      },
      imagePathAction: "https://jsonplaceholder.typicode.com/posts/",
      imagePathfileList: [],
    };
  },
  async created() {},
  methods: {
    async submitForm() {
      if (this.$refs.imagePath.uploadFiles[0]) {
        this.imgFormData = new FormData();
        this.imgFormData.append(
          "file",
          this.$refs.imagePath.uploadFiles[0].raw
        );
        this.imgFormData.append("fileType", 1);
        let imgRes = await 多媒体数据上传(this.imgFormData);
        if (imgRes.code === 200) {
          this.formData.imagePath = imgRes.data.fileUrl;
          console.log(`图片上传成功`);
        }
      }
      this.formData.orgClass = this.orgClass;
      let res = await 组织机构增加(this.formData);
      if (res.code === 200) {
        this.$message.success(`添加成功`);
        this.$emit("orgReset");
      }
      console.log(res);
    },
    async updateForm() {
      if (
        this.$refs.imagePath.uploadFiles[0] &&
        this.$refs.imagePath.uploadFiles[0].raw
      ) {
        this.imgFormData = new FormData();
        this.imgFormData.append(
          "file",
          this.$refs.imagePath.uploadFiles[0].raw
        );
        this.imgFormData.append("fileType", 1);
        let imgRes = await 多媒体数据上传(this.imgFormData);
        if (imgRes.code === 200) {
          this.formData.imagePath = imgRes.data.fileUrl;
          console.log(`图片上传成功`);
        }
      }
      this.formData.orgClass = this.orgClass;
      let res = await 组织机构修改(this.formData);
      if (res.code === 200) {
        this.$message.success(`修改成功`);
        console.log(res);
      }
      console.log(res);
    },
    async deleteForm() {
      let res = await 组织机构删除(this.formData.orgId);
      if (res.code === 200) {
        this.$message.success(`删除成功`);
        this.$emit("orgReset");
      }
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    submitUpload() {
      this.$refs["imagePath"].submit();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-upload__tip {
  line-height: 1.2;
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
.xiaobiao {
  color: #fff;
  font-size: 16px;
}
</style>
