<template>
	<div class="fz-container" v-loading="container_loading">
		<el-form
			:model="data.queryParams"
			ref="queryRef"
			:inline="true"
			label-width="68px"
		>
			<el-form-item>
				<el-input
					clearable
					v-model="data.queryParams.foreignMatterName"
					placeholder="请输入异物组态名称"
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
			<el-table-column
				prop="foreignMatterName"
				label="异物组态名称"
				align="center"
			/>
			<el-table-column prop="foreignMatterType" label="异物类型" align="center">
				<template #default="{ row }">{{
					formatter(texture, row.foreignMatterType)
				}}</template>
			</el-table-column>
			<el-table-column
				prop="foreignMatterLocation"
				label="位置"
				align="center"
			/>
			<el-table-column prop="volume" align="center" label="尺寸" />
			<el-table-column
				prop="conLimitDuration"
				align="center"
				label="侵限时长"
			/>
			<el-table-column prop="speed" align="center" label="移动速度" />
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
						@click="opcHandle(scope.row, '详情')"
						>查看</el-button
					>
					<el-button
						size="mini"
						type="text"
						icon="Edit"
						@click="opcHandle(scope.row, '编辑')"
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
			@close="cancel"
		>
			<el-form
				ref="formRef"
				:model="data.form"
				:rules="data.rules"
				label-width="110px"
				:class="isCheck ? 'el-form-check' : ''"
				v-loading="add_loading"
				element-loading-text="拼命加载中"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(0, 0, 0, 0.8)"
			>
				<el-form-item label="异物组态名称" prop="foreignMatterName">
					<el-input
						v-model="data.form.foreignMatterName"
						placeholder="请输入异物组态名称"
						:disabled="isCheck"
					/>
				</el-form-item>
				<el-form-item
					label="异物类型"
					:label-width="labelWidth"
					prop="foreignMatterType"
				>
					<el-select
						v-model="data.form.foreignMatterType"
						placeholder="请选择异物类型"
						size="small"
						style="width: 100%"
						:disabled="isCheck"
					>
						<el-option
							v-for="item in texture"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="位置" prop="foreignMatterLocation">
					<el-input
						v-model="data.form.foreignMatterLocation"
						placeholder="请输入侵限位置"
						:disabled="isCheck"
					/>
				</el-form-item>
				<el-form-item label="尺寸(m²)" :label-width="labelWidth" prop="volume">
					<el-input
						v-model="data.form.volume"
						placeholder="请输入尺寸"
						:disabled="isCheck"
					/>
				</el-form-item>
				<el-form-item
					label="侵限时长(h)"
					:label-width="labelWidth"
					prop="conLimitDuration"
				>
					<el-input
						v-model="data.form.conLimitDuration"
						placeholder="请输入侵限时长"
						:disabled="isCheck"
					/>
				</el-form-item>
				<el-form-item label="添加时间" :label-width="labelWidth" prop="addTime">
					<el-date-picker
						v-model="data.form.addTime"
						type="date"
						value-format="YYYY-MM-DD HH:mm:ss"
						format="YYYY-MM-DD HH:mm:ss"
						clearable
						placeholder="选择日期时间"
						style="width: 100%"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item
					label="移动速度(m/s)"
					:label-width="labelWidth"
					prop="speed"
				>
					<el-input
						v-model="data.form.speed"
						placeholder="请输入移动速度"
						:disabled="isCheck"
					/>
				</el-form-item>
				<el-form-item label="图片" :label-width="labelWidth" ref="fileRef">
					<el-upload
						v-if="title !== '详情'"
						class="upload-demo"
						:auto-upload="false"
						:on-change="handleChange"
						:on-remove="handleRemove"
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
import { onMounted, ref, reactive } from "vue";
import {
	getPlan,
	delPlan,
	getPlanById,
	addPlan,
	uploadFile,
	editPlan,
	exportPlan,
} from "@/api/simulation/compManage/foreignBody.js";
const { proxy } = getCurrentInstance();
const { texture } = proxy.useDict("texture");
const data = reactive({
	form: {
		sysFileUuids: [],
		fileUuids: [],
	},
	queryParams: {
		pageNum: 1,
		pageSize: 10,
		// foreignMatterName: "",
	},
	rules: {
		foreignMatterName: [
			{
				required: true,
				message: "异物组态名称不能为空",
				trigger: "blur",
			},
		],
		foreignMatterLocation: [
			{ required: true, message: "侵限位置不能为空", trigger: "blur" },
		],
		foreignMatterType: [
			{ required: true, message: "异物类型不能为空", trigger: "change" },
		],
		volume: [{ required: true, message: "尺寸不能为空", trigger: "change" }],
		conLimitDuration: [
			{ required: true, message: "侵限时长不能为空", trigger: "change" },
		],
		speed: [{ required: true, message: "移动速度不能为空", trigger: "change" }],
		addTime: [
			{ required: true, message: "添加时间不能为空", trigger: "change" },
		],
	},
	sesetionData: "",
});
let URL = ref("");
let container_loading = ref(false);
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
const { queryParams, form } = toRefs(data);
const labelWidth = ref("114px");
onMounted(() => {
	getList();
});
const disabledDate = (time) => {
	return time.getTime() >= Date.now();
};

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

const opcHandle = async (row, caption) => {
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

/** 搜索按钮操作 */
const handleQuery = () => {
	data.queryParams.pageNum = 1;
	getList();
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

				getList();
			} else {
				res = await addPlan(data.form);
				proxy.$modal.msgSuccess("添加成功");
				getList();
			}
			if (res.code === 200) {
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
	fileList.value = [];
	URL.value = null;
	isCheck.value = false;
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
const handleRemove = (file, filelist) => {
	// data.form.fileUuids = [data.form.files[0].fileUuid];
	// fileList.value = filelist;
};
//elment自带方法保存选中的数据
function selectionChange(selection) {
	data.sesetionData = selection;
}
const handleExport = async () => {
	container_loading.value = true;
	let res = await exportPlan({ pageNum: 1, pageSize: 10 });
	let blob = new Blob([res]);
	let url = window.URL.createObjectURL(blob);
	let donloadElement = document.createElement("a");
	donloadElement.style.display = "none";
	donloadElement.href = url;
	donloadElement.download = `异物组态库文件.rar`;
	document.body.appendChild(donloadElement);
	donloadElement.click();
	document.body.removeChild(donloadElement);
	window.URL.revokeObjectURL(url);
	container_loading.value = false;
};
function formatter(data, key) {
	let res = data.find((i) => i.value == key);
	return res ? res.label : "空";
}
</script>
<style scoped>
::v-deep .el-upload-list__item-name {
	color: #606266 !important;
}
::v-deep .el-image-viewer__actions {
	display: none;
}
/* 查看大图样式 */
::v-deep .el-image-viewer__btn.el-image-viewer__close .el-icon {
	display: block !important;
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
