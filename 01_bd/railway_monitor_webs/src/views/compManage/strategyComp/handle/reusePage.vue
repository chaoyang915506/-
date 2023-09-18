<template>
	<div class="fz-container">
		<div class="box_head">
			<weather-icon
				v-for="(i, j) in weatherData"
				:key="j"
				:texture="i.name"
				:count="i.count"
			></weather-icon>
		</div>
		<el-form
			:model="queryParams"
			ref="queryRef"
			:inline="true"
			label-width="68px"
		>
			<el-form-item>
				<el-input
					clearable
					v-model="queryParams.name"
					placeholder="请输入模型名称"
					@clear="handleQuery"
				></el-input>
			</el-form-item>
			<el-form-item>
				<el-button
					type="primary"
					plain
					round
					class="common_style"
					icon="Search"
					@click="handleQuery"
					>搜索</el-button
				>
			</el-form-item>
		</el-form>
		<Table :columnData="matchingColumnData" :tableData="dataList"> </Table>
		<pagination
			v-show="total > 0"
			:total="total"
			@pagination="getList"
			v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize"
		/>
		<!-- 详情 -->
		<el-dialog title="详情" v-model="open" width="35%" append-to-body>
			<el-form ref="formRef" :model="dataForm" label-width="160px">
				<el-form-item label="模型编号">
					<span>{{ dataForm.modelCode }}</span>
				</el-form-item>
				<el-form-item label="模型名称">
					<span>{{ dataForm.modelName }}</span>
				</el-form-item>
				<el-form-item label="适用场景">
					<span>{{ dataForm.applyScene }}</span>
				</el-form-item>
				<el-form-item label="算法排名">
					<span>{{ dataForm.algorithmRanking }}</span>
				</el-form-item>
				<el-form-item label="算法功能">
					<span>{{ dataForm.algorithmFunction }}</span>
				</el-form-item>
				<el-form-item label="样本集名称">
					<span>{{ dataForm.sampleSetName }}</span>
				</el-form-item>
				<el-form-item label="算法文件存储位置">
					<span>{{ dataForm.algFilePath }}</span>
				</el-form-item>
				<el-form-item label="生成时间">
					<span>{{ dataForm.addTime }}</span>
				</el-form-item>
				<el-form-item label="备注">
					<span>{{ dataForm.remark }}</span>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import { getModelById } from "@/api/simulation/compManage/strategy/imgEnhance.js";
import Table from "@/components/Table/index.vue";
const emit = defineEmits();
let dataList = ref([]);
let weatherData = ref([]);
let dataForm = ref("");
let queryParams = ref({
	name: "",
	pageNum: 1,
	pageSize: 10,
});
const total = ref(0);
const open = ref(false);
const props = defineProps({
	columnData: {
		type: Array,
		default: () => [],
	},
	tableData: {
		type: Array,
		default: () => [],
	},
	total: {
		type: Number,
		default: 0,
	},
	weatherData: {
		type: Array,
		default: () => [],
	},
});
onBeforeUpdate(() => {
	dataList.value = props.tableData;
	total.value = props.total;
	weatherData.value = props.weatherData;
});
// watch(props.tableData, (val) => {
// 	dataList.value = val;
// });
let matchingColumnData = [
	{
		label: "模型编号",
		prop: "modelCode",
	},
	{
		label: "模型名称",
		prop: "modelName",
	},
	{
		label: "适用场景",
		prop: "applyScene",
	},
	{
		label: "算法排名",
		// prop: "algorithmRanking",
		prop: "rownum",
	},
	{
		label: "生成时间",
		prop: "addTime",
	},
	{
		label: "详情",
		prop: "oper",
		operation: [{ name: "查看", style: "primary", clickFun: handleCheck }],
	},
];
const getList = (row) => {
	emit("handlePage", row);
};
// 详情
function handleCheck(row) {
	open.value = true;
	getModelById(row.id).then((res) => {
		dataForm.value = res.data;
	});
}
/** 搜索按钮操作 */
const handleQuery = async () => {
	emit("handleQuery", queryParams.value.name);
};
</script>
<style scoped>
.el-button--primary {
	background: #3d5a5d !important;
	border: none !important;
	opacity: 1;
}
.el-button--primary:hover {
	background-color: #3d5a5d !important;
	opacity: 0.6;
}
.el-button--primary.is-plain {
	color: white;
	background-color: #3d5a5d !important;
}
.box_head {
	display: flex;
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
::v-deep .el-form-item__content{
	color: #fff;
}
</style>
