<template>
	<div class="fz-container">
		<!-- echarts -->
		<!-- <div class="elcard_display">
			<div class="box_plane">
				<echartsPictorialBar
					:echartData="WeatherDisaster"
				></echartsPictorialBar>
			</div>
			<div class="box_plane">
				<echart-bar :echartsData="deviceData"></echart-bar>
			</div>
		</div> -->
		<div class="elcard_display">
			<echartsPictorialBar
				class="box_plane"
				:echartData="deviceData"
			></echartsPictorialBar>
			<line-chart class="box_plane" :echartData="foreignLineData"></line-chart>
		</div>
		<!-- 搜索栏 -->
		<el-form
			:model="queryParams"
			label-width="80px"
			:inline="true"
			size="normal"
		>
			<el-form-item label="">
				<el-select
					v-model="moldAll"
					@change="SelectChange"
					placeholder="请选择搜索类型"
				>
					<el-option label="按设备类型" value="1"></el-option>
					<el-option label="按添加时间" value="2"></el-option>
					<!-- <el-option label="按设备编号" value="3"></el-option> -->
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
					clearable
					v-model="queryParams.facilityType"
					placeholder="请选择设备类型"
				>
					<el-option
						v-for="item in Inspectionpoint_type"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button
					style="margin-left: 10px"
					@click="getAllData"
					type="primary"
					plain
					round
					class="common_style"
					>确定</el-button
				></el-form-item
			>
			<el-form-item style="float: right">
				<el-button
					type="primary"
					plain
					round
					class="common_style"
					icon="Delete"
					@click="deleteAll"
					v-hasPermi="['system:user:edit']"
					>删除</el-button
				>
				<el-button
					type="primary"
					plain
					round
					class="common_style"
					icon="Plus"
					v-hasPermi="['system:user:edit']"
					@click="dialog_form = true"
					>新增</el-button
				>
			</el-form-item>
		</el-form>

		<!-- 表格 -->
		<el-table
			id="tableele"
			v-loading="loading"
			:data="tableData"
			@selection-change="selectionChange"
		>
			<el-table-column type="selection" width="55" />
			<el-table-column type="index" width="55" align="center" label="序号" />
			<!-- <el-table-column label="设备ID" align="center" prop="id" /> -->
			<el-table-column label="设备名称" align="center" prop="facilityName" />
			<el-table-column
				label="所在路线"
				align="center"
				prop="route"
				:show-overflow-tooltip="true"
			>
				<template #default="{ row }">
					{{ formatter(lineIdSelect, row.lineId, "所在路线") }}
				</template>
			</el-table-column>
			<el-table-column
				label="监测点等级"
				align="center"
				prop="monitor.grade"
				:show-overflow-tooltip="true"
			>
				<template #default="{ row }">{{
					formatter(monitoring_point_grade, row.monitoringPointGrade)
				}}</template>
			</el-table-column>
			<el-table-column
				label="位置"
				align="center"
				prop="id"
				:show-overflow-tooltip="true"
			>
				<template #default="{ row }">{{
					"E " + row.lat + " N " + row.lon
				}}</template>
			</el-table-column>
			<el-table-column
				label="设备类型"
				align="center"
				prop="facilityType"
				:show-overflow-tooltip="true"
			>
				<template #default="{ row }">
					{{ formatter(facility_type, row.facilityType) }}
				</template>
			</el-table-column>
			<el-table-column label="监测内容" align="center" prop="id">
				<template #default="scope">
					{{
						formatter(monitoring_scene, scope.row.monitoringScene, "检测内容")
					}}
				</template>
			</el-table-column>
			<el-table-column label="传感器型号" align="center" prop="facilityModel">
				<template #default="scope">
					<span>{{ scope.row.facilityModel }}</span>
				</template>
			</el-table-column>
			<el-table-column label="添加时间" align="center" prop="createTime">
				<template #default="scope">
					<span>{{ scope.row.addTime }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
				class-name="small-padding fixed-width"
			>
				<template #default="scope">
					<el-button
						size="mini"
						type="text"
						@click="opcHandle(scope.row, '详情')"
						>查看</el-button
					>
					<el-button
						size="mini"
						type="text"
						@click="opcHandle(scope.row, '编辑')"
						>编辑</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			v-show="total > 0"
			:total="total"
			v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize"
			@pagination="getAllData"
		/>
		<!-- 新增弹框 -->
		<el-dialog
			@close="cancel"
			v-model="dialog_form"
			:title="facility.id ? '编辑设备' : '新增设备'"
		>
			<el-row :gutter="24" justify="center">
				<el-col :span="12">
					<el-form
						:model="facility"
						ref="facilityRef"
						:rules="rules"
						label-position="left"
						label-width="30%"
						:inline="false"
						size="normal"
						hide-required-asterisk="false"
						class="ele_form"
					>
						<el-form-item label="设备ID" v-if="facility.id">
							<el-input v-model="facility.id" disabled></el-input>
						</el-form-item>
						<el-form-item label="设备名称">
							<el-input v-model="facility.facilityName"></el-input>
						</el-form-item>
						<el-form-item label="所在线路" prop="lineId">
							<el-select v-model="facility.lineId" @change="lineChange">
								<el-option
									v-for="item in lineIdSelect"
									:key="item.id"
									:label="item.lineName"
									:value="item.id"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="所在监测点" prop="monitorId">
							<el-select v-model="facility.monitorId" @change="modelIdChange">
								<el-option
									v-for="item in monitorList"
									:key="item.id"
									:label="item.monitoringPointName"
									:value="item.id"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="监测点等级">
							<el-select v-model="fake.class" :disabled="fakeDisabled">
								<el-option
									v-for="item in monitoring_point_grade"
									:key="item.value"
									:label="item.label"
									:value="item.value"
									:disabled="title === '编辑设备'"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="位置">
							<span>{{ fake.lonlat }}</span>
						</el-form-item>
						<el-form-item label="设备类型" prop="facilityType">
							<el-select v-model="facility.facilityType">
								<el-option
									v-for="item in Inspectionpoint_type"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="检测内容" prop="monitoringScene">
							<el-select
								v-model="facility.monitoringScene"
								placeholder="请输入检测内容"
							>
								<el-option
									v-for="item in sceneList"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="传感器型号" prop="facilityModel">
							<el-input v-model="facility.facilityModel"></el-input>
						</el-form-item>
						<el-form-item label="添加时间">
							<el-date-picker
								v-model="facility.addTime"
								type="datetime"
								clearable
								placeholder="选择日期时间"
								style="width: 100%"
							>
							</el-date-picker>
						</el-form-item>

						<el-form-item label="图片" :label-width="labelWidth" ref="fileRef">
							<el-upload
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
							<div style="color: #ff3535">*请上传png/jpg格式的图片！</div>
						</el-form-item>
						<el-form-item style="text-align: center">
							<el-button type="primary" @click="onSbumit">确定</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-dialog>

		<!-- 查看 -->
		<el-dialog v-model="check_details" title="查看" @close="cancel">
			<el-row :gutter="24" justify="center">
				<el-col :span="12">
					<el-form
						:model="formData"
						ref="formDataRef"
						label-position="left"
						label-width="30%"
						:inline="false"
						size="normal"
					>
						<el-form-item label="设备ID">
							<span class="detail_style">{{ formData.id }}</span>
						</el-form-item>
						<el-form-item label="设备名称">
							<span class="detail_style">{{ formData.facilityName }}</span>
						</el-form-item>
						<el-form-item label="所在线路">
							<span class="detail_style">{{
								formatter(lineIdSelect, formData.lineId, "所在路线")
							}}</span>
						</el-form-item>
						<el-form-item label="所在监测点">
							<span class="detail_style">{{
								formatter(monitorList, formData.monitorId, "所在监测点")
							}}</span>
						</el-form-item>
						<el-form-item label="监测点等级">
							<span class="detail_style"
								>{{
									formatter(
										monitoring_point_grade,
										formData.monitoringPointGrade
									)
								}}
							</span>
						</el-form-item>
						<el-form-item label="经度">
							<span class="detail_style">{{ "E " + formData.lat }}</span>
						</el-form-item>
						<el-form-item label="纬度">
							<span class="detail_style">{{ "N " + formData.lon }}</span>
						</el-form-item>
						<el-form-item label="设备类型">
							<span class="detail_style">{{
								formatter(facility_type, formData.facilityType)
							}}</span>
						</el-form-item>
						<el-form-item label="检测内容">
							<span class="detail_style">{{
								formatter(monitoring_scene, formData.monitoringScene)
							}}</span>
						</el-form-item>
						<el-form-item label="传感器型号">
							<span class="detail_style">{{ formData.facilityModel }}</span>
						</el-form-item>
						<el-form-item label="添加时间">
							<span class="detail_style">{{ formData.addTime }}</span>
						</el-form-item>
						<el-form-item label="添加时间">
							<el-image
								style="width: 100px; height: 100px"
								:src="URL"
								:fit="fit"
								:preview-src-list="[URL]"
							></el-image>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-dialog>
	</div>
</template>
<script setup>
// import { makeline } from "../js/index";
import LineChart from "./LineChart.vue";
import echartsPictorialBar from "@/components/EchartsPictorialBar/index.vue";
import {
	getTable,
	addfacility,
	editfacility,
	deletefacility,
	getAllMonitor,
	findFacilityModelCount,
	WeatherDisasterCount,
	sceneList,
	DataFrom,
	addinfodata,
	uploadFile,
	getfacilityById,
	getForMatTrendall,
} from "@/api/simulation/compManage/detWeather.js";
import { onBeforeMount, onMounted, watch } from "@vue/runtime-core";
const { proxy } = getCurrentInstance();
const {
	monitoring_route,
	monitoring_scene,
	monitoring_point_grade,
	facility_type,
	Inspectionpoint_type,
	weather,
	RainStatus,
	WindStatus,
	FogStatus,
	SnowStatus,
} = proxy.useDict(
	"monitoring_scene",
	"monitoring_route",
	"facility_type",
	"monitoring_point_grade",
	"Inspectionpoint_type",
	"weather",
	"SnowStatus",
	"FogStatus",
	"RainStatus",
	"WindStatus"
);
let URL = ref("");
let fits = ref(["fill", "contain", "cover", "none", "scale-down"]);

//新增编辑的弹框
const dialog_form = ref(false);
const fileList = ref([]);
const data = reactive({
	foreignLineData: {
		forcast: [],
		history: [],
		forcasttime: [],
		historycreatetime: [],
	},
	deviceData: {
		title: "摄像头型号数量",
		seriesData: [], //设备数量
		color: "#5bc0be",
		xAxisData: [],
		dataZoom: true,
	},
	fakeDisabled: true, //监测点等级禁用选项
	//存地址
	fake: {
		class: "",
		lonlat: "",
	},
	//选择路线后的检测点
	monitorList: [],
	//所有检测点
	monitoringlist: [],
	//起始时间
	timePicker: [],
	//x线路和监测点
	lineIdSelect: [],
	tableData: [],
	queryParams: {
		beginTime: "",
		endTime: "",
		pageNum: 1,
		pageSize: 10,
		monitoringPointName: "", //搜索类型
		facilityType: "", //设备类型
		facilityModel: "",
		monitoringScene:'2'
	},
	moldAll: "1",
	sesetionData: [], //选中的数据
	//全部检测点
	// allMonitor: [],
	// allpath: [], //所有路线
	rules: {
		addTime: [
			{ required: true, message: "添加时间不能为空", trigger: "change" },
		],
		route: [
			{
				required: true,
				message: "所在线路不能为空",
				trigger: "blur",
			},
		],
		monitorId: [
			{ required: true, message: "所在监测点不能为空", trigger: "blur" },
		],
		facilityType: [
			{ required: true, message: "设备类型不能为空", trigger: "blur" },
		],
		monitoringScene: [
			{ required: true, message: "检测内容不能为空", trigger: "blur" },
		],
		facilityModel: [
			{ required: true, message: "传感器型号不能为空", trigger: "blur" },
		],
		lineId: [
			{ required: true, message: "所在路线不能为空", trigger: "change" },
		],
	},
});
watch(
	() => data.moldAll,
	() => {
		data.queryParams.beginTime = "";
		data.queryParams.endTime = "";
		data.queryParams.facilityType = "";
	}
);
//表单的ref
const facilityRef = ref(null);
//查看的表单数据
const formData = ref(null);
//查看详情的开关
const check_details = ref(false);
const loading = ref(false);
//获取新增前的信息
addinfodata().then((res) => {
	data.lineIdSelect = makeline(res);
	data.monitoringlist = res.data;
});

//选择线路好
const lineChange = (e) => {
	let result = data.monitoringlist.filter((i) => i.id == e);
	data.monitorList = result[0].monitorPoints;
};
//当检测点修改
const modelIdChange = (e, item) => {
	let resultes = data.monitorList.find((i) => i.id == e);
	if (resultes) {
		data.fakeDisabled = false;
		data.fake.class = resultes.monitoringPointGrade;
		data.fake.lonlat = "经度 " + resultes.lon + "  纬度 " + resultes.lat;
	} else {
		data.fakeDisabled = true;
	}
};

const total = ref(0);
//新增和编辑的表单
const facility = ref(new DataFrom());
//日期选择器
const getDate = (e) => {
	data.queryParams.beginTime = e[0];
	data.queryParams.endTime = e[1];
};

//查数据字典展示给用户
function formattersence(data, key) {
	let result = data.find((i) => i.monitorID == key);
	return result ? result.monitorName : "空";
}
let monitorPointsList = null;
const formatter = (data, key, line) => {
	if (line === "所在路线" && data) {
		let res = data.find((i) => i.id == key);
		monitorPointsList = res ? res.monitorPoints : null;
		return res ? res.lineName : "空";
	} else if (line === "所在监测点") {
		let res = monitorPointsList.find((i) => i.id == key);
		return res ? res.monitoringPointName : "空";
	} else {
		let res = data.find((i) => i.value == key);
		return res ? res.label : "空";
	}
};

function SelectChange() {
	data.queryParams.addTime = "";
	data.timePicker = [];
	data.queryParams.facilityType = "";
	data.queryParams.facilityModel = "";
}
//跳转编辑
function opcHandle(row, caption) {
	getfacilityById(row.id).then((res) => {
		if (caption === "编辑") {
			dialog_form.value = true;
			facility.value = {
				...row,
			};
		} else {
			check_details.value = true;
			formData.value = {
				...row,
				// monitoringPointGrade: row.monitor.monitoringPointGrade,
			};
		}
		facility.value = res.data;
		data.fake.class = res.data.monitoringPointGrade;
		data.fake.lonlat = "经度 " + res.data.lon + "  纬度 " + res.data.lat;

		if (res.data.file) {
			let bytes = window.atob(res.data.file.fileBytes);
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
					name: res.data.file.fileName,
				},
			];
		}
	});
}
//查询接口
function getAllData() {
	loading.value = true;
	getTable({
		...data.queryParams,
	})
		.then((res) => {
			data.tableData = res.rows;
			total.value = res.total;
			loading.value = false;
		})
		.catch(() => {
			loading.value = false;
		});
}
//判断当前状态
function getStatus(stats) {
	if (stats == "1") {
		return "离线";
	} else if (stats == "0") {
		return "异常";
	} else {
		return "在线";
	}
}
//新增/编辑确定
function onSbumit() {
	facilityRef.value.validate().then((res) => {
		if (res) {
			if (facility.value.id) {
				editfacility(facility.value).then(() => {
					getAllData();
					proxy.$modal.msgSuccess("编辑成功");
					cancel();
				});
			} else {
				delete facility.value.monitoringPointGrade;
				delete facility.value.route;
				if (
					facility.value.sysFileUuid === "" ||
					facility.value.sysFileUuid === undefined
				)
					return proxy.$modal.msgError("请先上传文件!");
				addfacility(facility.value).then(() => {
					getAllData();
					proxy.$modal.msgSuccess("新增成功");
					cancel();
				});
			}
		}
	});
}
/** 删除按钮操作 */
function deleteAll() {
	if (data.sesetionData.length === 0) return proxy.$modal.msgError("请选择检测设备！");
	proxy.$modal.confirm("是否确认此条数据项？").then(() => {
		let parmas = "";
		data.sesetionData.forEach((i, j) => {
			j == 0 ? (parmas += i.id) : (parmas += "," + i.id);
		});
		deletefacility(parmas).then(() => {
			proxy.$modal.msgSuccess("删除成功");
		getAllData();

		});
	});
}
//elment自带方法保存选中的数据
function selectionChange(selection) {
	data.sesetionData = selection;
}

// 天气表
// WeatherDisasterCount().then((res) => {
// 	// data.WeatherDisaster.xAxisData = [23, 32, 324];
// 	// data.WeatherDisaster.seriesData = [234, 2534, 456];
// 	// console.log(res, "取数据");
// 	//问题不在于查
// 	let arr = formatterFn(res);
// 	data.WeatherDisaster.xAxisData = arr.flat().map((i) => i.name);
// 	data.WeatherDisaster.seriesData = arr.flat().map((i) => i.count);
// });

function formatterFn(res) {
	let arr = [];
	for (let key in res.data) {
		const keyname = res.data[key];
		if (keyname.length == 0) {
			continue;
		} else if (key == "fogStatus") {
			arr.push(formatterList(FogStatus.value, keyname, key));
		} else if (key == "rainStatus") {
			arr.push(formatterList(RainStatus.value, keyname, key));
		} else if (key == "windStatus") {
			arr.push(formatterList(WindStatus.value, keyname, key));
		} else if (key == "snowStatus") {
			arr.push(formatterList(SnowStatus.value, keyname, key));
		}
	}
	return arr;
}
//格式化数据筛选出风雾雨雪的分类
function formatterList(data, arr, keyname) {
	return arr.map((i) => {
		const findData = data.find((id) => id.value == i[keyname]);
		//为了页面好看后期改成空或者天气
		return {
			name: findData ? findData.label : "无",
			count: i.count,
		};
	});
}
// 取消提交
const cancel = () => {
	facility.value = new DataFrom();
	data.fake = {};
	fileList.value = [];
	dialog_form.value = false;
	check_details.value = false;
};
getAllData();
//查询线路
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
				// add_loading.value = true;
				let res = await uploadFile(formData);
				facility.value.sysFileUuid = res.data.fileUuid;
				proxy.$refs["fileRef"].clearValidate();
				// add_loading.value = false;
			}
		});
	}
};
const handleRemove = (file, filelist) => {
	facility.value.sysFileUuid = "";
	fileList.value = filelist;
};
// 取半年异物侵限走势统计
getForMatTrendall().then((res) => {
	data.foreignLineData.forcast = res.data.forcast.map((i) => i.formatCount);
	data.foreignLineData.history = res.data.history.map((i) => i.formatCount);
	data.foreignLineData.historycreatetime = res.data.history.map(
		(i) => i.staTime
	);
});
// 摄像头型号数量
findFacilityModelCount().then((res) => {
	data.deviceData.xAxisData = res.data.map((i) => i.facilityModel);
	data.deviceData.seriesData = res.data.map((i) => i.facilityCount);
});
const {
	queryParams,
	monitorList,
	fake,
	timePicker,
	lineIdSelect,
	moldAll,
	allMonitor,
	rules,
	monitoringlist,
	tableData,
	fakeDisabled,
	deviceData,
	foreignLineData,
} = toRefs(data);
</script>
<style lang="scss" scoped>
:deep(.formdialog .el-select) {
	width: 100%;
}
.app-container {
	min-width: 1000px;
}
.detail_style {
	color: white;
}
.mr-1 {
	margin-right: 10px;
}
.item {
	padding: 18px 0;
}
// echarts 表格
.box-card {
	width: 480px;
}
.elcard_display {
	display: flex;
	width: 100%;
	justify-content: space-between;
	margin-bottom: 20px;
}
:deep(.box-card) {
	flex: 0.5;
	margin-right: 10px;
}

.search_Select {
	margin: 2% 0;
}
:deep(.el-card__body) {
	width: 100%;
	height: 100%;
}
.box_plane {
	display: inline-block;
	width: 48%;
	box-shadow: 3px 3px 5px #bbb, -3px -3px 7px #bbb;
	height: 200px;
}
:deep(.el-button--medium.is-round) {
	// float: right;
	color: white;
	background-color: #3d5a5d;
	border: #3d5a5d;
}
:deep(.el-button--medium.is-round):hover {
	background-color: #57d0d8;
}
:deep(.ele_form .el-select) {
	width: 100%;
}
.app-container {
	min-width: 1000px;
	padding: 20px;
}
:deep(.el-upload-dragger) {
	// width: 100%;
	box-shadow: 3px 3px 3px #bbb, -3px -3px 7px #bbb;
	border: 0;
}
span {
	color: white;
}
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
