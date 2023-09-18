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
					v-model="data.queryParams.sceneName"
					placeholder="请输入场景组态名称"
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
							>添加</el-button
						>
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
			<el-table-column prop="sceneName" label="场景组态名称" align="center" />
			<el-table-column prop="sceneType" label="场景类型" align="center">
				<template #default="{ row }">{{
					formatter(scene_type, row.sceneType)
				}}</template>
			</el-table-column>
			<el-table-column prop="createTime" label="添加时间" align="center" />
			<el-table-column
				label="操作"
				align="center"
				width="150"
				class-name="small-padding fixed-width"
			>
				<template #default="scope">
					<el-button
						type="text"
						size="mini"
						icon="View"
						@click="SceneView(scope.row, '详情')"
						>查看</el-button
					>
					<el-button
						type="text"
						size="mini"
						icon="Edit"
						@click="SceneView(scope.row, '编辑')"
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
				<el-form-item label="场景组态名称" prop="sceneName">
					<el-input
						clearable
						v-model="data.form.sceneName"
						placeholder="请输入场景组态名称"
						:disabled="isCheck"
					/>
				</el-form-item>
				<!-- <el-form-item label="场景类型" prop="sceneType">
					<el-select
						v-model="data.form.sceneType"
						placeholder="请选择场景类型"
						size="small"
						style="width: 100%"
						:disabled="isCheck"
					>
						<el-option
							v-for="item in volumeList"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item> -->
				<el-form-item
					label="场景类型"
					:label-width="labelWidth"
					prop="sceneType"
				>
					<el-select
						v-model="data.form.sceneType"
						placeholder="请选择场景类型"
						size="small"
						style="width: 100%"
						:disabled="isCheck"
					>
						<el-option
							v-for="item in scene_type"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					label="添加时间"
					:label-width="labelWidth"
					prop="createTime"
				>
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
					<div style="color: #ff3535" v-if="title !== '详情'">
						*请上传png/jpg格式的图片！
					</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer" v-if="title !== '详情'">
					<el-button type="primary" @click="submitForm">确 定</el-button>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<script setup>
// 添加单位选项暂未确定
import { onMounted, ref, reactive } from "vue";
// import {
// 	getPlan,
// 	// delPlan,
// 	getPlanById,
// 	addPlan,
// 	uploadFile
// } from "@/api/SceneGroup/Administration/scene.js";
import {
	getPlan,
	delPlan,
	getPlanById,
	addPlan,
	uploadFile,
	editPlan,
	exportPlan,
} from "@/api/simulation/compManage/scenarios.js";
const { proxy } = getCurrentInstance();
const { scene_type } = proxy.useDict("scene_type");
const data = reactive({
	form: {},
	queryParams: {
		pageNum: 1,
		pageSize: 10,
		sceneName: "",
	},
	rules: {
		sceneName: [
			{
				required: true,
				message: "场景组态名称不能为空",
				trigger: "blur",
			},
		],
		sceneType: [
			{
				required: true,
				message: "场景类型不能为空",
				trigger: "change",
			},
		],
		createTime: [
			{
				required: true,
				message: "添加时间不能为空",
				trigger: "change",
			},
		],
	},
	export: "",
	sesetionData: "",
});
const { queryParams, form } = toRefs(data);
let URL = ref("");
let fits = ref(["fill", "contain", "cover", "none", "scale-down"]);
const total = ref(0);
const loading = ref(false);
let add_loading = ref(false);
const title = ref("");
const open = ref(false);
const isCheck = ref(false);
const tableData = ref([]);
const fileList = ref([]);
const url = ref(null);
const labelWidth = ref("114px");
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

// const handleEdit = async (row) => {
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
const SceneView = async (row, caption) => {
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
	isCheck.value = false;
};
// 提交信息
const submitForm = async (valid) => {
	if (valid) {
		let res;
		if (title.value === "编辑") {
			delete data.form.files;
			res = await editPlan(data.form);
		} else {
			res = await addPlan(data.form);
		}
		if (res.code === 200) {
			getList();
			open.value = false;
			return proxy.$modal.msgSuccess("添加成功");
		} else {
			open.value = false;
			return proxy.$modal.msgError("添加失败");
		}
	}
};
// 取消提交
const cancel = () => {
	open.value = false;
	reset();
};
/** 表单重置 */
function reset() {
	data.form = {};
	fileList.value = [];
	proxy.resetForm("formRef");
}
const handleChange = (file, filelist) => {
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
//elment自带方法保存选中的数据
function selectionChange(selection) {
	data.sesetionData = selection;
}
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
function formatter(data, key) {
	let res = data.find((i) => i.value == key);
	return res ? res.label : "空";
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
