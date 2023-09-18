<template>
  <div class="app-container">
    <el-tabs
      v-model="activeName"
      tab-position="top"
      class="tabs_class"
      @tab-click="handleClick"
    >
      <el-tab-pane label="技能" name="ability" style="height: 100%">
        <div
          class="formContainner"
          v-for="(item, i) in abilityDataList[0]"
          :key="i"
        >
          <el-form :model="item" size="medium" label-width="100px">
            <el-form-item :label="`技能 ${i + 1}`" prop="hxjn">
              <el-input
                v-model="item.hxjn"
                show-word-limit
                clearable
                :style="{ width: '200px' }"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="iconContainner">
            <i
              class="el-icon-remove-outline iconZi"
              @click="removeOne(0, i)"
            ></i>
          </div>
        </div>
        <i class="el-icon-circle-plus-outline iconZi" @click="addOne(0)"></i>
      </el-tab-pane>
      <el-tab-pane label="获得荣誉" name="honor" style="height: 100%">
        <div
          class="formContainner"
          v-for="(item, i) in abilityDataList[1]"
          :key="i"
        >
          <el-form :model="item" size="medium" label-width="100px">
            <el-form-item label="荣誉名称" prop="hdry">
              <el-input
                v-model="item.hdry"
                show-word-limit
                clearable
                :style="{ width: '200px' }"
              ></el-input>
            </el-form-item>
            <el-form-item label="荣誉时间" prop="hdryTime">
              <el-input
                v-model="item.hdryTime"
                show-word-limit
                clearable
                :style="{ width: '200px' }"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="iconContainner">
            <i
              class="el-icon-remove-outline iconZi"
              @click="removeOne(1, i)"
            ></i>
          </div>
        </div>
        <i class="el-icon-circle-plus-outline iconZi" @click="addOne(1)"></i>
      </el-tab-pane>
      <el-tab-pane label="评价" name="appraise" style="height: 100%">
        <div
          class="formContainner"
          v-for="(item, i) in abilityDataList[2]"
          :key="i"
        >
          <el-form :model="item" size="medium" label-width="100px">
            <el-form-item label="评价标题" prop="pjTitle">
              <el-input
                v-model="item.pjTitle"
                show-word-limit
                clearable
                :style="{ width: '200px' }"
              ></el-input>
            </el-form-item>
            <el-form-item label="评价时间" prop="pjTime">
              <el-input
                v-model="item.pjTime"
                show-word-limit
                clearable
                :style="{ width: '200px' }"
              ></el-input>
            </el-form-item>
            <el-form-item label="评价内容" prop="pjContent">
              <el-input
                v-model="item.pjContent"
                show-word-limit
                clearable
                :style="{ width: '200px' }"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="iconContainner">
            <i
              class="el-icon-remove-outline iconZi"
              @click="removeOne(2, i)"
            ></i>
          </div>
        </div>
        <i class="el-icon-circle-plus-outline iconZi" @click="addOne(2)"></i>
      </el-tab-pane>
      <el-tab-pane label="其他" name="other" style="height: 100%">
        <div
          class="formContainner"
          v-for="(item, i) in abilityDataList[3]"
          :key="i"
        >
          <el-form :model="item" size="medium" label-width="100px">
            <el-form-item :label="`其他 ${i + 1}`" prop="qt">
              <el-input
                v-model="item.qt"
                show-word-limit
                clearable
                :style="{ width: '200px' }"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="iconContainner">
            <i
              class="el-icon-remove-outline iconZi"
              @click="removeOne(3, i)"
            ></i>
          </div>
        </div>
        <i class="el-icon-circle-plus-outline iconZi" @click="addOne(3)"></i>
      </el-tab-pane>
    </el-tabs>

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
import { 个人能力增加, 个人能力修改 } from "@/api/corpus/human.js";
export default {
  components: {},
  props: {
    abilityInfo: Array,
    currentHumanId: Number,
    humanShowState: String,
  },
  watch: {
    abilityInfo: {
      deep: true,
      // immediate: true,
      handler(val) {
        this.abilityDataList = val;
      },
    },
  },
  data() {
    return {
      activeName: "ability",
      abilityDataList: [
        [
          {
            hxjn: "", // 核心技能
            psType: "1",
            orgUserId: 0,
          },
        ],
        [
          {
            hdry: "", // 荣誉名称
            hdryTime: "", // 荣誉时间
            psType: "2",
            orgUserId: 0,
          },
        ],
        [
          {
            pjTitle: "", // 评价标题
            pjTime: "", // 评价时间
            pjContent: "", // 评价内容
            psType: "3",
            orgUserId: 0,
          },
        ],
        [
          {
            qt: "", // 其他
            psType: "4",
            orgUserId: 0,
          },
        ],
      ],
    };
  },
  created() {},
  methods: {
    addOne(i) {
      if (i === 0) {
        this.abilityDataList[i].push({
          hxjn: "", // 核心技能
          psType: "1",
          orgUserId: 0,
        });
      } else if (i === 1) {
        this.abilityDataList[i].push({
          hdry: "", // 荣誉名称
          hdryTime: "", // 荣誉时间
          psType: "2",
          orgUserId: 0,
        });
      } else if (i === 2) {
        this.abilityDataList[i].push({
          pjTitle: "", // 评价标题
          pjTime: "", // 评价时间
          pjContent: "", // 评价内容
          psType: "3",
          orgUserId: 0,
        });
      } else if (i === 3) {
        this.abilityDataList[i].push({
          qt: "", // 其他
          psType: "4",
          orgUserId: 0,
        });
      }
    },
    removeOne(i, j) {
      this.abilityDataList[i].splice(j, 1);
    },
    async submitForm() {
      // 二维变一维
      this.abilityDataList = this.abilityDataList.flat();
      this.abilityDataList.forEach((item) => {
        item.orgUserId = this.currentHumanId;
      });

      let data = {
        bdsOrgUserPsList: this.abilityDataList,
      };

      let res = await 个人能力增加(data);
      if (res.code === 200) {
        this.$message.success(`个人能力增加成功`);
        console.log(`个人能力增加成功`);
      }
      console.log(res);
    },
    async updateForm() {
      this.abilityDataList = this.abilityDataList.flat();
      this.abilityDataList.forEach((item) => {
        item.orgUserId = this.currentHumanId;
      });

      let data = {
        bdsOrgUserPsList: this.abilityDataList,
      };

      let res = await 个人能力增加(data);
      if (res.code === 200) {
        this.$message.success(`个人能力修改成功`);
        console.log(`个人能力修改成功`);
      }
      console.log(res);
    },
    async deleteForm() {},
    handleClick() {},
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
::v-deep .el-tabs__item {
  color: #d7d0d0;
}
::v-deep .el-tabs__item.is-active {
  color: #fff;
  font-weight: bolder;
}
::v-deep .el-form-item__label {
  color: #fff;
}
::v-deep .el-input__inner {
  background-color: transparent;
  color: #fff;
}
</style>
