<template>
	<div class="fz-container">
		<el-form
			:model="data.queryParams"
			ref="queryRef"
			:inline="true"
			label-width="68px"
		>
			<el-form-item>
				<el-input
					clearable
					v-model="data.queryParams.evaluationName"
					placeholder="请输入名称"
					@clear="getList"
				></el-input>
			</el-form-item>
			<el-form-item>
				<el-button
					type="primary"
					icon="Search"
					plain
					round
					class="common_style"
					@click="handleQuery"
					>搜索</el-button
				>
			</el-form-item>
			<el-form-item class="float_r">
				<el-row :gutter="10">
					<el-col :span="1.5">
						<el-button
							type="primary"
							plain
							round
							class="common_style"
							icon="Delete"
							@click="handleDeleted"
							>删除</el-button
						>
					</el-col>
					<el-col :span="1.5">
						<el-button
							type="primary"
							plain
							round
							class="common_style"
							icon="Plus"
							@click="handleAdd"
							>添加评价</el-button
						>
					</el-col>
				</el-row>
			</el-form-item>
		</el-form>

		<el-table
			v-loading="loading"
			:data="tableData"
			style="width: 100%"
			@selection-change="selectionChange"
		>
			<el-table-column type="selection" width="55" />      
			<el-table-column type="index" label="序号" width="55" align="center" />
			<el-table-column
				prop="evaluationName"
				label="评价组件名称"
				align="center"
			/>
			     
			<el-table-column
				prop="monitoringPointName"
				label="算法耗时"
				align="center"
			>
				       
				<el-table-column
					prop="singleRuntime"
					label="单个算法运行耗时"
					align="center"
				/>
				       
				<el-table-column
					prop="unionRuntime"
					label="组合算法运行耗时"
					align="center"
				/>
				     
			</el-table-column>
			     
			<el-table-column align="center" label="图像增强算法">
				       
				<el-table-column
					prop="structureSimilarity"
					label="结构相似度"
					align="center"
				/>
				       
				<el-table-column
					prop="peakNoiseRatio"
					label="峰值信噪比"
					align="center"
				/>
				     
			</el-table-column>
			     
			<el-table-column align="center" label="场景分类算法">
				       
				<el-table-column
					prop="classificationAccuracy"
					label="分类准确度"
					align="center"
				/>
				     
			</el-table-column>
			     
			<el-table-column align="center" label="异物识别算法">
				       
				<el-table-column
					prop="recognitionAccuracy"
					label="识别准确度"
					align="center"
				/>
				       
				<el-table-column prop="detectionRatio" label="检出率" align="center" />
				     
			</el-table-column>
			     
			<el-table-column
				prop="simulationDescription"
				label="情景仿真描述"
				align="center"
			/>
			<el-table-column prop="createTime" align="center" label="添加时间" />  
			<el-table-column
				label="操作"
				align="center"
				width="150"
				class-name="small-padding fixed-width"
			>
				<template #default="scope">
					<el-button size="mini" type="text" @click="handleCheck(scope.row)"
						>查看</el-button
					>
					<el-button size="mini" type="text" @click="handleEdit(scope.row)"
						>编辑</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			v-show="total > 0"
			:total="total"
			@pagination="getList"
			v-model:page="data.queryParams.pageNum"
			v-model:limit="data.queryParams.pageSize"
		/>
		<!-- 添加或者修改 -->
		<el-dialog
			:title="title"
			v-model="open"
			width="80%"
			@close="cancel"
			append-to-body
		>
			<el-form
				ref="formRef"
				:model="data.form"
				:rules="data.rules"
				label-width="120px"
				:class="isCheck ? 'el-form-check' : ''"
			>
				<div>
					<div>
						<el-form-item
							label="评价组件名称"
							prop="evaluationName"
							label-width="120px"
						>
							<el-input
								:disabled="isCheck"
								v-model="data.form.evaluationName"
								placeholder="请输入评价组件名称"
								style="width: 50%"
							/>
						</el-form-item>
						<el-form-item
							label="情景仿真描述"
							prop="simulationDescription"
							label-width="120px"
						>
							<el-input
								:disabled="isCheck"
								v-model="data.form.simulationDescription"
								placeholder="请输入情景仿真描述"
								style="width: 50%"
							/>
						</el-form-item>
						<el-form-item
							label="单个算法耗时(h)"
							prop="singleRuntime"
							label-width="120px"
						>
							<el-input
								:disabled="isCheck"
								v-model="data.form.singleRuntime"
								placeholder="请输入单个算法耗时"
								style="width: 50%"
							/>
						</el-form-item>
						<el-form-item
							label="结合算法耗时(h)"
							prop="unionRuntime"
							label-width="120px"
						>
							<el-input
								:disabled="isCheck"
								v-model="data.form.unionRuntime"
								placeholder="请输入结合算法耗时"
								style="width: 50%"
							/>
						</el-form-item>
					</div>
				</div>
				<div
					style="
						display: flex;
						margin-top: 20px;
						justify-content: space-between;
					"
				>
					<div>
						<h3>图像增强算法</h3>
						<el-form-item
							label="结构相似度(%)"
							prop="structureSimilarity"
							label-width="120px"
						>
							<el-input
								:disabled="isCheck"
								v-model="data.form.structureSimilarity"
								placeholder="请输入结构相似度"
							/>
						</el-form-item>
						<el-form-item
							label="峰值信噪比(%)"
							prop="peakNoiseRatio"
							label-width="120px"
						>
							<el-input
								:disabled="isCheck"
								v-model="data.form.peakNoiseRatio"
								placeholder="请输入峰值信噪比"
							/>
						</el-form-item>
					</div>
					<div>
						<h3>场景分类算法</h3>
						<el-form-item
							label="分类准确度(%)"
							prop="classificationAccuracy"
							label-width="120px"
						>
							<el-input
								:disabled="isCheck"
								v-model="data.form.classificationAccuracy"
								placeholder="请输入分类准确度"
							/>
						</el-form-item>
					</div>
					<div>
						<h3>异物识别算法</h3>
						<el-form-item
							label="识别准确度(%)"
							prop="recognitionAccuracy"
							label-width="120px"
						>
							<el-input
								:disabled="isCheck"
								v-model="data.form.recognitionAccuracy"
								placeholder="请输入识别准确度"
							/>
						</el-form-item>
						<el-form-item
							label="检出率(%)"
							prop="detectionRatio"
							label-width="120px"
						>
							<el-input
								:disabled="isCheck"
								v-model="data.form.detectionRatio"
								placeholder="请输入检出率"
							/>
						</el-form-item>
					</div>
				</div>
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
import { onMounted, ref, reactive } from "vue";
import {
	getEva,
	addEva,
	deleteEva,
	editEva,
	getEvaById,
} from "@/api/simulation/compManage/evaluationComp.js";
const { proxy } = getCurrentInstance();
const data = reactive({
	form: {},
	queryParams: {
		pageNum: 1,
		pageSize: 10,
	},
	rules: {
		evaluationName: [
			{
				required: true,
				message: "评价组件名称不能为空",
				trigger: "blur",
			},
		],
		simulationDescription: [
			{
				required: true,
				message: "情景仿真描述不能为空",
				trigger: "blur",
			},
		],
		singleRuntime: [
			{
				required: true,
				message: "单个算法耗时不能为空",
				trigger: "blur",
			},
		],
		unionRuntime: [
			{
				required: true,
				message: "结合算法耗时不能为空",
				trigger: "blur",
			},
		],
		peakNoiseRatio: [
			{
				required: true,
				message: "峰值信噪比不能为空",
				trigger: "blur",
			},
		],
		structureSimilarity: [
			{
				required: true,
				message: "结构相似度不能为空",
				trigger: "blur",
			},
		],
		classificationAccuracy: [
			{
				required: true,
				message: "分类准确度不能为空",
				trigger: "blur",
			},
		],
		recognitionAccuracy: [
			{
				required: true,
				message: "识别准确度不能为空",
				trigger: "blur",
			},
		],
		detectionRatio: [
			{
				required: true,
				message: "检出率不能为空",
				trigger: "blur",
			},
		],
	},
	sesetionData: [], //选中的数据
});
const total = ref(0);
const loading = ref(false);
const title = ref("");
const open = ref(false);
const isCheck = ref(false);
const tableData = ref([]);
onMounted(() => {
	getList();
});
const getList = async () => {
	// loading.value = true;
	let res = await getEva(data.queryParams);
	if (res.code == 200) {
		tableData.value = res.rows;
		total.value = res.total;
		loading.value = false;
	}
};
const handleDeleted = async () => {
	let ids = data.sesetionData.map((item) => {
		return item.id;
	});
	ids = ids.join(",");
	let res = await deleteEva(ids);
	if (res.code == 200) {
		proxy.$modal.msgSuccess("删除成功");
	} else {
		proxy.$modal.msgError("删除失败");
	}
	getList();
};
const handleCheck = (row) => {
	data.form = row;
	isCheck.value = true;
	open.value = true;
	title.value = "查看";

};
// 编辑
const handleEdit = (row) => {
	getEvaById(row.id).then((res) => {
		if (res.code === 200) {
			data.form = res.data;
		}
	});
	isCheck.value = false;
	open.value = true;
	title.value = "编辑";
};
// 根据id查询数据
const getDataById = async (id) => {
	let res = await getLineById(id);
	if (res.code == 200) {
		data.form = res.data;
		let tempLon = res.data.lon.toString().split(".");
		data.form.lonDegree = tempLon[0];
		data.form.lonBranch = tempLon[1];
		let tempLat = res.data.lat.toString().split(".");
		data.form.latDegree = tempLat[0];
		data.form.latBranch = tempLat[1];
	}
};
/** 搜索按钮操作 */
const handleQuery = async () => {
	data.queryParams.pageNum = 1;
	loading.value = true;
	let res = await getEva(data.queryParams);
	if (res.code == 200) {
		tableData.value = res.rows;
		total.value = res.total;
		loading.value = false;
	}
};
const handleAdd = () => {
	reset();
	open.value = true;
	title.value = "添加评价";
};
// 提交信息
const submitForm = () => {
	proxy.$refs["formRef"].validate(async (valid) => {
		if (valid) {
			if (title.value === "添加评价") {
				addEva(data.form)
					.then((res) => {
						if (res.code == 200) {
							proxy.$modal.msgSuccess("添加成功");
							getList();
						} else {
							proxy.$modal.msgError("添加失败");
						}
						open.value = false;
					})
					.catch((err) => {
						open.value = false;
					});
			} else {
				editEva(data.form)
					.then((res) => {
						if (res.code == 200) {
							proxy.$modal.msgSuccess("编辑成功");
							getList();
						} else {
							proxy.$modal.msgError("编辑失败");
						}
						open.value = false;
					})
					.catch((err) => {
						open.value = false;
					});
			}
		}
	});
};
// 取消提交
const cancel = () => {
	open.value = false;
	reset();
	getList()
};
/** 表单重置 */
function reset() {
	data.form = {};
	isCheck.value = false;
	proxy.resetForm("formRef");
}

//elment自带方法保存选中的数据
function selectionChange(selection) {
	data.sesetionData = selection;
}
</script>

<style scoped>
.percentages {
	width: 10%;
	padding: 20px;
}
.percentage {
	width: 35%;
	padding: 20px;
}
.cebter {
	align-items: center;
}
.unified {
	color: aliceblue;
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
::v-deep .el-form-item__content {
	color: #fff;
}
</style>
