<template>
	<div class="app-container" style="padding: 1.25rem">
		<!-- 上 -->
		<div class="box_top">
			<div class="composite_father">
				<div class="composite" v-for="(i, j) in percent" :key="j">
					<div class="composite_top">未来风险</div>
					<div class="composite_bottom" style="color: #189f18">
						{{ parseInt(i.syfr * 100) }}
					</div>
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
					<forecastpieecharts :chartData="pieData1" />
				</div>
				<div class="echarts_bar_one">
					<EchartsPictorialBar :echartData="lineChartgray" />
				</div>
			</div>
		</div>
		<!-- 下 -->
		<div class="box_bottom">
			<div class="eacharts_one">
				<forecastechearts
					@getDateTime="getDateTime"
					@changeDate="getsingleCount"
					:chartData="chartDataThree"
					@lineChangeline="lineChangeline"
				/>
				<div
					class="arrow"
					@click="
						arrowone(indexSlideshow1 - 1, data.chartDataThree.lineList, 'one')
					"
				></div>
				<div
					class="next"
					@click="
						nextone(indexSlideshow1 + 1, data.chartDataThree.lineList, 'one')
					"
				></div>
			</div>
			<div class="eacharts_two">
				<forepieecharts
					@lineChange="lineChange"
					:chartData="chartDataline"
					@getDateTime="getDateTime2"
				/>
				<div
					class="arrow"
					@click="arrowone(indexSlideshow2 - 1, data.chartDataline.lineList, 'two')"
				></div>
				<div
					class="next"
					@click="nextone(indexSlideshow2 + 1, data.chartDataline.lineList, 'two')"
				></div>
			</div>
			<div class="eacharts_three">
				<forecastechartsend
					@changeDate="luNetwork"
					:chartData="chartDataHistory"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	formatterData,
	formatterMontain,
	jiaechart1,
	formmaterlist,
	jiachart2,
	jiashuju31,
	jiashuju21,
	jiashuju22,
	forammtertimemand,
	fomattersortTime,
	formattersingleCount,
} from "../js/compontents";
import forecastpieecharts from "../echarts/forecastpieecharts.vue";
import ChinaMap from "../echarts/chinaMap.vue";
import EchartsPictorialBar from "@/components/EchartsPictorialBar";
import forecastechearts from "../echarts/forecastechearts.vue";
import forecastechartsend from "../echarts/forecastechartsend.vue";
const { proxy } = getCurrentInstance();
const { texture } = proxy.useDict("texture");
import forepieecharts from "../echarts/forepieecharts.vue";
import {
	synthesisForecastRisk,
	situationmonitorForecastRisk,
	forMatForecastRisk,
	sevWeatForecastRisks,
	lunetworkForecastRisk,
	lineMonthsForecastRisk,
	mapForecastDistribution,
	getMountions,
	getAllGradeMonitors,
	getAllAssessLines,
} from "@/api/tenseassess/tenseassess.js";

import { getCurrentInstance } from "@vue/runtime-core";
let echartOneTime = ref(null);
let echarttwoTime = ref(null);
const data = reactive({
	lineData: [], //全部路线
	monitorData: [], //全部检测点
	percent: [],
	dateListTime: [],
	currentdot: [],
	pieData1: {
		title: "侵限异物趋势预测分析",
		serviesData: [],
	},
	//默认显示的点
	mapDataEchart: {
		title: "未来风险预测",
		bgcolor: "rgba(245, 245, 14, 0.8)",
		lonLat: [],
		average: [],
	},
	lineChartgray: {
		xAxisData: [],
		seriesData: [],
		title: "恶劣天气趋势预测分析",
		color: "#5bc0be",
		girdData1: true,
		dataZoom: true,
		minValueSpan: 4,
		maxValueSpan: 5,
		percent: true,
	},
	//one 折現
	chartDataThree: {
		title: "单点监测点预测统计",
		xaxisdate: [],
		legendList: ["异物", "环境", "综合"],
		seriesone: [],
		serietwo: [],
		seriesthree: [],
		lineValue: "",
		lineList: [],
		dataZoom: false,
		gridStyle: {
			left: 10,
			right: 10,
			top: 100,
			bottom: 10,
			containLabel: true,
		},
	},
	chartDataline: {
		title: "线路段近三个月预测统计",
		lineValue: "",
		lineList: [],
		// legendList: ["异物", "环境", "综合"],
		lineValue: "",
		onempeidata: [],
		twompeidata: [],
		threempeidata: [],
	},
	chartDataHistory: {
		title: "路网预测统计",
		legendList: ["路网"],
		xaxisdate: [],
		seriesone: [],
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
		echarttwo();
	});
	getAllGradeMonitors().then((res) => {
		if (res.code === 200) {
			data.chartDataThree.lineList = res.data;
			data.chartDataThree.lineValue = data.chartDataThree.lineList[0].id;
		}
		getsingleCount();
	});
});
//获取所有路线和检测点信息
getMountions().then((res) => {
	const { lineData, monitorData } = formatterData(res.data);
	data.lineData = lineData;
	data.monitorData = monitorData;
});

const mapdddd = ref();
function zoom(val) {
	mapdddd.value.roamMap(val);
}
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
//异物侵限综合风险分析
forMatForecastRisk({ queryType: "forecast" }).then((res) => {
	let obj = {};
	for (let key in res.data.forecastMapList) {
	  let keyv = res.data.forecastMapList[key];
	  if (!obj[keyv["texture"]]) {
	    obj[keyv["texture"]] = [keyv];
	  } else {
	    obj[keyv["texture"]].push(keyv);
	  }
	}
	for (let key in obj) {
	  let arrv = obj[key];
	  fmfr = 0;
	  arrv.forEach((i) => {
	    fmfr += i.fmfr;
	  });
	}
	res.data.forecastMapList.forEach((i) => {
	  for (let key in i) {
	    let keycopy = i[key];
	    console.log(keycopy);
	    if (![keycopy["texture"]]) {
	      obj[keycopy["texture"]] = [];
	    } else {
	      obj[keycopy["texture"]].push(keycopy);
	    }
	  }
	});

	data.pieData1.serviesData = res.data.forecastMapList.map((i, j) => {
		// let reutls = texture.value.find((item) => item.value == i.texture);
		let obj = {};

		return {
			name: i.texture ? i.texture : "无",
			// name: reutls ? reutls.label : "无",
			value: i.fmfr,
		};
	});
});
//恶劣天气综合风险预测分析
sevWeatForecastRisks({ queryType: "forecast" }).then((res) => {
	data.lineChartgray.xAxisData = res.data.forecastMapList.map(
		(i) => i.sevweather
	);
	data.lineChartgray.seriesData = res.data.forecastMapList.map((i) => i.wefr);
});

//路网历史统计
async function luNetwork(val = "year") {
	const results = await lunetworkForecastRisk({
		dateType: val,
		queryType: "forecast",
	});
	// console.log(results, "路网历史");

	let resdata = forammtertimemand(val, results.data.forecastMapList, "fdtime");
	data.chartDataHistory.seriesone = resdata.map((i) => i.synthesis);
	data.chartDataHistory.xaxisdate = resdata.map((i) => i.fdtime);
}
luNetwork();

//线路段近三个月预测统计
function echarttwo(val) {
	val = val ? val : (val = "year");
	lineMonthsForecastRisk({
		dateType: val,
		id: data.chartDataline.lineValue,
		queryType: "forecast",
	}).then((res) => {
		if (res.code === 200 && res.data.length) {
			data.chartDataline.lineValue = res.data[0].forecastMapList.id;
			data.chartDataline.xaxisdate = res.data.forecastMapList.map((i) => i.createTime);
			data.chartDataline.seriesone = res.data.forecastMapList.map((i) => i.foreignMatter);
			data.chartDataline.seriestwo = res.data.forecastMapList.map((i) => i.weather);
			data.chartDataline.seriesthree = res.data.forecastMapList.map((i) => i.synthesis);
		} else {
			data.chartDataline.xaxisdate = [];
			data.chartDataline.seriesone = [];
			data.chartDataline.seriestwo = [];
			data.chartDataline.seriesthree = [];
		}
	});
}
// lineMonthsForecastRisk({ dateType: "month",  }).then(
// 	(res) => {
// 		// console.log(res, "线路段近三个月预测统计");
// 		let obj = {};
// 		for (let key in res.data.forecastMapList) {
// 			let keyname = res.data.forecastMapList[key];
// 			if (!obj[keyname.line_id]) {
// 				obj[keyname.line_id] = [keyname];
// 			} else {
// 				obj[keyname.line_id].push(keyname);
// 			}
// 		}
// 		let arrdata = [];
// 		for (let key in obj) {
// 			arrdata.push(obj[key]);
// 		}
// 		slideshow.slideshowData2 = arrdata;

// 		// slideshow.slideshowData2 = jiashuju22;
// 		data.chartDataline.lineList = formmaterlist(
// 			slideshow.slideshowData2,
// 			data.lineData,
// 			"line_id"
// 		);
// 		if (arrdata.length !== 0) {
// 			arrowone(0, slideshow.slideshowData2, "two");
// 		}
// 	}
// );
function forttor(every) {
	let arr = [];
	for (let key in every) {
		let temp = {};
		if (key == "weather" || key == "synthesis" || key == "foreignMatter") {
			temp.name =
				key == "weather"
					? "环境"
					: key == "synthesis"
					? "综合"
					: key == "foreignMatter"
					? "异物"
					: "";
			temp.value = every[key];
			arr.push(temp);
		}
	}
	return arr;
}
mapForecastDistribution({ queryType: "forecast" }).then((res) => {
	// console.log(res, "ditu");
	// data.mapDataEchart.lonLat = [{ value: [113.922282, 40] }];
	data.mapDataEchart.lonLat = res.data.map((i) => {
		return {
			value: [i.lon, i.lat],
		};
	});
	// data.mapDataEchart.average = [1];
	data.mapDataEchart.average = res.data.map((i) => {
		return i.syfr ? i.syfr : "0";
	});
});

//综合风险
synthesisForecastRisk({ queryType: "forecast" }).then((res) => {
	// console.log(res, "全部数据");
	if (res.data) {
		data.percent = [res.data];
	} else {
		data.percent = [{ syfr: 1 }];
	}
});

//下第一个切换
const lineChangeline = (e) => {
	let index = data.chartDataThree.lineList.findIndex((i) => i.id == e);
	slideshow.indexSlideshow1 = index;
	data.chartDataThree.lineValue = e;
	getsingleCount(echartOneTime.value);
};
//下第二个切换
const lineChange = (e) => {
	let index = data.chartDataline.lineList.findIndex((i) => i.id == e);
	slideshow.indexSlideshow2 = index;
	data.chartDataline.lineValue = e;
	echarttwo(echarttwoTime.value);
};
//单点检测点预测统计
async function getsingleCount(val) {
	val ? val : (val = "year");
	situationmonitorForecastRisk({
		dateType: val,
		queryType: "forecast",
		id: data.chartDataThree.lineValue,
	}).then((res) => {
		if (res.code === 200 && res.data.length) {
			data.chartDataThree.lineValue = res.data.forecastMapList[0].id;
			data.chartDataThree.xaxisdate = res.data.forecastMapList.map(
				(i) => i.createTime
			);
			data.chartDataThree.seriesone = res.data.forecastMapList.map(
				(i) => i.foreignMatter
			);
			data.chartDataThree.seriestwo = res.data.forecastMapList.map(
				(i) => i.weather
			);
			data.chartDataThree.seriesthree = res.data.forecastMapList.map(
				(i) => i.synthesis
			);
		} else {
			data.chartDataThree.xaxisdate = [];
			data.chartDataThree.seriesone = [];
			data.chartDataThree.seriestwo = [];
			data.chartDataThree.seriesthree = [];
		}
	});
}

let slideshow = reactive({
	//第一个轮播图
	indexSlideshow1: 0,
	slideshowData: [],
	//第二个轮播图
	slideshowData2: [],
	indexSlideshow2: 0,
});
const { indexSlideshow1, slideshowData, slideshowData2, indexSlideshow2 } =
	toRefs(slideshow);

//轮播图箭头的操作
//info 传1是bottom echart1  传2 是ehcart2
const arrowone = (index, slideD, info) => {
	if (slideD.length == 0) return;
	if (index < 0) {
		arrowone(slideD.length - 1, slideD, info);
	} else {
		if (info == "one") {
			slideshow.indexSlideshow1 = index;
			data.chartDataThree.lineValue = slideD[index].id;
			getsingleCount(echartOneTime.value);
		} else {
			slideshow.indexSlideshow2 = index;
			data.chartDataline.lineValue = slideD[index].id;
			echarttwo(echarttwoTime.value);
		}
	}
};
const nextone = (index, slideD, info) => {
	if (slideD.length == 0) return;
	if (slideD.length - 1 < index) {
		nextone(0, slideD, info);
	} else {
		if (info == "one") {
			slideshow.indexSlideshow1 = index;
			data.chartDataThree.lineValue = slideD[index].id;
			getsingleCount(echartOneTime.value);
		} else if (info == "two") {
			slideshow.indexSlideshow2 = index;
			data.chartDataline.lineValue = slideD[index].id;
			echarttwo(echarttwoTime.value);
		}
	}
};
// 赋值函数
function assignmentFn(index, slidedata, info) {
	// console.log(info, "轮播");
	// if (info == "one") {
	// 	data.chartDataThree.lineValue = data.chartDataThree.lineList[index].value;
	// 	data.chartDataThree.seriesone = slidedata[index].map(
	// 		(i) => i.foreignMatter
	// 	);
	// 	data.chartDataThree.serietwo = slidedata[index].map((i) => i.weather);
	// 	data.chartDataThree.seriesthree = slidedata[index].map((i) => i.synthesis);
	// 	data.chartDataThree.xaxisdate = slidedata[index].map((i) => i.fdtime);
	// } else {
	// 	data.chartDataline.lineValue = data.chartDataline.lineList[index].value;
	// 	for (let idx = 0; idx < slidedata[index].length; idx++) {
	// 		let every = slidedata[index][idx];
	// 		if (idx == 0) {
	// 			data.chartDataline.onempeidata = forttor(every);
	// 		} else if (idx == 1) {
	// 			data.chartDataline.twompeidata = forttor(every);
	// 		} else if (idx == 2) {
	// 			data.chartDataline.threempeidata = forttor(every);
	// 		}
	// 	}
	// }
}
</script>

<style lang="scss" scoped>
@import url("../css/index.css");
</style>
