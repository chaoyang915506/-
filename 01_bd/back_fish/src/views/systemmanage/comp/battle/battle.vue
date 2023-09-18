<template>
  <div class="app-container">
    <div class="formContainner" v-for="(item, i) in battleList" :key="i">
      <el-form :model="item" size="medium" label-width="100px">
        <el-form-item label="事件" prop="event">
          <el-input
            v-model="item.event"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="地点" prop="addr">
          <el-input v-model="item.addr" clearable :style="{ width: '100%' }">
          </el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imagePath">
          <el-upload
            :data="urlData"
            :headers="token"
            :file-list="item.imagePathfileList"
            :action="imagePathAction"
            :auto-upload="true"
            :limit="imgLimit"
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
      v-if="battleShowState === 'add'"
      type="primary"
      @click="submitForm"
      >新增提交</el-button
    >
    <el-button
      v-if="battleShowState === 'update'"
      type="primary"
      @click="updateForm"
      >修改提交</el-button
    >
    <el-button
      v-if="battleShowState === 'update'"
      type="danger"
      @click="deleteForm"
      >删除战例</el-button
    >
  </div>
</template>

<script>
import { 战例查询, 战例保存, 战例修改, 战例删除 } from "@/api/corpus/battle.js";
import { resolve } from "path";
import { getToken } from "@/utils/auth";
export default {
  components: {},
  props: {
    battleCount: Number,
    orgId: Number,
    battleShowState: String,
    imageServerUri: String,
  },
  watch: {
    battleCount: {
      deep: true,
      // immediate: true,
      handler(val) {
        战例查询(this.orgId).then((res) => {
          res.rows.forEach((item) => {
            item.imagePathfileList = item.imagePath
              ? [{ url: this.imageServerUri + item.imagePath }]
              : [];
          });
          this.battleList = res.rows;
        });
      },
    },
    battleShowState: {
      deep: true,
      // immediate: true,
      handler(val) {
        if (val === "add") {
          this.battleList = [
            {
              addr: "",
              begintime: "",
              endtime: "",
              event: "",
              imagePath: "",
              orgId: 0,
              imagePathfileList: [],
            },
          ];
        }
      },
    },
  },
  data() {
    return {
      imgLimit: 1,
      token: { Authorization: getToken() },
      battleList: [
        {
          addr: "",
          begintime: "",
          endtime: "",
          event: "",
          imagePath: "",
          orgId: 0,
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
    战例查询(this.orgId).then((res) => {
      res.rows.forEach((item) => {
        item.imagePathfileList = item.imagePath
          ? [{ url: this.imageServerUri + item.imagePath }]
          : [];
      });
      this.battleList = res.rows;
      // console.log("人员教育经历查询", this.battleList);
    });
  },
  methods: {
    imageSuccess(response, file, fileList, index) {
      this.battleList[index].imagePath = response.data.fileUrl;
      console.log(response, file, fileList, index);
    },
    imageRemove(file, fileList, index) {
      console.log("shanchu", file, fileList, index);
      this.battleList[index].imagePath = null;
      this.battleList[index].imagePathfileList = [];
    },
    addOne() {
      this.battleList.push({
        addr: "",
        begintime: "",
        endtime: "",
        event: "",
        imagePath: "",
        orgId: 0,
        imagePathfileList: [],
      });
    },
    removeOne(i) {
      this.battleList.splice(i, 1);
    },
    async submitForm() {
      this.battleList.forEach((item) => {
        item.orgId = this.orgId;
      });
      let data = {
        bdsSeopList: this.battleList,
      };
      let res = await 战例保存(data);
      if (res.code === 200) {
        this.$message.success(`战例增加成功`);
      }
    },
    async updateForm() {
      for (let i = 0; i < this.battleList.length; i++) {
        let item = this.battleList[i];
        item.orgId = this.orgId;
      }

      let data = {
        bdsSeopList: this.battleList,
      };

      let res = await 战例保存(data);
      if (res.code === 200) {
        this.$message.success(`战例修改成功`);
      }
    },
    async deleteForm() {
      let res = await 战例删除(this.orgId);
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
