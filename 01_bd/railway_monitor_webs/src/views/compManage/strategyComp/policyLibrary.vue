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
			:model="data.queryParams"
			ref="queryRef"
			:inline="true"
			label-width="68px"
		>
			<el-form-item>
				<el-input
					clearable
					v-model="data.queryParams.name"
					placeholder="请输入策略名称"
					@clear="getList"
				></el-input>
			</el-form-item>
			<el-form-item>
				<el-button plain round type="primary" icon="Search" @click="handleQuery"
					>搜索</el-button
				>
			</el-form-item>
			<el-form-item class="float_r">
				<el-row :gutter="10">
					<el-col :span="1.5">
						<el-button
							plain
							round
							type="primary"
							icon="Delete"
							@click="handleDeleted"
							>删除</el-button
						>
					</el-col>
					<el-col :span="1.5">
						<el-button plain round type="primary" icon="Plus" @click="handleAdd"
							>添加策略</el-button
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
			<el-table-column prop="policyCode" label="策略编号" align="center" />
			<el-table-column prop="policyName" label="策略名称" align="center" />
			<!-- <el-table-column prop="algDescribe" align="center" label="算法描述" /> -->
			<el-table-column
				prop="inclusionAlgorithm"
				align="center"
				label="包含算法"
			/>
			<el-table-column prop="createTime" align="center" label="生成时间" />
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
			width="35%"
			append-to-body
			@close="reset()"
		>
			<el-form
				v-if="title !== '详情'"
				ref="formRef"
				:model="formData"
				:rules="data.rules"
				label-width="120px"
			>
				<el-form-item label="策略编号" prop="policyCode">
					<el-input
						v-model="formData.policyCode"
						placeholder="请输入策略编号"
					/>
				</el-form-item>
				<el-form-item label="策略名称" prop="policyName">
					<el-input
						v-model="formData.policyName"
						placeholder="请输入策略名称"
					/>
				</el-form-item>
				<el-form-item
					v-for="(item, i) in formData.imageEnhanceId"
					:key="i"
					:label="`图像增强模型 ` + (i == 0 ? '' : i + 1)"
					:prop="'imageEnhanceId.' + i"
					:rules="[
						{
							required: true,
							message: '图像增强模型不能为空',
							trigger: 'change',
						},
					]"
				>
					<el-select
						v-model="formData.imageEnhanceId[i]"
						style="width: 70%; margin-right: 10px"
						:disabled="isCheck"
					>
						<el-option
							v-for="item in getModelValue('图像增强模型')"
							:key="item.id"
							:label="item.modelName"
							:value="item.id"
						/>
					</el-select>
					<el-button
						circle
						icon="Plus"
						@click="addList('imageEnhanceId')"
					></el-button>
					<el-button
						circle
						icon="SemiSelect"
						@click="subList('imageEnhanceId', i)"
						v-if="i > 0"
					></el-button>
				</el-form-item>
				<el-form-item
					v-for="(item, i) in formData.sceneAnalysisId"
					:key="i"
					:label="`场景识别模型 ` + (i == 0 ? '' : i + 1)"
					:prop="'sceneAnalysisId.' + i"
					:rules="[
						{
							required: true,
							message: '场景识别模型不能为空',
							trigger: 'change',
						},
					]"
				>
					<el-select
						v-model="formData.sceneAnalysisId[i]"
						style="width: 70%; margin-right: 10px"
						:disabled="isCheck"
					>
						<el-option
							v-for="item in getModelValue('场景识别')"
							:key="item.id"
							:label="item.modelName"
							:value="item.id"
						/>
					</el-select>
					<el-button
						circle
						icon="Plus"
						@click="addList('sceneAnalysisId')"
					></el-button>
					<el-button
						circle
						icon="SemiSelect"
						@click="subList('sceneAnalysisId', i)"
						v-if="i > 0"
					></el-button>
				</el-form-item>
				<el-form-item
					v-for="(item, i) in formData.sceneDivisionId"
					:key="i"
					:label="`场景分割模型 ` + (i == 0 ? '' : i + 1)"
					:prop="'sceneDivisionId.' + i"
					:rules="[
						{
							required: true,
							message: '场景分割模型不能为空',
							trigger: 'change',
						},
					]"
				>
					<el-select
						v-model="formData.sceneDivisionId[i]"
						style="width: 70%; margin-right: 10px"
					>
						<el-option
							v-for="item in getModelValue('场景分割')"
							:key="item.id"
							:label="item.modelName"
							:value="item.id"
						/>
					</el-select>
					<el-button
						circle
						icon="Plus"
						@click="addList('sceneDivisionId')"
					></el-button>
					<el-button
						circle
						icon="SemiSelect"
						@click="subList('sceneDivisionId', i)"
						v-if="i > 0"
					></el-button>
				</el-form-item>
				<el-form-item
					v-for="(item, i) in formData.materialQualityId"
					:key="i"
					:label="`材质识别模型 ` + (i == 0 ? '' : i + 1)"
					:prop="'materialQualityId.' + i"
					:rules="[
						{
							required: true,
							message: '材质识别模型不能为空',
							trigger: 'change',
						},
					]"
				>
					<el-select
						v-model="formData.materialQualityId[i]"
						style="width: 70%; margin-right: 10px"
					>
						<el-option
							v-for="item in getModelValue('材质识别')"
							:key="item.id"
							:label="item.modelName"
							:value="item.id"
						/>
					</el-select>
					<el-button
						circle
						icon="Plus"
						@click="addList('materialQualityId')"
					></el-button>
					<el-button
						circle
						icon="SemiSelect"
						@click="subList('materialQualityId', i)"
						v-if="i > 0"
					></el-button>
				</el-form-item>
			</el-form>
			<!-- 详情 -->
			<el-form
				v-if="title == '详情'"
				ref="formRef"
				:model="data.form"
				label-width="110px"
			>
				<el-form-item label="策略编号">
					<span>{{ data.form.policyCode }}</span>
				</el-form-item>
				<el-form-item label="策略名称">
					<span>{{ data.form.policyName }}</span>
				</el-form-item>
				<el-form-item label="包含算法">
					<span>{{ data.form.inclusionAlgorithm }}</span>
				</el-form-item>
				<el-form-item label="生成时间">
					<span>{{ data.form.createTime }}</span>
				</el-form-item>
				<!-- <el-form-item label="算法描述">
					<span>{{ data.form.algDescribe }}</span>
				</el-form-item> -->
			</el-form>
			<template #footer>
				<div class="dialog-footer" v-show="title !== '详情'">
					<el-button type="primary" @click="submitForm">确 定</el-button>
					<el-button @click="reset">取 消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import {
	getPol,
	getSelectByName,
	getModel,
	addPol,
	getPolCount,
	deletePol,
	editPol,
	detailPol,
} from "@/api/simulation/compManage/strategy/PolicyLibrary.js";
const { proxy } = getCurrentInstance();
const data = reactive({
	form: {},
	queryParams: {
		name: "",
		pageNum: 1,
		pageSize: 10,
	},
	rules: {
		policyCode: [
			{ required: true, message: "策略编号不能为空", trigger: "blur" },
		],
		policyName: [
			{ required: true, message: "策略名称不能为空", trigger: "blur" },
		],
		imageEnhanceId: [
			{ required: true, message: "图像增强模型不能为空", trigger: "change" },
		],
		// sceneAnalysisId: [
		// 	{ required: true, message: "场景分析模型不能为空", trigger: "change" },
		// ],
		// sceneDivisionId: [
		// 	{ required: true, message: "场景分割模型不能为空", trigger: "change" },
		// ],
		// materialQualityId: [
		// 	{ required: true, message: "材质识别模型不能为空", trigger: "change" },
		// ],
	},
	weatherData: [],
	sesetionData: [], //选中的数据
	modalList: [],
});
const total = ref(0);
const loading = ref(false);
const title = ref("");
const open = ref(false);
const tableData = ref([]);
const { weatherData, params, queryParams, form } = toRefs(data);
const formData = reactive({
	imageEnhanceId: [null],
	sceneAnalysisId: [null],
	sceneDivisionId: [null],
	materialQualityId: [null],
});
onMounted(() => {
	getList();
	// 新增所需字段
	getModel().then((res) => {
		if (res.code === 200) {
			data.modalList = res.rows;
		}
	});
});
// 获取列表
const getList = async () => {
	loading.value = true;
	let res = await getPol(data.queryParams);
	if (res.code == 200) {
		tableData.value = res.rows;
		total.value = res.total;
		loading.value = false;
	}
};
// 删除
const handleDeleted = async () => {
	let ids = data.sesetionData.map((item) => {
		return item.id;
	});
	ids = ids.join(",");
	let res = await deletePol(ids);
	if (res.code == 200) {
		proxy.$modal.msgSuccess("删除成功");
	} else {
		proxy.$modal.msgError("删除失败");
	}
	getList();
};
// 详情
const handleCheck = (row) => {
	open.value = true;
	title.value = "详情";
	data.form = row;
};
// 编辑
const handleEdit = (row) => {
	detailPol(row.id).then((res) => {
		formData.imageEnhanceId = res.data.imageEnhanceId.length
			? res.data.imageEnhanceId
			: [null];
		formData.sceneAnalysisId = res.data.sceneAnalysisId.length
			? res.data.sceneAnalysisId
			: [null];
		formData.sceneDivisionId = res.data.sceneDivisionId.length
			? res.data.sceneDivisionId
			: [null];
		formData.materialQualityId = res.data.materialQualityId.length
			? res.data.materialQualityId
			: [null];
		formData.policyName = res.data.policyName;
		formData.policyCode = res.data.policyCode;
		formData.id = res.data.id;
	});

	open.value = true;
	title.value = "编辑";
};

/** 搜索按钮操作 */
const handleQuery = async () => {
	data.queryParams.pageNum = 1;
	loading.value = true;
	let res = await getSelectByName(data.queryParams);
	if (res.code == 200) {
		tableData.value = res.rows;
		total.value = res.total;
		loading.value = false;
	}
};
const handleAdd = () => {
	open.value = true;
	title.value = "添加";
};
// 提交信息
const submitForm = () => {
	proxy.$refs["formRef"].validate(async (valid) => {
		if (valid) {
			let res;
			if (title.value === "添加") {
				res = await addPol(formData);
			} else {
				res = await editPol(formData);
			}
			if (res.code === 200) {
				proxy.$modal.msgSuccess(
					title.value === "添加" ? "添加成功" : "编辑成功"
				);
				open.value = false;
				getList();
			} else {
				proxy.$modal.msgError(title.value === "添加" ? "添加失败" : "编辑失败");
				open.value = false;
				reset();
			}
		}
	});
};
/** 表单重置 */
function reset() {
	open.value = false;
	data.form = {};
	formData.policyName = "";
	formData.policyCode = "";
	formData.imageEnhanceId = [null];
	formData.sceneAnalysisId = [null];
	formData.sceneDivisionId = [null];
	formData.materialQualityId = [null];
	// proxy.resetForm("formRef");
}
//elment自带方法保存选中的数据
function selectionChange(selection) {
	data.sesetionData = selection;
}
// 获取对应算法列表
const getModelValue = (modelName) => {
	let res = data.modalList.filter((item) => {
		if (modelName === item.modelTypeName) return item;
	});
	return res[0].smodel;
};
// 新增一行选项
const addList = (modelType) => {
	formData[modelType].push(null);
};
const subList = (modelType, index) => {
	formData[modelType].splice(index, 1);
};
getPolCount().then((res) => {
	data.weatherData = [{ name: "全部", count: res.data[0].count }];
});
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
::v-deep .el-form-item__content{
	color: #fff;
}
</style>
