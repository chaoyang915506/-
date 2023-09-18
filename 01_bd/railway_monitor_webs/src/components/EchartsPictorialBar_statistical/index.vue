<template>
	<echarts
		:option="option"
		ref="echart"
		autoresize
		:update-options="{ notMerge: true }"
	></echarts>
</template>

<script setup>
const props = defineProps({
	echartData: Object,
});

const option = computed(() => {
	const option = {
		title: {
      top: 7,
			text: "恶劣天气综合风险预测分析",
			textStyle: {
				color: "#b7b7af",
				fontSize: 16,
				fontWeight: 300,
			},
		},
		legend: {
			top: 5,
			right:10,
			icon: "circle",
			itemWidth: 9,

			textStyle: {
				color: "white",
			},
		},
		tooltip: {},
		dataset: {
			dimensions: ["sevweather", "历史数据", "预测数据"],
			source: props.echartData,
		},
		xAxis: {
			type: "category",
			axisLabel: {
				color: "rgba(255,255,255,.6) ",
				fontSize: "12",
			},
			axisLabel: {
				//   show: false,
				color: "white",
			},
		},
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
				type: "bar",
			},
			{ type: "bar" },
		],
    dataZoom: {
      type: "slider",
      show:  true ,
      start: 0,
      end: 70,
      xAxisIndex: [0],
      bottom: 22,
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
