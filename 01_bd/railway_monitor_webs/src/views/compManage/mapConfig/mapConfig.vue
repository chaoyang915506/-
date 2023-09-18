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
					v-model="data.queryParams.lineName"
					placeholder="请输入路线名称"
					@clear="getList"
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
							>添加路线</el-button
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
			<el-table-column prop="lineName" label="路线名称" align="center" />
			<el-table-column prop="lineStart" label="起点" align="center" />
			<el-table-column prop="lineEnd" align="center" label="终点" />
			<el-table-column prop="siteSnum" align="center" label="站点数量" />
			<el-table-column prop="isShow " align="center" label="发布状态">
				<template #default="scope">
					{{ scope.row.isShow ? "未发布" : "已发布" }}
				</template>
			</el-table-column>
			<el-table-column prop="createTime" align="center" label="添加时间" />
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
				v-show="title == '添加路线'"
				ref="formRef"
				:model="data.form"
				:rules="data.rules"
				label-width="110px"
			>
				<el-form-item label="路线名称" prop="lineName">
					<el-input v-model="data.form.lineName" placeholder="请输入路线名称" />
				</el-form-item>
				<el-form-item label="上传文件" prop="fileList" ref="fileRef">
					<el-upload
						class="upload-demo"
						:auto-upload="false"
						:on-change="handleChange"
						:on-remove="handleRemove"
						:file-list="fileList"
					>
						<el-button size="small" icon="Upload" type="primary"
							>点击上传</el-button
						>
					</el-upload>
					<div style="color: #ff3535">*请上传xls/xlsx格式的文件！</div>
				</el-form-item>
			</el-form>
			<el-form
				v-show="title !== '添加路线'"
				ref="formRef"
				:model="data.form"
				label-width="110px"
			>
				<el-form-item label="路线名称">
					<span>{{ data.form.lineName }}</span>
				</el-form-item>
				<el-form-item label="起点">
					<span>{{ data.form.lineEnd }}</span>
				</el-form-item>
				<el-form-item label="终点">
					<span>{{ data.form.lineEnd }}</span>
				</el-form-item>
				<el-form-item label="状态">
					<span>{{ data.form.isShow ? "未发布" : "已发布" }}</span>
				</el-form-item>
				<el-form-item label="途径点数量">
					<span>{{ data.form.approachPoint }}</span>
				</el-form-item>
				<el-form-item label="添加时间">
					<span>{{ data.form.createTime }}</span>
				</el-form-item>
			</el-form>
			<template #footer>
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
	getSelectLine,
	getSelectByLineName,
	addLine,
	deleteLine,
	getLineById,
	updateLineById,
} from "@/api/simulation/compManage/mapConfig.js";
const { proxy } = getCurrentInstance();
const data = reactive({
	form: {
		lineName: "",
		file: "",
	},
	queryParams: {
		lineName: undefined,
		pageNum: 1,
		pageSize: 10,
	},
	rules: {
		lineName: [
			{ required: true, message: "路线名称不能为空", trigger: "blur" },
		],
	},
	sesetionData: [], //选中的数据
});
const total = ref(0);
const loading = ref(false);
const title = ref("");
const open = ref(false);
const tableData = ref([]);
const fileList = ref([]);
onMounted(() => {
	getList();
});
const getList = async () => {
	loading.value = true;
	let res = await getSelectLine(data.queryParams);
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
	open.value = true;
	title.value = "查看路线";
	getDataById(row.id);
};
// 根据id查询数据
const getDataById = async (id) => {
	let res = await getLineById(id);
	if (res.code == 200) {
		data.form = res.data;
	}
};
const handleIssue = (row) => {
	loading.value = true;

	proxy.$modal
		.confirm("是否发布该路线?")
		.then(() => {
			return updateLineById({ id: row.id });
		})
		.then(() => {
			getTable();
			proxy.$modal.msgSuccess("发布成功");
			loading.value = false;
		})
		.catch(() => {
			loading.value = false;
			proxy.$modal.msgSuccess("发布成功");
			getList();
		});

	getList();
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
	title.value = "添加路线";
};
// 提交信息
const submitForm = () => {
	proxy.$refs["formRef"].validate(async (valid) => {
		if (valid) {
			let formData = new FormData();
			formData.append("file", fileList.value[0].raw);
			formData.append("lineName", data.form.lineName);
			let res = await addLine(formData)
				.then((res) => {
					if (res.code == 200) {
						getList();
						open.value = false;
						proxy.$modal.msgSuccess("添加成功");
					} else {
						open.value = false;
					}
				})
				.catch((err) => {
					open.value = false;
				});
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
	fileList.value = [];
	proxy.resetForm("formRef");
}
const handleChange = (file, filelist) => {
	if (filelist && filelist.length) {
		// filelist.forEach((item, index) => {
		// if (!item.name.endsWith(".xls")) {
		// if (item.uid == file.uid) {
		// 	filelist.splice(index, 1);
		// }
		// return proxy.$modal.msgError(
		// 	item.name + " 文档格式不正确，请重新上传！"
		// );
		// }
		// });
		fileList.value = [filelist[filelist.length - 1]];
		proxy.$refs["fileRef"].clearValidate();
	}
};
const handleRemove = (file, filelist) => {
	fileList.value = filelist;
};
//elment自带方法保存选中的数据
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
::v-deep .el-button__text--expand {
	margin-left: 2px !important;
}
.el-form-item__content span {
	color: white;
}
</style>
