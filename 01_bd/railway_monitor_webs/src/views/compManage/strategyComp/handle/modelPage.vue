<template>
	<div>
		<!-- 场景分类 -->
		<reusePage
			:tableData="data.dataList"
			:weatherData="data.weatherData"
			@handleQuery="handleQuery"
			@handlePage="handlePage"
			:total="data.total"
		></reusePage>
	</div>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import {
	getModelList,
	getModelCount,
} from "@/api/simulation/compManage/strategy/imgEnhance.js";
import reusePage from "./reusePage.vue";
const data = reactive({
	queryParams: {
		pageNum: 1,
		pageSize: 10,
		modelType: 2,
		modelName: "",
	},
	total: 0,
	dataList: [],
	weatherData: [],
});
const props = defineProps({
	modelType: {
		type: Number,
		default: null,
	},
});
onBeforeUpdate(() => {
	data.queryParams.modelType = props.modelType;
});
watch(
	() => data.queryParams.modelType,
	() => {
		getList();
	}
);
onMounted(() => {
	getList();
});
const getList = () => {
	console.log(data.queryParams.modelType)
	getModelList(data.queryParams).then((res) => {
		data.dataList = res.rows;
		data.total = res.total;
	});
	getModelCount({ modelType: data.queryParams.modelType }).then((res) => {
		data.weatherData = plusfn(res);
	});
};
// 搜索
function handleQuery(row) {
	data.queryParams.modelName = row;
	data.queryParams.pageNum = 10;
	data.queryParams.pageSize = 10;
	console.log(data.queryParams.name);
	getList();
}
// 分页
function handlePage(row) {
	data.queryParams.pageNum = row.page;
	data.queryParams.pageSize = row.pageSize;
	getList();
}
// 算法统计
function plusfn(res) {
	let arr = [];
	res.data.map((item) => {
		arr.push({ name: item.algName, count: item.count });
	});
	arr.unshift({ name: "全部", count: eval(arr.map((i) => i.count).join("+")) });
	return arr;
}
</script>
<style scoped></style>
