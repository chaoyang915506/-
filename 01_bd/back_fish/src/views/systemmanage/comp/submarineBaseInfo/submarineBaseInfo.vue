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
          <span class="xiaobiao">基础信息：</span>
          <el-col :span="12">
            <el-form-item label="舰艇名称" prop="smName">
              <el-input
                v-model="formData.smName"
                show-word-limit
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="船徽" prop="smImagePath">
              <el-upload
                ref="smImagePath"
                :file-list="imagePathfileList"
                :action="imagePathAction"
                :limit="imgLimit"
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
            <el-form-item label="舰艇弦号" prop="sideNum">
              <el-input
                v-model="formData.sideNum"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="级别、批次" prop="jbpc">
              <el-select
                v-model="formData.jbpc"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in jibieList"
                  :key="index"
                  :label="item.dictLabel"
                  :value="item.dictLabel"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入役时间" prop="rysj">
              <el-input
                v-model="formData.rysj"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="smStatus">
              <el-input
                v-model="formData.smStatus"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建造方" prop="jzf">
              <el-input
                v-model="formData.jzf"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="母港" prop="harborId">
              <el-select
                v-model="formData.harborId"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in harborList"
                  :key="index"
                  :label="item.harborNameZh"
                  :value="item.harborId"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织机构" prop="zdId">
              <el-select
                v-model="formData.zdId"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in middleList"
                  :key="index"
                  :label="item.orgName"
                  :value="item.orgId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="兵力部势" prop="blbs">
              <el-select
                v-model="formData.blbs"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in blbsList"
                  :key="index"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <div class="br"></div>
          <span class="xiaobiao">舰艇参数:</span>
          <el-col :span="12">
            <el-form-item label="排水量" prop="psl">
              <el-input
                v-model="formData.psl"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="潜航排水" prop="qhps">
              <el-input
                v-model="formData.qhps"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="艇长" prop="tz">
              <el-input
                v-model="formData.tz"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="动力系统" prop="dlxt">
              <el-input
                v-model="formData.dlxt"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="潜深" prop="qs">
              <el-input
                v-model="formData.qs"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="武器装备" prop="wqzb">
              <el-input
                v-model="formData.wqzb"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="浮航排水" prop="fhps">
              <el-input
                v-model="formData.fhps"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="吃水深度" prop="cssd">
              <el-input
                v-model="formData.cssd"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="艇宽" prop="tk">
              <el-input
                v-model="formData.tk"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航速" prop="sh">
              <el-input
                v-model="formData.sh"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编制艇员" prop="bzty">
              <el-input
                v-model="formData.bzty"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="large">
              <el-button
                v-if="subShowState === 'add'"
                type="primary"
                @click="submitForm"
                >新增提交</el-button
              >
              <el-button
                v-if="subShowState === 'update'"
                type="primary"
                @click="updateForm"
                >修改提交</el-button
              >
              <el-button
                v-if="subShowState === 'update'"
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
import {
  潜艇信息增加,
  潜艇信息修改,
  潜艇信息删除,
  组织机构列表,
} from "@/api/corpus/submarine";
export default {
  components: {},
  props: {
    subShowState: String,
    harborList: Array,
    currentSubmarineList: Object,
    imageServerUri: String,
  },
  watch: {
    subShowState: {
      deep: true,
      // immediate: true,
      handler(val) {
        if (val === "add") {
          this.resetForm();
          this.imagePathfileList = [];
        }
      },
    },
    currentSubmarineList: {
      deep: true,
      immediate: true,
      handler(val) {
        // debugger
        this.formData = val;
        if (val.smImagePath) {
          if (this.imagePathfileList.length === 0) {
            this.imagePathfileList.push({
              name: val.smImagePath,
              url: this.imageServerUri + val.smImagePath,
            });
          }
          if (
            this.imagePathfileList.length > 0 &&
            this.imagePathfileList[0].name !== val.smImagePath
          ) {
            this.imagePathfileList = [];
            this.imagePathfileList.push({
              name: val.smImagePath,
              url: this.imageServerUri + val.smImagePath,
            });
          }
        }
      },
    },
  },
  computed: {
    // 兵力部势所属区域
    ssqy: function () {
      if (this.formData.blbs) {
        if (
          this.formData.blbs == 1 ||
          this.formData.blbs == 2 ||
          this.formData.blbs == 3
        ) {
          return 1;
        } else {
          return 2;
        }
      } else {
        return undefined;
      }
    },
    middleList: function () {
      let reg = new RegExp("中队");
      return this.orgList.filter((item) => reg.test(item.orgName));
    },
    // 大队ID formData.
    ddId: function () {
      if (this.formData.zdId) {
        let tar = this.orgList.find(
          (item) => item.orgId === this.formData.zdId
        );
        return tar.parentOrgId;
      } else {
        return undefined;
      }
    },
    // 司令部ID
    slbId: function () {
      if (this.ddId) {
        let tar = this.orgList.find((item) => item.orgId == this.ddId);
        return tar.parentOrgId;
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
        smName: "",
        smImagePath: null,
        sideNum: undefined,
        jbpc: undefined,
        rysj: undefined,
        smStatus: undefined,
        jzf: undefined,
        harborId: undefined,
        psl: undefined,
        qhps: undefined,
        tz: undefined,
        dlxt: undefined,
        qs: undefined,
        wqzb: undefined,
        fhps: undefined,
        cssd: undefined,
        tk: undefined,
        sh: undefined,
        bzty: undefined,
      },
      imagePathAction: "https://jsonplaceholder.typicode.com/posts/",
      imagePathfileList: [],
      blbsList: [],
      jibieList: [],
      orgList: [],
    };
  },
  async created() {
    // 兵力部势
    this.getDicts("app_line_type").then((res) => {
      this.blbsList = res.data;
    });
    // 级别批次
    this.getDicts("submarine_type").then((res) => {
      this.jibieList = res.data;
    });
    // 组织机构
    组织机构列表().then((res) => {
      this.orgList = res.rows;
    });
  },
  methods: {
    addRow() {},
    handleClick() {},
    imageChange(file, fileList) {
      console.log(file, fileList);
      // if (fileList.length > 1) {
      //   let tarIndex = fileList.findIndex((item) => (item.name = file.name));
      //   fileList.splice(tarIndex, 1);
      // }
    },
    async submitForm() {
      if (!this.formData.sideNum) {
        this.$message.error(`弦号不能为空`);
        return;
      }
      // console.log(this.$refs.smImagePath.uploadFiles[0].raw);
      if (this.$refs.smImagePath.uploadFiles[0]) {
        this.imgFormData = new FormData();
        this.imgFormData.append(
          "file",
          this.$refs.smImagePath.uploadFiles[0].raw
        );
        this.imgFormData.append("fileType", 1);
        let imgRes = await 多媒体数据上传(this.imgFormData);
        if (imgRes.code === 200) {
          this.formData.smImagePath = imgRes.data.fileUrl;
          console.log(`图片上传成功`);
        }
      }
       // 兵力部势
      this.formData.ssqy = this.ssqy;
       // 组织机构
      if (this.formData.zdId) {
        this.formData.ddId = Number(this.ddId);
        this.formData.slbId = Number(this.slbId);
      }
      let res = await 潜艇信息增加(this.formData);
      if (res.code === 200) {
        this.$message.success(`添加成功`);
        this.$emit("submarineRest");
      }
      console.log(res);
    },
    async updateForm() {
      if (!this.formData.sideNum) {
        this.$message.error(`弦号不能为空`);
        return;
      }
      // console.log("图片看看", this.$refs.smImagePath.uploadFiles[0]);
      // 如何判断图片需不需要重新上传？
      // console.log(this.$refs.smImagePath);
      if (
        this.$refs.smImagePath.uploadFiles[0] &&
        this.$refs.smImagePath.uploadFiles[0].raw
      ) {
        this.imgFormData = new FormData();
        this.imgFormData.append(
          "file",
          this.$refs.smImagePath.uploadFiles[0].raw
        );
        this.imgFormData.append("fileType", 1);
        let imgRes = await 多媒体数据上传(this.imgFormData);
        if (imgRes.code === 200) {
          this.formData.smImagePath = imgRes.data.fileUrl;
          console.log(`图片上传成功`);
        }
      }
      // 兵力部势
      this.formData.ssqy = this.ssqy;
      // 组织机构
      if (this.formData.zdId) {
        this.formData.ddId = Number(this.ddId);
        this.formData.slbId = Number(this.slbId);
      }
      let res = await 潜艇信息修改(this.formData);
      if (res.code === 200) {
        this.$message.success(`修改成功`);
        console.log(res);
      }
      console.log(res);
    },
    async deleteForm() {
      let res = await 潜艇信息删除(this.formData.smId);
      if (res.code === 200) {
        this.$message.success(`删除成功`);
        this.$emit("submarineRest");
      }
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    submitUpload() {
      this.$refs["smImagePath"].submit();
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
.xiaobiao {
  color: #fff;
  font-size: 16px;
}
</style>
