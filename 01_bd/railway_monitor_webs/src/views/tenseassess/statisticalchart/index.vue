<template>
	<div class="app-container" style="padding: 1.25rem">
		<!-- 上 -->
		<div class="box_top">
			<div class="composite_father">
				<div class="composite" v-for="(i, j) in percent" :key="j">
					<div class="composite_top">综合分析</div>
					<div class="composite_bottom">{{ parseInt(i.syfr * 100) }}</div>
				</div>
			</div>
			<div class="china_map">
				<china-map
					style="width: 100%; height: 100%"
					:echartData="mapDataEchart"
					ref="mapdddd"
				/>
				<div class="btns_bigsmall">
					<div class="btns_big" @click="zoom('0')"></div>
					<div class="btns_small" @click="zoom('1')"></div>
				</div>
			</div>
			<div class="right_chinaMap">
				<!-- 饼饼图 -->
				<div class="echarts_cake1">
					<synthesipietwo :chartData="pieChartData" />
					<!-- <forecastpieecharts :chartData="pieChartData" /> -->
				</div>
				<div class="echarts_bar_one">
					<EchartsPictorialBar :echartData="lineChartgray" />
				</div>
			</div>
		</div>
		<!-- 下 -->
		<div class="box_bottom">
			<div class="eacharts_one">
				<eachartsline
					@lineChangeline="lineChangeline"
					:chartData="chartDataThree"
					@echarttwo="unitchekpoint"
					@getDateTime="getDateTime"
				/>
				<div
					class="arrow"
					@click="
						arrowone(indexSlideshow2 - 1, data.chartDataThree.lineList, 'two')
					"
				></div>
				<div
					class="next"
					@click="
						nextone(indexSlideshow2 + 1, data.chartDataThree.lineList, 'two')
					"
				></div>
			</div>
			<div class="eacharts_two">
				<eachartsthreeBar
					@lineChange="lineChange"
					@oneechart="luforecast"
					:chartData="chartDataline"
					@getDateTime="getDateTime2"
				></eachartsthreeBar>
				<div
					class="arrow"
					@click="
						arrowone(indexSlideshow1 - 1, data.chartDataline.lineList, 'one')
					"
				></div>
				<div
					class="next"
					@click="
						nextone(indexSlideshow1 + 1, data.chartDataline.lineList, 'one')
					"
				></div>
			</div>
			<div class="eacharts_three">
				<forecastechearts
					:showTime="false"
					:chartData="chartDataHistory"
					@changeDate="lunetworkRisk"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
const { proxy } = getCurrentInstance();
const { texture, RainStatus, WindStatus, FogStatus, SnowStatus } =
	proxy.useDict(
		"texture",
		"SnowStatus",
		"FogStatus",
		"RainStatus",
		"WindStatus"
	);
// formatterData as formatter,
import {
	formatterMontain,
	formmaterlist,
	formatterDatas,
	forammtertimemand,
} from "../js/compontents";
import synthesipietwo from "../echarts/synthesipietwo.vue";
import eachartsthreeBar from "../echarts/eachartsthreeBar.vue";
import stituationanalysisBar from "@/components/echarts/stituationanalysisBar.vue";
import ChinaMap from "../echarts/chinaMap.vue";
import eachartsline from "../echarts/eachartsline.vue";
import echartpie from "../echarts/echartpie.vue";
import EchartsPictorialBar from "@/components/EchartsPictorialBar_statistical";
import forecastechearts from "../echarts/forecastechearts.vue";
import forecastechartsend from "../echarts/forecastechartsend.vue";
import forepieecharts from "../echarts/forepieecharts.vue";
import forecastpieecharts from "../echarts/forecastpieecharts.vue";
import {
	forMatForecastRisk,
	sevWeatForecastRisks,
	lineMonthsForecastRisk,
	lunetworkForecastRisk,
	mapForecastDistribution,
	synthesisForecastRisk,
	situationmonitorForecastRisk,
	getMountions,
	getAllAssessLines,
	getAllGradeMonitors,
} from "@/api/tenseassess/tenseassess.js";
import {
	formatterData,
	formmaterobj,
	formatterpic,
	dandianFn,
	formatlineData,
} from "./index.js";

//获取所有路线和检测点信息
getMountions().then((res) => {
	const { lineData, monitorData } = formatterDatas(res.data);
	// console.log(lineData, "all");
	data.lineData = lineData;
	data.monitorData = monitorData;
});
let echartOneTime = ref(null);
let echarttwoTime = ref(null);
const data = reactive({
	lineData: [],
	monitorData: [],
	percent: [], //未来风险分析
	//默认显示的点
	mapDataEchart: {
		title: "历史风险统计",
		bgcolor: "rgba(149, 233, 18, 0.8)",
		lonLat: [],
		average: [],
	},
	pieData1: {
		title: "异物侵限综合风险预测分析",
		serviesData: [],
	},
	//恶劣天气综合风险预测分析
	lineChartgray: {
		axisLine: false,
		title: "恶劣天气综合风险预测分析",
		xAxisData: [],
		seriesData: [],
		color: "#5bc0be",
		girdData1: true,
		dataZoom: true,
		minValueSpan: 4,
		maxValueSpan: 5,
		fontSize: "15px",
		titleColor: "#b7b7af",
		percent: true,
	},
	//饼饼图1two餅圖
	pieChartData: {
		title: "异物侵限综合风险预测分析",
		serviesData: [],
	},
	//bottom第1个图
	chartDataThree: {
		title: "单点监测点综合分析统计",
		xaxisdate: [],
		legendList: ["异物", "环境", "综合"],
		seriesone: [],
		seriestwo: [],
		seriesthree: [],
		dataZoom: false,
		lineValue: "",
		lineList: [],
		gridStyle: {
			left: 10,
			right: 10,
			top: 100,
			bottom: 10,
			containLabel: true,
		},
	},
	//bottom第二个图
	chartDataline: {
		title: "线路段综合分析统计",
		xaxisdate: [],
		lineValue: "",
		lineList: [],
		legendList: ["异物", "环境", "综合"],
		seriesone: [],
		seriestwo: [],
		seriesthree: [],
		dataZoom: true,
		lineValue: "",
		lineList: [],
	},
	chartDataHistory: {
		title: "路网综合分析统计",
		legendList: ["综合"],
		xaxisdate: [],
		seriesone: [],
		dataZoom: false,
		gridStyle: {
			left: 10,
			right: 10,
			top: 100,
			bottom: 10,
			containLabel: true,
		},
	},
});
const {
	pieChartData,
	chartDataThree,
	chartDataline,
	chartDataHistory,
	lineChartgray,
	mapDataEchart,
	pieData1,
	percent,
} = toRefs(data);
onMounted(() => {
	getAllAssessLines().then((res) => {
		if (res.code === 200) {
			data.chartDataline.lineList = res.data;
			data.chartDataline.lineValue = data.chartDataline.lineList[0].id;
		}
		luforecast();
	});
	getAllGradeMonitors().then((res) => {
		if (res.code === 200) {
			data.chartDataThree.lineList = res.data;
			data.chartDataThree.lineValue = data.chartDataThree.lineList[0].id;
		}
		unitchekpoint();
	});
});
const getDateTime2 = (val) => {
	if (val == 1) {
		echarttwoTime.value = "year";
	} else if (val == 2) {
		echarttwoTime.value = "month";
	} else if (val == 3) {
		echarttwoTime.value = "day";
	}
};
const getDateTime = (val) => {
	if (val == 1) {
		echartOneTime.value = "year";
	} else if (val == 2) {
		echartOneTime.value = "month";
	} else if (val == 3) {
		echartOneTime.value = "day";
	}
};
const mapdddd = ref();
function zoom(val) {
	mapdddd.value.roamMap(val);
}
//-异物侵限综合风险预测分析
forMatForecastRisk({ queryType: "synthesis" }).then((res) => {
	// console.log(res, "异物", formatterpic(res.data, texture.value));
	data.pieChartData.serviesData = formatterpic(res.data, texture.value);
	// console.log(data.pieChartData.serviesData, "两个pie");
	// data.pieChartData.serviesData.forecastMapList = [];
});

//恶劣天气综合风险预测分析  需要放两个数据空间太小
sevWeatForecastRisks({ queryType: "synthesis" }).then((res) => {
	// let resultes = mal_weather(res);
	let source = [];
	res.data.hisMapsList.map((item) => {
		item["历史数据"] = item.wefr;
	});
	res.data.forecastMapList.map((item) => {
		item["预测数据"] = item.wefr;
	});
	res.data.forecastMapList.forEach((fore, foreIndex) => {
		res.data.hisMapsList.forEach((his, hisIndex) => {
			if (fore.sevweather === his.sevweather) {
				fore["历史数据"] = his.wefr;
			}
		});
	});
	data.lineChartgray = res.data.forecastMapList;
});

//线路段综合分析统计lineMonthsForecastRisk
function luforecast(val) {
	val ? val : (val = "year");
	lineMonthsForecastRisk({
		dateType: val,
		id: data.chartDataline.lineValue,
		queryType: "synthesis",
	}).then((res) => {
		if (res.code === 200) {
			let map1 = [];
			let map2 = [];
			if (res.data.forecastMapList.length) {
				map1 = forammtertimemand(
					val,
					res.data.forecastMapList,
					"create_time"
				).map((i) => {
					return {
						...i,
						time: i.create_time,
					};
				});
			} else {
				map1 = [];
			}
			if (res.data.hisMapsList.length) {
				map2 = forammtertimemand(val, res.data.hisMapsList, "createTime").map(
					(i) => {
						return {
							...i,
							time: i.createTime,
						};
					}
				);
			} else {
				map2 = [];
			}
			let results = [...map2, ...map1];
			if (results.length === 0) {
				data.chartDataline.xaxisdate = [];
				data.chartDataline.seriesone = [];
				data.chartDataline.seriestwo = [];
				data.chartDataline.seriesthree = [];
			} else {
				data.chartDataline.lineValue = results[0].id;
				data.chartDataline.xaxisdate = results.map((i) =>
					i.createTime ? i.createTime : i.create_time
				);
				data.chartDataline.seriesone = results.map((i) => i.foreignMatter);
				data.chartDataline.seriestwo = results.map((i) => i.weather);
				data.chartDataline.seriesthree = results.map((i) => i.synthesis);
			}
		}
	});
}
//切换单点监测综合下拉框
const lineChangeline = (e) => {
	let index = data.chartDataThree.lineList.findIndex((i) => i.id == e);
	slidedata.indexSlideshow1 = index;
	data.chartDataThree.lineValue = e;
	unitchekpoint(echartOneTime.value);
};
//线路段综合分析统计下拉
const lineChange = (e) => {
	let index = data.chartDataline.lineList.findIndex((i) => i.id == e);
	slidedata.indexSlideshow2 = index;
	data.chartDataline.lineValue = e;
	luforecast(echartOneTime.value);
};
// 单点监测点综合分析统计
function unitchekpoint(val) {
	val ? val : (val = "year");
	situationmonitorForecastRisk({
		dateType: val,
		id: data.chartDataThree.lineValue,
		queryType: "synthesis",
	}).then((res) => {
		if (res.code === 200) {
			let map1 = [];
			let map2 = [];
			if (res.data.forecastMapList.length) {
				map1 = forammtertimemand(
					val,
					res.data.forecastMapList,
					"create_time"
				).map((i) => {
					return {
						...i,
						time: i.create_time,
					};
				});
			} else {
				map1 = [];
			}
			if (res.data.hisMapsList.length) {
				map2 = forammtertimemand(val, res.data.hisMapsList, "createTime").map(
					(i) => {
						return {
							...i,
							time: i.createTime,
						};
					}
				);
			} else {
				map2 = [];
			}
			let results = [...map2, ...map1];
			if (results.length === 0) {
				data.chartDataThree.xaxisdate = [];
				data.chartDataThree.seriesone = [];
				data.chartDataThree.seriestwo = [];
				data.chartDataThree.seriesthree = [];
			} else {
				data.chartDataThree.lineValue = results[0].id;
				data.chartDataThree.xaxisdate = results.map((i) =>
					i.createTime ? i.createTime : i.create_time
				);
				data.chartDataThree.seriesone = results.map((i) => i.foreignMatter);
				data.chartDataThree.seriestwo = results.map((i) => i.weather);
				data.chartDataThree.seriesthree = results.map((i) => i.synthesis);
			}
		}
	});
}

function foarrtter(obj) {
	let objCopy = {};
	for (let key in obj) {
		let newarr = obj[key];
		for (let k in newarr) {
			let kv = newarr[k];
			if (!objCopy[kv.time]) {
				objCopy[kv.time] = [kv];
			} else {
				objCopy[kv.time].push(kv);
			}
		}
	}
	let ardata = [];
	for (let kk in objCopy) {
		let arr = [];
		let vv = objCopy[kk];
		let str = 0;
		let str1 = 0;
		let str2 = 0;
		let id = "";
		vv.forEach((i) => {
			str += i.foreignMatter;
			str1 += i.synthesis;
			str2 += i.weather;
			id = i.id;
		});
		arr.push({ for: str, synth: str1, weather: str2, id: id, time: kk });
		ardata.push(arr);
	}
	return ardata;
}

//路网综合分析统计
function lunetworkRisk(val = "year") {
	lunetworkForecastRisk({ dateType: val, queryType: "synthesis" }).then(
		(res) => {
			// console.log(res, "路网综合分析统计");
			// console.log(
			//   forammtertimemand(val, res.data.forecastMapList, "fdtime"),
			//   forammtertimemand(val, res.data.hisMapsList, "createTime"),
			//   "未来"
			// );

			let map1 = forammtertimemand(val, res.data.forecastMapList, "fdtime").map(
				(i) => {
					return {
						...i,
						time: i.fdtime,
					};
				}
			);
			let map2 = forammtertimemand(val, res.data.hisMapsList, "createTime").map(
				(i) => {
					return {
						...i,
						time: i.createTime,
					};
				}
			);
			let results = [...map2, ...map1];
			data.chartDataHistory.xaxisdate = results.map((i) => i.time);
			data.chartDataHistory.seriesone = results.map((i) => i.synthesis);
		}
	);
}
lunetworkRisk();

//中央风险图
mapForecastDistribution({ queryType: "synthesis" }).then((res) => {
	// console.log(res, "地图");
	data.mapDataEchart.lonLat = res.data.map((i) => {
		return {
			value: [i.lon, i.lat],
		};
	});
	data.mapDataEchart.average = res.data.map((i) => {
		return i.syfr ? i.syfr : "0";
	});

});

//未来风险预测
synthesisForecastRisk({ queryType: "forecast" }).then((res) => {
	// console.log(res, "res");
	if (res.data) {
		data.percent = [res.data];
	} else {
		data.percent = [{ syfr: 1 }];
	}
});

const slidedata = reactive({
	indexSlideshow1: 0,
	slideshowData: [],
	indexSlideshow2: 0,
	slideshowData2: [],
});
const { indexSlideshow2, slideshowData2, indexSlideshow1, slideshowData } =
	toRefs(slidedata);
const arrowone = (index, slideD, info) => {
	if (slideD.length == 0) return;
	if (index < 0) {
		arrowone(slideD.length - 1, slideD, info);
	} else {
		if (info == "one") {
			slidedata.indexSlideshow1 = index;
			data.chartDataline.lineValue = slideD[index].id;
			luforecast(echartOneTime.value);
		} else {
			slidedata.indexSlideshow2 = index;
			data.chartDataThree.lineValue = slideD[index].id;
			unitchekpoint(echarttwoTime.value);
		}
	}
};
const nextone = (index, slideD, info) => {
	if (slideD.length == 0) return;
	if (slideD.length - 1 < index) {
		nextone(0, slideD, info);
	} else {
		if (info == "one") {
			slidedata.indexSlideshow1 = index;
			data.chartDataline.lineValue = slideD[index].id;
			luforecast(echartOneTime.value);
		} else if (info == "two") {
			slidedata.indexSlideshow2 = index;
			data.chartDataThree.lineValue = slideD[index].id;
			unitchekpoint(echarttwoTime.value);
		}
	}
};

</script>

<style lang="scss" scoped>
@import url("../css/index.css");
</style>
