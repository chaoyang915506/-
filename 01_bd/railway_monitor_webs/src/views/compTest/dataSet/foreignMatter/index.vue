<template>
	<div class="fz-container" v-loading="loading">
		<!-- 图标 -->
		<div class="icon_list_style">
			<weather-icon
				v-for="(i, j) in textureData"
				:key="j"
				:texture="i.texture"
				:count="i.count"
			></weather-icon>
		</div>
		<!--搜索框 -->
		<el-form label-width="80px" :inline="true" size="normal">
			<el-form-item label="">
				<el-select placeholder="" v-model="moldAll" @change="SelectChange">
					<el-option label="按种类" value="1"></el-option>
					<el-option label="按添加时间" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-date-picker
					v-if="moldAll == 2"
					v-model="timePicker"
					type="daterange"
					range-separator="To"
					value-format="YYYY-MM-DD"
					format="YYYY-MM-DD"
					@change="getDate"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					:size="size"
					clearable
				/>
				<el-select
					v-if="moldAll == 1"
					clearable
					placeholder="请选择异物类型"
					v-model="queryParams.foreignMatterType"
					@change="getList"
				>
					<el-option
						v-for="item in texture"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button
					type="primary"
					style="margin-left: 10px"
					size="default"
					round
					@click="getList"
					>确定</el-button
				></el-form-item
			>
			<el-form-item style="float: right">
				<el-button
					type="primary"
					style="margin-right: 10px"
					size="default"
					round
					@click="deletHandle"
					>删除</el-button
				>
				<el-button
					type="primary"
					style="margin-right: 10px"
					size="default"
					round
					@click="addHandle"
					>添加</el-button
				>
				<el-select class="select_pic" v-model="pic_data" filterable>
					<el-option label="大图" value="0"></el-option>
					<el-option label="小图" value="1"></el-option>
					<el-option label="列表" value="2"></el-option>
					<el-option label="详细信息" value="3"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<!-- 暂无数据占位 -->
		<el-empty v-if="isEmpty" description="暂无数据..."></el-empty>
		<!-- 图片集 -->
		<div style="width: 100%">
			<!-- 大图 -->
			<div v-if="pic_data == '0'" class="piclist_sum">
				<div class="list_pic" v-for="i in allDataList" :key="i.id">
					<div class="pic_body" @click="viewDetails(i)">
						<el-image
							:src="i.image"
							style="width: 100%; height: 100%"
							fit="fill"
							:lazy="true"
						></el-image>
						<div class="shade">
							<div>
								<span>材质类别: {{ i.foreignMatterType }}</span>
							</div>
							<div>
								<span>异物描述: {{ i.foreignMatterDescription }}</span>
							</div>
							<div>
								<span>数据来源: {{ i.dataSource }}</span>
							</div>
						</div>
					</div>

					<div class="info">
						<el-checkbox
							v-if="isShowPicCheckbox"
							@change="getDeletePicIds(i.id)"
							style="padding-right: 8px"
						/>{{  i.name }}
					</div>
				</div>
			</div>
			<!-- 小图 -->
			<div v-if="pic_data == '1'" class="piclist_sum_small">
				<div class="list_pic_small" v-for="i in allDataList" :key="i.id">
					<div class="pic_body" @click="viewDetails(i)">
						<el-image
							:src="i.image"
							fit="fill"
							style="width: 100%; height: 100%"
							:lazy="true"
						></el-image>
					</div>
					<div class="info_samll">
						<el-checkbox
							v-if="isShowPicCheckbox"
							@change="getDeletePicIds(i.id)"
							style="padding-right: 8px"
						/>
						{{  i.name }}
					</div>
				</div>
			</div>
			<!-- 列表 -->
			<div v-if="pic_data == '2'">
				<div class="list_pic_list" v-for="i in allDataList" :key="i.id">
					<div class="pic_body_list" @click="viewDetails(i)">
						<el-checkbox
							v-if="isShowPicCheckbox"
							@change="getDeletePicIds(i.id)"
							style="padding-right: 8px"
						/>
						<el-icon color="white"><PictureFilled /></el-icon>
						&nbsp;
						<span class="name_list">{{  i.name }}</span>
						<div class="info_list">
							<el-button type="text" @click="viewDetails(i)">查看</el-button>
						</div>
					</div>
				</div>
			</div>
			<!-- 详细详细 -->
			<div v-if="pic_data == '3'">
				<table style="width: 100%">
					<tr>
						<th></th>
						<th>名称</th>
						<th>描述</th>
						<th>来源</th>
						<th>操作</th>
					</tr>
					<tbody>
						<tr v-for="i in allDataList" :key="i.id">
							<td>
								<el-checkbox
									v-if="isShowPicCheckbox"
									@change="getDeletePicIds(i.id)"
									style="padding-right: 8px"
								/>
								<el-icon color="white"><PictureFilled /> </el-icon>
							</td>
							<td>{{  i.name }}</td>
							<td class="pic_details">
								{{ i.foreignMatterDescription }}
							</td>
							<td>{{ i.dataSource }}</td>
							<td>
								<el-button size="small" type="text" @click="viewDetails(i)"
									>查看</el-button
								>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<!-- 查看 -->
		<el-dialog v-model="check_details" title="查看" width="35%">
			<el-row :gutter="24" justify="center">
				<el-col :span="12">
					<el-form
						:model="formData"
						ref="formDataRef"
						label-position="left"
						label-width="110px"
						:inline="false"
						size="normal"
					>
						<el-form-item label="图片ID">
							<span class="detail_style">{{ formData.id }}</span>
						</el-form-item>
						<el-form-item label="数据来源">
							<span class="detail_style">{{ formData.dataSource }}</span>
						</el-form-item>
						<el-form-item label="异物类型">
							<span class="detail_style"
								>{{ formData.foreignMatterType }}
							</span>
						</el-form-item>
						<el-form-item label="异物来源">
							<span class="detail_style"
								>{{ formData.foreignMatterSource }}
							</span>
						</el-form-item>
						<el-form-item label="尺寸">
							<span class="detail_style">{{ formData.volume }} </span>
						</el-form-item>
						<el-form-item label="侵限区域">
							<span class="detail_style">{{ formData.conLimitArea }} </span>
						</el-form-item>
						<el-form-item label="异物风险描述">
							<span class="detail_style"
								>{{ formData.foreignMatterDescription }}
							</span>
						</el-form-item>
						<el-form-item label="应用">
							<span class="detail_style">{{ formData.application }} </span>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-dialog>
		<el-dialog
			v-model="add_details"
			title="添加"
			width="35%"
			ref="fileRef"
			@close="cancel"
		>
			<el-form v-loading="!add_details">
				<el-form-item label="添加模板">
					<el-upload
						class="upload-demo"
						:auto-upload="false"
						:on-change="handleChange"
						:on-remove="handleRemove"
						:file-list="fileList"
					>
						<el-button size="small" icon="Upload" type="primary"
							>上传模板</el-button
						>
					</el-upload>
				</el-form-item>
				<el-form-item label="添加图片">
					<el-upload
						class="upload-demo"
						:auto-upload="false"
						:on-change="imageHandleChange"
						:on-remove="imageHandleRemove"
						:file-list="imageFileList"
						list-type="picture"
					>
						<el-button size="small" icon="Upload" type="primary"
							>上传图片</el-button
						>
					</el-upload>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer" v-if="title !== '详情'">
					<el-button type="primary" @click="submitForm" :disabled="!add_details"
						>确 定</el-button
					>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { getCurrentInstance, toRefs } from "vue";
import {
	getforeign,
	getfindCount,
	addfind,
	deletforeign,
} from "@/api/simulation/compTest/foreignMatter";
const { proxy } = getCurrentInstance();
const { texture } = proxy.useDict("texture");

//日期选择器
const getDate = (e) => {
	if (!e) {
		data.queryParams.startDate = "";
		data.queryParams.endDate = "";
	} else {
		data.queryParams.startDate = e[0];
		data.queryParams.endDate = e[1];
	}
	getList();
};
const data = reactive({
	isEmpty: false,
	isShowPicCheckbox: false,
	deletePicIds: [], //点击删除勾选后的id
	filterPicIds: [], //算法过滤后
	imageFileList: [],
	fileList: [],
	timePicker: [],
	// errorImg: true, //出错的时候触发
	textureData: [], //异物数量
	moldAll: "1",
	allDataList: [], //全部的列表数据
	queryParams: {
		foreignMatterType: "",
		startDate: "",
		endDate: "",
	},
	loading: false,
	pic_data: "0",
	//点击查看
	check_details: false,
	add_details: false,
	formData: {},
	//测试二进制流图片
	testimg: "",
});
const {
	testimg,
	loading,
	weatherData,
	pic_data,
	formData,
	check_details,
	isShowPicCheckbox,
	add_details,
	imageFileList,
	fileList,
	moldAll,
	textureData,
	queryParams,
	allDataList,
	timePicker,
	isEmpty,
} = toRefs(data);

//获取列表数据
function getList() {
	data.loading = true;
	getforeign({ ...data.queryParams })
		.then((res) => {
			data.allDataList = res.data.map((i) => {
				return {
					...i,
					image: toflowData(i.file ? i.file.fileBytes : ""),
					name: i.file ?  i.file.fileName : ""
				};
			});
			data.isEmpty = false;
			data.loading = false;
		})
		.catch((err) => {
			data.isEmpty = true;
			data.loading = false;
		});
}

function SelectChange() {
	data.queryParams.foreignMatterType = "";
	data.queryParams.endDate = "";
	data.queryParams.startDate = "";
	data.timePicker = [];
}
//全部的异物数据
getfindCount().then((res) => {
	let resdata = res.data.map((i) => {
		return {
			texture: i.dataType,
			count: i.dataCount,
		};
	});
	data.textureData = resdata;
});
//查数据
function formatterDict(data, key) {
	const findData = data.find((i) => i.value == key);
	return findData ? findData.label : "无";
}
// 查看
const viewDetails = (item) => {
	data.formData = item;
	data.check_details = true;
};
// 添加
const addHandle = () => {
	data.add_details = true;
};
// 删除
const deletHandle = async () => {
	data.isShowPicCheckbox = true;
	if (data.isShowPicCheckbox && data.filterPicIds.length) {
		let ids = data.filterPicIds.join(",");
		let res = await deletforeign(ids);
		data.filterPicIds = [];
		data.deletePicIds = [];
		data.isShowPicCheckbox = false;
		if (res.code === 200) {
			proxy.$modal.msgSuccess("删除成功");
			getList();
		} else {
			proxy.$modal.msgSuccess("删除成功");
		}
	}
};
getList();
const toflowData = (file) => {
	let pic = "";
	let bytes = window.atob(file);
	let buffer = new ArrayBuffer(bytes.length);
	let unit = new Uint8Array(buffer);

	for (let i = 0; i < bytes.length; i++) {
		unit[i] = bytes.charCodeAt(i);
	}
	let blob = new Blob([buffer]);
	pic = window.URL.createObjectURL(blob);
	return pic ? pic : "";
};
// 文件上传回调 -图片
const imageHandleChange = async (file, filelist) => {
	data.imageFileList = filelist;
};
const imageHandleRemove = (file, filelist) => {
	data.imageFileList = filelist;
};
// 文件上传回调 -文本
const handleChange = async (file, filelist) => {
	data.fileList = filelist;
};
const handleRemove = (file, filelist) => {
	data.fileList = filelist;
};
const submitForm = async () => {
	if (!data.fileList.length)
		return proxy.$modal.msgSuccess("文件模板不能为空！");
	if (!data.imageFileList.length)
		return proxy.$modal.msgSuccess("图片不能为空！");
	let formData = new FormData();
	// 文本文件
	formData.append("baseFile", data.fileList[0].raw);
	// 图片文件
	data.imageFileList.map((item) => {
		formData.append("files", item.raw);
	});
	let res = await addfind(formData);
	cancel();
	if (res.code === 200) {
		proxy.$modal.msgSuccess("添加成功");
		getList();
	} else {
		proxy.$modal.msgSuccess("失败成功");
	}
};
// 取消
const cancel = () => {
	data.add_details = false;
	data.fileList = [];
	data.imageFileList = [];
};
// 获取删除数组
const getDeletePicIds = (row) => {
	let filterPicIds = [];
	data.deletePicIds.push(row);
	deletRepetition(filterPicIds);
};
const deletRepetition = (filterPicIds) => {
	var countedNames = data.deletePicIds.reduce((obj, name) => {
		if (name in obj) {
			obj[name]++;
		} else {
			obj[name] = 1;
		}
		return obj;
	}, {});
	for (const key in countedNames) {
		if (countedNames[key] % 2 !== 0) {
			filterPicIds.push(key);
		}
	}
	data.filterPicIds = filterPicIds;
};
</script>

<style scoped>
@import url("./../css/index.css");

</style>
