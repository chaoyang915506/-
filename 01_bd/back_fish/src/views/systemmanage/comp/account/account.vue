<template>
  <div class="app-container">
    <div class="formContainner">
      <el-form :model="accountList" size="medium" label-width="100px">
        <el-form-item label="账号ID" prop="accountId">
          <el-input
            v-model="accountList.accountId"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号名称" prop="accountName">
          <el-input
            v-model="accountList.accountName"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="账号类别" prop="dataSource">
          <el-select
            v-model="accountList.dataSource"
            placeholder="请选择账号类别"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="(item, index) in dataSourceOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <el-button
      v-if="accountShowState === 'add'"
      type="primary"
      @click="submitForm"
      >新增提交</el-button
    >
    <el-button
      v-if="accountShowState === 'update'"
      type="primary"
      @click="updateForm"
      >修改提交</el-button
    >
    <el-button
      v-if="accountShowState === 'update'"
      type="danger"
      @click="deleteForm"
      >删除账号</el-button
    >
  </div>
</template>

<script>
import { 账号增加, 账号修改, 账号删除 } from "@/api/corpus/account.js";
import { resolve } from "path";
import { getToken } from "@/utils/auth";
export default {
  components: {},
  props: {
    accountObj: Object,
    accountShowState: String,
    imageServerUri: String,
  },
  watch: {
    accountObj: {
      deep: true,
      immediate: true,
      handler(val) {
        this.accountList = val;
      },
    },
    accountShowState: {
      deep: true,
      // immediate: true,
      handler(val) {
        if (val === "add") {
          this.accountList = {
            accountId: "",
            accountName: "",
            dataSource: "",
          };
        }
      },
    },
  },
  data() {
    return {
      dataSourceOptions: [
        {
          label: "Twitter",
          value: "TT",
        },
        {
          label: "FaceBook",
          value: "FB",
        },
      ],
      imgLimit: 1,
      token: { Authorization: getToken() },
      urlData: {
        fileType: "1",
      },
      imagePathAction: process.env.VUE_APP_BASE_API + "/common/upload/media",
      accountList: {
        accountId: "",
        accountName: "",
        dataSource: "",
      },
    };
  },
  created() {},
  methods: {
    async submitForm() {
      let res = await 账号增加(this.accountList);
      if (res.code === 200) {
        this.$message.success(`账号增加成功`);
        this.$emit("accountReset");
      }
    },
    async updateForm() {
      // 母港ID
      let res = await 账号修改(this.accountList);
      if (res.code === 200) {
        this.$message.success(`账号修改成功`);
      }
    },
    async deleteForm() {
      let res = await 账号删除(this.accountList.id);
      if (res.code === 200) {
        this.$message.success(`账号删除成功`);
        this.$emit("accountReset");
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
