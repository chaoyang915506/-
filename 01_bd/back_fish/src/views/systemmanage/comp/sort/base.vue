<template>
  <div class="app-container">
    <div class="formContainner">
      <el-form size="medium" label-width="100px">
        <el-form-item label="简介" prop="intro">
          <el-input
            v-model="dataList.intro"
            rows="8"
            type="textarea"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="基本信息" prop="baseInfo">
          <el-input
            v-model="dataList.baseInfo"
            rows="12"
            type="textarea"
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="qty">
          <el-input v-model="dataList.qty" clearable :style="{ width: '100%' }">
          </el-input>
        </el-form-item>
        <el-form-item label="编号" prop="code">
          <el-input
            v-model="dataList.code"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-button
      v-if="subTypeShowState === 'add'"
      type="primary"
      @click="submitForm"
      >新增提交</el-button
    >
    <el-button
      v-if="subTypeShowState === 'update'"
      type="primary"
      @click="updateForm"
      >修改提交</el-button
    >
    <!-- <el-button
      v-if="subTypeShowState === 'update'"
      type="danger"
      @click="deleteForm"
      >删除</el-button
    > -->
  </div>
</template>

<script>
import { 基本信息增加, 基本信息修改, 基本信息删除 } from "@/api/corpus/sort.js";
export default {
  components: {},
  props: {
    subBaseInfo: Array,
    currentSubType: String,
    subTypeShowState: String,
  },
  watch: {
    subBaseInfo: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val[0]) {
          this.dataList = val[0];
        }
      },
    },
  },
  data() {
    return {
      dataList: {
        intro: "",
        code: "",
        baseInfo: "",
        qty: 0,
      },
    };
  },
  created() {},
  methods: {
    async submitForm() {
      let res = await 基本信息增加(this.dataList);
      if (res.code === 200) {
        this.$message.success(`基本信息增加成功`);
        console.log(`基本信息增加成功`);
      }
      console.log(res);
    },

    async updateForm() {
      let res = await 基本信息修改(this.dataList);
      if (res.code === 200) {
        this.$message.success(`基本信息修改成功`);
        console.log(`基本信息修改成功`);
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
::v-deep .el-textarea__inner {
  background-color: transparent;
  color: #fff;
}
</style>
