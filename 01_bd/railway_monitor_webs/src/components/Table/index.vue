<template>
	<div class="table-wrap">
		<el-table :data="tableData" style="width: 100%">
			<el-table-column type="index" label="序号" width="55" align="center" />

			<el-table-column
				v-for="th in columnData"
				:key="th.label"
				:prop="th.prop"
				:label="th.label"
				align="center"
			>
				<template #default="scope">
					<!-- 操作行 -->
					<div v-if="th.operation">
						<el-button
							v-for="oper in th.operation"
							:key="oper.name"
							@click="oper.clickFun(scope.row)"
							type="text"
							>{{ oper.name }}</el-button
						>
					</div>
					<!-- 展示行 -->
					<span v-if="!th.operation && !th.tag">{{ scope.row[th.prop] }}</span>
					<el-tag v-if="th.tag">{{ formatter(scope.row[th.prop]) }}</el-tag>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup>
import { onMounted, ref, reactive, defineProps } from "vue";
const emit = defineEmits();
const props = defineProps({
	columnData: {
		type: Array,
		default: () => [],
	},
	tableData: {
		type: Array,
		default: () => [],
	},
	dictTagData: {
		type: Array,
		default: () => [],
	},
});
onMounted(() => {});
function formatter(val) {
	let data = props.dictTagData.filter((item) => {
		return item.value === val ? item : "";
	});
	return data[0].label;
}
</script>
<style scoped>
.table-wrap {
	/* margin: 20px; */
}
</style>
