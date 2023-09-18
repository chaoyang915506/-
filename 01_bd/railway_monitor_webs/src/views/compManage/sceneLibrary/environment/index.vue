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
					v-model="data.queryParams.envName"
					placeholder="请输入环境组态名称"
				></el-input>
			</el-form-item>
			<el-form-item>
				<el-button
					icon="Search"
					type="primary"
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
							icon="Plus"
							@click="handleAdd"
							>添加</el-button
						>
						<el-col :span="1.5">
							<el-button
								type="primary"
								plain
								round
								icon="Delete"
								class="common_style"
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
								icon="Download"
								@click="handleExport"
								>导出</el-button
							>
						</el-col>
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
			<el-table-column prop="envName" label="环境组态名称" align="center" />
			<el-table-column prop="weatherType" label="气象模块" align="center" />
			<el-table-column prop="airTemperature" label="温度" align="center" />
			<el-table-column prop="humidity" align="center" label="相对湿度" />
			<el-table-column prop="atmosphericPressure" label="气压" align="center" />
			<el-table-column prop="windDirection" label="风向" align="center" />
			<el-table-column prop="windSpeed" label="风速" align="center" />
			<el-table-column prop="rainCapacity" label="雨量" align="center" />
			<el-table-column prop="snowDepth" label="雪深" align="center" />
			<el-table-column prop="createTime" align="center" label="添加时间" />
			<el-table-column
				label="操作"
				align="center"
				width="150"
				class-name="small-padding fixed-width"
			>
				<template #default="scope">
					<!-- <el-button
						size="mini"
						type="text"
						icon="Deleted"
						@click="handleDeleted(scope.row)"
						>删除</el-button
					> -->
					<el-button
						size="mini"
						type="text"
						icon="View"
						@click="EnvironmentView(scope.row, '详情')"
						>查看</el-button
					>
					<el-button
						size="mini"
						type="text"
						icon="Edit"
						@click="EnvironmentView(scope.row, '编辑')"
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
		<el-dialog :title="title" v-model="open" width="35%" append-to-body>
			<el-form
				ref="formRef"
				:model="data.form"
				:rules="data.rules"
				label-width="110px"
				:class="isCheck ? 'el-form-check' : ''"
			>
				<el-form-item label="环境组态名称" prop="envName">
					<el-input
						v-model="data.form.envName"
						placeholder="请输入环境组态名称"
						:disabled="isCheck"
					/>
				</el-form-item>
				<el-form-item
					label="气象模块选择"
					:label-width="labelWidth"
					prop="weatherType"
				>
					<el-select
						v-model="data.form.weatherType"
						placeholder="请选择气象模块"
						size="small"
						style="width: 100%"
						:disabled="isCheck"
					>
						<el-option
							v-for="item in weather"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="温度" prop="airTemperature">
					<el-input
						v-model="data.form.airTemperature"
						placeholder="请输入温度值"
						:disabled="isCheck"
					/>
				</el-form-item>
				<el-form-item label="相对湿度" prop="humidity">
					<el-input
						v-model="data.form.humidity"
						placeholder="请输入湿度值"
						:disabled="isCheck"
					/>
				</el-form-item>
				<el-form-item
					label="气压"
					:label-width="labelWidth"
					prop="atmosphericPressure"
				>
					<el-input
						v-model="data.form.atmosphericPressure"
						placeholder="请输入气压值"
						:disabled="isCheck"
					/>
				</el-form-item>
				<el-form-item
					label="风向"
					:label-width="labelWidth"
					prop="windDirection"
				>
					<el-input
						v-model="data.form.windDirection"
						placeholder="请输入气压值"
						:disabled="isCheck"
					/>
				</el-form-item>
				<el-form-item label="风速" prop="windSpeed">
					<el-input
						v-model="data.form.windSpeed"
						placeholder="请输入风速"
						:disabled="isCheck"
					/>
				</el-form-item>
				<el-form-item label="雨量" prop="rainCapacity">
					<el-input
						v-model="data.form.rainCapacity"
						placeholder="请输入雨量"
						:disabled="isCheck"
					/>
				</el-form-item>
				<el-form-item label="雪深" prop="snowDepth">
					<el-input
						v-model="data.form.snowDepth"
						placeholder="请输入雪深"
						:disabled="isCheck"
					/>
				</el-form-item>
				<el-form-item
					label="地质类型"
					:label-width="labelWidth"
					prop="geologyType"
				>
					<el-select
						v-model="data.form.geologyType"
						placeholder="请选择地址类型"
						size="small"
						style="width: 100%"
						:disabled="isCheck"
					>
						<el-option
							v-for="item in geologyType"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="添加时间" prop="createTime">
					<!-- <el-input
						clearable
						v-model="data.form.createTime"
						placeholder="请选择添加时间"
						:disabled="isCheck"
					/> -->
					<el-date-picker
						v-model="data.form.createTime"
						type="datetime"
						clearable
						placeholder="选择日期时间"
						style="width: 100%"
					>
					</el-date-picker>
				</el-form-item>

				<el-form-item label="图片" :label-width="labelWidth" ref="fileRef">
					<el-upload
						v-if="title !== '详情'"
						class="upload-demo"
						:auto-upload="false"
						:on-change="handleChange"
						:file-list="fileList"
						list-type="picture"
					>
						<el-button size="small" icon="Upload" type="primary"
							>上传图片</el-button
						>
					</el-upload>
					<el-image
						v-else
						style="width: 100px; height: 100px"
						:src="URL"
						:fit="fit"
						:preview-src-list="[URL]"
					></el-image>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="submitForm" :disabled="add_loading"
						>确 定</el-button
					>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<script setup>
// 添加单位选项暂未确定
import { onMounted, ref, reactive } from "vue";
import {
	getPlan,
	delPlan,
	getPlanById,
	addPlan,
	uploadFile,
	editPlan,
	exportPlan,
} from "@/api/simulation/compManage/environment.js";

const { proxy } = getCurrentInstance();
const { weather, geologyType } = proxy.useDict("weather", "geologyType");
const data = reactive({
	form: {
		sysFileUuids: [],
		fileUuids: [],
	},
	queryParams: {
		pageNum: 1,
		pageSize: 10,
		envName: "",
	},
	rules: {
		weatherType: [
			{ required: true, message: "气象模块不能为空", trigger: "change" },
		],
		windDirection: [
			{ required: true, message: "风向不能为空", trigger: "change" },
		],
		geologyType: [
			{ required: true, message: "地质类型不能为空", trigger: "change" },
		],
		envName: [
			{
				required: true,
				message: "组态名称不能为空",
				trigger: "blur",
			},
		],
		airTemperature: [
			{
				required: true,
				message: "温度不能为空",
				trigger: "blur",
			},
		],
		humidity: [
			{
				required: true,
				message: "相对湿度不能为空",
				trigger: "blur",
			},
		],
		atmosphericPressure: [
			{
				required: true,
				message: "气压不能为空",
				trigger: "blur",
			},
		],
		windSpeed: [
			{
				required: true,
				message: "风速不能为空",
				trigger: "blur",
			},
		],
		rainCapacity: [
			{
				required: true,
				message: "雨量不能为空",
				trigger: "blur",
			},
		],
		snowsDepth: [
			{
				required: true,
				message: "雨深不能为空",
				trigger: "blur",
			},
		],
		createTime: [
			{
				required: true,
				message: "时间不能为空",
				trigger: "blur",
			},
		],
		snowDepth: [
			{
				required: true,
				message: "学深不能为空",
				trigger: "blur",
			},
		],
	},
	sesetionData: "",
});
const total = ref(0);
const loading = ref(false);
const title = ref("");
const open = ref(false);
let add_loading = ref(false);
const isCheck = ref(false);
const tableData = ref([]);
const fileList = ref([]);
const url = ref(null);
let URL = ref("");
const { queryParams, form } = toRefs(data);
onMounted(() => {
	getList();
});
const getList = async () => {
	loading.value = true;
	let res = await getPlan(data.queryParams);
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
	let res = await delPlan(ids);
	if (res.code == 200) {
		proxy.$modal.msgSuccess("删除成功");
	} else {
		proxy.$modal.msgError("删除失败");
	}
	getList();
};

// const handleEdit = async (row) => {
//   console.log("wwww", row);
//   open.value = true;
//   title.value = "编辑";
//   let res = await getPlanById(row.id);
//   if (res.code === 200) data.form = res.data;
// };

/** 搜索按钮操作 */
const handleQuery = () => {
	data.queryParams.pageNum = 1;
	getList();
};
const EnvironmentView = async (row, caption) => {
	add_loading.value = true;
	open.value = true;
	title.value = caption;
	title.value == "详情" ? (isCheck.value = true) : (isCheck.value = false);
	let res = await getPlanById(row.id);
	data.form = res.data;
	data.form.sysFileUuids = [];
	data.form.fileUuids = [];
	if (res.data.files.length) {
		let bytes = window.atob(res.data.files[0].fileBytes);
		let buffer = new ArrayBuffer(bytes.length); //处理异常,将ascii码小于0的转换为大于0
		let unit = new Uint8Array(buffer);
		for (var i = 0; i < bytes.length; i++) {
			unit[i] = bytes.charCodeAt(i);
		}
		let blob = new Blob([buffer]);
		URL.value = window.URL.createObjectURL(blob);
		fileList.value = [
			{
				url: URL.value,
				name: res.data.files[0].fileName,
			},
		];
	}
	add_loading.value = false;
};
const handleAdd = () => {
	reset();
	open.value = true;
	title.value = "添加";
};
// 提交信息
const submitForm = async () => {
	proxy.$refs["formRef"].validate(async (valid) => {
		if (valid) {
			let res;
			if (title.value === "编辑") {
				delete data.form.files;
				res = await editPlan(data.form);
				proxy.$modal.msgSuccess("编辑成功");
			} else {
				res = await addPlan(data.form);
				proxy.$modal.msgSuccess("新增成功");
			}
			if (res.code === 200) {
				getList();
				open.value = false;
			} else {
				open.value = false;
				return proxy.$modal.msgError("添加失败");
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
	data.form = {};
	data.form.sysFileUuids = [];
	data.form.fileUuids = [];
	URL.value = null;
	fileList.value = [];
	proxy.resetForm("formRef");
}
const handleChange = async (file, filelist) => {
	if (filelist && filelist.length) {
		filelist.forEach(async (item, index) => {
			if (!item.name.endsWith(".png") && !item.name.endsWith(".jpg")) {
				if (item.uid == file.uid) {
					filelist.splice(index, 1);
				}
				return proxy.$modal.msgError(
					item.name + " 文档格式不正确，请重新上传！"
				);
			} else {
				fileList.value = [filelist[filelist.length - 1]];
				let formData = new FormData();
				formData.append("file", fileList.value[0].raw);
				add_loading.value = true;
				let res = await uploadFile(formData);
				data.form.sysFileUuids = [res.data.fileUuid];
				proxy.$refs["fileRef"].clearValidate();
				add_loading.value = false;
			}
		});
		data.form.fileUuids = [data.form.files[0].fileUuid];
		fileList.value = [filelist[filelist.length - 1]];
	}
};
/** 导出按钮操作 */
const handleExport = async () => {
	let res = await exportPlan();
	let blob = new Blob([res]);
	let url = window.URL.createObjectURL(blob);
	let donloadElement = document.createElement("a");
	donloadElement.style.display = "none";
	donloadElement.href = url;
	donloadElement.download = `场景组态库文件.rar`;
	document.body.appendChild(donloadElement);
	donloadElement.click();
	document.body.removeChild(donloadElement);
	window.URL.revokeObjectURL(url);
};
// elment自带方法保存选中的数据
function selectionChange(selection) {
	data.sesetionData = selection;
}
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
</style>
