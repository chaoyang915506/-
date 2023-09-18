<template>
	<echarts
		:option="option"
		ref="echart"
		:update-options="{ notMerge: true }"
		autoresize
	/>
	<div class="left_date">
		<div
			@click="clickTime('1')"
			:class="[dateTime == '1' ? 'active' : '', 'year']"
		>
			年
		</div>
		<div
			@click="clickTime('2')"
			:class="[dateTime == '2' ? 'active' : '', 'month']"
		>
			月
		</div>
		<div
			@click="clickTime('3')"
			:class="[dateTime == '3' ? 'active' : '', 'day']"
		>
			日
		</div>
	</div>
	<div class="searchinput" v-if="props.showTime">
		<el-select
			v-model="props.chartData.lineValue"
			class="m-2"
			@change="changeSelect"
			placeholder=""
			size="small"
		>
			<el-option
				v-for="item in props.chartData.lineList"
				:key="item.id"
				:label="item.monitorName"
				:value="item.id"
			/>
		</el-select>
	</div>
</template>

<script setup>
const props = defineProps({
	chartData: Object,
	showTime: {
		type: Boolean,
		default: true,
	},
});
const emit = defineEmits(["changeDate", "lineChangeline"]);
const changeSelect = (e) => {
	// console.log(e, "red的说法");
	emit("lineChangeline", e);
};

let dateTime = ref("1");
function clickTime(val) {
	if (val == "1") {
		emit("changeDate", "year");
	} else if (val == "2") {
		emit("changeDate", "month");
	} else if (val == "3") {
		emit("changeDate", "day");
	}
	dateTime.value = val;
	emit("getDateTime", dateTime.value);
}

let symbol = false;
watch(
	() => props.chartData.seriesone,
	(val) => {
		if (val.length == 1) {
			symbol = true;
		} else {
			symbol = false;
		}
	}
);
// let redsd = {
//   type: "slider",
//   show: true,
//   start: 0,
//   end: 100,
//   xAxisIndex: [0],
//   bottom: 20,
//   left: 30,
// };
// let grid = { left: 10, right: 10, top: 100, bottom: 70, containLabel: true };
const option = computed(() => {
	const option = {
		color: ["#1c82e0", "#30ac55", "#dcb519"],
		// grid: props.chartData.dataZoom ? grid : props.chartData.gridStyle、,
		grid: {
			left: 10,
			right: 10,
			top: 100,
			bottom: props.chartData.seriesone.length > 10 ? 32 : 10,
			containLabel: true,
		},

		title: {
			text: props.chartData.title,
			top: 7,
			right: 20,
			textStyle: {
				color: "#b7b7af",
				fontSize: 16,
				fontWeight: 300,
			},
			//   textAlign: "right",
		},
		tooltip: {
			trigger: "axis",
			show: true,
		},
		legend: {
			show: props.chartData.legendList.length == 1 ? false : true,
			right: 20,
			top: 50,
			icon: "circle",
			itemWidth: 8,
			textStyle: {
				color: "white",
			},
		},
		xAxis: [
			{
				type: "category",
				axisTick: { show: false },
				data: props.chartData.xaxisdate,
				axisLine: {
					//   show: false,
					lineStyle: {
						color: "white",
					},
				},
				splitLine: {
					show: false,
				},
				axisLabel: {
					//   show: false,
					color: "white",
				},
			},
		],
		yAxis: [
			{
				type: "value",
				splitLine: {
					lineStyle: {
						type: "dashed",
					},
				},
			},
		],
		series: [
			{
				name: props.chartData.legendList[0],
				type: "line",
				symbolSize: 8,
				showSymbol: symbol,
				// barGap: 0,
				data: props.chartData.seriesone,
			},
			{
				name: props.chartData.legendList[1],
				symbolSize: 8,
				type: "line",
				showSymbol: symbol,
				data: props.chartData.serietwo,
			},
			{
				name: props.chartData.legendList[2],
				symbolSize: 8,
				type: "line",
				showSymbol: symbol,
				data: props.chartData.seriesthree,
			},
		],
		dataZoom: [props.chartData.dataZoom ? redsd : ""],
		dataZoom: {
		  type: "slider",
		  show: props.chartData.seriesone.length > 0 ? true : false,
		  start: 0,
		  end: props.chartData.seriesone.length > 10 ? 40 : 100,
		  xAxisIndex: [0],
		  bottom: 20,
		  left: 30,
		  realtime: true,
		  height: 10,
		  // maxSpan: 4,
		  borderColor: "#363636",
		  textStyle: {
		    color: "#05D5FF",
		  },
		  backgroundColor: "#424242",
		},
	};
	return option;
});
</script>
<style lang="scss" scoped>
@import url("../css/echarts.css");
</style>
