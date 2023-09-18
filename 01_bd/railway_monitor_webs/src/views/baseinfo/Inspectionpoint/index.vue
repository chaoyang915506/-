<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item prop="searchType">
        <el-select
          v-model="searchType"
          placeholder="请选择搜索类型"
          @change="handleSelect"
        >
          <el-option
            v-for="(item, index) in searchTypeOpt"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="monitoringPointGrade"
        v-if="searchType == 'monitoringPointGrade'"
      >
        <el-select
          v-model="queryParams.monitoringPointGrade"
          placeholder="请选择监测点等级"
          clearable
        >
          <!-- size="small" -->
          <el-option
            v-for="dict in monitoring_point_grade"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="addTime" v-if="searchType == 'addTime'">
        <el-date-picker
          v-model="timePicker"
          type="datetimerange"
          @change="getDate"
          clearable
          class="timeline_css"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 350px"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item prop="route" v-if="searchType == 'route'">
        <el-input
          v-model="queryParams.route"
          placeholder="请输入所在路线"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="monitoringPointName"
        v-if="searchType == 'monitoringPointName'"
      >
        <el-input
          v-model="queryParams.monitoringPointName"
          placeholder="请输入监测点名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn_submit" @click="handleQuery"
          >确定</el-button
        >
        <!-- <el-button
          icon="Refresh"
          type="primary"
          round
          class="common_style"
          @click="resetQuery"
          >重置</el-button
        > -->
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          type="primary"
          round
          class="common_style"
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['system:config:add']"
          >添加监测点</el-button
        >
        <el-button
          type="primary"
          round
          class="common_style"
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:config:remove']"
          >删除</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column
        label="监测点名称"
        align="center"
        prop="monitoringPointName"
      />
      <!-- :formatter="formatterRoute" -->
      <el-table-column label="所在路线" align="center" prop="route" />

      <el-table-column
        label="监测点等级"
        align="center"
        prop="monitoringPointGrade"
        :formatter="formatterGrade"
      />
      <!-- <el-table-column label="岩土类型" align="center" prop="rocksoil" :formatter="formatterGt"/> -->
      <el-table-column label="位置" align="center" width="250">
        <template #default="scope">
          <span v-if="scope.row.lon">E {{ pointToString(scope.row.lon) }}</span>
          <span v-if="scope.row.lat" style="margin-left: 10px"
            >N {{ pointToString(scope.row.lat) }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="设备数" align="center" prop="facilityNumber" />
      <el-table-column label="添加时间" align="center" prop="addTime" />
      <el-table-column label="描述" align="center" prop="monitorDescribe" />
      <el-table-column
        label="操作"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:config:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="View"
            @click="handleCheck(scope.row)"
            v-hasPermi="['system:config:remove']"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 添加或者修改 -->
    <el-dialog :title="title" v-model="open" width="35%" append-to-body>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="110px"
        :class="isCheck ? 'el-form-check' : ''"
      >
        <el-form-item label="监测点名称" prop="monitoringPointName">
          <el-input
            :disabled="isCheck"
            v-model="form.monitoringPointName"
            placeholder="请输入监测点名称"
          />
        </el-form-item>
        <el-form-item label="所在路线" prop="lineId">
          <el-select
            v-model="form.lineId"
            placeholder="请选择所在路线"
            clearable
            :disabled="isCheck"
            style="width: 100%"
            size="small"
          >
            <el-option
              v-for="dict in linelist"
              :key="dict.lineID"
              :label="dict.lienName"
              :value="dict.lineID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="监测点等级" prop="monitoringPointGrade">
          <el-select
            v-model="form.monitoringPointGrade"
            placeholder="请选择监测点等级"
            clearable
            :disabled="isCheck"
            style="width: 100%"
            size="small"
          >
            <el-option
              v-for="dict in monitoring_point_grade"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="场景类型" prop="sceneType">
          <el-select
            v-model="form.sceneType"
            placeholder="请选择场景类型"
            clearable
            :disabled="isCheck"
            style="width: 100%"
            size="small"
          >
            <el-option
              v-for="dict in scene_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="岩土类型" prop="rocksoil">
          <el-select
            v-model="form.rocksoil"
            placeholder="请选择岩土类型"
            clearable
            :disabled="isCheck"
            style="width: 100%"
            size="small"
          >
            <el-option
              v-for="dict in gt"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="位置" v-if="isCheck">
          <div
            style="
              display: flex;
              align-items: center;
              font-size: 14px;
              color: #fff;
            "
            :style="
              isCheck
                ? { paddingLeft: '30px' }
                : { 'justify-content': space - between }
            "
          >
            <div
              style="display: flex; align-items: center; flex-wrap: nowrap"
              v-if="!isCheck"
            >
              <!-- <span style="margin-right: 5px">E</span>
              <el-form-item prop="lonDegree">
                <div style="display: flex">
                  <el-input v-model="form.lonDegree" placeholder="度" /><sup
                    style="font-size: 20px; margin: 0 5px"
                    >°</sup
                  >
                </div>
              </el-form-item>
              <el-form-item prop="lonBranch">
                <div style="display: flex">
                  <el-input v-model="form.lonBranch" placeholder="分" /><sup
                    style="font-size: 20px; margin: 0 5px"
                    >′</sup
                  >
                </div>
              </el-form-item> -->
            </div>
            <div
              v-else
              style="display: flex; align-items: center; flex-wrap: nowrap"
            >
              <span style="margin-right: 5px">E</span>
              <span>{{ form.lonDegree }}</span
              ><sup style="font-size: 20px; margin: 0 5px">°</sup>
              <span>{{ form.lonBranch }}</span
              ><sup style="font-size: 20px; margin: 0 5px">′</sup>
            </div>
            <div
              style="display: flex; align-items: center; margin-left: 10px"
              v-if="!isCheck"
            >
              <!-- <span style="margin-right: 5px">N</span>
              <el-form-item prop="latDegree">
                <div style="display: flex">
                  <el-input v-model="form.latDegree" placeholder="度" /><sup
                    style="font-size: 20px; margin: 0 5px"
                    >°</sup
                  >
                </div>
              </el-form-item>
              <el-form-item prop="latBranch">
                <div style="display: flex">
                  <el-input v-model="form.latBranch" placeholder="分" /><sup
                    style="font-size: 20px; margin: 0 5px"
                    >′</sup
                  >
                </div>
              </el-form-item> -->
            </div>
            <div
              v-else
              style="
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
                margin-left: 25px;
              "
            >
              <span style="margin-right: 5px">N</span>
              <span>{{ form.latDegree }}</span
              ><sup style="font-size: 20px; margin: 0 5px">°</sup>
              <span>{{ form.latBranch }}</span
              ><sup style="font-size: 20px; margin: 0 5px">′</sup>
            </div>
          </div>
        </el-form-item>

        <!-- 经度 -->
        <el-form-item label="经度" class="lonlat" v-if="!isCheck">
          <span style="margin-right: 5px">E</span>
          <el-form-item prop="lonDegree">
            <div style="display: flex">
              <el-input v-model="form.lonDegree" placeholder="度" /><sup
                style="font-size: 20px; margin: 0 5px"
                >°</sup
              >
            </div>
          </el-form-item>
          <el-form-item prop="lonBranch">
            <div style="display: flex">
              <el-input v-model="form.lonBranch" placeholder="分" /><sup
                style="font-size: 20px; margin: 0 5px"
                >′</sup
              >
            </div>
          </el-form-item>
        </el-form-item>
        <!-- 纬度 -->
        <el-form-item label="纬度" class="lonlat" v-if="!isCheck">
          <span style="margin-right: 5px">N</span>

          <el-form-item prop="latDegree">
            <div style="display: flex">
              <el-input v-model="form.latDegree" placeholder="度" /><sup
                style="font-size: 20px; margin: 0 5px"
                >°</sup
              >
            </div>
          </el-form-item>
          <el-form-item prop="latBranch">
            <div style="display: flex">
              <el-input v-model="form.latBranch" placeholder="分" /><sup
                style="font-size: 20px; margin: 0 5px"
                >′</sup
              >
            </div>
          </el-form-item>
        </el-form-item>
        <el-form-item label="添加时间" prop="addTime">
          <el-date-picker
            v-model="form.addTime"
            type="datetime"
            clearable
            :disabled="isCheck"
            value-format="YYYY-MM-DD hh:mm:ss"
            style="width: 100%"
            size="small"
            placeholder="请选择日期"
          />
        </el-form-item>
        <el-form-item label="流域面积" prop="wa">
          <el-input
            :disabled="isCheck"
            v-model="form.wa"
            placeholder="请输入流域面积"
            style="width: 90%"
          /><span style="color: #fff"> km²</span>
        </el-form-item>
        <el-form-item label="松散物质储量" prop="lmsc">
          <el-input
            :disabled="isCheck"
            v-model="form.lmsc"
            placeholder="请输入松散物质储量"
            style="width: 90%"
          /><span style="color: #fff"> m³</span>
        </el-form-item>
        <el-form-item label="平均坡度" prop="aves">
          <el-input
            :disabled="isCheck"
            v-model="form.aves"
            placeholder="请输入平均坡度"
            style="width: 90%"
          /><span style="color: #fff"> °</span>
        </el-form-item>
        <el-form-item label="植物覆盖率" prop="pc">
          <el-input
            :disabled="isCheck"
            v-model="form.pc"
            placeholder="请输入植物覆盖率"
            style="width: 90%"
          /><span style="color: #fff"> ％</span>
        </el-form-item>
        <el-form-item label="描述" prop="monitorDescribe">
          <el-input
            type="textarea"
            :disabled="isCheck"
            v-model="form.monitorDescribe"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
      <template #footer v-if="!isCheck">
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import {
  getMonitor,
  addMonitor,
  updateMonitor,
  delMonitor,
  getMonitorById,
  addinfodata,
} from "@/api/baseinfo/Inspectionpoint.js";
const { proxy } = getCurrentInstance();
const {
  monitoring_point_grade,
  monitoring_route,
  gt,
  monitoring_scene,
  scene_type,
} = proxy.useDict(
  "monitoring_point_grade",
  "monitoring_route",
  "gt",
  "monitoring_scene",
  "scene_type"
);

const tableData = ref([]);
const open = ref(false);
const isCheck = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
//日期选择器
const getDate = (e) => {
  if (!e) {
    data.queryParams.beginTime = "";
    data.queryParams.endTime = "";
  } else {
    data.queryParams.beginTime = e[0];
    data.queryParams.endTime = e[1];
  }
};
const searchTypeOpt = ref([
  {
    label: "按添加时间",
    value: "addTime",
  },
  {
    label: "按监测点等级",
    value: "monitoringPointGrade",
  },
  {
    label: "按路线",
    value: "route",
  },
  {
    label: "按名称",
    value: "monitoringPointName",
  },
]);

const data = reactive({
  timePicker: [],
  linelist: [],
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    monitoringPointGrade: undefined,
    addTime: [],
    route: undefined,
    monitoringPointName: undefined,
  },
  searchType: "monitoringPointGrade",
  rules: {
    monitoringPointName: [
      { required: true, message: "监测点名称不能为空", trigger: "blur" },
    ],
    sceneType: [
      { required: true, message: "场景类型不能为空", trigger: "blur" },
    ],
    lmsc: [
      { required: true, message: "松散物质储量不能为空", trigger: "blur" },
      { pattern: /^[0-9]*$/, message: "请输入数字", trigger: "blur" },
    ],
    aves: [
      { required: true, message: "平均坡度不能为空", trigger: "blur" },
      {
        pattern: /^(([0-9]|[1-8][0-9])(\.[0-9]+)?|90)$/,
        message: "请输入 0°-90° 坡度",
        trigger: "blur",
      },
    ],
    pc: [
      {
        whitespace: true,
        type: "number",
        transform(value) {
          if (value) {
            return Number(value);
          }
        },
        message: "请输入数字",
      },
      {
        type: "number",
        min: 0,
        max: 100,
        message: "请输入0%-100%",
        trigger: "blur",
      },
      { required: true, message: "植物覆盖率不能为空", trigger: "blur" },
    ],
    wa: [
      { required: true, message: "流域面积不能为空", trigger: "blur" },
      { pattern: /^[0-9]*$/, message: "请输入数字", trigger: "blur" },
    ],
    rocksoil: [
      { required: true, message: "岩土类型不能为空", trigger: "change" },
    ],
    lineId: [{ required: true, message: "所在路线不能为空", trigger: "blur" }],
    monitoringPointGrade: [
      { required: true, message: "监测点等级不能为空", trigger: "change" },
    ],
    addTime: [
      { required: true, message: "添加时间不能为空", trigger: "change" },
    ],
    lonDegree: [
      { required: true, message: "请输入度", trigger: "blur" },
      {
        pattern: /^((-|\+)?[1]?[0-7][0-9]?|(-180)|180|(-|\+)?[0-9][0-9]?)$/,
        message: "输入-180到180的整数",
        trigger: "blur",
      },
    ],
    lonBranch: [
      { required: true, message: "请输入分", trigger: "blur" },
      { pattern: /^\d{1,6}$/, message: "不能超过6位数", trigger: "blur" },
    ],
    latDegree: [
      { required: true, message: "请输入度", trigger: "blur" },
      {
        pattern: /^((-|\+)?[1]?[0-7][0-9]?|(-90)|90|(-|\+)?[0-9][0-9]?)$/,
        message: "输入-90到90的整数",
        trigger: "blur",
      },
    ],
    latBranch: [
      { required: true, message: "请输入分", trigger: "blur" },
      { pattern: /^\d{1,6}$/, message: "不能超过6位数", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules, searchType, timePicker, linelist } =
  toRefs(data);
// 初始化数据
const getList = async () => {
  loading.value = true;
  if (queryParams.value.addTime && queryParams.value.addTime.length) {
    queryParams.value.beginTime = queryParams.value.addTime[0];
    queryParams.value.endTime = queryParams.value.addTime[1];
  }
  let parmas = queryParams.value;
  // delete parmas.addTime;
  // data.searchType = "";
  // console.log(parmas, "参数");
  let res = await getMonitor(parmas);
  if (res.code == 200) {
    // console.log(res.rows, "leib");
    tableData.value = res.rows;
    total.value = res.total;
    loading.value = false;
  }
};
// 添加检测点getDataById
const handleAdd = () => {
  reset();
  open.value = true;
  isCheck.value = false;
  title.value = "添加监测点";
};
// 删除检测点
const handleDelete = () => {
  proxy.$modal
    .confirm("是否确认删除选中的数据项？")
    .then(function () {
      return delMonitor(ids.value.join(","));
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
};
// 根据id查询数据
const getDataById = async (id) => {
  let res = await getMonitorById(id);
  if (res.code == 200) {
    form.value = res.data;
    let tempLon = res.data.lon.toString().split(".");
    form.value.lonDegree = tempLon[0];
    form.value.lonBranch = tempLon[1];
    let tempLat = res.data.lat.toString().split(".");
    form.value.latDegree = tempLat[0];
    form.value.latBranch = tempLat[1];
    form.value.rocksoil = res.data.rocksoil.toString();
  }
};
// 修改检测点
const handleUpdate = (row) => {
  reset();
  getDataById(row.id);
  open.value = true;
  isCheck.value = false;
  title.value = "修改监测点";
};
// 查看检测点
const handleCheck = (row) => {
  reset();
  getDataById(row.id);
  open.value = true;
  isCheck.value = true;
  title.value = "查看检测点";
};
// 提交信息
const submitForm = () => {
  proxy.$refs["formRef"].validate(async (valid) => {
    if (valid) {
      form.value.lon = form.value.lonDegree + "." + form.value.lonBranch;
      form.value.lat = form.value.latDegree + "." + form.value.latBranch;
      // console.log(form.value);
      if (form.value.id) {
        // 修改
        let res = await updateMonitor(form.value);
        if (res.code == 200) {
          getList();
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
        }
      } else {
        // 新增
        let res = await addMonitor(form.value);
        if (res.code == 200) {
          getList();
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
        }
      }
    }
  });
};
// 取消提交
const cancel = () => {
  open.value = false;
  reset();
};
/** 表单重置 */
function reset() {
  form.value = {
    monitoringPointName: undefined, // 检测点名称
    route: undefined, // 所在路线
    rocksoil: undefined, // 岩土类型
    monitoringPointGrade: undefined, // 检测点等级
    addTime: undefined, // 添加时间
    monitorDescribe: "", // 描述
    lon: undefined, // 经度
    lat: undefined, // 纬度
    lonDegree: undefined,
    lonBranch: undefined,
    latDegree: undefined,
    latBranch: undefined,
    lineId: undefined,
  };
  proxy.resetForm("formRef");
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  data.queryParams = {
    pageNum: 1,
    pageSize: 10,
    monitoringPointGrade: undefined,
    addTime: [],
    route: undefined,
    monitoringPointName: undefined,
  };
  proxy.resetForm("queryRef");
  handleQuery();
}
const handleSelect = () => {
  queryParams.value.monitoringPointGrade = undefined;
  queryParams.value.addTime = [];
  queryParams.value.route = undefined;
  queryParams.value.monitoringPointName = undefined;
};
// 格式化列表
const formatterRoute = (row, column, columnIndex) => {
  let result = monitoring_route.value.find((item) => item.value == columnIndex);
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
const formatterGrade = (row, column, columnIndex) => {
  let result = monitoring_point_grade.value.find(
    (item) => item.value == columnIndex
  );
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
const pointToString = (val) => {
  let str = val.toString();
  let result = str.split(".");
  // console.log(result[0], "--", result[1] ? result[1] : "啥事");
  let resultwto = result[1] ? result[1] : " ";
  return result[0] + "°" + resultwto + "′";
};
//获取全部路线
addinfodata().then((res) => {
  // console.log(res, "检测点");
  data.linelist = [...new Set(res.data.map((i) => i.lineID))]
    .filter((i) => i)
    .map((i) => {
      let dd = res.data.find((idx) => idx.lineID == i);
      return dd;
    });

  // console.log(data.linelist, "处理后");
});
getList();
</script>
<style scoped>
:deep(.lonlat .el-form-item__content) {
  display: flex;
  color: #fff;
}
</style>