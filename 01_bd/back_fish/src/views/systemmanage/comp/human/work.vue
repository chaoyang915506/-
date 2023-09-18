<template>
  <div class="app-container">
    <div class="formContainner" v-for="(item, i) in workDataList" :key="i">
      <el-form :model="item" size="medium" label-width="100px">
        <el-form-item label="任职单位" prop="orgName">
          <el-input
            v-model="item.orgName"
            placeholder="请输入任职单位"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="任职头衔" prop="post">
          <el-input
            v-model="item.post"
            placeholder="请输入任职头衔"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input
            v-model="item.addr"
            placeholder="请输入地址"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="上传" prop="imagePath">
          <el-upload
            :data="urlData"
            :headers="token"
            :limit="imgLimit"
            :file-list="item.imagePathfileList"
            :action="imagePathAction"
            :auto-upload="true"
            :on-success="
              (response, file, fileList) =>
                imageSuccess(response, file, fileList, i)
            "
            :on-remove="(file, fileList) => imageRemove(file, fileList, i)"
            list-type="picture"
          >
            <el-button size="small" type="primary" icon="el-icon-upload"
              >点击上传</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item label="开始时间" prop="begintime">
          <el-input
            v-model="item.begintime"
            placeholder="请输入开始时间"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="endtime">
          <el-input
            v-model="item.endtime"
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
  工作经历增加,
  工作经历修改,
  多媒体数据上传,
} from "@/api/corpus/human.js";
import { 人员工作经历查询 } from "@/api/institutional/institutional.js";
import { getToken } from "@/utils/auth";
export default {
  components: {},
  props: {
    workInfo: Array,
    currentHumanId: Number,
    humanShowState: String,
    imageServerUri: String,
  },
  //   watch: {
  //     workInfo: {
  //       deep: true,
  //       // immediate: true,
  //       handler(val) {
  //         this.workDataList = val;
  //       },
  //     },
  //   },
  data() {
    return {
      imgLimit: 1,
      token: { Authorization: getToken() },
      workDataList: [
        {
          orgName: "",
          imagePath: null,
          post: undefined,
          addr: "",
          begintime: undefined,
          endtime: undefined,
          orgUserId: 0,
          imagePathfileList: [],
        },
      ],
      urlData: {
        fileType: "1",
      },
      imagePathAction: process.env.VUE_APP_BASE_API + "/common/upload/media",
      imagePathfileList: [],
    };
  },
  created() {
    人员工作经历查询(this.currentHumanId).then((res) => {
      res.rows.forEach((item) => {
        item.imagePathfileList = item.imagePath
          ? [{ url: this.imageServerUri + item.imagePath }]
          : [];
      });
      this.workDataList = res.rows;
      console.log("人员工作经历查询", this.workDataList);
    });
  },
  methods: {
    imageSuccess(response, file, fileList, index) {
      this.workDataList[index].imagePath = response.data.fileUrl;
      console.log(response, file, fileList, index);
    },
    imageRemove(file, fileList, index) {
      console.log("shanchu", file, fileList, index);
      this.workDataList[index].imagePath = null;
      this.eduDataList[index].imagePathfileList = [];
    },
    addOne() {
      this.workDataList.push({
        orgName: "",
        imagePath: null,
        post: undefined,
        addr: "",
        begintime: undefined,
        endtime: undefined,
        orgUserId: 0,
        imagePathfileList: [],
      });
    },
    removeOne(i) {
      this.workDataList.splice(i, 1);
    },
    async submitForm() {
      // let bdsOrgUserEduList =
      this.workDataList.forEach((item) => {
        item.orgUserId = this.currentHumanId;
      });

      let data = {
        bdsOrgUserWkxList: this.workDataList,
      };

      let res = await 工作经历增加(data);
      if (res.code === 200) {
        this.$message.success(`工作经历增加成功`);
        console.log(`工作经历增加成功`);
      }
      console.log(res);
    },
    async updateForm() {
      // let bdsOrgUserEduList =
      this.workDataList.forEach((item) => {
        item.orgUserId = this.currentHumanId;
      });

      let data = {
        bdsOrgUserWkxList: this.workDataList,
      };

      let res = await 工作经历增加(data);
      if (res.code === 200) {
        this.$message.success(`工作经历修改成功`);
        console.log(`工作经历修改成功`);
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
