<template>
	<div class="fz-container" v-loading="loading">
		<!-- 图标 -->
		<div class="elcard_display">
			<echarts-pictorial-bar
				class="box_plane"
				:echartData="sceneData"
			></echarts-pictorial-bar>

			<echarts-pictorial-bar
				class="box_plane"
				:echartData="weatherData"
			></echarts-pictorial-bar>
			<echarts-pictorial-bar
				class="box_plane"
				:echartData="textureData"
			></echarts-pictorial-bar>
		</div>
		<!--搜索框 -->
		<el-form :inline="true" size="normal">
			<el-form-item>
				<el-select
					placeholder="请选择搜索类型"
					v-model="moldAll"
					@change="SelectChange"
				>
					<el-option label="按种类" value="1"></el-option>
					<el-option label="按时间" value="2"></el-option>
					<!-- <el-option label="按组态" value="3"></el-option> -->
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
				/>
				<el-select
					v-if="moldAll == 1"
					v-model="config"
					@change="configChange"
					placeholder="请选择组态类型"
					clearable
				>
					<el-option label="异物组态" value="1"> </el-option>
					<el-option label="场景组态" value="2"> </el-option>
					<el-option label="气象组态" value="3"> </el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select
					clearable
					v-model="sceneSetName"
					v-if="moldAll == 1"
					@change="getList"
				>
					<el-option
						v-for="item in configuartion"
						:key="item.value"
						:label="item.label"
						:value="item.label"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" round size="default" @click="getList"
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
						<el-image :src="i.image" fit="contain" :lazy="true"></el-image>
						<div class="shade">
							<div>
								<!-- <img
									style="width: 1.875rem"
									src="../../../../assets/icons/svg/heavyfog.svg"
									alt=""
								/> -->
								<span>材质类别: {{ i.scenesName }}</span>
							</div>
							<div>
								<span>湿度: {{ i.humidity }}</span>
							</div>
							<div>
								<span>风速: {{ i.windSpeed }}</span>
							</div>
						</div>
					</div>
					<div class="info">
						<el-checkbox
							v-if="isShowPicCheckbox"
							@change="getDeletePicIds(i.id)"
							style="padding-right: 8px"
						/>{{ i.name }}
					</div>
				</div>
			</div>
			<!-- 小图 -->
			<div v-if="pic_data == '1'" class="piclist_sum_small">
				<div class="list_pic_small" v-for="i in allDataList" :key="i.id">
					<div class="pic_body" @click="viewDetails(i)">
						<el-image :src="i.image" fit="contain" :lazy="true"></el-image>
					</div>
					<div class="info_samll">
						<el-checkbox
							v-if="isShowPicCheckbox"
							@change="getDeletePicIds(i.id)"
							style="padding-right: 8px"
						/>
						<span>{{ i.name }}</span>
					</div>
				</div>
			</div>
			<!-- 列表 -->
			<div v-if="pic_data == '2'">
				<div class="list_pic_list" v-for="i in allDataList" :key="i.id">
					<div class="pic_body_list" @click="viewDetails(i)">
						<el-icon color="white"><PictureFilled /></el-icon>
						&nbsp;
						<span>{{ i.name }}</span>
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
						<th>仿真结果描述</th>
						<th>检出率</th>
						<th>操作</th>
					</tr>
					<tbody>
						<tr v-for="i in allDataList" :key="i.id">
							<td>
								<el-icon color="white"><PictureFilled /> </el-icon>
							</td>
							<td>{{ i.name }}</td>
							<td class="pic_details">
								{{ i.simulationDescribe }}
							</td>
							<td>{{ i.detectionRate }}</td>
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
		<el-dialog v-model="check_details" title="查看" ref="delDialog" width="35%">
			<el-form
				:model="formData"
				ref="formDataRef"
				label-position="left"
				label-width="80px"
				:inline="false"
				size="normal"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="图片ID">
							<span class="detail_style">{{ formData.id }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="场景名称">
							<span class="detail_style">{{ formData.sceneName }}</span>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="场景类型">
							<span class="detail_style">{{ formData.sceneType }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="情景名称">
							<span class="detail_style">{{ formData.scenesName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="温度">
							<span class="detail_style">{{ formData.airTemperature }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="相对湿度">
							<span class="detail_style">{{ formData.humidity }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="气压">
							<span class="detail_style"
								>{{ formData.atmosphericPressure }}
							</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="风向">
							<span class="detail_style">{{ formData.windDirection }} </span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="风速">
							<span class="detail_style"
								>{{ getWindSpeed(formData.windSpeed) }}
							</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="雨量">
							<span class="detail_style">{{ formData.rainCapacity }} </span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="雪深(cm)">
							<span class="detail_style">{{ formData.snowDepth }} </span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="速度">
							<span class="detail_style">{{ formData.speed }} </span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="材质">
							<span class="detail_style">{{ formData.texture }} </span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="尺寸">
							<span class="detail_style">{{ formData.volume }} </span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="气象类型">
							<span class="detail_style">{{ formData.weatherType }} </span>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="地质类型">
							<span class="detail_style"
								>{{
									formData.geologyType == 1
										? "褶皱"
										: formData.geologyType == 2
										? "节理"
										: "断层"
								}}
							</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="异物位置">
							<span class="detail_style"
								>{{ formData.foreignMatterLocation }}
							</span>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="异物名称">
							<span class="detail_style"
								>{{ formData.foreignMatterName }}
							</span>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="异物类型">
							<span class="detail_style"
								>{{ formData.foreignMatterType }}
							</span>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="侵限时长">
							<span class="detail_style">{{ formData.conLimitDuration }} </span>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="侵限类型">
							<span class="detail_style">{{ formData.conLimitType }} </span>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="数据类型">
							<span class="detail_style"
								>{{ formData.dataType ? "前端展示" : "训练" }}
							</span>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="组态名称">
							<span class="detail_style">{{ formData.envName }} </span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<!-- 添加 -->
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
import EchartsPictorialBar from "@/components/EchartsPictorialBar/index.vue";
import { formatterWeather, fomattertexture } from "./index.js";
import {
	getScenesList,
	getWeatherconfig,
	getFormattconfig,
	getSceneconfig,
	addScenes,
	deleteScenes,
} from "@/api/simulation/compTest/circumstances";
const { proxy } = getCurrentInstance();
const { texture, scene_type, weather } = proxy.useDict(
	"scene_type",
	"texture",
	"weather"
);
const data = reactive({
	isEmpty: false,
	isShowPicCheckbox: false,
	fileList: [],
	filterPicIds: [],
	deletePicIds: [],
	imageFileList: [],
	add_details: false,
	sceneSetName: "",
	config: "",
	// 组态信息
	configuartion: [],
	moldAll: "",
	loading: false,
	allDataList: [], //全部的列表数据
	queryParams: {
		startDate: "",
		endDate: "",
		foreignMatterType: "",
		sceneType: "",
		weatherType: "",
	},
	//起始时间
	timePicker: [],
	pic_data: "0",
	//点击查看
	check_details: false,
	formData: {},
	//气象表
	weatherData: {
		xAxisData: [],
		seriesData: [],
		axisLine: false,
		title: "气象组态",
	},
	//异物表
	textureData: {
		xAxisData: [],
		seriesData: [],
		axisLine: false,
		title: "异物组态",
	},
	sceneData: {
		xAxisData: [],
		seriesData: [],
		axisLine: false,
		title: "场景组态",
	},
	//下拉
	SelectWeatherData: [],
	weatherState: "",
});

//获取列表的数据
function getList() {
	let name = data.sceneSetName;
	data.config == 1
		? (data.queryParams.foreignMatterType = name)
		: data.config == 2
		? (data.queryParams.sceneType = name)
		: (data.queryParams.weatherType = name);
	data.loading = true;
	getScenesList({ ...data.queryParams })
		.then((res) => {
			data.loading = false;
			data.isEmpty = false;

			data.allDataList = res.data.map((i) => {
				return {
					...i,
					image: toflowData(i.file ? i.file.fileBytes : ""),
					name: i.file ? i.file.fileName : "",
				};
			});
		})
		.catch(() => {
			data.loading = false;
			data.isEmpty = true;
		});
}
// // 添加
const addHandle = () => {
	data.add_details = true;
};
// 删除
const deletHandle = async () => {
	data.isShowPicCheckbox = true;
	if (data.isShowPicCheckbox && data.filterPicIds.length) {
		let ids = data.filterPicIds.join(",");
		let res = await deleteScenes(ids);
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
function formatterDict(data, key) {
	const findData = data.find((i) => i.value == key);
	return findData ? findData.label : "空";
}
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
// 查看
const viewDetails = (item) => {
	data.formData = item;
	data.check_details = true;
};

function formatterList(data, arr, keyname) {
	let newarr = [];
	arr.forEach((i) => {
		const findData = data.find((i) => i.value == i[keyname]);
		//为了页面好看后期改成空或者天气
		newarr.push({
			name: findData ? findData.label : i[keyname],
			count: i.count,
		});
	});
	return newarr;
}

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
	let res = await addScenes(formData);
	cancel();
	if (res.code === 200) {
		proxy.$modal.msgSuccess("添加成功");
		getList();
	} else {
		proxy.$modal.msgSuccess("失败成功");
	}
};
// 添加的取消
const cancel = () => {
	data.add_details = false;
	data.fileList = [];
	data.imageFileList = [];
};
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
getList();
function SelectChange() {
	data.queryParams.endDate = "";
	data.queryParams.startDate = "";
	data.sceneSetName = "";
	data.timePicker = [];
	data.queryParams.foreignMatterType = "";
	data.queryParams.sceneType = "";
	data.queryParams.weatherType = "";
}
// 组态切换
const configChange = (e) => {
	SelectChange();
	if (e == 1) {
		data.configuartion = texture.value;
	} else if (e == 2) {
		data.configuartion = scene_type.value;
	} else if (e == 3) {
		data.configuartion = weather.value;
	}
};
const findrainsnow = (i) => {
	if (i == 0) {
		return "无降水";
	} else if (i == 1) {
		return "有降水";
	} else {
		return "未知";
	}
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
getWeatherconfig().then((res) => {
	data.weatherData.seriesData = res.data.map((i) => i.weatherCount);
	data.weatherData.xAxisData = res.data.map((i) => {
		return formatterDict(weather.value, i.weatherType);
	});
});
getFormattconfig().then((res) => {
	data.textureData.xAxisData = res.data.map((i) => {
		return formatterDict(texture.value, i.foreignMatterType);
	});
	data.textureData.seriesData = res.data.map((i) => i.foreignMatterCount);
});
getSceneconfig().then((res) => {
	data.sceneData.xAxisData = res.data.map((i) => {
		return formatterDict(scene_type.value, i.sceneType);
	});
	data.sceneData.seriesData = res.data.map((i) => i.sceneCount);
});
const getWindSpeed = (val) => {
	if (val === 1) return "东";
	if (val === 2) return "西";
	if (val === 3) return "南";
	if (val === 4) return "北";
	if (val === 5) return "东南";
	if (val === 6) return "东北";
	if (val === 7) return "西南";
	if (val === 8) return "西北";
};
const {
	isEmpty,
	weatherData,
	weatherState,
	pic_data,
	formData,
	check_details,
	moldAll,
	sceneData,
	textureData,
	queryParams,
	loading,
	allDataList,
	timePicker,
	configuartion,
	config,
	sceneSetName,
	add_details,
	imageFileList,
	fileList,
	isShowPicCheckbox,
} = toRefs(data);
</script>

<style scoped>
@import url("./../css/index.css");

.box_plane {
	margin-right: 10px;
}
::v-deep .el-dialog__body {
	margin-left: 50px;
}
.info {
	margin-top: 0 !important;
}
</style>
