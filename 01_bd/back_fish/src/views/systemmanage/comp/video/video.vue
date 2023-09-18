<template>
  <div class="app-container">
    <div class="formContainner">
      <el-form :model="videoList" size="medium" label-width="100px">
        <el-form-item label="资源名称" prop="resourceName">
          <el-input
            v-model="videoList.resourceName"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传视频" prop="imagePath">
          <el-upload
            :data="urlData"
            :headers="token"
            :file-list="videoList.imagePathfileList"
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
      </el-form>

      <!-- <video width="320" height="240" controls>
        <source :src="videoServerUri + videoList.fileUri" type="video/mp4" />
      </video> -->
    </div>
    <el-button
      v-if="videoShowState === 'add'"
      type="primary"
      @click="submitForm"
      >新增提交</el-button
    >
    <el-button
      v-if="videoShowState === 'update'"
      type="primary"
      @click="updateForm"
      >修改提交</el-button
    >
    <el-button
      v-if="videoShowState === 'update'"
      type="danger"
      @click="deleteForm"
      >删除</el-button
    >
  </div>
</template>

<script>
import {
  首页资源增加,
  首页资源修改,
  首页资源删除,
} from "@/api/corpus/video.js";
import { resolve } from "path";
import { getToken } from "@/utils/auth";
export default {
  components: {},
  props: {
    // battleCount: Number,
    currentVideoObj: Object,
    videoShowState: String,
    imageServerUri: String,
  },
  watch: {
    currentVideoObj: {
      deep: true,
      immediate: true,
      handler(val) {
        this.videoList = val;
      },
    },
    // battleCount: {
    //   deep: true,
    //   // immediate: true,
    //   handler(val) {
    //     战例查询(this.orgId).then((res) => {
    //       res.rows.forEach((item) => {
    //         item.imagePathfileList = item.fileUri
    //           ? [{ url: this.imageServerUri + item.fileUri }]
    //           : [];
    //       });
    //       this.videoList = res.rows;
    //     });
    //   },
    // },
    videoShowState: {
      deep: true,
      // immediate: true,
      handler(val) {
        if (val === "add") {
          this.videoList = {
            display: 1,
            fileId: 0,
            fileName: "",
            fileType: "2",
            fileUri: "",
            orderNum: 0,
            resourceId: 1,
            resourceName: "",
            resourceType: "",
            imagePathfileList: [],
          };
        }
      },
    },
  },
  data() {
    return {
      videoServerUri: "http://192.168.1.50:18080/",
      imgLimit: 1,
      token: { Authorization: getToken() },
      videoList: {
        display: 1,
        fileId: 0,
        fileName: "",
        fileType: "2",
        fileUri: "",
        orderNum: 0,
        resourceId: 1,
        resourceName: "",
        resourceType: "",
        imagePathfileList: [],
      },
      urlData: {
        fileType: "2",
      },
      imagePathAction: process.env.VUE_APP_BASE_API + "/common/upload/media",
    };
  },
  created() {
    // debugger
    // 战例查询(this.orgId).then((res) => {
    //   res.rows.forEach((item) => {
    //     item.imagePathfileList = item.imagePath
    //       ? [{ url: this.imageServerUri + item.imagePath }]
    //       : [];
    //   });
    //   this.videoList = res.rows;
    //   // console.log("人员教育经历查询", this.videoList);
    // });
  },
  methods: {
    imageSuccess(response, file, fileList) {
      this.videoList.fileName = response.data.fileName;
      this.videoList.fileUri = response.data.fileUrl;
      console.log(response, file, fileList);
    },
    imageRemove(file, fileList) {
      // console.log("shanchu", file, fileList, index);
      this.videoList.fileUri = null;
      this.videoList.imagePathfileList = [];
    },
    async submitForm() {
      //   this.videoList.forEach((item) => {
      //     item.orgId = this.orgId;
      //   });
      //   let data = {
      //     bdsSeopList: this.videoList,
      //   };
      let res = await 首页资源增加(this.videoList);
      if (res.code === 200) {
        this.$message.success(`首页资源增加成功`);
      }
    },
    async updateForm() {
      //   for (let i = 0; i < this.videoList.length; i++) {
      //     let item = this.videoList[i];
      //     item.orgId = this.orgId;
      //   }

      //   let data = {
      //     bdsSeopList: this.videoList,
      //   };

      let res = await 首页资源修改(this.videoList);
      if (res.code === 200) {
        this.$message.success(`首页资源修改成功`);
      }
    },
    async deleteForm() {
      let res = await 战例删除(this.currentVideoId);
      if (res.code === 200) {
        this.$message.success(`战例删除成功`);
        this.$emit("battleReset");
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
</style>
