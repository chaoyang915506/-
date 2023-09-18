<template>
  <div class="fz-container">
    <!-- 图标 -->
    <div class="icon_list_style" v-if="weatherData && weatherData.length">
      <weather-icon
        v-for="i in weatherData"
        :key="i.algType ? i.algType : null"
        :texture="i.algType ? i.algType : null"
        :count="i.count"
      ></weather-icon>
    </div>
    <!--搜索框 -->
    <el-form :model="form" :inline="true" size="small">
      <!-- <el-form-item>
        <el-select v-model="selectModel" placeholder="" @change="clearSelect">
          <el-option label="按生成时间" value="1"></el-option>
          <el-option label="按算法名称" value="2"></el-option>
          <el-option label="按算法种类" value="3"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item>
        <el-date-picker
          v-if="selectModel == 1"
          v-model="timePicker"
          type="daterange"
          class="timeline_css"
          range-separator="-"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          @change="getDate"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :size="size"
          clearable
        />

        <el-input
          v-if="selectModel == 2"
          placeholder="请输入模型名称"
          size="small"
          v-model="queryParams.modelName"
          clearable
        >
        </el-input>

        <el-select
          v-if="selectModel == 3"
          v-model="queryParams.algType"
          placeholder="请选择算法种类"
          clearable
        >
          <el-option
            v-for="item in alg_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-input
          clearable
          size="default"
          v-model="queryParams.algorithmName"
          placeholder="请输入名称"
          @clear="getInitList"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="getInitList"
          type="primary"
          class="common_style"
          round
          size="default"
          >确定</el-button
        >
      </el-form-item>
      <el-button
        style="float: right"
        type="primary"
        class="common_style"
        round
        size="default"
        icon="Plus"
        @click="handleAdd"
        >新增</el-button
      >
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" ref="eletable">
      <el-table-column type="index" width="55" align="center" label="序号" />
      <el-table-column label="算法名称" align="center" prop="algorithmName" />
      <!-- <el-table-column label="算法类型" align="center" prop="algorithmType" :formatter="formatterType" /> -->
      <!-- <el-table-column
        label="适用场景"
        align="center"
        prop="applyScene"
        :show-overflow-tooltip="true"
      /> -->
      <el-table-column
        label="版本号"
        align="center"
        prop="algorithmVersion"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="算法排名"
        align="center"
        prop="algorithmSort"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="平均绝对误差"
        align="center"
        prop="meanAbsoluteError"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="算法接口地址"
        align="center"
        prop="algInterfacePath"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="均方根误差"
        align="center"
        prop="rootMeanSquareError"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="使用场景"
        align="center"
        prop="applicationScenario"
        :formatter="formatterScene"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <!-- <el-table-column
        label="预测成功率"
        align="center"
        prop="forecastSuccessRate"
        :show-overflow-tooltip="true"
      >
        <template #default="{ row }">
          {{ row.forecastSuccessRate * 100 + "%" }}
        </template>
      </el-table-column> -->
      <el-table-column label="添加时间" align="center" prop="createTime">
        <template #default="{ row }">{{
          proxy.parseTime(row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
        }}</template>
      </el-table-column>
      <el-table-column
        label="详情"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button size="mini" type="text" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="text" @click="handleCheck(scope.row)"
            >查看</el-button
          >
          <el-button size="mini" type="text" @click="hangleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getInitList"
    />
    <!-- 新增算法 -->
    <el-dialog v-model="open" width="40%" :title="title">
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        size="default"
        label-width="110px"
        :class="isCheck ? 'el-form-check' : ''"
      >
        <el-form-item label="算法名称" prop="algorithmName">
          <el-input
            v-model="form.algorithmName"
            placeholder="请输入算法名称"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="算法类型" prop="algorithmType">
          <el-select v-model="form.algorithmType" filterable placeholder="请选择算法类型类型" style="width:100%">
            <el-option v-for="item in algorithm_type_code" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="版本号" prop="algorithmVersion">
          <el-input
            v-model="form.algorithmVersion"
            placeholder="请输入版本号"
          ></el-input>
        </el-form-item>
        <el-form-item label="算法排名" prop="algorithmSort">
          <el-input
            v-model="form.algorithmSort"
            placeholder="请输入算法排名"
          ></el-input>
        </el-form-item>
        <el-form-item label="算法接口地址" prop="algInterfacePath">
          <el-input
            v-model="form.algInterfacePath"
            placeholder="例 : /api/dl/comprehensive_risk/"
          ></el-input>
        </el-form-item>
        <el-form-item label="平均绝对误差" prop="meanAbsoluteError">
          <el-input
            v-model="form.meanAbsoluteError"
            placeholder="请输入平均绝对误差"
          ></el-input>
        </el-form-item>
        <el-form-item label="均方根误差" prop="rootMeanSquareError">
          <el-input
            v-model="form.rootMeanSquareError"
            placeholder="请输入均方根误差"
          ></el-input>
        </el-form-item>
        <el-form-item label="使用场景" prop="applicationScenario">
          <el-select
            v-model="form.applicationScenario"
            filterable
            placeholder="请选择使用场景"
            style="width: 100%"
          >
            <el-option
              v-for="item in alg_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer v-if="!isCheck">
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { toflowData, findPic } from "../js/fomatter";
import {
  getList,
  deleteById,
  getById,
  updateData,
  addData,
  getmodelCount,
} from "@/api/algLibrary/algLibrary.js";
const { proxy } = getCurrentInstance();
const { alg_type, algorithm_type_code } = proxy.useDict(
  "alg_type",
  "algorithm_type_code"
);
const loading = ref(false);
const open = ref(false);
let title = ref("");
const data = reactive({
  weatherData: [],
  tableData: [],
  timePicker: [],
  form: {},
  rules: {
    algorithmName: [
      { required: true, message: "请输入算法名称", trigger: "blur" },
    ],
    algorithmType: [
      { required: true, message: "请选择算法类型", trigger: "change" },
    ],
    applicationScenario: [
      { required: true, message: "请选择使用场景", trigger: "change" },
    ],
    algorithmVersion: [
      { required: true, message: "请输入版本号", trigger: "blur" },
    ],
    algorithmSort: [
      { required: true, message: "请输入算法排名", trigger: "blur" },
    ],
    meanAbsoluteError: [
      { required: true, message: "请输入平均绝对误差", trigger: "blur" },
    ],
    rootMeanSquareError: [
      { required: true, message: "请输入均方根误差", trigger: "blur" },
    ],
    algInterfacePath: [
      { required: true, message: "请输入算法接口地址", trigger: "blur" },
    ],
  },
  queryParams: {
    // beginTime: "",
    // endTime: "",
    pageNum: 1,
    pageSize: 10,
    // facilityId: "",
    // modelName: "",
    algorithmTypeCode: "5",
  },
  //点击查看
  isCheck: false,
  selectModel: "",
  total: 0,
});
const clearSelect = () => {
  data.queryParams = {
    pageNum: 1,
    pageSize: 10,
  };
  data.timePicker = [];
};
const {
  weatherData,
  isCheck,
  queryParams,
  total,
  tableData,
  selectModel,
  timePicker,
  form,
  rules,
} = toRefs(data);
onMounted(() => {
  getInitList();
  getModelCountData();
});
//日期选择器
const getDate = (e) => {
  if (!e) {
    data.queryParams.beginTime = "";
    data.queryParams.endTime = "";
  } else {
    data.queryParams.beginTime = e[0];
    data.queryParams.endTime = e[1];
  }
};
async function getInitList() {
  loading.value = true;
  let res = await getList(queryParams.value);
  if (res.code == 200) {
    total.value = res.total;
    tableData.value = res.rows;
    loading.value = false;
  }
}
//获取icon的数据
async function getModelCountData() {
	let res = await getmodelCount({
		algorithmTypeCode: queryParams.value.algorithmTypeCode,
	});
	if (res.code == 200) {
		let arrlist = [];
		arrlist = res.data.map((i) => {
			let resutls = alg_type.value.find((idx) => idx.value == i.algType);
			if (resutls) {
				return {
					...i,
					algType: resutls.label,
				};
			}
		});
		// console.log(arrlist, "list");
		let num = eval(res.data.map((i) => i.count).join("+"));
		arrlist.unshift({
			algType: "全部",
			count: num ? num : 0,
		});
		setTimeout(() => {
			data.weatherData = arrlist;
		}, 0);
	}
}
//  重置
function reset() {
  form.value = {
    algorithmTypeCode: data.queryParams.algorithmTypeCode,
    algorithmName: undefined,
    algorithmVersion: undefined,
    applicationScenario: undefined,
    algorithmType: undefined,
    algorithmSort: undefined,
    meanAbsoluteError: undefined,
    rootMeanSquareError: undefined,
  };
  proxy.resetForm("formRef");
}
// 提交
const submitForm = () => {
  proxy.$refs["formRef"].validate(async (valid) => {
    if (valid) {
      if (form.value.id) {
        let res = await updateData(form.value);
        if (res.code == 200) {
          open.value = false;
          getInitList();
        }
      } else {
        let res = await addData(form.value);
        if (res.code == 200) {
          open.value = false;
          getInitList();
        }
      }
    }
  });
};
// 取消
const cancel = () => {
  open.value = false;
};
// 获取算法信息
const getInfoByid = async (row) => {
  let res = await getById(row.id);
  if (res.code == 200) {
    form.value = res.data;
  }
};
// 查看、
const handleCheck = (row) => {
  reset();
  data.isCheck = true;
  open.value = true;
  title.value = "查看";
  getInfoByid(row);
};
// 删除
function hangleDelete(row) {
  proxy.$modal
    .confirm("是否确认删除选中的数据项？")
    .then(function () {
      return deleteById(row.id);
    })
    .then(() => {
      getInitList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}
// 编辑
function handleEdit(row) {
  reset();
  data.isCheck = false;
  open.value = true;
  title.value = "编辑";
  getInfoByid(row);
}
// 新增
function handleAdd(row) {
  reset();
  title.value = "新增";
  data.isCheck = false;
  open.value = true;
}
// 格式化列表
const formatterScene = (row, column, columnIndex) => {
  let result = alg_type.value.find((item) => item.value == columnIndex);
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
const formatterType = (row, column, columnIndex) => {
  let result = algorithm_type_code.value.find(
    (item) => item.value == columnIndex
  );
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
</script>

<style scoped>
@import url("../css/index.css");

.defined-divider :deep(.el-divider__text) {
  color: #058e8a !important;
  background: #363636 !important;
  font-size: 20px;
  padding: 0 10px;
}

.defined-progress :deep(.el-progress-bar__outer) {
  background: #7f7f7f !important;
  overflow: inherit !important;
}

.defined-progress :deep(.el-progress-bar__innerText) {
  position: absolute !important;
  top: -20px !important;
}
.common_style {
  color: #fff;
  background-color: #3d5a5d !important;
}
.common_style:hover {
  background-color: #57d0d8 !important;
  font-weight: 500 !important;
  opacity: 1;
  border-color: #57d0d8;
}
</style>
