<template>
	<div class="fullscreen-app-container">
		<div
			id="mapContainer"
			:style="isShow ? { width: '78%' } : { width: '60%' }"
		></div>
		<!-- 搜索框 -->
		<!-- <el-select
      v-model="tipInput"
      class="input-class-search"
      filterable
      remote
      size="medium"
      reserve-keyword
      clearable
      id="tipinput"
      placeholder="请输入监测点"
      :remote-method="remoteMethod"
      :loading="loading"
      @change="tipChange"
    >
      <el-option
        v-for="item in tips"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
        <span style="float: left">{{ item.name }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{
          item.district
        }}</span>
      </el-option>
    </el-select> -->
		<!-- <el-input
      size="medium"
      class="input-class-search"
      id="tipinput"
      placeholder="请输入监测点"
      v-model="searchValue"
      @keyup.enter="handleIconClick"
    >
      <template #suffix>
        <el-icon class="el-input__icon" @click="handleIconClick">
          <search />
        </el-icon>
      </template>
    </el-input> -->
		<div class="input-class-search">
			<el-autocomplete
				v-model="searchValue"
				:fetch-suggestions="querySearch"
				:trigger-on-focus="false"
				clearable
				size="medium"
				class="inline-input w-50"
				placeholder="请输入监测点"
				@select="handleSelect"
			>
				<template #default="{ item }">
					<div class="value">{{ item.monitorName }}</div>
				</template>
			</el-autocomplete>
		</div>
		<!-- 风险等级背景 -->
		<div class="risk-level-background">
			<img
				class="risk-level-ring"
				src="./../../assets/images/realtimestatus/risk-level-ring.svg"
			/>
		</div>
		<!-- 风险等级文字 -->
		<div class="risk-level-text">
			<span v-if="riskGrades?.monitorName">{{ riskGrades.monitorName }}</span>
			<span>风险等级</span>
			<!-- <span>{{ formatterRiskGrade(riskGrade) }}</span> -->
			<span>{{ riskGrades?.riskGrade }}</span>
		</div>
		<!-- 顶部设备、异常、在线 -->
		<div class="top-list-class" v-if="isShow">
			<ul>
				<li>
					<span>设备总数</span
					><span ref="counter1">{{ equipmentStatus.total }}</span>
				</li>
				<li>
					<span>异常</span
					><span ref="counter2">{{ equipmentStatus.abno }}</span>
				</li>
				<li>
					<span>在线</span
					><span ref="counter3">{{ equipmentStatus.onlin }}</span>
				</li>
			</ul>
		</div>
		<div class="right-stas-class" v-if="isShow">
			<div class="right-class-inspect-point">
				<handleLevelBar :chartData="chartDataRisk"></handleLevelBar>
			</div>
			<div class="right-class-inspect-point">
				<handleVerticalBar :chartData="chartDataForeign"></handleVerticalBar>
			</div>
			<div class="right-class-inspect-point">
				<handleRankBar
					:chartData="chartDataWeather"
					:barType="'weather'"
				></handleRankBar>
			</div>
		</div>
		<!-- 返回按钮 -->
		<div class="back-class" @click="goBack" v-if="!isShow">返回</div>
		<div v-if="!isShow" class="right-show-class">
			<div class="right-show-left">
				<div>
					<div class="base-info-title">监测点实时风险预测</div>
					<div class="realtimestatus-class" ref="counterRiskRate">
						{{ riskRate }}
					</div>
				</div>
				<div>
					<!-- 监测点基本信息 -->
					<inspectBaseInfo :monitorID="monitorID"></inspectBaseInfo>
				</div>
			</div>
			<div class="right-show-right">
				<div>
					<!-- 实时天气情况 -->
					<realTimeWeather :monitorID="monitorID"></realTimeWeather>
				</div>
				<div>
					<!-- 监测点设备实时状况 -->
					<equipmentCondition
						:equipmentStatus="equipmentStatus"
					></equipmentCondition>
				</div>
				<div>
					<!-- 情景风险综合分析 -->
					<scenarioRisk :monitorID="monitorID"></scenarioRisk>
				</div>
			</div>
		</div>
		<!-- 统计图 -->
		<div class="broken-line-class" v-if="!isShow">
			<brokenLine :monitorID="monitorID"></brokenLine>
		</div>
	</div>
</template>
<script setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import handleLevelBar from "@/components/echarts/handleLevelBar.vue";
import handleRankBar from "@/components/echarts/handleRankBar.vue";
import handleVerticalBar from "@/components/echarts/handleVerticalBar.vue";
import inspectBaseInfo from "./baseinfo/inspectBaseInfo.vue";
import realTimeWeather from "./baseinfo/realTimeWeather.vue";
import equipmentCondition from "./baseinfo/equipmentCondition.vue";
import scenarioRisk from "./baseinfo/scenarioRisk.vue";
import brokenLine from "./baseinfo/brokenLine.vue";
import {
	getFacilityCount,
	getMonitorRiskCount,
	getAllMonitorAndCoord,
	getRealTimeRisk,
	getRiskGrade,
} from "@/api/realtimestatus/realtimestatus.js";
import { getMonitorInfo } from "@/api/realtimestatus/realtimestatus.js";
const { proxy } = getCurrentInstance();
const { risk_grade } = proxy.useDict("risk_grade");
let chartDataRisk = ref({
	title: "Top7监测点风险统计",
	xData: [],
	yData: [],
});
let chartDataForeign = ref({
	title: "Top7监测点异物侵限统计",
	xData: [],
	yData: [],
});
let chartDataWeather = ref({
	title: "Top7监测点恶劣天气统计",
	xData: [],
	yData: [],
});
let monitorID = ref(null);
let isShow = ref(true);
let tipInput = ref("");
let loading = ref(false);
let tips = ref([]);
let equipmentStatus = ref({});
let markers = ref([]);
let riskRate = ref(undefined);
let riskGrades = ref({});
let markersList = ref([]);
let targetMap = ref(null);
let realtimeId = ref(null);
// 检索函数对象
let placeSearch = ref(null);
// 检索关键字
let searchValue = ref("");
let obj = ref({
	cluster: undefined,
});
// 获取地图上站点的信息
let clickSite = ref({
	siteInfo: null,
});
let clickedMarker = ref(null); // 保存当前点击的Marker
let clickIcon = ref(null);
// 获取监测点基本信息
watch(
	() => monitorID.value,
	(val) => {
		getMonitorInfoData(val);
	}
);
const getMonitorInfoData = async (val) => {
	let res = await getMonitorInfo({
		monitorId: val,
	});
	if (res.code == 200) {
    getFacilityCountData(res.data[0].id)
		console.log(res.data, "监测点基本信息123");
		// monitorInfoData.value = res.data[0];
	}
};
// 设置icon样式
const setIconStyle = (icon, marker) => {
	let contentIcon = new URL(
		`./../../assets/images/realtimestatus/${icon}`,
		import.meta.url
	).href;
	let content = `<div style="height: 30px; width: 30px;"><img style="width: 100%; height: 100%" src="${contentIcon}"></img></div>`;
	marker.setContent(content);
};
const getInitList = () => {
	AMapLoader.load({
		key: import.meta.env.VITE_AMSP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
		// "version": "2.0",     // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
		plugins: [
			"AMap.Pixel",
			"AMap.MarkerClusterer",
			"AMap.ToolBar",
			"AMap.PlaceSearch",
			"AMap.AutoComplete",
		], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
	})
		.then(async (AMap) => {
			// 获取检测点
			let res = await getAllMonitorAndCoord();
			if (res.code == 200) {
				markersList.value = res.data;
			}
			targetMap.value = new AMap.Map("mapContainer", {
				zoom: 7, //级别
				center: [116.397428, 39.90923], //中心点坐标
				resizeEnable: true,
				viewMode: "3D", //使用3D视图
			});
			// poi点
			// let markers = [];
			for (let i = 0; i < markersList.value.length; i++) {
				let marker = new AMap.Marker({
					position: [markersList.value[i].lon, markersList.value[i].lat], // 必传参数，统一格式
					map: targetMap.value,
				});
				let offset = new AMap.Pixel(-7, -7);
				marker.setOffset(offset);
				markers.value.push(marker);
				// console.log(markersList.value[i], "redgg");
				if (riskGrades.value?.monitorId == markersList.value[i].monitorID) {
					setIconStyle("inspect-point-active.svg", marker);
				} else {
					setIconStyle("inspect-point.svg", marker);
				}
				// 设置标记携带的数据，点击事件会使用
				marker.setExtData({
					id: markersList.value[i].monitorID,
					name: markersList.value[i].monitorName,
				});
				marker.on("click", markerClick);
				// marker.emit('click', { target: marker });
			}
			targetMap.value.setFitView();
		})
		.catch((e) => {
			console.log(e);
		});
};
// 标记点点击
const markerClick = async (ev) => {
	// console.log(markers.value, ev.target, "ret");
	targetMap.value.remove(
		markers.value.filter((i) => i._amap_id !== ev.target._amap_id)
	);
	let a = markers.value.filter((i) => i._amap_id === ev.target._amap_id);
	console.log(a, "p");
	// 当前标记居中, 第一个参数为缩放级别

	targetMap.value.setZoomAndCenter(16, ev.target.getPosition());
	// 获取标记携带的数据
	const extData = ev.target.getExtData();
	monitorID.value = extData.id;
	await getFacilityCountData(extData.id);
	if (clickedMarker.value) {
		// 恢复上次点击的样式
		setIconStyle("inspect-point.svg", clickedMarker.value);
	}
	setIconStyle("inspect-point-active.svg", ev.target);
	getRealTimeRiskData(extData.id);
	clickSite.value.siteInfo = extData; // 点击获取当前站点的信息，触发监听事件
	// console.log(clickSite.value.siteInfo, "clickSite.value.siteInfo");
	clickedMarker.value = ev.target;
	isShow.value = false;
};
// 获取实时风险等级
const getRiskGradeData = async () => {
	let res = await getRiskGrade();
	if (res.code == 200) {
		// console.log(res.data, "riskGrade");
		// riskGrade.value = res.data.risk;
		riskGrades.value = res.data;
	}
};
// 获取设备数量、状态
const getFacilityCountData = async (val) => {
	let res = await getFacilityCount({
		monitorId: val? val : null,
	});
	if (res.code == 200) {
		// console.log(res, "res状态", val);
		equipmentStatus.value = res.data[0];
		nextTick(() => {
			proxy.animateValue(
				proxy.$refs.counter1,
				0,
				equipmentStatus.value.total,
				2000
			);
			proxy.animateValue(
				proxy.$refs.counter2,
				0,
				equipmentStatus.value.abno,
				2000
			);
			proxy.animateValue(
				proxy.$refs.counter3,
				0,
				equipmentStatus.value.onlin,
				2000
			);
		});
	}
};
// 获取检测点统计
const getMonitorRiskCountData = async () => {
	let res = await getMonitorRiskCount({
		riskType: "1,2,4",
	});
	if (res.code == 200) {
		// 1 异物风险
		if (res.data[1] && res.data[1].length) {
			let xData = [];
			let yData = [];
			res.data[1].forEach((item) => {
				xData.push(item.monitoring_point_name);
				yData.push(item.count);
			});
			chartDataForeign.value.xData = xData;
			chartDataForeign.value.yData = yData;
		} else {
			chartDataForeign.value.xData = [];
			chartDataForeign.value.yData = [];
		}
		// 2 恶劣天气
		if (res.data[2] && res.data[2].length) {
			let xData = [];
			let yData = [];
			res.data[2].forEach((item) => {
				xData.push(item.monitoring_point_name);
				yData.push(item.count);
			});
			chartDataWeather.value.xData = xData;
			chartDataWeather.value.yData = yData;
		} else {
			chartDataWeather.value.xData = [];
			chartDataWeather.value.yData = [];
		}
		// 4 综合风险
		if (res.data[4] && res.data[4].length) {
			let xData = [];
			let yData = [];
			res.data[4].forEach((item) => {
				xData.push(item.monitoring_point_name);
				yData.push(item.count);
			});
			chartDataRisk.value.xData = xData;
			chartDataRisk.value.yData = yData;
		} else {
			chartDataRisk.value.xData = [];
			chartDataRisk.value.yData = [];
		}
	}
};
// 监测点实施风险预测
const getRealTimeRiskData = async (val) => {
	let res = await getRealTimeRisk({
		monitorId: val,
	});
	if (res.code == 200) {
		riskRate.value = res.data[0] ? res.data[0].risk * 100 : 0;
		proxy.animateValue(proxy.$refs.counterRiskRate, 0, riskRate.value, 2000);
	}
};

// 搜索
const handleIconClick = (ev) => {
	console.log(searchValue.value, ev);
};
const querySearch = (queryString, cb) => {
	const results = queryString
		? markersList.value.filter(createFilter(queryString))
		: markersList.value;
	// call callback function to return suggestions
	// console.log(results, "results");
	cb(results);
};
const createFilter = (queryString) => {
	return (restaurant) => {
		return (
			restaurant.monitorName
				.toLowerCase()
				.indexOf(queryString.toLowerCase()) === 0
		);
	};
};
const handleSelect = (item) => {
	// console.log(item)
	searchValue.value = item.monitorName;
	let position = [item.lon, item.lat];
	targetMap.value.setCenter(position);
};

// 模糊下拉框搜索
// const tipChange = (value) => {
//   for (const tip of tips.value) {
//     if (value === tip.id) {
//       targetMap.value.setZoom(13)
//       targetMap.value.setCenter(tip.location)
//       break
//     }
//   }
// }
// const remoteMethod = (query) => {
//   console.log(query, 'query')
//   if (query !== '') {
//     loading.value = true;
//     AMap.plugin('AMap.Autocomplete', function () {
//       // 实例化Autocomplete
//       const autoOptions = {
//         input: 'tipinput'
//       }
//       const autoComplete = new AMap.Autocomplete(autoOptions);
//       autoComplete.search(query, function (status, result) {
//         console.log(result, status, 'status', autoComplete)
//         // 搜索成功时，result即是对应的匹配数据
//         tips.value = result.tips || []
//         loading.value = false;
//       })
//     })
//   } else {
//     tips.value = [];
//   }
// }
// 格式化风险等级
const formatterRiskGrade = (val) => {
	let result = risk_grade.value.find((item) => item.value == val);
	if (result) {
		return result.label;
	} else {
		return "";
	}
};
// 返回
const goBack = () => {
	isShow.value = true;
	clickedMarker.value = null;
	getRiskGradeData();
	getInitList();
	getFacilityCountData();
	getMonitorRiskCountData();
};
onMounted(() => {
	getRiskGradeData();
	getInitList();
	getFacilityCountData();
	getMonitorRiskCountData();
});

import WebSocketClass from "@/utils/webSocket.js";
import { useStore } from "vuex";
import { watch } from "@vue/runtime-core";
const store = useStore();
const socket = ref(null);
onMounted(() => {
	socket.value = new WebSocketClass(
		websocketCallReceive,
		store.state.user.name
	);
	socket.value.connect();
});
const websocketCallReceive = (data) => {
	// console.log(data, "返回的数据");
	if (data == "success") {
		getInitList();
		getFacilityCountData();
		getMonitorRiskCountData();
		getRiskGradeData();
	}
};
nextTick(() => {
	store.dispatch("app/setShowMenu", false);
});
onUnmounted(() => {
	store.dispatch("app/setShowMenu", true);
});
</script>
<style scoped>
@import "css/index.css";
</style>
