<template>
  <el-dialog
    title="查看详情"
    v-model="open"
    width="35%"
    :before-close="handleClose"
  >
    <el-form :model="form" label-width="120px">
      <el-form-item label="监测点名称：" prop="monitoringPointName">
        <el-input
          class="check-form-class"
          :readonly="isShowInfoWindow"
          v-model="form.monitoringPointName"
        />
      </el-form-item>
      <el-form-item label="所在路线：" prop="route">
        <el-input
          class="check-form-class"
          :readonly="isShowInfoWindow"
          :value="formatterRoute(form.route)"
        />
      </el-form-item>
      <el-form-item label="监测点等级：" prop="monitoringPointGrade">
        <el-input
          class="check-form-class"
          :readonly="isShowInfoWindow"
          :value="formatterMointerGrade(form.monitoringPointGrade)"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="isShow">
        <el-input
          class="check-form-class"
          :readonly="isShowInfoWindow"
          :value="formatterIsRealease(form.isShow)"
        />
      </el-form-item>
      <el-form-item label="位置：" prop="eventName">
        <div style="color: #c1c1c1">
          <span>经度</span>
          <span style="margin: 0 40px 0 8px">{{
            form.lon ? lonAndLat(form.lon) : ""
          }}</span>
          <span>纬度</span>
          <span style="margin: 0 10px 0 8px">{{
            form.lat ? lonAndLat(form.lat) : ""
          }}</span>
        </div>
      </el-form-item>
      <!-- 分割线 -->
      <div class="diver-line"></div>
      <el-form-item label="图像增强模型" prop="imageEnhanceId">
        <el-select v-model="form.imageEnhanceId" style="width: 100%">
          <el-option
            v-for="item in getModelValue('图像增强模型')"
            :key="item.id"
            :label="item.modelName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="场景分析模型" prop="sceneAnalysisId">
        <el-select v-model="form.sceneAnalysisId" style="width: 100%">
          <el-option
            v-for="item in getModelValue('场景识别')"
            :key="item.id"
            :label="item.modelName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="场景分割模型" prop="sceneDivisionId">
        <el-select v-model="form.sceneDivisionId" style="width: 100%">
          <el-option
            v-for="item in getModelValue('场景分割')"
            :key="item.id"
            :label="item.modelName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="材质识别模型" prop="materialQualityId">
        <el-select v-model="form.materialQualityId" style="width: 100%">
          <el-option
            v-for="item in getModelValue('材质识别')"
            :key="item.id"
            :label="item.modelName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { getMonitorParticulars, insertFailure } from "@/api/display/display.js";
import {
  getMonitorById,
  addinfodata,
} from "@/api/simulationOverview/Overview.js";
import { getModel, editLine } from "@/api/simulation/compManage/monitoring.js";
let props = defineProps({
  isShowInfoWindow: {
    type: Boolean,
    default: false,
  },
  infoWindowData: {
    type: Object,
    default: {},
  },
});
let { proxy } = getCurrentInstance();
const { is_release, gt, monitoring_point_grade, monitoring_route } =
  proxy.useDict("is_release", "monitoring_point_grade", "monitoring_route");
let emit = defineEmits(["handleCloseDialog"]);
let open = ref(false);
let form = ref({});
let modelList = ref([]);
watch(
  () => props.isShowInfoWindow,
  (val) => {
    getCheckData();
    getModelList();
    open.value = val;
  }
);
function getCheckData() {
  getMonitorById(props.infoWindowData.monitorId).then((res) => {
    console.log(res, "res");
    form.value = res.data;
  });
  console.log(props.infoWindowData, "props.infoWindowData");
}
function getModelList() {
  getModel().then((res) => {
    if (res.code === 200 && res.rows.length) modelList.value = res.rows;
  });
}
// 处理经纬度
function lonAndLat(data) {
  let str = data.toString().split(".");
  return str[0] + "°" + (str[1] ? str[1] + "′" : "");
}
// 获取对应算法列表
const getModelValue = (modelName) => {
  let res = modelList.value.filter((item) => {
    if (modelName === item.modelTypeName) return item;
  });
  return res[0] ? res[0].smodel : [];
};
// 确定
const submitForm = () => {
  console.log(form.value);
  editLine(form.value).then((res) => {
    if (res.code == 200) {
      emit("handleCloseDialog", props.infoWindowData.monitorId);
    }
  });
};
const handleClose = () => {
  emit("handleCloseDialog");
};
// 取消
function cancel() {
  emit("handleCloseDialog");
}
// 监测点等级
const formatterMointerGrade = (val) => {
  // riskGrade
  let result = monitoring_point_grade.value.find((item) => item.value == val);
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
// 路线
const formatterRoute = (val) => {
  // riskGrade
  let result = lineIdSelect.value.find((item) => item.lineID == val);
  if (result) {
    return result.lienName;
  } else {
    return "";
  }
};
// 是否发布
const formatterIsRealease = (val) => {
  // riskGrade
  let result = is_release.value.find((item) => item.value == val);
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
let lineIdSelect = ref([]);
addinfodata()
  .then((res) => {
    // console.log(res, "all");
    lineIdSelect.value = makeline(res);
    console.log(lineIdSelect.value, "res");
    // data.monitoringlist = res.data;
  })
  .catch((err) => {
    console.log(err);
  });

function makeline(res) {
  //   console.log(res, "数据");
  if (!res) return [];
  let linedata = [];
  [...new Set(res.data.map((i) => i.lineID).filter((i) => i))].forEach((i) => {
    let resultes = res.data.find((idx) => idx.lineID == i);
    if (resultes) {
      linedata.push(resultes);
    }
  });
  //   console.log(linedata, "线路");
  return linedata;
}
</script>
<style scoped>
.diver-line {
  border-bottom: 1px solid #d6d6d6;
  position: relative;
  margin-bottom: 15px;
}
.diver-line::before {
  content: "模型库";
  color: #058e8a;
  font-size: 18px;
  position: absolute;
  bottom: -8px;
  left: 3%;
  padding: 0 5px;
  background: #363636;
  text-shadow: 1px 1px 4px #058e8a;
}
.check-form-class :deep(.el-input__inner) {
  background: none !important;
  border: none !important;
}
</style>