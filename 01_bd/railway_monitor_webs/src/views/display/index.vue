<template>
	<div class="fullscreen-app-container" style="padding: 10px">
		<div class="display-left">
			<div class="display-left-one">
				<div class="display-title">
					<span class="display-title-border">实时综合风险走势</span>
				</div>
				<comprehensiveRisk ref="risk"></comprehensiveRisk>
			</div>
			<div class="display-left-two">
				<div class="display-title">
					<span class="display-title-border"> 今日异物侵限高发监测点统计 </span>
				</div>
				<foreignBody ref="foregin"></foreignBody>
			</div>
			<div class="display-left-three">
				<div class="display-title">
					<span class="display-title-border"> 今日恶劣天气统计 </span>
				</div>
				<badWeather ref="badweather"></badWeather>
			</div>
		</div>
		<div class="display-center">
			<!-- 综合风险动态 -->
			<div class="compose-risk-class">
				<div class="compose-risk-class-text">
					<div>综合风险</div>
					<div ref="riskCount"></div>
				</div>
				<img
					src="./../../assets/images/display/risk-one.svg"
					class="risk-one-img"
					alt=""
				/>
				<img
					src="./../../assets/images/display/risk-two.svg"
					class="risk-two-img"
					alt=""
				/>
			</div>
			<!-- 设备数、报警监测点 -->
			<div class="equipment-warning-class">
				<div>
					<span>设备总数</span>
					<span ref="counter1"></span>
				</div>
				<div>
					<span>报警监测点</span>
					<span ref="counter2"></span>
				</div>
			</div>
			<div>
				<echartsMap
					ref="chinamap"
					@goBack="goBack"
					@handleIsShowLenged="handleIsShowLenged"
					:isMapOrSiteMap="isMapOrSiteMap"
					:checkedLines="checkedLines"
					:currentMoniter="currentMoniter"
				></echartsMap>
			</div>
			<el-button
				class="back-class"
				size="mini"
				type="text"
				icon="Back"
				@click="goBack"
				v-show="isShowLenged"
			></el-button>
			<!-- 地图切换容器 -->
			<div class="map-switch-class">
				<img
					src="./../../assets/images/display/map-switch.svg"
					@click="isMapChange = !isMapChange"
					alt=""
				/>
				<transition name="el-zoom-in-center">
					<div class="map-sitemap" v-show="isMapChange">
						<div @click="handleChangeMap(true)">
							<img
								src="./../../assets/images/display/u140.png"
								alt=""
								srcset=""
							/>
							<span>电子地图</span>
						</div>
						<div @click="handleChangeMap(false)">
							<img
								src="./../../assets/images/display/u139.png"
								alt=""
								srcset=""
							/>
							<span>影像图</span>
						</div>
					</div>
				</transition>
			</div>
			<!-- 筛选容器 -->
			<div class="map-filter-class">
				<img
					src="./../../assets/images/display/filter-class.svg"
					@click="isFilterMapChange = !isFilterMapChange"
					alt=""
				/>

				<transition name="el-zoom-in-center">
					<div class="filter-sitemap" v-show="isFilterMapChange">
						<div class="filter-sitemap-title">路线筛选</div>
						<div>
							<el-checkbox
								v-model="checkAll"
								:indeterminate="isIndeterminate"
								@change="handleCheckAllChange"
								>全部</el-checkbox
							>
							<el-checkbox-group
								v-model="checkedLines"
								class="check-class-vertical"
								@change="handleCheckedCitiesChange"
							>
								<el-checkbox
									v-for="item in allLinesData"
									:key="item.id"
									:label="item.id"
									>{{ item.line_name }}</el-checkbox
								>
							</el-checkbox-group>
						</div>
					</div>
				</transition>
			</div>
			<!-- 图例 -->
			<transition name="el-zoom-in-left">
				<div
					class="legend-class"
					v-show="isShowLenged"
					:style="isCollesBanner ? { bottom: '190px' } : { bottom: '60px' }"
				>
					<div>
						<img
							class="legend-class-img"
							src="./../../assets/images/display/online.png"
							alt=""
						/>
						<span>在线</span>
					</div>
					<div>
						<img
							class="legend-class-img"
							src="./../../assets/images/display/abnormal.svg"
							alt=""
						/>
						<span>异常</span>
					</div>
					<div>
						<img
							class="legend-class-img"
							src="./../../assets/images/display/warning.png"
							alt=""
						/>
						<span>预警</span>
					</div>
					<div>
						<img
							class="legend-class-img"
							src="./../../assets/images/display/grade-point.svg"
							alt=""
						/>
						<span>关键监测点</span>
					</div>
				</div>
			</transition>
			<!-- banner图 -->
			<div
				class="banner-class"
				:style="isCollesBanner ? { height: '180px' } : { height: '50px' }"
			>
				<banner
					@handleCollseIcon="handleCollseIcon"
					@handleCurrentMoniter="handleCurrentMoniter"
				></banner>
			</div>
		</div>
		<div class="display-right">
			<div class="display-right-one">
				<echartsBanner ref="bannerCopy"></echartsBanner>
			</div>
			<div class="display-right-two">
				<div class="display-title">
					<span class="display-title-border"> 监测点综合风险排名变化 </span>
				</div>
				<comprehensiveRate
					ref="comprehensive"
					style="width: 100%; height: 100%"
				></comprehensiveRate>
			</div>
			<div class="display-right-three my-self-collapse-style">
				<baseInfo ref="baseinfo"></baseInfo>
			</div>
		</div>
	</div>
</template>
<script setup>
import comprehensiveRisk from "./handle/comprehensiveRisk.vue";
import foreignBody from "./handle/foreignBody.vue";
import badWeather from "./handle/badWeather.vue";
import echartsBanner from "./handle/echartsBanner.vue";
import comprehensiveRate from "./handle/comprehensiveRate.vue";
import baseInfo from "./handle/baseInfo.vue";
import banner from "./handle/banner.vue";
import echartsMap from "./handle/echartsMap.vue";
import {
	getSynRisk,
	getFacAndWarnMonitor,
	getAllLines,
} from "@/api/display/display.js";
let { proxy } = getCurrentInstance();
let isChainDivMap = ref(false);
let isMapOrSiteMap = ref(true);
let isMapChange = ref(false);
let isFilterMapChange = ref(false);
let isShowLenged = ref(false);
let isCollesBanner = ref(true);
const checkAll = ref(false);
const isIndeterminate = ref(false);
const checkedLines = ref([]);
const allLinesData = ref([]);
let currentMoniter = ref(null);
const handleCheckAllChange = (val) => {
	checkedLines.value = val ? allLinesData.value.map((item) => item.id) : [];
	isIndeterminate.value = false;
};
const handleCheckedCitiesChange = (value) => {
	const checkedCount = value.length;
	checkAll.value = checkedCount === allLinesData.value.length;
	isIndeterminate.value =
		checkedCount > 0 && checkedCount < allLinesData.value.length;
};
// 是否收起banner
const handleCollseIcon = (val) => {
	isCollesBanner.value = val;
};
const handleCurrentMoniter = (val) => {
	currentMoniter.value = val;
};
// 地图切换
const handleChangeMap = (val) => {
	isMapOrSiteMap.value = val;
};
// 综合风险
const getSynRiskData = async () => {
	let res = await getSynRisk();
	if (res.code == 200) {
		nextTick(() => {
			proxy.animateValue(proxy.$refs.riskCount, 0, res.data.risk * 100, 2500);
		});
	}
};
// 获取所有路线
const getAllLinesData = async () => {
	let res = await getAllLines();
	if (res.code == 200) {
		allLinesData.value = res.data;
	}
};
// 设备总数和报警监测点
const getFacAndWarnMonitorData = async () => {
	let res = await getFacAndWarnMonitor();
	if (res.code == 200) {
		nextTick(() => {
			proxy.animateValue(proxy.$refs.counter1, 0, res.data.total, 2500);
			proxy.animateValue(proxy.$refs.counter2, 0, res.data.monitor, 2500);
		});
	}
};
// 是否展示图例
const handleIsShowLenged = (val) => {
	isShowLenged.value = val;
};

onMounted(() => {
	store.dispatch("app/setShowMenu", false);

	// console.log(route.path, "path");
	getSynRiskData();
	getAllLinesData();
	getFacAndWarnMonitorData();
});

//轮询功能
import WebSocketClass from "@/utils/webSocket.js";
const socket = ref(null);
import { useStore } from "vuex";
import { nextTick } from "@vue/runtime-core";
import { useRoute } from "vue-router";
nextTick(() => {});
const store = useStore();
onMounted(() => {
	socket.value = new WebSocketClass(
		websocketCallReceive,
		store.state.user.name
	);
	socket.value.connect();
});
const risk = ref(null); //实时综合风险走势
const foregin = ref(null); //今日异物侵限高发监测点统计
const badweather = ref(null); //今日恶劣天气统计
const chinamap = ref(null); //地图
const bannerCopy = ref(null); //banner图
const comprehensive = ref(null); //监测点综合风险排名变化
const baseinfo = ref(null);
const bannercopy1 = ref(null); //banner图
const websocketCallReceive = (data) => {
	// console.log(data, "返回的数据");
	if (data == "success") {
		getSynRiskData();
		getFacAndWarnMonitorData();
		risk.value.getInitList();
		foregin.value.getInitList();
		badweather.value.getInitList();
		chinamap.value.getInitList([]);
		bannerCopy.value.getInitList();
		comprehensive.value.getInitList();
		baseinfo.value.getInitList();
		bannercopy1.value.initmothod();
	}
};
onUnmounted(() => {
	socket.value.closeMyself();
	store.dispatch("app/setShowMenu", true);
});
const route = useRoute();
const goBack = () => {
	// console.log(11213);
	store.dispatch("app/setShowMenu", false);
	chinamap.value.expcloseInfoWindow();
	chinamap.value.getInitList([]);
};
// watch(
//   () => route.path,
//   (val) => {
//     console.log(val, "route");
//     if (val == "/index" || val == "/") {
//       store.dispatch("app/setShowMenu", false);
//       nextTick(() => {
//         chinamap.value.getInitList([]);
//       });
//     }
//   },
//   {
//     immediate: true,
//   }
// );
// watch(
//   () => route.query,
//   (val) => {
//     if (val.login) {
//       // console.log();
//       goBack();
//     }
//   }
// );
// 返回
</script>
<style scoped>
@import "css/index.css";
</style>
