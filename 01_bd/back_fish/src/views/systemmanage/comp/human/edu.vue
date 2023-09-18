<template>
  <div class="app-container">
    <div class="formContainner" v-for="(item, i) in eduDataList" :key="i">
      <el-form :model="item" size="medium" label-width="100px">
        <el-form-item label="学校名称" prop="eduScl">
          <el-input
            v-model="item.eduScl"
            placeholder="请输入学校名称"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="eduDegree">
          <el-input
            v-model="item.eduDegree"
            placeholder="请输入学历"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="上传" prop="imagePath">
          <el-upload
            :data="urlData"
            :headers="token"
            :file-list="item.imagePathfileList"
            :action="imagePathAction"
            :auto-upload="true"
            :limit="imgLimit"
            :on-change="(file, fileList) => imageChange(file, fileList, i)"
            :on-remove="(file, fileList) => imageRemove(file, fileList, i)"
            :on-success="
              (response, file, fileList) =>
                imageSuccess(response, file, fileList, i)
            "
            list-type="picture"
          >
            <el-button size="small" type="primary" icon="el-icon-upload"
              >点击上传</el-button
            >
          </el-upload>
        </el-form-item>

        <el-form-item label="开始时间" prop="eduBeginTime">
          <el-input
            v-model="item.eduBeginTime"
            placeholder="请输入开始时间"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="eduEndTime">
          <el-input
            v-model="item.eduEndTime"
            placeholder="请输入结束时间"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
      </el-form>

      <div class="iconContainner">
        <i class="el-icon-remove-outline iconZi" @click="removeOne(i)"></i>
      </div>
    </div>
    <div class="iconContainner">
      <i class="el-icon-circle-plus-outline iconZi" @click="addOne()"></i>
    </div>
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
  </div>
</template>

<script>
import {
  教育经历增加,
  教育经历修改,
  多媒体数据上传,
} from "@/api/corpus/human.js";
import { 人员教育经历查询 } from "@/api/institutional/institutional.js";
import { resolve } from "path";
import { getToken } from "@/utils/auth";
export default {
  components: {},
  props: {
    eduInfo: Array,
    currentHumanId: Number,
    humanShowState: String,
    imageServerUri: String,
  },
  //   watch: {
  //     eduInfo: {
  //       deep: true,
  //       // immediate: true,
  //       handler(val) {
  //         this.eduDataList = val;
  //       },
  //     },
  //   },
  data() {
    return {
      imgLimit: 1,
      token: { Authorization: getToken() },
      eduDataList: [
        {
          eduScl: "",
          imagePath: null,
          eduDegree: undefined,
          eduBeginTime: undefined,
          eduEndTime: undefined,
          orgUserId: 0,
          imagePathfileList: [],
        },
      ],
      urlData: {
        fileType: "1",
      },
      imagePathAction: process.env.VUE_APP_BASE_API + "/common/upload/media",
    };
  },
  created() {
    // debugger
    人员教育经历查询(this.currentHumanId).then((res) => {
      res.rows.forEach((item) => {
        item.imagePathfileList = item.imagePath
          ? [{ url: this.imageServerUri + item.imagePath }]
          : [];
      });
      this.eduDataList = res.rows;
      console.log("人员教育经历查询", this.eduDataList);
    });
  },
  methods: {
    imageSuccess(response, file, fileList, index) {
      this.eduDataList[index].imagePath = response.data.fileUrl;
      console.log(response, file, fileList, index);
    },
    imageChange(file, fileList, index) {
      console.log(file, fileList, index);
    },
    imageRemove(file, fileList, index) {
      console.log("shanchu", file, fileList, index);
      this.eduDataList[index].imagePath = null;
      this.eduDataList[index].imagePathfileList = [];
    },
    addOne() {
      this.eduDataList.push({
        eduScl: "",
        imagePath: null,
        eduDegree: undefined,
        eduBeginTime: undefined,
        eduEndTime: undefined,
        orgUserId: 0,
        imagePathfileList: [],
      });
    },
    removeOne(i) {
      this.eduDataList.splice(i, 1);
    },
    async submitForm() {
      this.eduDataList.forEach((item) => {
        item.orgUserId = this.currentHumanId;
      });

      let data = {
        bdsOrgUserEduList: this.eduDataList,
      };

      let res = await 教育经历增加(data);
      if (res.code === 200) {
        this.$message.success(`教育经历增加成功`);
      }
      console.log(res);
    },
    async updateForm() {
      for (let i = 0; i < this.eduDataList.length; i++) {
        let item = this.eduDataList[i];
        item.orgUserId = this.currentHumanId;
      }

      let data = {
        bdsOrgUserEduList: this.eduDataList,
      };

      let res = await 教育经历增加(data);
      if (res.code === 200) {
        this.$message.success(`教育经历修改成功`);
        console.log(`教育经历修改成功`);
      }
      console.log(res);
    },
    async deleteForm() {},
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
</style>
