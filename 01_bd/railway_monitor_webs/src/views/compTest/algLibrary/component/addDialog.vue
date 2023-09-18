<template>
	<el-divider content-position="left" class="defined-divider"
		>输入参数</el-divider
	>
	<el-form :model="form" ref="formRef" :rules="rules" label-width="110px">
		<el-row>
			<el-col :span="name == '训练' ? 24 : 12">
				<el-form-item
					label="算法类型"
					prop="algorithmType"
					v-if="name !== '训练'"
				>
					<el-select
						v-model="form.algorithmType"
						filterable
						placeholder="请选择算法类型"
						style="width: 100%"
					>
						<el-option
							v-for="item in algorithm_type_code"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="算法名称" prop="algorithmName">
					<el-input
						v-model="form.algorithmName"
						placeholder="请输入算法名称"
					></el-input>
				</el-form-item>
				<el-form-item label="版本号" prop="algorithmVersion">
					<el-input
						v-model="form.algorithmVersion"
						placeholder="请输入版本号"
					></el-input>
				</el-form-item>
				<el-form-item label="模型名称" prop="modelName">
					<el-input
						v-model="form.modelName"
						placeholder="请输入模型名称"
					></el-input>
				</el-form-item>
				<el-form-item label="模型编号" prop="modelCode">
					<el-input
						v-model="form.modelCode"
						placeholder="请输入模型编号"
					></el-input>
				</el-form-item>
				<el-form-item label="适用场景" prop="applicationScenario">
					<el-select
						clearable
						v-model="form.applicationScenario"
						filterable
						placeholder="请选择适用场景"
						style="width: 100%"
					>
						<el-option
							v-for="item in alg_type"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="训练轮数" prop="numEpochs" v-if="name !== '训练'">
					<el-input
						v-model="form.numEpochs"
						placeholder="请输入训练轮数"
					></el-input>
				</el-form-item>
				<el-form-item label="学习率" prop="lr" v-if="name !== '训练'">
					<el-input v-model="form.lr" placeholder="请输入学习率"></el-input>
				</el-form-item>
				<!-- <el-form-item label="数据批量大小" prop="sceneSetName">
          <el-input v-model="form.modelCode" placeholder="请输入训练轮数"></el-input>
        </el-form-item> -->
				<el-form-item
					label="数据集根路径"
					prop="imagesPath"
					v-if="name !== '训练'"
				>
					<el-input
						v-model="form.imagesPath"
						placeholder="请输入数据集根路径"
					></el-input>
				</el-form-item>
				<el-form-item label="	模型输出路径" prop="snapshotsFolder" v-else>
					<el-input
						v-model="form.snapshotsFolder"
						placeholder="请输入数据集根路径"
					></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="descs">
					<el-input
						v-model="form.descs"
						type="textarea"
						placeholder="请输入描述"
					></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" v-if="form.algorithmType == '0' && name !== '训练'">
				<el-form-item
					label="weight_decay"
					prop="weightDecay"
					label-width="140px"
				>
					<el-input
						v-model="form.weightDecay"
						placeholder="请输入weight_decay"
					></el-input>
				</el-form-item>
				<el-form-item
					label="grad_clip_norm"
					prop="gradClipNorm"
					label-width="140px"
				>
					<el-input
						v-model="form.gradClipNorm"
						placeholder="请输入grad_clip_norm"
					></el-input>
				</el-form-item>
				<el-form-item
					label="train_batch_size"
					prop="trainBatchSize"
					label-width="140px"
				>
					<el-input
						v-model="form.trainBatchSize"
						placeholder="请输入train_batch_size"
					></el-input>
				</el-form-item>
				<el-form-item
					label="val_batch_size"
					prop="valBatchSize"
					label-width="140px"
				>
					<el-input
						v-model="form.valBatchSize"
						placeholder="请输入val_batch_size"
					></el-input>
				</el-form-item>
				<el-form-item label="num_workers" prop="numWorkers" label-width="140px">
					<el-input
						v-model="form.numWorkers"
						placeholder="请输入num_workers"
					></el-input>
				</el-form-item>
				<el-form-item
					label="display_iter"
					prop="displayIter"
					label-width="140px"
				>
					<el-input
						v-model="form.displayIter"
						placeholder="请输入display_iter"
					></el-input>
				</el-form-item>
				<el-form-item
					label="snapshot_iter"
					prop="snapshotIter"
					label-width="140px"
				>
					<el-input
						v-model="form.snapshotIter"
						placeholder="请输入snapshot_iter"
					></el-input>
				</el-form-item>
				<el-form-item
					label="snapshots_folder"
					prop="snapshotsFolder"
					label-width="140px"
				>
					<el-input
						v-model="form.snapshotsFolder"
						placeholder="请输入snapshots_folder"
					></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" v-if="form.algorithmType == '1' && name !== '训练'">
				<el-form-item label="batch_size" prop="batchSize" label-width="140px">
					<el-input
						v-model="form.batchSize"
						placeholder="请输入batch_size"
					></el-input>
				</el-form-item>
				<el-form-item label="alpha" prop="alpha" label-width="140px">
					<el-input v-model="form.alpha" placeholder="请输入alpha"></el-input>
				</el-form-item>
				<el-form-item label="ACC_level" prop="accLevel" label-width="140px">
					<el-input
						v-model="form.accLevel"
						placeholder="请输入ACC_level"
					></el-input>
				</el-form-item>
				<el-form-item
					label="snapshots_folder"
					prop="snapshotsFolder"
					label-width="140px"
				>
					<el-input
						v-model="form.snapshotsFolder"
						placeholder="请输入snapshots_folder"
					></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" v-if="form.algorithmType == '2' && name !== '训练'">
				<el-form-item label="batch_size" prop="batchSize" label-width="140px">
					<el-input
						v-model="form.batchSize"
						placeholder="请输入batch_size"
					></el-input>
				</el-form-item>
				<el-form-item
					label="val_batch_size"
					prop="valBatchSize"
					label-width="140px"
				>
					<el-input
						v-model="form.valBatchSize"
						placeholder="请输入val_batch_size"
					></el-input>
				</el-form-item>
				<el-form-item
					label="iou_threshold"
					prop="iouThreshold"
					label-width="140px"
				>
					<el-input
						v-model="form.iouThreshold"
						placeholder="请输入iou_threshold"
					></el-input>
				</el-form-item>
				<el-form-item label="max_score" prop="maxScore" label-width="140px">
					<el-input
						v-model="form.maxScore"
						placeholder="请输入max_score"
					></el-input>
				</el-form-item>
				<el-form-item
					label="snapshots_folder"
					prop="snapshotsFolder"
					label-width="140px"
				>
					<el-input
						v-model="form.snapshotsFolder"
						placeholder="请输入snapshots_folder"
					></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" v-if="form.algorithmType == '3' && name !== '训练'">
				<el-form-item label="batch_size" prop="batchSize" label-width="140px">
					<el-input
						v-model="form.batchSize"
						placeholder="请输入batch_size"
					></el-input>
				</el-form-item>
				<el-form-item label="alpha" prop="alpha" label-width="140px">
					<el-input v-model="form.alpha" placeholder="请输入alpha"></el-input>
				</el-form-item>
				<el-form-item label="ACC_level" prop="accLevel" label-width="140px">
					<el-input
						v-model="form.accLevel"
						placeholder="请输入ACC_level"
					></el-input>
				</el-form-item>
				<el-form-item
					label="snapshots_folder"
					prop="snapshotsFolder"
					label-width="140px"
				>
					<el-input
						v-model="form.snapshotsFolder"
						placeholder="请输入snapshots_folder"
					></el-input>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
	<div style="text-align: center">
		<el-button
			size="small"
			type="primary"
			style="width: 70px"
			@click="handleClickStart"
			>执 行</el-button
		>
		<el-button size="small" style="width: 70px" @click="cancel"
			>取 消</el-button
		>
	</div>
	<el-divider content-position="left" class="defined-divider" v-if="isShow"
		>模型研判</el-divider
	>
	<div
		style="display: flex; margin-bottom: 30px; flex-wrap: wrap"
		v-if="isShow"
	>
		<fzStudyModel
			:chartData="item"
			v-for="(item, index) in chartDataArr"
			:key="index"
			:echartsIndex="index"
			v-show="item.xData && item.xData.length"
			:id="'echart' + index"
			style="width: 33%; margin: 10px 0; height: 220px"
		></fzStudyModel>
	</div>
	<!-- 进度条 -->
	<el-progress
		v-if="isShowProgress"
		style="margin-top: 20px"
		:text-inside="true"
		class="defined-progress"
		:stroke-width="15"
		color="#058E8A"
		:percentage="percentage"
	/>
	<div
		v-if="isShow"
		style="
			color: #3feace;
			font-size: 16px;
			font-weight: bold;
			text-align: right;
			margin: 20px 0;
			cursor: pointer;
		"
		@click="handleExport"
	>
		训练曲线图表下载至本地
	</div>
	<div style="text-align: center" v-if="isShow">
		<el-button size="small" type="primary" style="width: 70px" @click="finshBtn"
			>结 束</el-button
		>
	</div>
</template>
<script setup>
import fzStudyModel from "@/components/echarts/fzStudyModel.vue";
import WebSocketClass from "@/utils/webSocket.js";
import { addData, exportPlan, train } from "@/api/algLibrary/algLibrary.js";
import { watch } from "@vue/runtime-core";

const { proxy } = getCurrentInstance();
const { algorithm_type_code } = proxy.useDict("algorithm_type_code");
let props = defineProps({
	open: {
		type: Boolean,
		default: false,
	},
	alg_type: {
		type: Array,
		default: [],
	},
	title: {
		type: String,
		default: null,
	},
	trainingList: {
		type: Object,
		default: {},
	},
});
let emit = defineEmits(["closeDialog"]);
let chartDataArr = ref([]);
let socket = ref(null);
let socketId = ref(undefined);
let percentage = ref(undefined);
let isShow = ref(false);
let isShowProgress = ref(false);
let name = ref("训练");
const state = reactive({
	form: {},
	rules: {
		algorithmType: [
			{ required: true, message: "请输入算法类型", trigger: "change" },
		],
		algorithmName: [
			{ required: true, message: "请输入算法名称", trigger: "blur" },
		],
		algorithmVersion: [
			{ required: true, message: "请输入算法类型", trigger: "blur" },
		],
		modelName: [{ required: true, message: "请输入模型名称", trigger: "blur" }],
		modelCode: [{ required: true, message: "请输入模型编号", trigger: "blur" }],
		applicationScenario: [
			{ required: true, message: "请选择适用场景", trigger: "change" },
		],
		numEpochs: [{ required: true, message: "请输入训练轮数", trigger: "blur" }],
		lr: [{ required: true, message: "请输入学习率", trigger: "blur" }],
		imagesPath: [
			{ required: true, message: "请输入数据集根路径", trigger: "blur" },
		],
		batchSize: [
			{ required: true, message: "请输入batchSize", trigger: "blur" },
		],
		alpha: [{ required: true, message: "请输入alpha", trigger: "blur" }],
		accLevel: [{ required: true, message: "请输入accLevel", trigger: "blur" }],
		snapshotsFolder: [
			{ required: true, message: "请输入snapshotsFolder", trigger: "blur" },
		],
		weightDecay: [
			{ required: true, message: "请输入weightDecay", trigger: "blur" },
		],
		gradClipNorm: [
			{ required: true, message: "请输入gradClipNorm", trigger: "blur" },
		],
		trainBatchSize: [
			{ required: true, message: "请输入trainBatchSize", trigger: "blur" },
		],
		valBatchSize: [
			{ required: true, message: "请输入valBatchSize", trigger: "blur" },
		],
		numWorkers: [
			{ required: true, message: "请输入numWorkers", trigger: "blur" },
		],
		displayIter: [
			{ required: true, message: "请输入displayIter", trigger: "blur" },
		],
		snapshotIter: [
			{ required: true, message: "请输入snapshotIter", trigger: "blur" },
		],
		iouThreshold: [
			{ required: true, message: "请输入iouThreshold", trigger: "blur" },
		],
		maxScore: [{ required: true, message: "请输入maxScore", trigger: "blur" }],
	},
});
reset();
watch(
	() => props.trainingList,
	(val) => {
		state.form = val;
		console.log(val);
	}
);
watch(
	() => props.open,
	(val) => {
		if (val) {
			reset();
		} else {
			if (socket.value) {
				// socket.value.closeMyself()
			}
		}
	}
);
watch(
	() => props.title,
	(val) => {
		name.value = val;
	},
	{ immediate: true }
);
// 开启socket
function startSocket() {
	isShowProgress.value = true;
	socket.value = new WebSocketClass(websocketCallReceive, socketId.value);
	socket.value.connect();
}
// 获取执行进度
const websocketCallReceive = (data) => {
	if (data != "连接成功") {
		percentage.value = data;
	}
};
// 执行
function handleClickStart() {
	proxy.$refs["formRef"].validate(async (valid) => {
		if (valid) {
			startSocket();
			let res;
			let result = algorithm_type_code.value.find(
				(item) => item.value == state.form.algorithmType
			);
			if (result) {
				state.form.algorithmTypeCode = result.value;
			}
			if (name.value == "训练") {
				state.form.socketId = socketId.value;
				res = await train(state.form);
			} else {
				res = await addData(state.form);
			}

			if (res.code == 200) {
				let data = res.data;
				if (data.loss) {
					for (let key in data.loss) {
						let xData = [];
						if (data.loss[key].dataSeq && data.loss[key].dataSeq.length) {
							data.loss[key].dataSeq.map((item, index) => {
								if (item != null) {
									xData.push(index + 1);
								}
							});
						}
						let chartObj = {
							title: key,
							gridTop: 40,
							isMmooth: true,
							isYAxisLabel: true,
							XLabel: data.loss[key].X_label,
							YLabel: data.loss[key].Y_label,
							xData: xData,
							yData: data.loss[key].dataSeq,
						};
						chartDataArr.value.push(chartObj);
					}
				}
				isShow.value = true;
			}
		}
	});
}
async function handleExport() {
	// proxy.download(
	//   "/simulation/algorithm/export",
	//   `config_${new Date().getTime()}.xlsx`
	// );
	let res = await exportPlan();
	let blob = new Blob([res]);
	let url = window.URL.createObjectURL(blob);
	let donloadElement = document.createElement("a");
	donloadElement.style.display = "none";
	donloadElement.href = url;
	donloadElement.download = `训练曲线.xlsx`;
	document.body.appendChild(donloadElement);
	donloadElement.click();
	document.body.removeChild(donloadElement);
	window.URL.revokeObjectURL(url);
}
function cancel() {
	// emit("1");
	emit("closeDialog");
}
function finshBtn() {
	emit("closeDialog");
}
//  重置
function reset() {
	chartDataArr.value = [];
	socketId.value = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
	state.form = {
		algorithmTypeCode: undefined,
		algorithmType: "0",
		algorithmName: undefined,
		modelName: undefined,
		modelCode: undefined,
		applicationScenario: undefined,
		numEpochs: undefined,
		lr: undefined,
		imagesPath: undefined,
		descs: undefined,
		socketId: socketId.value,
		batchSize: undefined,
		alpha: undefined,
		accLevel: undefined,
		snapshotsFolder: undefined,
		weightDecay: undefined,
		gradClipNorm: undefined,
		trainBatchSize: undefined,
		valBatchSize: undefined,
		numWorkers: undefined,
		displayIter: undefined,
		snapshotIter: undefined,
		iouThreshold: undefined,
		maxScore: undefined,
	};
	proxy.resetForm("formRef");
}
const { form, rules } = toRefs(state);
</script>
<style scoped>
.defined-divider :deep(.el-divider__text) {
	color: #058e8a !important;
	background: #363636 !important;
	font-size: 20px;
	padding: 0 10px;
}

.defined-progress :deep(.el-progress-bar__outer) {
	background: #7f7f7f !important;
	overflow: inherit !important;
}

.defined-progress :deep(.el-progress-bar__innerText) {
	position: absolute !important;
	top: -20px !important;
}
</style>
