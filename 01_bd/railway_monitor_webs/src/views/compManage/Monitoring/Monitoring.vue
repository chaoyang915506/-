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
					v-model="data.queryParams.name"
					placeholder="请输入监测点名称"
					@clear="getList"
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
							>添加监测点</el-button
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
				prop="monitoringPointName"
				label="监测点名称"
				align="center"
			/>
			<el-table-column prop="lineName" label="所在路线" align="center" />
			<el-table-column
				prop="monitoringPointGrade"
				align="center"
				label="监测点等级"
			>
			</el-table-column>
			<el-table-column align="center" label="位置">
				<template #default="{ row }">
					{{ "E " + row.lon + ", N " + row.lat }}
				</template>
			</el-table-column>
			<el-table-column prop="facilityNum" align="center" label="设备数量" />
			<el-table-column prop="modles" align="center" label="模型" />
			<el-table-column prop="addTime" align="center" label="添加时间" />
			<el-table-column prop="monitorDescribe" align="center" label="描述" />
			<el-table-column prop="isShow " align="center" label="发布状态">
				<template #default="scope">
					{{ scope.row.isShow ? "未发布" : "已发布" }}
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
				width="150"
				class-name="small-padding fixed-width"
			>
				<template #default="scope">
					<el-button size="mini" type="text" @click="handleIssue(scope.row)"
						>发布</el-button
					>
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
		<el-dialog :title="title" v-model="open" width="45%" append-to-body>
			<el-form
				ref="formRef"
				:model="data.form"
				:rules="data.rules"
				label-width="150px"
				:class="isCheck ? 'el-form-check' : ''"
			>
				<el-form-item label="监测点名称" prop="monitoringPointName">
					<el-input
						:disabled="isCheck"
						v-model="data.form.monitoringPointName"
						placeholder="请输入监测点名称"
					/>
				</el-form-item>
				<el-form-item label="所在路线" prop="lineId">
					<el-select
						v-model="data.form.lineId"
						placeholder="请选择所在路线"
						clearable
						:disabled="isCheck"
						style="width: 100%"
						size="small"
					>
						<el-option
							v-for="item in data.lineIdSelect"
							:key="item.id"
							:label="item.lineName"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="监测点等级" prop="monitoringPointGrade">
					<el-select
						v-model="data.form.monitoringPointGrade"
						placeholder="请选择监测点等级"
						clearable
						:disabled="isCheck"
						style="width: 100%"
						size="small"
					>
						<el-option
							v-for="dict in monitoring_point_grade"
							:key="dict.value"
							:label="dict.label"
							:value="dict.value"
						/>
					</el-select>
				</el-form-item>

				<el-form-item label="场景类型" prop="rocksoil">
					<el-select
						clearable
						v-model="data.form.sceneType"
						placeholder="请选择场景类型"
						:disabled="isCheck"
						style="width: 100%"
						size="small"
					>
						<el-option
							v-for="item in scene_type"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="位置">
					<div
						style="
							display: flex;
							align-items: center;
							font-size: 14px;
							color: #fff;
						"
						:style="
							isCheck
								? { paddingLeft: '30px' }
								: { 'justify-content': space - between }
						"
					>
						<div
							style="display: flex; align-items: center; flex-wrap: nowrap"
							v-if="!isCheck"
						>
							<span style="margin-right: 5px">E</span>
							<el-form-item prop="lonDegree">
								<div style="display: flex">
									<el-input v-model="data.form.lon" /><sup
										style="font-size: 20px; margin: 0 5px"
										>°</sup
									>
								</div>
							</el-form-item>
						</div>
						<div
							v-else
							style="display: flex; align-items: center; flex-wrap: nowrap"
						>
							<span style="margin-right: 5px">E</span>
							<span>{{ data.form.lon }}</span>
							<span style="margin-right: 5px">N</span>
							<span>{{ data.form.lat }}</span>
						</div>
						<div
							style="display: flex; align-items: center; margin-left: 10px"
							v-if="!isCheck"
						>
							<span style="margin-right: 5px">N</span>
							<el-form-item prop="latDegree">
								<div style="display: flex">
									<el-input
										v-model="data.form.lat"
										placeholder="请输入度"
									/><sup style="font-size: 20px; margin: 0 5px">°</sup>
								</div>
							</el-form-item>
						</div>
						<div
							v-else
							style="
								display: flex;
								align-items: center;
								flex-wrap: nowrap;
								margin-left: 25px;
							"
						>
							<span style="margin-right: 5px">N</span>
							<span>{{ data.form.latDegree }}</span
							><sup style="font-size: 20px; margin: 0 5px">°</sup>
							<span>{{ data.form.latBranch }}</span
							><sup style="font-size: 20px; margin: 0 5px">′</sup>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="添加时间" prop="addTime">
					<el-date-picker
						v-model="data.form.addTime"
						type="datetime"
						clearable
						:disabled="isCheck"
						value-format="YYYY-MM-DD hh:mm:ss"
						style="width: 100%"
						size="small"
						placeholder="请选择日期"
					/>
				</el-form-item>
				<el-form-item label="岩土类型" prop="rocksoil">
					<el-select
						v-model="data.form.rocksoil"
						placeholder="请选择岩土类型"
						clearable
						:disabled="isCheck"
						style="width: 100%"
						size="small"
					>
						<el-option
							v-for="dict in gt"
							:key="dict.value"
							:label="dict.label"
							:value="dict.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="流域面积(km²)" prop="wa">
					<el-input
						:disabled="isCheck"
						v-model="data.form.wa"
						placeholder="请输入流域面积"
					/>
				</el-form-item>
				<el-form-item label="松散物质储量(m³)" prop="lmsc">
					<el-input
						:disabled="isCheck"
						v-model="data.form.lmsc"
						placeholder="请输入松散物质储量"
					/>
				</el-form-item>
				<el-form-item label="平均坡度(°)" prop="aves">
					<el-input
						:disabled="isCheck"
						v-model="data.form.aves"
						placeholder="请输入平均坡度"
					/>
				</el-form-item>
				<el-form-item label="植物覆盖率(百分比%)" prop="pc">
					<el-input
						:disabled="isCheck"
						v-model="data.form.pc"
						placeholder="请输入植物覆盖率"
					/>
				</el-form-item>
				<el-form-item label="描述" prop="monitorDescribe">
					<el-input
						type="textarea"
						:disabled="isCheck"
						v-model="data.form.monitorDescribe"
						placeholder="请输入描述"
					/>
				</el-form-item>
				<h2>绑定模型</h2>
				<el-form-item label="图像增强模型" prop="imageEnhanceId">
					<el-select
						v-model="data.form.imageEnhanceId"
						style="width: 100%"
						:disabled="isCheck"
					>
						<el-option
							v-for="item in getModelValue('图像增强模型')"
							:key="item.id"
							:label="item.modelName"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="场景分析模型" prop="sceneAnalysisId">
					<el-select
						v-model="data.form.sceneAnalysisId"
						style="width: 100%"
						:disabled="isCheck"
					>
						<el-option
							v-for="item in getModelValue('场景识别')"
							:key="item.id"
							:label="item.modelName"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="场景分割模型" prop="sceneDivisionId">
					<el-select
						v-model="data.form.sceneDivisionId"
						style="width: 100%"
						:disabled="isCheck"
					>
						<el-option
							v-for="item in getModelValue('场景分割')"
							:key="item.id"
							:label="item.modelName"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="材质识别模型" prop="materialQualityId">
					<el-select
						v-model="data.form.materialQualityId"
						style="width: 100%"
						:disabled="isCheck"
					>
						<el-option
							v-for="item in getModelValue('材质识别')"
							:key="item.id"
							:label="item.modelName"
							:value="item.id"
						/>
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
import { onMounted, ref, reactive } from "vue";
import {
	getSelectMonitor,
	getSelectByLineName,
	addLine,
	deleteLine,
	getLineById,
	updateLineById,
	editLine,
	getModel,
} from "@/api/simulation/compManage/monitoring.js";
import { addinfodata } from "@/api/simulation/compManage/detWeather.js";
const { proxy } = getCurrentInstance();
const { scene_type, gt, monitoring_point_grade, monitoring_route } =
	proxy.useDict(
		"scene_type",
		"gt",
		"monitoring_point_grade",
		"monitoring_route"
	);
const data = reactive({
	form: {},
	lineIdSelect: [],
	queryParams: {
		lineName: undefined,
		pageNum: 1,
		pageSize: 10,
	},
	rules: {
		imageEnhanceId: [
			{ required: true, message: "图像增强模型不能为空", trigger: "change" },
		],
		sceneAnalysisId: [
			{ required: true, message: "场景分析模型不能为空", trigger: "change" },
		],
		sceneDivisionId: [
			{ required: true, message: "场景分割模型不能为空", trigger: "change" },
		],
		materialQualityId: [
			{ required: true, message: "材质识别模型不能为空", trigger: "change" },
		],
	},
	sesetionData: [], //选中的数据
	modelList: [],
});
const lineId = ref(null);
const total = ref(0);
const loading = ref(false);
const title = ref("");
const open = ref(false);
const isCheck = ref(false);
const tableData = ref([]);
addinfodata().then((res) => {
	data.lineIdSelect = makeline(res);
});
function makeline(res) {
	let linedata = [];
	[...new Set(res.data.map((i) => i.id).filter((i) => i))].forEach((i) => {
		let resultes = res.data.find((idx) => idx.id == i);
		if (resultes) {
			linedata.push(resultes);
		}
	});
	return linedata;
}
onMounted(() => {
	getList();
});
getModel().then((res) => {
	if (res.code === 200 && res.rows.length) data.modelList = res.rows;
});
// 获取对应算法列表
const getModelValue = (modelName) => {
	let res = data.modelList.filter((item) => {
		if (modelName === item.modelTypeName) return item;
	});
	return res[0].smodel;
};
const getList = async () => {
	loading.value = true;
	let res = await getSelectMonitor(data.queryParams);
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
	let res = await deleteLine(ids);
	if (res.code == 200) {
		proxy.$modal.msgSuccess("删除成功");
	} else {
		proxy.$modal.msgError("删除失败");
	}
	getList();
};
const handleCheck = (row) => {
	isCheck.value = true;
	open.value = true;
	title.value = "查看监测点";
	getDataById(row.id);
};
// 编辑
const handleEdit = (row) => {
	isCheck.value = false;
	open.value = true;
	title.value = "编辑路线";
	getDataById(row.id);
};
// 发布
const handleIssue = async (row) => {
	let res = await updateLineById(row.id);
	if (res.code === 200) {
		proxy.$modal.msgSuccess("发布成功");
	} else {
		proxy.$modal.msgError("发布失败");
	}
	getList();
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
		lineId.value = data.form.lineId;
		data.form.lineId = formatter(
			data.lineIdSelect,
			data.form.lineId,
			"所在路线"
		);
	}
};
/** 搜索按钮操作 */
const handleQuery = async () => {
	data.queryParams.pageNum = 1;
	loading.value = true;
	let res = await getSelectByLineName(data.queryParams);
	if (res.code == 200) {
		tableData.value = res.rows;
		total.value = res.total;
		loading.value = false;
	}
};
const handleAdd = () => {
	reset();
	open.value = true;
	title.value = "添加检测点";
};
// 提交信息
const submitForm = () => {
	proxy.$refs["formRef"].validate(async (valid) => {
		if (valid) {
			if (title.value === "添加检测点") {
				addLine(data.form)
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
				console.log(data.form.lineId);
				console.log(!isNaN(data.form.lineId));
				data.form.lineId = isNaN(data.form.lineId)
					? lineId.value
					: data.form.lineId;
				editLine(data.form)
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
};
/** 表单重置 */
function reset() {
	data.form = {
		lineName: "",
	};
	isCheck.value = false;
	proxy.resetForm("formRef");
}

//elment自带方法保存选中的数据
function selectionChange(selection) {
	data.sesetionData = selection;
}
let monitorPointsList = null;
const formatter = (data, key, line) => {
	if (line === "所在路线" && data) {
		let res = data.find((i) => i.id == key);
		monitorPointsList = res ? res.monitorPoints : null;
		return res ? res.lineName : "";
	} else if (line === "所在监测点") {
		let res = monitorPointsList.find((i) => i.id == key);
		return res ? res.monitoringPointName : "";
	} else {
		let res = data.find((i) => i.value == key);
		return res ? res.label : "";
	}
};
</script>
<style scoped>
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
.detail_style {
	color: white;
	margin-left: 32px;
}
</style>
