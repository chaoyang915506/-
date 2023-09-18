<template>
  <div class="app-container">
    <div class="formContainner" v-for="(item, i) in trainDataList" :key="i">
      <el-form :model="item" size="medium" label-width="100px">
        <el-form-item label="演训时间" prop="tDatetime">
          <el-input
            v-model="item.tDatetime"
            placeholder="请输入演训时间"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="演训事件" prop="tEvent">
          <el-input
            v-model="item.tEvent"
            placeholder="请输入演训事件"
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
  演训经历增加,
  演训经历修改,
  多媒体数据上传,
} from "@/api/corpus/human.js";
export default {
  components: {},
  props: {
    trainInfo: Array,
    currentHumanId: Number,
    humanShowState: String,
  },
  watch: {
    trainInfo: {
      deep: true,
      // immediate: true,
      handler(val) {
        this.trainDataList = val;
      },
    },
  },
  data() {
    return {
      trainDataList: [
        {
          tDatetime: "",
          imagePath: null,
          tEvent: "",
          orgUserId: 0,
        },
      ],
      imagePathAction: "https://jsonplaceholder.typicode.com/posts/",
      imagePathfileList: [],
    };
  },
  created() {},
  methods: {
    addOne() {
      this.trainDataList.push({
        tDatetime: "",
        imagePath: null,
        tEvent: "",
        orgUserId: 0,
      });
    },
    removeOne(i) {
      this.trainDataList.splice(i, 1);
    },
    async submitForm() {
      // let bdsOrgUserEduList =
      this.trainDataList.forEach((item) => {
        item.orgUserId = this.currentHumanId;
      });

      let data = {
        bdsTrainingEpList: this.trainDataList,
      };

      let res = await 演训经历增加(data);
      if (res.code === 200) {
        this.$message.success(`演训经历增加成功`);
        console.log(`演训经历增加成功`);
      }
      console.log(res);
    },
    async updateForm() {
      // let bdsOrgUserEduList =
      this.trainDataList.forEach((item) => {
        item.orgUserId = this.currentHumanId;
      });

      let data = {
        bdsTrainingEpList: this.trainDataList,
      };

      let res = await 演训经历增加(data);
      if (res.code === 200) {
        this.$message.success(`演训经历修改成功`);
        console.log(`演训经历修改成功`);
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
