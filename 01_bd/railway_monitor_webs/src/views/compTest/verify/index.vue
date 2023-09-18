<template>
  <div class="fz-container">
    <el-row :gutter="20" v-show="view == 'home'" v-loading="loading">
      <el-col :span="12" :offset="6">
        <el-divider content-position="left" class="defined-divider"
          >验证</el-divider
        >

        <el-form
          :model="queryParams"
          ref="form"
          :inline="false"
          size="normal"
          :rules="rules"
          style="margin-top: 10%"
          label-width="110px"
          hide-required-asterisk="false"
        >
          <el-form-item label="算法种类" prop="alg_type">
            <el-select
              v-model="queryParams.alg_type"
              placeholder="请选择算法种类"
              clearable
              filterable
              @change="selectalg"
            >
              <el-option
                v-for="item in alg_typeC"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模型" prop="ids">
            <el-select
              clearable
              multiple
              placeholder="请选择模型"
              v-model="queryParams.ids"
            >
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.modelName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片">
            <update v-model="queryParams.file" />
          </el-form-item>
          <el-form-item
            label="背景图片"
            v-if="coutent == 'pic' || coutent == 'text8'"
          >
            <update v-model="queryParams.backgroundFile" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit_hub" class="btn_submit"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <verifyTable
      v-if="view == 'table'"
      @gohome="gohome"
      :tableData="tableData"
      :coutent="coutent"
    />
  </div>
</template>
<script setup>
import { reactive, toRefs } from "@vue/reactivity";
import update from "./update.vue";
import verifyTable from "./verifytable.vue";
const { proxy } = getCurrentInstance();
const {} = proxy.useDict();
import {
  getModelByAigType,
  validateion,
} from "@/api/simulation/compTest/verify.js";
let loading = ref(false);
const data = reactive({
  queryParams: {
    alg_type: "",
    ids: [],
    file: "",
    backgroundFile: "",
  },

  alg_typeC: [
    {
      label: "去雾",
      value: "0",
    },
    {
      label: "去雨",
      value: "1",
    },
    {
      label: "去雪",
      value: "2",
    },
    {
      label: "场景识别算法",
      value: "3",
    },
    {
      label: "场景分割算法",
      value: "4",
    },
    {
      label: "材质识别算法",
      value: "8",
    },
  ],
  modelList: [],
  view: "home",
  tableData: [],
  rules: {
    alg_type: [{ required: true, message: "请选择算法", trigger: "change" }],
    ids: [{ required: true, message: "请选择模型", trigger: "change" }],
  },
  coutent: "",
});
const { queryParams, alg_typeC, modelList, view, rules, coutent, tableData } =
  toRefs(data);

const selectalg = async (e) => {
  try {
    if (e == "1" || e == "2" || e == "0") {
      coutent.value = "pic";
    } else if (e == "3") {
      coutent.value = "text3";
      queryParams.value.backgroundFile = "";
    } else if (e == "4") {
      coutent.value = "text4";
      queryParams.value.backgroundFile = "";
    } else {
      coutent.value = "text8";
    }
    data.modelList = [];
    data.queryParams.ids = [];
    const results = await getModelByAigType({ algType: e });
    if (results.code == 200) {
      if (results.data.length == 0)
        return proxy.$modal.msgError("该算法下没有模型");
      //   console.log(results);
      data.modelList = results.data;
    }
  } catch (error) {
    console.log(error);
  }
};

//提交
const submit_hub = () => {
  proxy.$refs["form"].validate(async (valid) => {
    if (valid) {
      //   console.log(data.queryParams, "ti");
      if (!data.queryParams.file) return proxy.$modal.msgError("图片不能为空");
      if (coutent.value == "pic" || coutent.value == "text8") {
        if (!data.queryParams.backgroundFile)
          return proxy.$modal.msgError("背景图片不能为空");
      }

      let params = new FormData();
      // console.log(data.queryParams.file, "rrr");
      params.append("file", data.queryParams.file);
      if (data.queryParams.backgroundFile !== "") {
        params.append("backgroundFile", data.queryParams.backgroundFile);
      }
      //   params.append("ids", data.queryParams.ids.join(","));

      try {
        loading.value = true;
        let rresults = await validateion(
          params,
          data.queryParams.ids.join(",")
        );
        if (rresults.code == 200) {
          if (rresults.rows.length == 0)
            return proxy.$modal.msgError("当前模型下没有数据");

          data.tableData = rresults.rows.map((i) => {
            return {
              ...i,
              image1: proxy.$arrayBufferToBlob(i.image),
              image2: proxy.$arrayBufferToBlob(i.origImage),
              image3: i.backgroundImage
                ? proxy.$arrayBufferToBlob(i.backgroundImage)
                : "",
            };
          });
          loading.value = false;
          data.view = "table";
        }
      } catch (error) {
        loading.value = false;
        console.log(error);
      }
    }
  });
};

const gohome = (val) => {
  data.view = val;
};
</script>
<style lang="scss" scoped>
.defined-divider :deep(.el-divider__text) {
  color: #058e8a !important;
  background: #363636 !important;
  font-size: 26px;
  padding: 0 10px;
}
</style>