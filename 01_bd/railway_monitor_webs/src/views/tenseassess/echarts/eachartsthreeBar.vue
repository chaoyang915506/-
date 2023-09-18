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
	<div class="searchinput">
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
				:label="item.lineName"
				:value="item.id"
			/>
		</el-select>
	</div>
</template>

<script setup>
const emit = defineEmits(["oneechart", "lineChange"]);
const props = defineProps({
	chartData: Object,
});
const changeSelect = (e) => {
	// console.log(e, "red的说法");
	emit("lineChange", e);
};
// let value = ref(props.chartData.lineValue);
let dateTime = ref("1");
function clickTime(val) {
	if (val == 1) {
		emit("oneechart", "year");
	} else if (val == 2) {
		emit("oneechart", "month");
	} else if (val == 3) {
		emit("oneechart", "day");
	}
	emit("getDateTime", val);
	dateTime.value = val;
}
let zoomshow = {
	type: "slider",
	show: props.chartData.seriesone.length > 10 ? true : false,
	start: 0,
	end: props.chartData.seriesone.length > 10 ? 4 : 100,
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
};
// let grid = {
//   left: 10,
//   right: 10,
//   top: 100,
//   bottom: props.chartData.seriesone.length > 10 ? 32 : 10,
//   containLabel: true,
// };
const option = computed(() => {
	const option = {
		color: ["#1c82e0", "#30ac55", "#dcb519"],
		// grid: props.chartData.dataZoom ? grid : props.chartData.gridStyle,
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
		},
		tooltip: {
			trigger: "axis",
			show: true,
			formatter(params) {
				// console.log(params, "参数");
				// 检测点&nbsp;&nbsp;&nbsp;${props.chartData.lineName}<br/>
				return `${params[0].axisValue}<br/>${params[0].marker}${params[0].seriesName}&nbsp;&nbsp;&nbsp;${params[0].data}<br/>${params[1].marker}${params[1].seriesName}&nbsp;&nbsp;&nbsp;${params[1].data}<br/>${params[2].marker}${params[2].seriesName}&nbsp;&nbsp;&nbsp;${params[2].data}<br/>`;
			},
		},
		legend: {
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

				type: "bar",
				barGap: 0,
				barWidth: 15,
				data: props.chartData.seriesone,
				barGap: "20%",
			},
			{
				name: props.chartData.legendList[1],
				type: "bar",
				barWidth: 15,
				barGap: "20%",
				data: props.chartData.seriestwo,
			},
			{
				name: props.chartData.legendList[2],

				barGap: "20%",
				type: "bar",
				barWidth: 15,
				data: props.chartData.seriesthree,
			},
		],
		dataZoom: [props.chartData.dataZoom ? zoomshow : ""],
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
