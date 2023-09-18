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
          <el-col :span="12">
            <el-form-item label="中文名称" prop="zhName">
              <el-input
                v-model="formData.zhName"
                placeholder="请输入中文名称"
                show-word-limit
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传" prop="imagePath">
              <el-upload
                ref="imagePath"
                :file-list="imagePathfileList"
                :limit="imgLimit"
                :action="imagePathAction"
                :auto-upload="false"
                :on-change="imageChange"
                list-type="picture"
              >
                <el-button size="small" type="primary" icon="el-icon-upload"
                  >点击上传</el-button
                >
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文名称" prop="enName">
              <el-input
                v-model="formData.enName"
                placeholder="请输入英文名称"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Twitter ID" prop="ttUserId">
              <el-input
                v-model="formData.ttUserId"
                placeholder="请输入Twitter ID"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-input
                v-model="formData.gender"
                placeholder="请输入性别"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属机构" prop="orgId">
              <el-select
                v-model="formData.orgId"
                placeholder="请选择所属机构"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in orgIdOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Facebook ID" prop="fbUserId">
              <el-input
                v-model="formData.fbUserId"
                placeholder="请输入Facebook ID"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="母港" prop="harborId">
              <el-select
                v-model="formData.harborId"
                placeholder="请选择母港"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in harborIdOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任职舷号" prop="sideNum">
              <el-input
                v-model="formData.sideNum"
                placeholder="请输入任职舷号"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="zw">
              <el-input
                v-model="formData.zw"
                placeholder="请输入职位"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="nl">
              <el-input
                v-model="formData.nl"
                placeholder="请输入年龄"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="large">
              <el-button
                v-if="humanShowState === 'add'"
                type="primary"
                @click="submitForm"
                >新增提交</el-button
              >
              <el-button
                v-if="humanShowState === 'update'"
                type="primary"
                @click="updateForm"
                >修改提交</el-button
              >
              <el-button
                v-if="humanShowState === 'update'"
                type="danger"
                @click="deleteForm"
                >删除此人</el-button
              >
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  组织人员增加,
  组织人员修改,
  多媒体数据上传,
  人员删除,
} from "@/api/corpus/human.js";
import { 查询图片服务器地址 } from "@/api/situation/situation";
export default {
  components: {},
  props: {
    humanInfo: Object,
    humanShowState: String,
    imageServerUri: String,
  },
  watch: {
    humanShowState: {
      deep: true,
      // immediate: true,
      handler(val) {
        if (val === "add") {
          this.resetForm();
          this.imagePathfileList = [];
        }
      },
    },
    humanInfo: {
      deep: true,
      // immediate: true,
      handler(val) {
        this.formData = val;
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
  data() {
    return {
      imgLimit: 1,
      userId: "",
      imgFormData: null,
      formData: {
        zhName: "",
        imagePath: null,
        enName: undefined,
        ttUserId: undefined,
        gender: undefined,
        orgId: undefined,
        fbUserId: undefined,
        harborId: undefined,
        sideNum: undefined,
        zw: undefined,
        nl: undefined,
      },
      imagePathAction: process.env.VUE_APP_BASE_API + "/common/upload/media",
      imagePathfileList: [],
      orgIdOptions: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
      harborIdOptions: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
    };
  },
  async created() {},
  methods: {
    addRow() {},
    handleClick() {},
    imageChange(file, fileList) {
      console.log(file, fileList);
      //   let tarIndex = fileList.findIndex((item) => (item.name = file.name));
      //   fileList.splice(tarIndex, 1);
    },
    async submitForm() {
      // console.log(this.$refs.imagePath.uploadFiles[0].raw);
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
      let res = await 组织人员增加(this.formData);
      if (res.code === 200) {
        this.$message.success(`添加成功`);
        this.userId = res.data;
        this.$emit("addHumanSuc", this.userId);
      }
      console.log(res);
    },
    async updateForm() {
      // console.log(this.$refs.imagePath);
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
      let res = await 组织人员修改(this.formData);
      if (res.code === 200) {
        this.$message.success(`修改成功`);
        console.log(res);
      }
      console.log(res);
    },
    async deleteForm() {
      let res = await 人员删除(this.formData.orgUserId);
      if (res.code === 200) {
        this.$message.success(`删除成功`);
        this.$emit("delHumanSuc");
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
</style>
