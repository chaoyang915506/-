<template>
	<div class="fz-container">
		<div class="my-tab-class">
			<div
				:class="activeIndex == 1 ? 'Manuals' : ''"
				class="Manual"
				@click="handleTabClick(1)"
			>
				监测点预测
			</div>
			<div
				:class="activeIndex == 2 ? 'Manuals' : 'Manual'"
				class="Manual"
				@click="handleTabClick(2)"
				style="margin-left: 20px"
			>
				线路段预测
			</div>
		</div>
		<el-form :model="queryParams" ref="queryRef" @submit.prevent>
			<el-row :gutter="20">
				<el-col :span="4">
					<el-form-item prop="roleName">
						<!-- style="width: 240px" -->
						<!-- size="small" -->
						<el-input
							size="default"
							v-model="queryParams.roleName"
							placeholder="请输入角色名称"
							clearable
							@keyup.enter="handleQuery"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<!-- class="btn_submit timeline_css" -->
					<el-button
						type="primary"
						size="default"
						class="common_style"
						round
						@click="handleQuery"
						>确定</el-button
					>
					<el-button
						icon="Refresh"
						type="primary"
						class="common_style"
						round
						size="default"
						@click="resetQuery"
						>重置</el-button
					>
				</el-col>
				<el-col :span="12" style="text-align: right">
					<el-button
						icon="Delete"
						type="primary"
						class="common_style"
						round
						size="default"
						:disabled="multiple"
						@click="handleDelete"
						>删除
					</el-button>
					<el-button
						type="primary"
						class="common_style"
						round
						size="default"
						icon="Plus"
						@click="handleAdd"
						>新增预测</el-button
					>
				</el-col>
			</el-row>
		</el-form>
		<el-table
			v-loading="loading"
			:data="tableData"
			style="width: 100%"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" />
			<el-table-column type="index" label="序号" width="55" align="center" />
			<el-table-column
				:label="activeIndex == 1 ? '监测点' : '线路段'"
				align="center"
			>
				<template #default="scope">
					<span v-if="activeIndex == 1">{{
						formatterLineAndMointor(scope.row.lineId, scope.row.monitorId)
					}}</span>
					<span v-else>{{ formatterLineAndMointor(scope.row.lineId) }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="algorithmId" label="选用算法" align="center">
				<template #default="scope">
					<span>{{ formatterAlgorithm(scope.row.algorithmId) }}</span>
				</template>
			</el-table-column>
			<el-table-column
				prop="configType"
				label="类型"
				align="center"
				:formatter="formatterType"
			/>
			<el-table-column prop="conLimitDuration" align="center" label="历史周期">
				<template #default="scope">
					<span>{{ scope.row.historyStartDate }}</span>
					-
					<span>{{ scope.row.historyStartDate }}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="volume" align="center" label="预测周期">
        <template #default="scope">
          <span>{{ scope.row.forecastStartDate }}</span>
          -
          <span>{{ scope.row.forecastEndDate }}</span>
        </template>
      </el-table-column> -->
			<el-table-column
				label="操作"
				align="center"
				width="150"
				class-name="small-padding fixed-width"
			>
				<template #default="scope">
					<el-button
						size="mini"
						type="text"
						icon="View"
						@click="handleCheck(scope.row)"
						>查看</el-button
					>
					<el-button
						size="mini"
						type="text"
						icon="Edit"
						@click="handleEdit(scope.row)"
						>编辑</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			v-show="total > 0"
			:total="total"
			v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize"
			@pagination="getList"
		/>
		<!-- 添加、修改、查看 -->
		<el-dialog
			:title="title"
			v-model="open"
			width="60%"
			style="position: relative"
		>
			<el-form
				v-loading="loadingdig"
				ref="formRef"
				hide-required-asterisk
				:model="form"
				:rules="rules"
				label-width="110px"
				:class="isCheck ? 'el-form-check' : ''"
			>
				<el-form-item label="线路" prop="lineId">
					<el-select
						v-model="form.lineId"
						placeholder="请选择线路"
						size="small"
						@change="handleSelect(form.lineId)"
						style="width: 100%"
						:disabled="isCheck"
					>
						<el-option
							v-for="item in lineData"
							:key="item.id"
							:label="item.lineName"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="监测点" prop="monitorId" v-if="activeIndex == 1">
					<el-select
						v-model="form.monitorId"
						placeholder="请选择监测点"
						size="small"
						style="width: 100%"
						:disabled="isCheck"
					>
						<el-option
							v-for="item in monitorOpt"
							:key="item.id"
							:label="item.monitoringPointName"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="选用算法" prop="algorithmId">
					<el-select
						v-model="form.algorithmId"
						placeholder="请选择选用算法"
						size="small"
						style="width: 100%"
						:disabled="isCheck"
					>
						<!-- algorithmOpt -->
						<el-option
							v-for="item in algolist"
							:key="item.id"
							:label="item.algorithmName"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="类型" prop="configType">
					<el-select
						v-model="form.configType"
						placeholder="请选择类型"
						size="small"
						style="width: 100%"
						:disabled="isCheck"
					>
						<el-option
							v-for="item in weatherlist"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="均方根误差" v-if="form.id">
					<el-input v-model="form.rmse" placeholder="" size="small"></el-input>
				</el-form-item>
				<el-form-item label="平均绝对误差" v-if="form.id">
					<el-input v-model="form.mae" placeholder="" size="small"></el-input>
				</el-form-item>

				<el-form-item
					label="预测时长"
					style="display: flex"
					class="forecast_css"
				>
					<el-form-item prop="predStep" style="width: 50%">
						<el-input
							v-model="form.predStep"
							placeholder=""
							size="small"
							clearable
						></el-input>
					</el-form-item>
					<el-form-item style="flex: 0.9">
						<el-select
							placeholder="请选择"
							filterable
							size="small"
							class="select_diy"
							:disabled="isCheck"
							v-model="form.forecastUnit"
						>
							<el-option value="month" label="月"></el-option>
							<el-option value="day" label="日"></el-option>
						</el-select>
					</el-form-item>
				</el-form-item>

				<el-form-item
					label="历史周期"
					style="display: flex"
					class="forecast_css"
				>
					<el-form-item prop="historyStartDate" class="date_pick">
						<el-date-picker
							:type="formattime.type"
							placeholder="请选择日期"
							v-model="form.historyStartDate"
							@change="clearforecastUnit"
							:value-format="formattime.format"
							:format="formattime.format"
							:disabled-date="getcreateTime"
							:default-value="defaultTime"
						></el-date-picker>
					</el-form-item>
					<el-form-item prop="historyEndDate" class="date_pick">
						<el-date-picker
							:type="formattime.type"
							placeholder="请选择日期"
							v-model="form.historyEndDate"
							:value-format="formattime.format"
							:format="formattime.format"
							:disabledDate="getendTime"
						></el-date-picker>
					</el-form-item>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="submitForm">确 定</el-button>
					<el-button @click="open = false">取 消</el-button>
				</div>
			</template>
			<div
				v-if="title == '查看预测'"
				style="width: 100%; height: 500px; background: #fff"
			>
				<echartbar :echartData="echartData" />
			</div>
		</el-dialog>
	</div>
</template>
<script setup>
import echartbar from "./echartbar.vue";
import { formatterData } from "./calculate";
import {
	listPage,
	addData,
	updateData,
	deleteData,
	findLineTree,
	getalgorithmId,
	findforecast,
} from "@/api/statisticsVerify/statisticsVerify.js";
import { computed } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
let weatherlist = ref([
	{ value: "1", label: "异物" },
	{ value: "2", label: "天气" },
	{ value: "4", label: "情景综合" },
]);

let { proxy } = getCurrentInstance();

// const { configuration_type } = proxy.useDict("configuration_type");

const formattime = computed(() => {
	if (data.form.forecastUnit == "month") {
		return {
			format: "YYYY-MM",
			type: "month",
			defautValue: new Date().getMonth() + 1 - 16,
		};
	} else {
		return { format: "YYYY-MM-DD", type: "date", defautValue: new Date() };
	}
});
const getcreateTime = (time) => {
	// console.log(time.getTime());
	if (data.form.forecastUnit == "day") {
		return time.getTime() >= Date.now() - 16 * 8.64e7;
	} else {
		let y = new Date().getFullYear();
		let m = new Date().getMonth() + 1;
		let month = new Date(`${y}-${m}`);
		let lasttime = month.setMonth(month.getMonth() - 16);
		return time.getTime() >= lasttime;
	}
};
const getendTime = (time) => {
	// if (!data.form.historyStartDate) return true;
	// if (data.form.historyStartDate) {
	if (data.form.forecastUnit == "day") {
		// let y = new Date(data.form.historyStartDate).getFullYear();
		// let m = new Date(data.form.historyStartDate).getMonth() + 1;
		// let d = new Date(data.form.historyStartDate).getDate();
		// let t = new Date(`${y}-${m}-${d}`);
		// let lastt = t.setDate(t.getDate() + 16);
		// console.log(lastt, "shuju");
		let y = new Date().getFullYear();
		let m = new Date().getMonth() + 1;
		let d = new Date().getDate();
		let nowtime = new Date(`${y}-${m}-${d}`);
		return time.getTime() != Date.parse(nowtime);
		// return time.getTime() < lastt || time.getTime() >= Date.now();
	} else {
		// let y = new Date(data.form.historyStartDate).getFullYear();
		// let m = new Date(data.form.historyStartDate).getMonth() + 1;
		// let month = new Date(`${y}-${m}`);
		// let lasttime = month.setMonth(month.getMonth() + 16);
		let nowy = new Date().getFullYear();
		let nowm = new Date().getMonth() + 1;
		let lastM = new Date(`${nowy}-${nowm}`);

		// return time.getTime() >= lastM || time.getTime() < lasttime;
		return time.getTime() != Date.parse(lastM);
	}
	// }
};
//默认选择的时间
const defaultTime = computed(() => {
	let t = new Date();
	return data.form.forecastUnit == "month"
		? t.setMonth(t.getMonth() - 16)
		: t.setDate(t.getDate() - 16);
});

//清空下拉框
const clearforecastUnit = () => {
	let date = new Date()
		.toLocaleDateString()
		.split("/")
		.map((item) => {
			if (item < 10) {
				return "0" + item;
			} else {
				return item;
			}
		})
		.join("-");
	if (data.form.forecastUnit == "month") {
		data.form.historyEndDate = getNowMonth();
	} else {
		data.form.historyEndDate = date;
	}
};
function getNowMonth() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	month = month > 9 ? month : "0" + month;
	var nowMonth = year + "-" + month;
	return nowMonth;
}
const defaultendValue = computed(() => {
	let y = new Date().getFullYear();
	let m = new Date().getMonth() + 1;
	let d = new Date().getDate();
	if (data.form.forecastUnit == "month") {
		return `${y}-${m}`;
	} else {
		return `${y}-${m}-${d}`;
	}
});
const open = ref(false);
const loading = ref(false);
const isCheck = ref(false);
const ids = ref([]);
const tableData = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
let activeIndex = ref(1);

let lineOpt = ref([]);
let monitorOpt = ref([]);
let month = ref(`${new Date().getFullYear()}-${new Date().getMonth() + 1}`);
let date = ref(
	`${new Date().getFullYear()}-${
		new Date().getMonth() + 1
	}-${new Date().getDate()}`
);

const data = reactive({
	echartData: {},
	form: {
		lineId: "",
		monitorId: "",
		algorithmId: "",
		configType: "",
		historyDate: "",
		predStep: "",
		forecastUnit: "day",
		historyEndDate: "",
		historyStartDate: "",
		// data.form.forecastUnit == "day" ? `` : `${y}-${m}`,
		algInterfacePath: "",
	},
	queryParams: {
		pageNum: 1,
		pageSize: 10,
		roleName: undefined,
		forecastType: undefined,
	},
	rules: {
		lineId: [{ required: true, message: "线路不能为空", trigger: "change" }],
		monitorId: [
			{ required: true, message: "监测点不能为空", trigger: "change" },
		],
		algorithmId: [
			{ required: true, message: "选用算法不能为空", trigger: "change" },
		],
		configType: [
			{ required: true, message: "类型不能为空", trigger: "change" },
		],
		historyDate: [
			{ required: true, message: "历史周期不能为空", trigger: "change" },
		],
		predStep: [
			{ required: true, message: "预测时长不能为空", trigger: "blur" },
			{ pattern: /^[0-9]*$/, message: "请输入数字", trigger: "change" },
			,
		],
		historyStartDate: [
			{ required: true, message: "历史启始周期不能为空", trigger: "change" },
		],
		historyEndDate: [
			{ required: true, message: "历史结束周期不能为空", trigger: "change" },
		],
	},
});
watch(
	() => data.form.forecastUnit,
	() => {
		data.form.historyEndDate = "";
		data.form.historyStartDate = "";
	}
);
watch(
	() => data.form.forecastUnit,
	(val) => {
		// console.log("标红", val);
		// console.log(month.value, "月");
		if (val == "day") {
			data.form.historyEndDate = date.value;
		} else if (val == "month") {
			data.form.historyEndDate = month.value;
		}
	},
	{
		deep: true,
		immediate: true,
	}
);
const { queryParams, form, rules, echartData } = toRefs(data);
onMounted(() => {
	findLineTreeData();
	getList();
});

/** 查询列表 */
function getList() {
	loading.value = true;
	queryParams.value.forecastType = activeIndex.value;
	listPage(queryParams.value).then((response) => {
		tableData.value = response.rows;
		total.value = response.total;
		loading.value = false;
	});
}
let lineData = ref([]);
// 获取监测点和线路
const findLineTreeData = async () => {
	let res = await findLineTree();
	if (res.code == 200) {
		// console.log(res.data, "线路res");
		lineData.value = res.data;
		lineOpt.value = JSON.parse(JSON.stringify(res.data));
	}
};
// 筛选监测点
const handleSelect = (val) => {
	// console.log(val, "val");
	data.form.monitorId = undefined;
	// console.log(lineData.value, "值");
	let result = lineData.value.find((item) => item.id == val);
	// let result = lineOpt.value.find((item) => (item.id = val));
	// console.log(result, "筛");
	if (result) {
		monitorOpt.value = result.monitorPoints;
	} else {
		monitorOpt.value = [];
	}
};
// 添加
function handleAdd() {
	reset();
	open.value = true;
	isCheck.value = false;
	title.value = "添加预测";
}
/** 删除按钮操作 */
function handleDelete(row) {
	proxy.$modal
		.confirm("是否确认删除选中的数据项？")
		.then(function () {
			return deleteData(ids.value.join(","));
		})
		.then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		})
		.catch(() => {});
}

// 查看
async function handleCheck(row) {
	try {
		loading.value = true;
		reset();
		handleSelect(row.lineId);
		let res = await findforecast(row.id);
		// console.log(res, "查询的数据");

		let resutl = formatterData(
			res.data.forecastDataList.filter((i) => i.dataType == 1)
		);
		let resutl2 = formatterData(
			res.data.forecastDataList.filter((i) => i.dataType == 2)
		);
		data.echartData = {
			ydata: [
				...resutl.map((i) => i.forecastData),
				...resutl2.map((i) => i.forecastData),
			],
			xdata: [...resutl.map((i) => i.date), ...resutl2.map((i) => i.date)],
		};
		form.value = res.data;
		title.value = "查看预测";
		open.value = true;
		isCheck.value = true;
		loading.value = false;
	} catch (error) {
		loading.value = false;
	}

	// form.value = row;
	// forecastDataList
	// data.echartData=
	// form.value.predStep = [
	//   form.value.forecastStartDate,
	//   form.value.forecastEndDate,
	// ];
	// form.value.historyDate = [
	//   form.value.historyStartDate,
	//   form.value.historyEndDate,
	// ];
}
// 编辑
async function handleEdit(row) {
	reset();
	handleSelect(row.lineId);
	loading.value = true;
	try {
		let res = await findforecast(row.id);
		// console.log(res, "查询的数据");

		let resutl = formatterData(
			res.data.forecastDataList.filter((i) => i.dataType == 1)
		);
		let resutl2 = formatterData(
			res.data.forecastDataList.filter((i) => i.dataType == 2)
		);
		data.echartData = {
			ydata: [
				...resutl.map((i) => i.forecastData),
				...resutl2.map((i) => i.forecastData),
			],
			xdata: [...resutl.map((i) => i.date), ...resutl2.map((i) => i.date)],
		};
		form.value = res.data;
	} catch (error) {
		loading.value = false;
	}
	loading.value = false;
	// form.value.predStep = [
	//   form.value.forecastStartDate,
	//   form.value.forecastEndDate,
	// ];
	// form.value.historyDate = [
	//   form.value.historyStartDate,
	//   form.value.historyEndDate,
	// ];
	open.value = true;
	isCheck.value = false;
	title.value = "修改预测";
}
/** 重置操作表单 */
function reset() {
	let y = new Date().getFullYear();
	let m = new Date().getMonth() + 1;
	let d = new Date().getDate();
	form.value = {
		algorithmId: undefined,
		lineId: undefined,
		monitorId: undefined,
		configType: undefined,
		predStep: undefined,
		forecastUnit: "day",
		// historyDate: [],
		// predStep: [],
		// forecastEndDate: undefined,
		// forecastStartDate: undefined,
		forecastType: activeIndex.value, // 预测类型（1监测点 2线路）
		historyEndDate:
			data.form.forecastUnit == "day" ? `${y}-${m}-${d}` : `${y}-${m}`,
		historyStartDate: undefined,
	};
	proxy.resetForm("formRef");
}
let loadingdig = ref(false);
/** 提交按钮 */
function submitForm() {
	// console.log(form.value, 'form.value')
	proxy.$refs["formRef"].validate(async (valid) => {
		if (valid) {
			// form.value.forecastStartDate = form.value.predStep[0];
			// form.value.forecastEndDate = form.value.predStep[1];
			// form.value.historyStartDate = form.value.historyDate[0];
			// form.value.historyEndDate = form.value.historyDate[1];
			// console.log(form.value, "add");
			try {
				loadingdig.value = true;
				let findpath = algolist.value.find(
					(i) => i.id == form.value.algorithmId
				);
				let resData = {
					...form.value,
					algInterfacePath: findpath ? findpath.algInterfacePath : "",
				};
				// return;
				if (form.value.id != undefined) {
					await updateData(resData).then((response) => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					await addData(resData).then((response) => {
						proxy.$modal.msgSuccess("新增成功");
						open.value = false;
						getList();
					});
				}
				loadingdig.value = false;
			} catch (error) {
				loadingdig.value = false;
			}
		}
	});
}
/** 搜索按钮操作 */
function handleQuery() {
	queryParams.value.pageNum = 1;
	getList();
}
/** 重置按钮操作 */
function resetQuery() {
	dateRange.value = [];
	proxy.resetForm("queryRef");
	handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
	ids.value = selection.map((item) => item.id);
	single.value = selection.length != 1;
	multiple.value = !selection.length;
}
const handleTabClick = (val) => {
	activeIndex.value = val;
	getList();
};
// 格式化监测点和线路
const formatterLineAndMointor = (lineId, monitorId) => {
	if (monitorId) {
		let result = lineOpt.value.find((item) => item.id == lineId);
		if (result) {
			let resultMointoer = result.monitorPoints.find(
				(val) => val.id == monitorId
			);
			if (resultMointoer) {
				return resultMointoer.monitoringPointName;
			} else {
				return "无";
			}
		} else {
			return "";
		}
	} else {
		let result = lineOpt.value.find((item) => item.id == lineId);
		if (result) {
			return result.lineName;
		} else {
			return "";
		}
	}
};
// 格式化类型
const formatterType = (row, colunm, columnIndex) => {
	if (columnIndex) {
		let result = weatherlist.value.find((item) => item.value == columnIndex);
		if (result) {
			return result.label;
		} else {
			return "";
		}
	} else {
		return "";
	}
};
// 格式化算法
const formatterAlgorithm = (algorithmId) => {
	let result = algolist.value.find((item) => item.id == algorithmId);
	if (result) {
		return result.algorithmName;
	} else {
		return "";
	}
};
let algolist = ref([]);
const getalgo = async () => {
	let res = await getalgorithmId();
	// console.log(res, "什么");
	algolist.value = res.data;
};
getalgo();
</script>
<style scoped>
.my-tab-class {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
}

.Manual {
	color: aliceblue;
	line-height: 35px;
	text-align: center;
	width: 120px;
	cursor: pointer;
	background-color: #363636;
	height: 35px;
	-webkit-box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
	box-shadow: 2px 0 6px rgba(234, 237, 240, 0.35);
}

.Manuals {
	background-color: #058e8a;
}
@media screen and (max-height: 800px) {
	:deep(.el-overlay-dialog) {
		/* padding-top: 10%; */
		padding: 10% 0 17% 0;
	}
}
.forecast_css :deep(.el-form-item__content) {
	display: flex;
	justify-content: space-between !important;
}
:deep(.select_diy) {
	width: 100%;
}
.date_pick {
	flex: 1;
	width: 100%;
}
:deep(.date_pick .el-form-item__content, .date_pick),
:deep(.el-date-editor.el-input),
:deep(.date_pick .el-date-editor.el-input__inner) {
	width: 99% !important;
}
</style>
