<template>
	<el-form
		:model="formData"
		:rules="rules"
		ref="formDataRef"
		label-width="120px"
		v-loading="loading"
		element-loading-text="Loading..."
		:class="isCheck ? 'el-form-check' : ''"
	>
		<el-row>
			<el-col :span="12">
				<el-form-item label="算法名称" prop="algorithmName"><el-input
						v-model="formData.algorithmName"
						:disabled="isCheck"
					></el-input>
				</el-form-item>
				<el-form-item label="适用场景" prop="applicationScenario">
					<el-select
						clearable
						v-model="formData.applicationScenario"
						filterable
						:disabled="isCheck"
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
				<el-form-item label="版本号" prop="algorithmVersion">
					<span>{{ formData.algorithmVersion }}</span>
					<!-- <el-input v-model="formData.algorithmVersion" :disabled="isCheck"></el-input> -->
				</el-form-item>
				<el-form-item label="算法排名" prop="rownum">
					<span>{{ formData.rownum }}</span>
					<!-- <el-input v-model="formData.algorithmSort" :disabled="isCheck"></el-input> -->
				</el-form-item>
				<el-form-item
					label="峰值信噪比"
					prop="rsnr"
					v-if="activeMeunItem == '1'"
				>
					<span>{{ formData.rsnr }}</span>
					<!-- <el-input v-model="formData.rsnr" :disabled="isCheck"></el-input> -->
				</el-form-item>
				<el-form-item
					label="结构相似度"
					prop="ssim"
					v-if="activeMeunItem == '1'"
				>
					<span>{{ formData.ssim }}</span>
					<!-- <el-input v-model="formData.ssim" :disabled="isCheck"></el-input> -->
				</el-form-item>
				<el-form-item
					label="识别准确度"
					prop="acc"
					v-if="activeMeunItem == '3' || activeMeunItem == '2'"
				>
					<span>{{ formData.acc }}</span>
					<!-- <el-input v-model="formData.accLevel" :disabled="isCheck"></el-input> -->
				</el-form-item>
				<el-form-item label="描述">
					<el-input
						v-model="formData.descs"
						type="textarea"
						:disabled="isCheck"
					></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" class="img-content">
				<div class="img-class">
						<!-- :src="formData.imagePr" -->
					<el-image
						style="width: 100%; height: 100%"
						 :src="'data:image/png;base64,'+formData.imagePr"
						fit="fill"
						:lazy="true"
					></el-image>
				</div>
				<div class="img-class" style="position: relative">
					<div
						style="
							background: rgba(255, 255, 255, 0.4);
							position: absolute;
							width: 100%;
							height: 100%;
							z-index: 10;
						"
						v-if="formData.imageAf"
					></div>
					<el-image
						style="width: 100%; height: 100%"
						 :src="'data:image/png;base64,'+formData.imageAf"
						fit="fill"
						:lazy="true"
					></el-image>
				</div>
				<div class="info">算法使用前后对比图</div>
			</el-col>
		</el-row>
	</el-form>
	<div style="text-align: center" v-if="!isCheck">
		<el-button type="primary" @click="submitForm">确 定</el-button>
		<el-button @click="cancel">取 消</el-button>
	</div>
</template>
<script setup>
import { findPic } from "../js/fomatter";
import { getById, updateData } from "@/api/algLibrary/algLibrary.js";
const { proxy } = getCurrentInstance();
let emit = defineEmits("closeDialog");
let props = defineProps({
	isCheck: {
		type: Boolean,
		default: false,
	},
	activeMeunItem: {
		type: String,
		default: "",
	},
	rowId: {
		type: Number,
		default: undefined,
	},
	alg_type: {
		type: Array,
		default: [],
	},
});
const state = reactive({
	formData: {},
	loading: false,
	rules: {
		algorithmName: [
			{ required: true, message: "请输入算法名称", trigger: "blur" },
		],
		applicationScenario: [
			{ required: true, message: "请选择适用场景", trigger: "change" },
		],
	},
});
watch(
	() => props.rowId,
	(val) => {
		state.formData = {};
		proxy.resetForm("formDataRef");
		if (val) {
			getInfoByid(val);
		}
	}
);
const loadingDialog = ref(false);
onMounted(() => {
	getInfoByid(props.rowId);
});
async function submitForm() {
	proxy.$refs["formDataRef"].validate(async (valid) => {
		if (valid) {
			let res = await updateData(state.formData);
			if (res.code == 200) {
				emit("closeDialog");
			}
		}
	});
}
function cancel() {
	emit("closeDialog");
}
// 获取算法信息
const getInfoByid = async (id) => {
	state.loading = true;
	let res = await getById(id);
	if (res.code == 200) {
		let itemd = res.data;
		state.formData = {
			...itemd,
			beforeImage: itemd.files ? findPic(itemd.files, 0) : "",
			afterImage: itemd.files ? findPic(itemd.files, 1) : "",
		};
		state.loading = false;
	}
};

const { formData, rules, loading } = toRefs(state);
</script>
<style scoped>
.img-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #ddd;
}
.img-class {
	width: 250px;
	height: 200px;
}
.img-class:nth-child(1),
.img-class:nth-child(2) {
	margin-bottom: 10px;
}
::v-deep .el-form-item__content span {
	margin-left: 32px;
	color: white;
}
</style>
