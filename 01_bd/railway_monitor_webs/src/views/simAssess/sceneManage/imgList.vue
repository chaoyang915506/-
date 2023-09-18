<template>
	<!-- <el-row>
		<el-col :span="4">
			<el-select
				v-model="queryParams.modeType"
				clearable
				size="small"
				style="width: 90%"
			>
				<el-option
					v-for="(item, index) in modeOpt"
					:key="index"
					:label="item.name"
					:value="item.value"
				/>
			</el-select>
		</el-col>
		<el-col :span="7" v-show="queryParams.modeType == 'timePicker'">
			<el-date-picker
				v-model="queryParams.timePicker"
				type="datetimerange"
				clearable
				value-format="YYYY-MM-DD HH:mm:ss"
				style="width: 100%"
				size="small"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
			/>
		</el-col>
		<el-col :span="6" v-show="queryParams.modeType == 'deviceId'">
			<el-input
				v-model="queryParams.deviceId"
				size="small"
				placeholder="请输入设备id"
			></el-input>
		</el-col>
		<el-col :span="4" style="margin-left: 10px">
			<el-button type="primary" icon="Search" size="small" @click="handleQuery"
				>搜索</el-button
			>
			<el-button icon="Refresh" size="small" @click="resetQuery"
				>重置</el-button
			>
		</el-col>
	</el-row> -->
	<div class="img-list-content">
		<ul>
			<li v-for="(item, index) in imgListData" :key="index">
				<div class="img-div">
					<el-image
						:src="item.image"
						style="width: 100%; height: 100%"
						fit="fill"
						:lazy="true"
					></el-image>
				</div>
				<div class="img-label">
					<span>{{ item.name }}</span>
					<div class="defined-checked">
						<el-checkbox
							v-model="item.checked"
							size="large"
							@change="getDeletePicIds(item)"
						/>
					</div>
				</div>
			</li>
		</ul>
	</div>
	<pagination
		v-show="total > 0"
		:total="total"
		v-model:page="queryParams.pageNum"
		v-model:limit="queryParams.pageSize"
		@pagination="getList"
	/>
</template>
<script setup>
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
const emit = defineEmits(["changePicId"]);
const total = ref(1);
let modeOpt = ref([
	{
		name: "按设备id",
		value: "deviceId",
	},
	{
		name: "按时间",
		value: "timePicker",
	},
]);
let imgListData = ref([]);
let queryParams = ref({
	pageNum: 1,
	pageSize: 20,
	modeType: undefined,
	timePicker: undefined,
	deviceId: undefined,
});
let picIds = ref([]);
let props = defineProps({
	picList: {
		type: Array,
		default: [],
	},
});
watch(
	() => props.picList,
	(val) => {
		if (val.length) {
			imgListData.value = val.map((i) => {
				return {
					...i,
					image: toflowData(i.img),
				};
			});
		}
	}
);
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
	return pic;
};
// 搜索
function handleQuery() {}
// 重置
function resetQuery() {
	queryParams.modeType = undefined;
	queryParams.timePicker = undefined;
	queryParams.deviceId = undefined;
}
// 获取勾选图片
const getDeletePicIds = (val) => {
	let arr = imgListData.value.map((item) => {
		return {
			...item,
			checked: item.id === val.id ? true : false,
		};
	});
	imgListData.value = arr;
	emit("changePicId", val);
};
</script>
<style scoped>
.img-list-content ul,
.img-list-content li {
	margin: 0;
	padding: 0;
	list-style: none;
}

.img-list-content {
	max-height: 60vh;
	overflow-y: auto;
	margin-top: 10px;
}

.img-list-content ul {
	display: flex;
	align-items: center;
	/* justify-content: space-between; */
	flex-wrap: wrap;
}

.img-list-content li {
	width: 18%;
	height: 160px;
	cursor: pointer;
	margin: 10px;
	text-align: center;
	border: 1px solid #ccc;
}
.img-div {
	width: 100%;
	height: 130px;
	border-bottom: 1px solid #ccc;
}
.img-label {
	display: flex;
	height: 30px;
	color: #cfcfcf;
	font-size: 14px;
	align-items: center;
}
.img-label span {
	flex: 1;
	text-align: right;
}
.defined-checked {
	flex: 1;
	text-align: right;
	padding-right: 5px;
}
.defined-checked :deep(.el-checkbox) {
	--el-checkbox-input-height: 20px;
	--el-checkbox-input-width: 20px;
	--el-checkbox-background-color: #a6a5a6;
	--el-checkbox-input-border: none;
}
.defined-checked :deep(.el-checkbox__inner::after) {
	height: 12px;
	left: 8px;
	border-width: 2px;
}
</style>
