<template>
	<div class="app-container">
		<!-- 上 -->
		<div class="box_top">
			<div class="composite_father" v-if="riskData.length > 0">
				<div class="composite" v-for="(i, j) in riskData" :key="j">
					<div class="composite_top">综合风险</div>
					<div class="composite_bottom">{{ parseInt(i.average * 100) }}</div>
				</div>
			</div>

			<div class="china_map">
				<china-map
					style="width: 100%; height: 100%"
					:echartData="mapDataEchart"
					ref="mapdddd"
				>
				</china-map>
				<div class="time_Style">
					<div class="item_content">
						<!-- <div class="vieoClass">
              <div class="trianglepic"></div>
            </div> -->
						<div
							style="flex: 1; display: flex"
							v-for="i in dateListTime"
							:key="i.id"
						>
							<div
								class="dot"
								:class="[i.info == currentdot ? 'dot_active' : '']"
								@click="timedot(i)"
							>
								<div class="info">
									{{ i.info == currentdot ? "当前" : i.info }}
								</div>
							</div>
							<div class="item"></div>
							<div class="triangle"></div>
						</div>
					</div>
					<div class="class_Select">
						<el-select v-model="selectTime" @change="selectChange">
							<el-option label="近7天" value="1"></el-option>
							<el-option label="近一个月" value="2"></el-option>
							<el-option label="近一个季度" value="3"></el-option>
							<el-option label="近一年" value="4"></el-option>
						</el-select>
					</div>
				</div>
				<div class="btns_bigsmall">
					<div class="btns_big" @click="zoom('0')"></div>
					<div class="btns_small" @click="zoom('1')"></div>
				</div>
			</div>
			<div class="right_chinaMap">
				<!-- 饼饼图 -->
				<div class="echarts_cake">
					<div class="pie_title">异物类型历史统计分析</div>
					<div
						:class="pieChartData.length < 5 ? 'every_pie_flex' : 'every_pie'"
						v-for="i in pieChartData"
						:key="i.id"
					>
						<echartpie :chartData="i" />
					</div>
				</div>
				<div class="echarts_bar_one">
					<stituationanalysisBar :chartData="chartDataWeather" />
				</div>
			</div>
		</div>
		<!-- 下 -->
		<div class="box_bottom">
			<div class="eacharts_one">
				<eachartsthreeBar
					@getDateTime="getDateTime"
					:chartData="chartDataThree"
					@oneechart="oneechart"
					@lineChange="lineChange"
				></eachartsthreeBar>
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
				<eachartsline
					@lineChangeline="lineChangeline"
					:chartData="chartDataline"
					@echarttwo="echarttwo"
					@getDateTime="getDateTime2"
				/>
				<div
					class="arrow"
					@click="
						arrowone(indexSlideshow2 - 1, data.chartDataline.lineList, 'two')
					"
				></div>
				<div
					class="next"
					@click="
						nextone(indexSlideshow2 + 1, data.chartDataline.lineList, 'two')
					"
				></div>
			</div>
			<div class="eacharts_three">
				<echartshistoryline
					:chartData="chartDataHistory"
					@echarthtree="echarthtree"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
const { proxy } = getCurrentInstance();
import { formatterData, forammtertimemand } from "../js/compontents";
const { texture, RainStatus, WindStatus, FogStatus, SnowStatus } =
	proxy.useDict(
		"texture",
		"SnowStatus",
		"FogStatus",
		"RainStatus",
		"WindStatus"
	);
import {
	situationMatterRisk,
	situationmonitorHistoryRisk,
	situationnetworkHistoryRisk,
	situationrouteHistoryRisk,
	situationsevereWeatherRisk,
	situationriskDistribution,
	getsynthesizeRisk,
	getMountions,
	getAllAssessLines,
	getAllGradeMonitors,
} from "@/api/tenseassess/tenseassess.js";
import stituationanalysisBar from "@/components/echarts/stituationanalysisBar.vue";
import eachartsthreeBar from "../echarts/eachartsthreeBar.vue";
import ChinaMap from "../echarts/chinaMap.vue";
import eachartsline from "../echarts/eachartsline.vue";
import echartshistoryline from "../echarts/echartshistoryline.vue";
import echartpie from "../echarts/echartpie.vue";
import { onMounted } from "@vue/runtime-core";

//控制地图放大缩小
const mapdddd = ref();
function zoom(val) {
	mapdddd.value.roamMap(val);
}
let echartOneTime = ref(null);
let echarttwoTime = ref(null);
const data = reactive({
	lineData: [],
	monitorData: [],
	mapDataValue: [], //全部的map数据年月日不定
	selectTime: "1", //下拉用户选择的时间点
	//存储当前显示几个点
	dateListTime: [],
	currentdot: "",
	//默认显示的点
	mapDataEchart: {
		title: "历史风险统计",
		lonLat: [],
		average: [],
		bgcolor: "rgba(173, 96, 106, 0.8)",
	},
	//柱状图带阴影
	chartDataWeather: {
		title: "恶劣天气次数历史统计分析",
		xData: [],
		yData: [],
	},
	//饼饼图
	pieChartData: [],
	//one 折現
	chartDataThree: {
		title: "单点监测点历史统计",
		xaxisdate: [],
		legendList: ["异物", "环境", "综合"],
		seriesone: [],
		seriestwo: [],
		seriesthree: [],
		dataZoom: true,
		lineValue: "",
		lineList: [],
	},
	chartDataline: {
		title: "线路段历史统计",
		xaxisdate: [],
		legendList: ["异物", "环境", "综合"],
		seriesone: [],
		seriestwo: [],
		seriesthree: [],
		dataZoom: true,
		lineValue: "",
		lineList: [],
		// gridStyle: {
		//   left: 10,
		//   right: 10,
		//   top: 100,
		//   bottom: 10,
		//   containLabel: true,
		// },
	},
	chartDataHistory: {
		title: "路网历史统计",
		legendList: ["路网"],
		dataZoom: false,
		gridStyle: {
			left: 10,
			right: 10,
			top: 100,
			bottom: 10,
			containLabel: true,
		},
		xaxisdate: [],
		seriesone: [],
	},
	riskData: [],
});
const {
	pieChartData,
	chartDataThree,
	chartDataline,
	chartDataHistory,
	chartDataWeather,
	mapDataEchart,
	dateListTime,
	currentdot,
	selectTime,
	riskData,
} = toRefs(data);
//获取所有路线和检测点信息
getMountions().then((res) => {
	const { lineData, monitorData } = formatterData(res.data);
	data.lineData = lineData;
	data.monitorData = monitorData;
});
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
		oneechart();
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

getsynthesizeRisk().then((res) => {
	if (res.data.length == 0) {
		data.riskData = [{ average: 1 }];
	} else {
		data.riskData = res.data;
	}
});
function selectChange(e) {
	if (e == 1) {
		getMapData("day");
	} else if (e == 2) {
		getMapData("month");
	} else if (e == 3) {
		getMapData("quarter");
	} else if (e == 4) {
		getMapData("year");
	}
}
async function getMapData(val = "day") {
	let res = await situationriskDistribution({ dateType: val });
	formateerDay(res, val);
}
// 用户选择的年月日
function formateerDay(res, val) {
	//全部数据重命名key
	let alldata = res.data.map((i, j) => {
		let timedata;
		if (val == "day") {
			timedata = new Date(i.createTime).getDate() + "号";
		} else if (val == "year" || val == "quarter") {
			timedata = new Date(i.createTime).getMonth() + 1 + "月";
		} else if (val == "month") {
			timedata = new Date(i.createTime).getDate() + "号";
		}
		return {
			...i,
			id: j,
			info: timedata,
		};
	});
	let foamtterData = [...new Set(alldata.map((i) => i.info))];
	//保存数据点击按钮的时候使用
	data.mapDataValue = alldata;
	//时间轴的数据
	data.dateListTime = foamtterData
		.map((i) => {
			let results = alldata.find((idx) => idx.info == i);
			return results ? results : { info: "" };
		})
		.filter((i) => i.info !== "")
		.sort((a, b) => {
			return parseInt(a.info) - parseInt(b.info);
		});

	//默认选择天数Wie最大的  经纬度
	let maxday = data.dateListTime[data.dateListTime.length - 1].info;
	data.currentdot = maxday; //赋值为最大的值显示当前

	data.mapDataEchart.average = alldata
		.filter((i) => i.info == maxday)
		.map((i) => {
			return i.average ? i.average : "0";
		});
	//第一次显示
	data.mapDataEchart.lonLat = alldata
		.filter((i) => i.info == maxday)
		.map((i) => {
			return {
				value: [i.lon, i.lat],
			};
		});
}
//每次点击时间轴点计算当前的经纬度
function timedot(item) {
	data.currentdot = item.info;

	data.mapDataEchart.average = data.mapDataValue
		.filter((i) => i.createTime == item.createTime)
		.map((i) => {
			return i.average ? i.average : "0";
		});
	data.mapDataEchart.lonLat = data.mapDataValue
		.filter((i) => i.createTime == item.createTime)
		.map((i) => {
			return {
				value: [i.lon, i.lat],
			};
		});
}

getMapData();
//统计分析-恶劣天气综合风险分析
situationsevereWeatherRisk().then((res) => {
	let arr = [];
	for (const keyname in res.data) {
		const dataCopy = res.data[keyname];
		if (keyname == "fogStatus") {
			arr.push(formatterList(FogStatus.value, dataCopy, keyname));
		} else if (keyname == "rainStatus") {
			arr.push(formatterList(RainStatus.value, dataCopy, keyname));
		} else if (keyname == "windStatus") {
			arr.push(formatterList(WindStatus.value, dataCopy, keyname));
		} else if (keyname == "snowStatus") {
			arr.push(formatterList(SnowStatus.value, dataCopy, keyname));
		}
	}
	data.chartDataWeather.xData = arr.flat().map((i) => i.name);
	data.chartDataWeather.yData = arr.flat().map((i) => i.count);
});

//格式化数据筛选出风雾雨雪的分类
function formatterList(data, arr, keyname) {
	let newarr = [];
	arr.forEach((i) => {
		const findData = data.find((id) => id.value == i[keyname]);
		//为了页面好看后期改成空或者天气
		newarr.push({
			name: findData ? findData.label : "无",
			count: i.weather,
		});
	});
	return newarr;
}

const lineChangeline = (e) => {
	let index = data.chartDataline.lineList.findIndex((i) => i.id == e);
	slidedata.indexSlideshow2 = index;
	data.chartDataline.lineValue = e;
	echarttwo(echarttwoTime.value);
};
//统计分析-线路段历史统计
function echarttwo(val) {
	val = val ? val : (val = "year");
	situationrouteHistoryRisk({
		dateType: val,
		id: data.chartDataline.lineValue,
	}).then((res) => {
		if (res.code === 200 && res.data.length) {
			data.chartDataline.lineValue = res.data[0].id;
			data.chartDataline.xaxisdate = res.data.map((i) => i.createTime);
			data.chartDataline.seriesone = res.data.map((i) => i.foreignMatter);
			data.chartDataline.seriestwo = res.data.map((i) => i.weather);
			data.chartDataline.seriesthree = res.data.map((i) => i.synthesis);
		} else {
      data.chartDataline.xaxisdate = []
			data.chartDataline.seriesone = []
			data.chartDataline.seriestwo = []
			data.chartDataline.seriesthree = []
		}
	});
}
// // 路网历史统计
function echarthtree(val = "year") {
	situationnetworkHistoryRisk({ dateType: val }).then((res) => {
		let results = forammtertimemand(val, res.data, "createTime");
		data.chartDataHistory.xaxisdate = results.map((i) => i.createTime);
		data.chartDataHistory.seriesone = results.map((i) => i.synthesis);
	});
}
echarthtree();
//下拉框查询检测点下的数据
function lineChange(e) {
	let index = data.chartDataThree.lineList.findIndex((i) => i.id == e);
	slidedata.indexSlideshow1 = index;
	data.chartDataThree.lineValue = e;
	oneechart(echartOneTime.value);
}
// 统计分析-单点监测点历史统计\
function oneechart(val) {
	val ? val : (val = "year");
	situationmonitorHistoryRisk({
		dateType: val,
		id: data.chartDataThree.lineValue,
	}).then((res) => {
		if (res.code === 200 && res.data.length) {
			data.chartDataThree.lineValue = res.data[0].id;
			data.chartDataThree.xaxisdate = res.data.map((i) => i.createTime);
			data.chartDataThree.seriesone = res.data.map((i) => i.foreignMatter);
			data.chartDataThree.seriestwo = res.data.map((i) => i.weather);
			data.chartDataThree.seriesthree = res.data.map((i) => i.synthesis);
		} else {
			data.chartDataThree.xaxisdate = [];
			data.chartDataThree.seriesone = [];
			data.chartDataThree.seriestwo = [];
			data.chartDataThree.seriesthree = [];
		}
	});
}
// 异物侵限综合风险分析
situationMatterRisk().then((res) => {
	const colorlist = [
		"#1c82e0",
		"#319a50",
		"#b09420",
		"#d88a26",
		"#840f1e",
		"#1c82e0",
		"#1c82e0",
		"#1c82e0",
		"#1c82e0",
		"#1c82e0",
	];
	data.pieChartData = res.data.map((i, j) => {
		// let valuelabel = texture.value.find((idx) => idx.value == i.texture);
		return {
			id: j + 1,
			info: i.texture ? i.texture : "无",
			// info: valuelabel ? valuelabel.label : "空",
			color: colorlist[j],
			datapie: i.percentum,
		};
	});
});

const slidedata = reactive({
	indexSlideshow1: 0,
	slideshowData: [],
	indexSlideshow2: 0,
	slideshowData2: [],
});

const { indexSlideshow1, slideshowData, indexSlideshow2, slideshowData2 } =
	toRefs(slidedata);

//index 索引  slideD数据  info 代表echarts 是哪个one
const arrowone = (index, slideD, info) => {
	if (slideD.length == 0) return;
	if (index < 0) {
		arrowone(slideD.length - 1, slideD, info);
	} else {
		if (info == "one") {
			slidedata.indexSlideshow1 = index;
			data.chartDataThree.lineValue = slideD[index].id;
			oneechart(echartOneTime.value);
		} else {
			slidedata.indexSlideshow2 = index;
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
			slidedata.indexSlideshow1 = index;
			data.chartDataThree.lineValue = slideD[index].id;
			oneechart(echartOneTime.value);
		} else if (info == "two") {
			slidedata.indexSlideshow2 = index;
			data.chartDataline.lineValue = slideD[index].id;
			echarttwo(echarttwoTime.value);
		}
	}
};
</script>

<style lang="scss" scoped>
@import url("../css/index.css");
</style>
