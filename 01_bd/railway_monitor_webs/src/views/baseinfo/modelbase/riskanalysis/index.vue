<template>
  <div class="app-container">
    <!-- 图标 -->
    <div class="icon_list_style">
      <weather-icon
        v-for="i in weatherData"
        :key="i.name"
        :texture="i.algType"
        :count="i.count"
      ></weather-icon>
    </div>
    <!--搜索框 -->
    <el-form :model="form" :inline="true" size="normal">
      <el-form-item>
        <el-select v-model="selectModel" placeholder="" @change="clearSelect">
          <el-option label="按生成时间" value="1"></el-option>
          <el-option label="按模型名称" value="2"></el-option>
          <el-option label="按算法种类" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
         class="timeline_css"
          v-if="selectModel == 1"
          v-model="timePicker"
          type="daterange"
          range-separator="-"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          @change="getDate"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :size="size"
        />
        <el-input
          v-if="selectModel == 2"
          placeholder="请输入模型名称"
          size="normal"
          v-model="queryParams.modelName"
          clearable
        ></el-input>

        <el-select
          v-if="selectModel == 3"
          v-model="queryParams.algType"
          placeholder="请选择算法种类"
          clearable
        >
          <el-option label="异物风险分析" value="5"></el-option>
          <el-option label="环境风险分析" value="6"></el-option>
          <el-option label="综合风险分析" value="7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn_submit" @click="getList"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" ref="eletable">
      <el-table-column type="index" width="55" align="center" label="序号" />
      <el-table-column label="模型名称" align="center" prop="modelName" />
      <el-table-column
        label="适用场景"
        align="center"
        prop="applyScene"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="版本号"
        align="center"
        prop="version"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="算法排名"
        align="center"
        prop="algorithmRanking"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="预测成功率"
        align="center"
        prop="forecastSuccessRate"
        :show-overflow-tooltip="true"
      >
        <template #default="{ row }">
          {{ row.forecastSuccessRate * 100 + "%" }}
        </template>
      </el-table-column>
      <el-table-column label="生成时间" align="center" prop="createTime">
      </el-table-column>
      <el-table-column label="使用前" align="center" prop="beforeImage">
        <template #default="{ row }">
          <el-image :src="row.beforeImage" fit="fill" :lazy="true"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="使用后" align="center" prop="afterImage">
        <template #default="{ row }">
          <el-image :src="row.afterImage" fit="fill" :lazy="true"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="详情"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button size="mini" type="text" @click="look_details(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getAllData"
    />

    <!-- 查看 -->
    <el-dialog v-model="check_details" title="查看" style="position: relative">
      <div
        class="dialog_deatils"
        style="position: relative; with: 100%; height: 100%"
      >
        <div class="left">
          <el-form
            :model="formData"
            ref="formDataRef"
            label-position="left"
            label-width="40%"
            :inline="false"
            size="normal"
          >
            <el-form-item label="模型名称">
              <span class="detail_style">{{ formData.modelName }}</span>
            </el-form-item>
            <el-form-item label="适用场景">
              <span class="detail_style">{{ formData.applyScene }} </span>
            </el-form-item>
            <el-form-item label="算法排名">
              <span class="detail_style">{{ formData.algorithmRanking }} </span>
            </el-form-item>
            <el-form-item label="预测成功率">
              <span class="detail_style"
                >{{ formData.forecastSuccessRate * 100 + "%" }}
              </span>
            </el-form-item>
            <el-form-item label="算法功能">
              <span class="detail_style"
                >{{ formData.algorithmFunction }}
              </span>
            </el-form-item>
            <el-form-item label="版本号">
              <span class="detail_style">{{ formData.version }} </span>
            </el-form-item>
            <el-form-item label="样本集名称">
              <span class="detail_style">{{ formData.sampleSetName }} </span>
            </el-form-item>
            <el-form-item label="算法文件存储位置">
              <span class="detail_style">{{ formData.algFilePath }} </span>
            </el-form-item>
            <el-form-item label="生成时间">
              <span class="detail_style">{{ formData.addTime }} </span>
            </el-form-item>
            <el-form-item label="备注">
              <span class="detail_style">{{ formData.remark }} </span>
            </el-form-item>
          </el-form>
        </div>

        <div class="right">
          <div class="img1">
            <el-image
              style="width: 100%; height: 100%"
              :src="formData.beforeImage"
              fit="fill"
              :lazy="true"
            ></el-image>
          </div>
          <div class="img2">
            <el-image
              style="width: 100%; height: 100%"
              :src="formData.afterImage"
              fit="fill"
              :lazy="true"
            ></el-image>
          </div>
          <div class="info">算法使用前后对比图</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { toflowData, findPic } from "../js/fomatter";

import { getforeign, addforeign } from "@/api/baseinfo/scenarion.js";
import {
  getmodellist,
  getmodelCount,
  inquire,
} from "@/api/baseinfo/modelbase.js";

const { proxy } = getCurrentInstance();
const { texture,  alg_type } = proxy.useDict(
  "alg_type",
  "texture"
);
const loading = ref(false);
const data = reactive({
  weatherData: [],
  tableData: [],
  timePicker: [],
  queryParams: {
    pageNum: "",
    pageSize: "",
    modelName: "",
    facilityId: "",
    beginTime: "",
    endTime: "",
  },
  //点击查看
  check_details: false,
  formData: {},
  selectModel: "",
  total: 0,
});
const {
  timePicker,
  weatherData,
  formData,
  check_details,
  queryParams,
  total,
  tableData,
  selectModel,
} = toRefs(data);
const getDate = (e) => {
  if (!e) {
    data.queryParams.beginTime = "";
    data.queryParams.endTime = "";
  } else {
    data.queryParams.beginTime = e[0];
    data.queryParams.endTime = e[1];
  }
};

const clearSelect = () => {
  data.queryParams = { applyScene: data.queryParams.applyScene };
  data.timePicker = [];
};
// 列表数据
async function getList() {
  loading.value = true;
  const res = await getmodellist({ modelType: 2, ...data.queryParams });
  loading.value = false;
  // console.log(res, "列表数据");
  data.tableData = res.rows.map((i) => {
    return {
      ...i,
      beforeImage: i.files ? findPic(i.files, 0) : "",
      afterImage: i.files ? findPic(i.files, 1) : "",
    };
  });
  data.total = res.total;
}
getList();
//获取icon的数据
getmodelCount({ modelType: 2 }).then((res) => {
  let arrlist = [];
  arrlist = res.data.map((i) => {
    let resutls = alg_type.value.find((idx) => idx.value == i.algType);
    return {
      ...i,
      algType: resutls ? resutls.label : "无",
    };
  });
  let num = eval(res.data.map((i) => i.count).join("+"));
  arrlist.unshift({
    algType: "全部",
    count: num ? num : 0,
  });
  data.weatherData = arrlist;
});
// 查看、
const look_details = (item) => {
  loading.value = true;

  inquire(item.id)
    .then((res) => {
      let itemd = res.data;
      data.formData = {
        ...itemd,
        beforeImage: itemd.files ? findPic(itemd.files, 0) : "",
        afterImage: itemd.files ? findPic(itemd.files, 1) : "",
      };
      data.formData = res.data;
      loading.value = false;
      data.check_details = true;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
  // console.log(item);
};
</script>

<style scoped>
@import url("../css/index.css");
</style>