<template>
  <div class="fz-container">
    <!-- 图标 -->
    <div class="icon_list_style" v-if="weatherData && weatherData.length">
      <weather-icon
        v-for="i in weatherData"
        :key="i.algType"
        :texture="i.algType"
        :count="i.count"
      ></weather-icon>
    </div>
    <!--搜索框 -->
    <el-form :model="form" :inline="true" size="small">
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
        >新增算法</el-button
      >
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
          range-separator="-"
          class="timeline_css"
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
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" ref="eletable">
      <el-table-column type="index" width="55" align="center" label="序号" />
      <el-table-column label="算法名称" align="center" prop="algorithmName" />
      <el-table-column
        label="适用场景"
        align="center"
        prop="applicationScenario"
        :formatter="formatterScene"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="版本号"
        align="center"
        prop="algorithmVersion"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="rownum"
        label="算法排名"
        align="center"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="识别准确度"
        align="center"
        prop="acc"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <!-- <el-table-column label="结构相似度" align="center" prop="algorithmRanking" :show-overflow-tooltip="true">
      </el-table-column> -->
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
			<el-table-column label="生成时间" align="center" prop="createTime">
				<template #default="{ row }">{{
					proxy.parseTime(row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
				}}</template>
			</el-table-column>
			<el-table-column label="使用前" align="center" prop="beforeImage">
				<template #default="{ row }">
					<el-image :src="'data:image/png;base64,'+row.imagePr" fit="fill" :lazy="true"></el-image>
				</template>
			</el-table-column>
			<el-table-column label="使用后" align="center" prop="afterImage">
				<template #default="{ row }">
					<div
						style="
							background: rgba(255, 255, 255, 0.4);
							position: absolute;
							width: 90%;
							height: 80%;
							z-index: 10;
						"
						v-if="row.imageAf"
					></div>
					<el-image :src="'data:image/png;base64,'+row.imageAf"  fit="fill" :lazy="true"></el-image>
				</template>
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
					<el-button size="mini" type="text" @click="handleTrain(scope.row)"
						>训练</el-button
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
		<!-- 查看 -->
		<el-dialog v-model="openCheck" :title="title" :before-close="handleClose">
			<checkDialog
				:rowId="rowId"
				:alg_type="alg_type"
				:isCheck="isCheck"
				:activeMeunItem="activeMeunItem"
				@closeDialog="closeDialog"
			></checkDialog>
		</el-dialog>
		<!-- 新增算法 -->
		<el-dialog
			v-model="open"
			:width="title == '训练' ? '40%' : '70%'"
			:title="title"
			:before-close="handleClose"
		>
			<addDialog
				:alg_type="alg_type"
				:open="open"
				:title="title"
				:trainingList="data.trainingList"
				:rowId="rowId"
				@closeDialog="closeDialog"
			></addDialog>
		</el-dialog>
	</div>
</template>

<script setup>
import { findPic } from "../js/fomatter";
import addDialog from "./../component/addDialog.vue";
import checkDialog from "./../component/checkDialog.vue";
import {
	getList,
	deleteById,
	getmodelCount,
	getById,
} from "@/api/algLibrary/algLibrary.js";
const { proxy } = getCurrentInstance();
const { alg_type } = proxy.useDict("alg_type");
const loading = ref(false);
const open = ref(false);
let activeMeunItem = ref("3");

let title = ref("");
const data = reactive({
  trainingList: [],
  weatherData: [],
  tableData: [],
  timePicker: [],
  queryParams: {
    // beginTime: "",
    // endTime: "",
    pageNum: 1,
    pageSize: 10,
    // facilityId: "",
    // modelName: "",
    algorithmTypeCode: "1",
  },
  //点击查看
  openCheck: false,
  isCheck: false,
  selectModel: "",
  total: 0,
});
let rowId = ref(undefined);
const clearSelect = () => {
  data.queryParams = {
    pageNum: 1,
    pageSize: 10,
  };

  data.timePicker = [];
};
const {
  weatherData,
  openCheck,
  queryParams,
  total,
  tableData,
  selectModel,
  timePicker,
  form,
  isCheck,
} = toRefs(data);
onMounted(() => {
  getInitList();
  getModelCountData();
});
// 刷新列表
function closeDialog() {
  getInitList();
  handleClose();
}
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
function handleClose() {
  rowId.value = undefined;
  data.openCheck = false;
  open.value = false;
}
// 查看、
const handleCheck = (row) => {
  data.openCheck = true;
  data.isCheck = true;
  title.value = "查看";
  rowId.value = row.id;
};
// 删除
function hangleDelete(row) {
	proxy.$modal
		.confirm("是否确认删除选中的数据项？")
		.then(function () {
			deleteById(row.id);
		})
		.then(() => {
			getInitList();
			proxy.$modal.msgSuccess("删除成功");
		})
		.catch(() => {});
}
// 编辑
function handleEdit(row) {
  data.openCheck = true;
  data.isCheck = false;
  title.value = "编辑";
  rowId.value = row.id;
}
// 训练
function handleTrain(row) {
	title.value = "训练";
	open.value = true;
	getById(row.id).then((res) => {
		if (res.code == 200) data.trainingList = res.data;
	});
}
// 新增
function handleAdd(row) {
  title.value = "新增";
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
</script>

<style scoped>
@import url("../css/index.css");
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
