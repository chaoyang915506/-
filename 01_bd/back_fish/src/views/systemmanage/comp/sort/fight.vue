<template>
  <div class="app-container">
    <div class="formContainner" v-for="(item, i) in dataList" :key="i">
      <el-form :model="item" size="medium" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="item.name"
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="信息" prop="info">
          <el-input
            v-model="item.info"
            rows="8"
            type="textarea"
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
    <!-- <el-button
      v-if="subTypeShowState === 'add'"
      type="primary"
      @click="submitForm"
      >新增提交</el-button
    > -->
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
import { 作战增加, 作战删除 } from "@/api/corpus/sort.js";
export default {
  components: {},
  props: {
    subFightInfo: Array,
    currentSubType: String,
    subTypeShowState: String,
  },
  watch: {
    subFightInfo: {
      deep: true,
      immediate: true,
      handler(val) {
        this.dataList = val;
      },
    },
  },
  data() {
    return {
      dataList: [
        {
          info: "",
          code: "",
          name: "",
        },
      ],
    };
  },
  created() {},
  methods: {
    addOne() {
      this.dataList.push({
        info: "",
        code: this.currentSubType,
        name: "",
      });
    },
    removeOne(i) {
      this.dataList.splice(i, 1);
    },
    // async submitForm() {
    //   this.dataList.forEach((item) => {
    //     item.orgUserId = this.currentHumanId;
    //   });

    //   let data = {
    //     bdsTrainingEpList: this.dataList,
    //   };

    //   let res = await 作战增加(data);
    //   if (res.code === 200) {
    //     this.$message.success(`作战增加成功`);
    //     console.log(`作战增加成功`);
    //   }
    //   console.log(res);
    // },
    async updateForm() {
      let data = {
        bdsKnwlSubZzList: this.dataList,
      };

      let res = await 作战增加(data);
      if (res.code === 200) {
        this.$message.success(`作战修改成功`);
        console.log(`作战修改成功`);
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
