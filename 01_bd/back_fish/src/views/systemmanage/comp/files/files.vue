<template>
  <div class="app-container">
    <div class="formContainner" v-for="(item, i) in filesList" :key="i">
      <el-form :model="item" size="medium" label-width="100px">
        <el-form-item label="舰艇弦号" prop="name">
          <el-input
            v-model="item.name"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="事件类型" prop="category">
          <el-input
            v-model="item.category"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="发生时间" prop="time">
          <el-input v-model="item.time" clearable :style="{ width: '100%' }">
          </el-input>
        </el-form-item>
        <el-form-item label="事件内容" prop="content">
          <el-input v-model="item.content" clearable :style="{ width: '100%' }">
          </el-input>
        </el-form-item>
        <el-form-item label="事件发生位置" prop="position">
          <el-input
            v-model="item.position"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="事件重要性" prop="priority">
          <el-input
            v-model="item.priority"
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
      v-if="filesShowState === 'add'"
      type="primary"
      @click="submitForm"
      >新增提交</el-button
    >
    <el-button
      v-if="filesShowState === 'update'"
      type="primary"
      @click="updateForm"
      >修改提交</el-button
    >
    <el-button
      v-if="filesShowState === 'update'"
      type="danger"
      @click="deleteForm"
      >删除档案</el-button
    >
  </div>
</template>

<script>
import { 档案查询, 档案保存, 档案删除 } from "@/api/corpus/files.js";
import { resolve } from "path";
import { getToken } from "@/utils/auth";
export default {
  components: {},
  props: {
    filesCount: Number,
    sidNum: String,
    filesShowState: String,
    imageServerUri: String,
  },
  watch: {
    filesCount: {
      deep: true,
      // immediate: true,
      handler(val) {
        档案查询(this.sidNum).then((res) => {
          this.filesList = res.rows;
        });
      },
    },
    filesShowState: {
      deep: true,
      // immediate: true,
      handler(val) {
        if (val === "add") {
          this.filesList = [
            {
              name: this.sidNum,
              category: "",
              time: "",
              content: "",
              position: "",
              priority: "",
            },
          ];
        }
      },
    },
  },
  data() {
    return {
      filesList: [
        {
          name: this.sidNum,
          category: "",
          time: "",
          content: "",
          position: "",
          priority: "",
        },
      ],
    };
  },
  created() {
    // debugger
    档案查询(this.sidNum).then((res) => {
      this.filesList = res.rows;
    });
  },
  methods: {
    addOne() {
      this.filesList.push({
        name: this.sidNum,
        category: "",
        time: "",
        content: "",
        position: "",
        priority: "",
      });
    },
    removeOne(i) {
      this.filesList.splice(i, 1);
    },
    async submitForm() {
      this.filesList.forEach((item) => {
        item.orgId = this.orgId;
      });
      let data = {
        tblSubrecordList: this.filesList,
      };
      let res = await 档案保存(data);
      if (res.code === 200) {
        this.$message.success(`档案增加成功`);
      }
    },
    async updateForm() {
      for (let i = 0; i < this.filesList.length; i++) {
        let item = this.filesList[i];
        item.orgId = this.orgId;
      }

      let data = {
        tblSubrecordList: this.filesList,
      };
      console.log(data);
      let res = await 档案保存(data);
      if (res.code === 200) {
        this.$message.success(`档案修改成功`);
      }
    },
    async deleteForm() {
      let res = await 档案删除(this.sidNum);
      if (res.code === 200) {
        this.$message.success(`档案删除成功`);
        this.$emit("filesReset");
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
