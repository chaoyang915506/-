<template>
  <div class="app-container">
    <!-- echarts -->
    <div class="elcard_display">
      <echarts-pictorial-bar
        class="box_plane"
        :xAxisData="WeatherDisaster.name"
        :seriesData="WeatherDisaster.count"
        title="气象灾害数量统计"
      ></echarts-pictorial-bar>
      <echart-bar
        class="box_plane"
        :xAxisData="deviceData.deviceName"
        :seriesData="deviceData.devicCount"
      ></echart-bar>
    </div>
    <!-- 搜索栏 -->
    <el-form
      :model="queryParams"
      label-width="80px"
      :inline="true"
      size="normal"
       >
      <el-form-item label="">
        <el-select
          v-model="moldAll"
          @change="SelectChange"
          placeholder="请选择搜索类型"
        >
          <el-option label="按设备类型" value="1"></el-option>
          <el-option label="按添加时间" value="2"></el-option>
          <!-- <el-option label="按设备编号" value="3"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-input
          v-if="moldAll == 3"
          v-model="queryParams.facilityModel"
          placeholder="请输入设备编号"
        ></el-input> -->
        <el-date-picker
          v-model="queryParams.addTime"
          type="date"
          v-if="moldAll == 2"
          placeholder="请选择日期"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        ></el-date-picker>
        <el-select
          v-if="moldAll == 1"
          clearable
          v-model="queryParams.facilityType"
          placeholder="请选择设备类型"
        >
          <el-option
            v-for="item in Inspectionpoint_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left: 10px" plain @click="getAllData"
          >确定</el-button
        ></el-form-item
      >
      <el-form-item style="float: right">
        <el-button
          color="#626aef"
          round
          icon="Delete"
          @click="deleteAll"
          v-hasPermi="['system:user:edit']"
          >删除</el-button
        >
        <el-button
          round
          icon="Plus"
          v-hasPermi="['system:user:edit']"
          @click="dialog_form = true"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      id="tableele"
      v-loading="loading"
      :data="tableData"
      ref="eletable"
      @selection-change="selectionChange"
     >
      <!-- .slice(
          (queryParams.pageNum - 1) * queryParams.pageSize,
          queryParams.pageNum * queryParams.pageSize
        ) -->
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="55" align="center" label="序号" />
      <el-table-column label="设备ID" align="center" prop="id" />
      <el-table-column
        label="所在路线"
        align="center"
        prop="route"
        :show-overflow-tooltip="true"
      >
        <template #default="{ row }">
          {{ formatter(monitoring_route, row.route) }}
        </template>
      </el-table-column>
      <el-table-column
        label="监测点等级"
        align="center"
        prop="monitor.monitoringPointGrade"
        :show-overflow-tooltip="true"
      >
        <template #default="{ row }">{{
          formatter(monitoring_point_grade, row.monitor.monitoringPointGrade)
        }}</template>
      </el-table-column>
      <el-table-column
        label="位置"
        align="center"
        prop="id"
        :show-overflow-tooltip="true"
      >
        <template #default="{ row }">{{
          "E " + row.lat + " N " + row.lon
        }}</template>
      </el-table-column>
      <el-table-column
        label="设备类型"
        align="center"
        prop="facilityType"
        :show-overflow-tooltip="true"
      >
        <template #default="{ row }">
          {{ formatter(facility_type, row.facilityType) }}
        </template>
      </el-table-column>
      <el-table-column label="检测内容" align="center" prop="id">
        <template #default="scope">
          {{ formatter(sceneList, scope.row.monitoringScene) }}
        </template>
      </el-table-column>
      <el-table-column label="传感器型号" align="center" prop="facilityModel">
        <template #default="scope">
          <span>{{ scope.row.facilityModel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center" prop="createTime">
        <template #default="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="fState">
        <template #default="scope">
          <span
            :style="{
              color:
                scope.row.fState == 0
                  ? 'red'
                  : scope.row.fState == 1
                  ? 'yellow'
                  : '#56b9d8',
            }"
            >{{ getStatus(scope.row.fState) }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button size="mini" type="text" @click="look_details(scope.row)"
            >查看</el-button
          >
          <el-button size="mini" type="text" @click="edit_btn(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
	
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getAllData"
    />
    <!-- 新增弹框 -->
    <el-dialog
      v-model="dialog_form"
      :title="facility.id ? '编辑设备' : '新增设备'"
    	>
      <el-row :gutter="24" justify="center">
        <el-col :span="12">
          <el-form
            :model="facility"
            ref="facilityRef"
            :rules="rules"
            label-position="left"
            label-width="30%"
            :inline="false"
            size="normal"
            class="ele_form"
          >
            <el-form-item label="设备ID" v-if="facility.id">
              <el-input v-model="facility.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="所在线路" prop="route">
              <el-select v-model="facility.route">
                <el-option
                  v-for="item in allpath"
                  :key="item.lineID"
                  :label="item.lienName"
                  :value="item.lienName"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所在监测点" prop="monitorId">
              <el-select v-model="facility.monitorId">
                <el-option
                  v-for="item in allMonitor"
                  :key="item.monitorID"
                  :label="item.monitorName"
                  :value="item.monitorID"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!--  -->
            <el-form-item label="监测点等级" prop="monitoringPointGrade">
              <el-select v-model="facility.monitoringPointGrade">
                <el-option
                  v-for="item in monitoring_point_grade"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="经度" prop="lat">
              <el-input
                v-model="facility.lat"
                placeholder="请直接输入数字"
              ></el-input>
            </el-form-item>
            <el-form-item label="纬度" prop="lon">
              <el-input
                v-model="facility.lon"
                placeholder="请直接输入数字"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备类型" prop="facilityType">
              <el-select v-model="facility.facilityType">
                <el-option
                  v-for="item in Inspectionpoint_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="添加时间" prop="addTime">
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
        </el-form-item> -->
            <el-form-item label="检测内容" prop="monitoringScene">
              <el-select
                v-model="facility.monitoringScene"
                placeholder="请输入检测内容"
              >
                <el-option
                  v-for="item in sceneList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="传感器型号" prop="facilityModel">
              <el-input v-model="facility.facilityModel"></el-input>
            </el-form-item>
            <el-form-item label="添加时间" prop="createTime">
              <el-input v-model="facility.createTime"></el-input>
            </el-form-item>
            <!-- <el-form-item
              label="排错使用"
              :rules="[{ required: true, message: '所在线路是必须的' }]"
            >
              <el-input v-model="facility.monitoringPointName"></el-input>
            </el-form-item> -->
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="onSbumit">确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 查看 -->
    <el-dialog v-model="check_details" title="查看">
      <el-row :gutter="24" justify="center">
        <el-col :span="12">
          <el-form
            :model="formData"
            ref="formDataRef"
            label-position="left"
            label-width="30%"
            :inline="false"
            size="normal"
          >
            <el-form-item label="设备ID">
              <span class="detail_style">{{ formData.id }}</span>
            </el-form-item>
            <el-form-item label="所在线路">
              <span class="detail_style">{{
                formatter(monitoring_route, formData.route)
              }}</span>
            </el-form-item>
            <el-form-item label="所在监测点">
              <span class="detail_style">{{
                formattersence(allMonitor, formData.monitor.monitoringPointName)
              }}</span>
            </el-form-item>
            <el-form-item label="监测点等级">
              <span class="detail_style"
                >{{
                  formatter(
                    monitoring_point_grade,
                    formData.monitoringPointGrade
                  )
                }}
              </span>
            </el-form-item>
            <el-form-item label="经度">
              <span class="detail_style">{{ "E " + formData.lat }}</span>
            </el-form-item>
            <el-form-item label="纬度">
              <span class="detail_style">{{ "N " + formData.lon }}</span>
            </el-form-item>
            <el-form-item label="设备类型">
              <span class="detail_style">{{
                formatter(facility_type, formData.facilityType)
              }}</span>
            </el-form-item>
            <el-form-item label="检测内容">
              <span class="detail_style">{{
                formatter(sceneList, formData.monitoringScene)
              }}</span>
            </el-form-item>
            <el-form-item label="传感器型号">
              <span class="detail_style">{{ formData.facilityModel }}</span>
            </el-form-item>
            <el-form-item label="添加时间">
              <span class="detail_style">{{ formData.createTime }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span class="detail_style">{{ getStatus(formData.fState) }}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup>
import EchartBar from "./echartbar.vue";
import {
  getTable,
  addfacility,
  editfacility,
  deletefacility,
  getAllMonitor,
  facilityCount,
  WeatherDisasterCount,
  sceneList,
  DataFrom,
} from "@/api/numberEquipment/device.js";
const { proxy } = getCurrentInstance();
const {
  monitoring_route,
  monitoring_point_grade,
  facility_type,
  Inspectionpoint_type,
  weather,
} = proxy.useDict(
  "monitoring_route",
  "facility_type",
  "monitoring_point_grade",
  "Inspectionpoint_type",
  "weather"
);
import * as echarts from "echarts";
import { computed, onMounted } from "vue";

//新增编辑的弹框
const dialog_form = ref(false);
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    addTime: "", //时间
    monitoringPointName: "", //搜索类型
    facilityType: "", //设备类型
    facilityModel: "",
  },
  moldAll: "1",
  sesetionData: [], //选中的数据
  deviceData: {
    devicCount: [], //设备数量
    deviceName: [],
  },
  WeatherDisaster: {
    count: [],
    name: [],
  },
  //全部检测点
  allMonitor: [],
  allpath: [], //所有路线
  rules: {
    createTime: [
      { required: true, message: "添加时间不能为空", trigger: "blur" },
    ],
    route: [
      {
        required: true,
        message: "所在线路不能为空",
        trigger: "blur",
      },
    ],
    monitorId: [
      { required: true, message: "所在监测点不能为空", trigger: "blur" },
    ],
    monitoringPointGrade: [
      { required: true, message: "监测点等级不能为空", trigger: "blur" },
    ],
    lat: [{ required: true, message: "经度不能为空", trigger: "blur" }],
    lon: [{ required: true, message: "纬度不能为空", trigger: "blur" }],
    facilityType: [
      { required: true, message: "设备类型不能为空", trigger: "blur" },
    ],
    monitoringScene: [
      { required: true, message: "检测内容不能为空", trigger: "blur" },
    ],
    facilityModel: [
      { required: true, message: "传感器型号不能为空", trigger: "blur" },
    ],
  },
});
//表单的ref
const facilityRef = ref(null);
//查看的表单数据
const formData = ref(null);
//查看详情的开关
const check_details = ref(false);
const eletable = ref(null); //table
const loading = ref(false);

const {
  queryParams,
  moldAll,
  deviceData,
  WeatherDisaster,
  allMonitor,
  rules,
  allpath,
} = toRefs(data);
const value = ref("");
const total = ref(0);
const tableData = ref([]);
//新增和编辑的表单
const facility = ref(new DataFrom());

//查数据字典展示给用户
function formattersence(data, key) {
  let result = data.find((i) => i.monitorID == key);
  return result ? result.monitorName : "空";
}
function formatter(data, key) {
  let res = data.find((i) => i.value == key);
  return res ? res.label : "空";
}

function SelectChange() {
  data.queryParams.addTime = "";
  data.queryParams.facilityType = "";
  data.queryParams.facilityModel = "";
}
//查看详情
function look_details(row) {
  check_details.value = true;
  formData.value = {
    ...row,
    monitoringPointGrade: row.monitor.monitoringPointGrade,
  };
}
//跳转编辑
function edit_btn(row) {
  dialog_form.value = true;
  facility.value = {
    ...row,
    monitoringPointGrade: row.monitor.monitoringPointGrade,
  };
}
//获取全部数据
function getAllData() {
  loading.value = true;
  getTable({
    monitoringScene: 0,
    ...queryParams.value,
  }).then((res) => {
    tableData.value = res.rows;
    total.value = res.total;
    loading.value = false;
  });
}
getAllMonitor().then((res) => {
  data.allMonitor = res.data;
  data.allpath = res.data.filter((i) => i.lienName);
});
//判断当前状态
function getStatus(stats) {
  if (stats == "1") {
    return "离线";
  } else if (stats == "0") {
    return "异常";
  } else {
    return "在线";
  }
}
//新增/编辑确定
function onSbumit() {
  facilityRef.value.validate().then((res) => {
    if (res) {
      if (facility.value.id) {
        editfacility(facility.value).then(() => {
          dialog_form.value = false;
          facility.value = new DataFrom();
          facilityRef.value.resetFields(); //清除校验
          getAllData();
          proxy.$modal.msgSuccess("编辑成功");
        });
      } else {
        addfacility(facility.value).then(() => {
          dialog_form.value = false;
          facility.value = new DataFrom();
          facilityRef.value.resetFields(); //清除校验
          getAllData();
          proxy.$modal.msgSuccess("新增成功");
        });
      }
    }
  });
}
/** 删除按钮操作 */
function deleteAll() {
  proxy.$modal.confirm("是否确认删除参数编号为的数据项？").then(() => {
    // console.log(data.sesetionData, "all");
    let parmas = "";
    data.sesetionData.forEach((i, j) => {
      j == 0 ? (parmas += i.id) : (parmas += "," + i.id);
    });
    // console.log(parmas, "all");
    deletefacility(parmas).then(() => {
      proxy.$modal.msgSuccess("删除成功");
    });
    getAllData();
  });
}
//elment自带方法保存选中的数据
function selectionChange(selection) {
  data.sesetionData = selection;
}

function getEcharts1() {
  WeatherDisaster.name = ["da", "er", "er", "ds"];
  WeatherDisaster.count = [2, 3, 5, 6];
  WeatherDisasterCount().then((res) => {
    let arr = [];
    for (let key in res.data) {
      const keyname = res.data[key];
      if (keyname.length > 0) {
        for (let k of keyname) {
          const keyvalue = Object.keys(k).find((i) => i !== "count");
          const result = weather.value.find((i) => i.value == k[keyvalue]);
          arr.push({ count: k.count, value: result ? result.label : "空" });
        }
      }
    }
    data.WeatherDisaster.count = arr.map((i) => i.count);
    data.WeatherDisaster.name = arr.map((i) => i.value);
  });
}
getEcharts1();

function getEcharts2() {
  facilityCount({ type: "facilityType" }).then((res) => {
    data.deviceData.deviceName = res.data.map((i) => i.facility_type);
    data.deviceData.devicCount = res.data.map((i) => i.count);
  });
}
getEcharts2();
const option = computed(() => {
  const option = {
    title: {
      text: "设备数量统计",
      textStyle: {
        color: "#b6bdbf",
        fontSize: "14px",
      },
    },
    color: ["#41b1b6"],
    // tooltip: {
    //   trigger: "axis",
    //   axisPointer: {
    //     // 坐标轴指示器，坐标轴触发有效
    //     type: "line", // 默认为直线，可选为：'line' | 'shadow'
    //   },
    // },
    grid: {
      left: "20%",
      top: "20%",
      right: "20%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: true,
      },

      minorSplitLine: {
        show: false,
      },
      axisTick: {
        alignWithLabel: true,
      },
      // data: deviceData.deviceName,
      data: ["大哥", "二哥"],
      axisLabel: {
        interval: 0,
      },
    },
    yAxis: {
      type: "value",
      // 修改刻度标签 相关样式
      axisLabel: {
        showMaxLabel: true,
        interval: 0,
        color: "rgba(255,255,255,.6) ",
        fontSize: 12,
      },
      // y轴分割线的颜色
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#999999",
        },
      },
    },
    series: [
      {
        data: [22, 44],
        // data: deviceData.devicCount,
        type: "bar",
        showBackground: false,
        barWidth: 30,
        itemStyle: {
          borderRadius: 8,
          borderWidth: 3,
          label: {
            show: true, //开启显示
            position: "top", //在上方显示
            textStyle: {
              color: "#41b1b6",
              fontSize: 16,
              fontWeight: "bold",
            },
          },
        },
      },
    ],
  };
  return option;
});
getAllData();
</script>
<style lang="scss" scoped>
:deep(.formdialog .el-select) {
  width: 100%;
}
.app-container {
  min-width: 1000px;
}
.detail_style {
  color: white;
}
.mr-1 {
  margin-right: 10px;
}
.item {
  padding: 18px 0;
}
// echarts 表格
.box-card {
  width: 480px;
}
.elcard_display {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
:deep(.box-card) {
  flex: 0.5;
  margin-right: 10px;
}

.search_Select {
  margin: 2% 0;
}
:deep(.el-card__body) {
  width: 100%;
  height: 100%;
}
.box_plane {
  display: inline-block;
  width: 48%;
  box-shadow: 3px 3px 5px #bbb, -3px -3px 7px #bbb;
  height: 200px;
}
:deep(.el-button--medium.is-round) {
  // float: right;
  color: white;
  background-color: #3d5a5d;
  border: #3d5a5d;
}
:deep(.el-button--medium.is-round):hover {
  background-color: #57d0d8;
}
:deep(.ele_form .el-select) {
  width: 100%;
}
.pagination-container :deep(.el-pagination){
	position: static;
	text-align: right;
}
</style>

