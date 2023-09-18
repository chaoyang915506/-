<template>
  <div class="app-container">
    <!-- echarts -->
    <div class="elcard_display">
      <echartsPictorialBar
        class="box_plane"
        :echartData="deviceData"
      ></echartsPictorialBar>
      <line-chart class="box_plane" :echartData="foreignLineData"></line-chart>
    </div>
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="form" :inline="true" size="normal">
      <el-form-item label="">
        <el-select
          v-model="moldAll"
          @change="SelectChange"
          placeholder="请选择搜索类型"
        >
          <el-option label="按设备类型" value="1"></el-option>
          <el-option label="按添加时间" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          class="timeline_css"
          v-if="moldAll == 2"
          v-model="timePicker"
          type="daterange"
          range-separator="-"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          @change="getDate"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :size="size"
        />
        <el-select
          v-if="moldAll == 1"
          clearable
          v-model="queryParams.facilityType"
          placeholder="请选择设备类型"
        >
          <el-option
            v-for="item in facility_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn_submit" @click="getAllData"
          >确定</el-button
        >
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          type="primary"
          class="common_style"
          round
          icon="Delete"
          @click="deleteAll"
          >删除</el-button
        >
        <el-button
          type="primary"
          class="common_style"
          round
          icon="Plus"
          @click="addfrom"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      id="tableele"
      v-loading="loading"
      :data="tableData"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="55" align="center" label="序号" />
      <el-table-column label="设备名称" align="center" prop="facilityName" />
      <el-table-column
        label="所在路线"
        align="center"
        prop="route"
        :show-overflow-tooltip="true"
      >
        <template #default="{ row }">
          {{ row.route }}
        </template>
      </el-table-column>
      <el-table-column
        label="监测点等级"
        align="center"
        prop="monitor.monitoringPointGrade"
        :show-overflow-tooltip="true"
      >
        <template #default="{ row }">{{
          formatter(monitoring_point_grade, row.grade)
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
      <el-table-column label="监测内容" align="center" prop="id">
        <template #default="scope">
          {{ formatter(monitoring_scene, scope.row.monitoringScene) }}
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
    <!-- v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageNum" -->
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getAllData"
    />
    <!-- 新增弹框 -->
    <el-dialog
      v-if="dialog_form"
      v-model="dialog_form"
      :close-on-click-modal="false"
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
            hide-required-asterisk="false"
            class="ele_form"
          >
            <el-form-item label="所在线路">
              <el-select v-model="facility.lingId" @change="lineChange">
                <el-option
                  v-for="item in lineIdSelect"
                  :key="item.lineID"
                  :label="item.lienName"
                  :value="item.lineID"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所在监测点">
              <el-select v-model="facility.monitorId" @change="modelIdChange">
                <el-option
                  v-for="item in monitorList"
                  :key="item.monitorID"
                  :label="item.monitorName"
                  :value="item.monitorID"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!-- fake.class -->
            <el-form-item label="监测点等级">
              <el-select v-model="facility.grade" disabled>
                <el-option
                  v-for="item in monitoring_point_grade"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="位置">
              <span>{{ fake.lonlat }}</span>
            </el-form-item>
            <el-form-item label="设备类型" prop="facilityType">
              <el-select v-model="facility.facilityType">
                <el-option
                  v-for="item in facility_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备名称">
              <el-input v-model="facility.facilityName"></el-input>
            </el-form-item>
            <el-form-item label="监测内容" prop="monitoringScene">
              <el-select
                v-model="facility.monitoringScene"
                placeholder="请输入监测内容"
                class="select_cutom"
                disabled
              >
                <el-option
                  v-for="item in monitoring_scene"
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
            <el-form-item label="添加时间" prop="addTime">
              <el-date-picker
                :default-value="new Date()"
                v-model="facility.addTime"
                format="YYYY/MM/DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="datetime"
                placeholder="请输入时间"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="技术参数" prop="filesCopy">
              <updateElement v-model="facility.filesCopy" />
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="onSbumit">确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 查看 -->
    <el-dialog v-if="check_details" v-model="check_details" title="查看">
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
            <el-form-item label="所在线路">
              <span class="detail_style">{{ formData.route }}</span>
            </el-form-item>
            <el-form-item label="所在监测点">
              <span class="detail_style">{{
                formattersence(monitoringlist, formData.monitorId)
              }}</span>
            </el-form-item>
            <el-form-item label="监测点等级">
              <span class="detail_style">
                {{ formatter(monitoring_point_grade, formData.grade) }}
              </span>
            </el-form-item>
            <el-form-item label="经纬度">
              <span class="detail_style">{{ formData.lonlat }}</span>
            </el-form-item>
            <el-form-item label="设备类型">
              <span class="detail_style">{{
                formatter(facility_type, formData.facilityType)
              }}</span>
            </el-form-item>
            <el-form-item label="设备名称">
              <span class="detail_style">{{ formData.facilityName }}</span>
            </el-form-item>
            <el-form-item label="监测内容">
              <span class="detail_style">{{
                formatter(monitoring_scene, formData.monitoringScene)
              }}</span>
            </el-form-item>
            <el-form-item label="传感器型号">
              <span class="detail_style">{{ formData.facilityModel }}</span>
            </el-form-item>
            <el-form-item label="添加时间">
              <span class="detail_style">{{ formData.addTime }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span class="detail_style">{{ getStatus(formData.fState) }}</span>
            </el-form-item>
            <el-form-item label="技术参数">
              <!-- <el-image :src="formData.pic" fit="fill" :lazy="true"></el-image> -->
              <updateElement
                :disabled="true"
                class="updateD"
                @resetImgValue="resetImgValue"
                v-model="formData.pic"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script setup>
import LineChart from "./LineChart.vue";
import { makeline, toflowData, rulesCopy } from "../js/index";
import updateElement from "../components/update.vue";
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
const { proxy } = getCurrentInstance();
import echartsPictorialBar from "@/components/EchartsPictorialBar/index.vue";
const {
  monitoring_route,
  monitoring_point_grade,
  facility_type,
  Inspectionpoint_type,
  monitoring_scene,
} = proxy.useDict(
  "monitoring_route",
  "facility_type",
  "monitoring_point_grade",
  "Inspectionpoint_type",
  "monitoring_scene"
);
import {
  getTable,
  addfacility,
  editfacility,
  deletefacility,
  addinfodata,
  facilityCount,
  DataFrom,
  getForMatTrendall,
  imquire,
} from "@/api/baseinfo/device.js";
import { onMounted } from "@vue/runtime-core";
const loading = ref(false);

//获取线路经纬度等信息
addinfodata()
  .then((res) => {
    // console.log(makeline(res), "全部线路信息");
    data.lineIdSelect = makeline(res);
    data.monitoringlist = res.data;
  })
  .catch((err) => {
    // console.log(err);
  });

//选择线路好
const lineChange = (e) => {
  // console.log(e, "当前选择的线路");
  data.monitorList = data.monitoringlist.filter((i) => i.lineID == e);
};
//当监测点修改
const modelIdChange = (e, item) => {
  let resultes = data.monitorList.find((i) => i.monitorID == e);
  if (resultes) {
    facility.value.grade = resultes.grade;
    data.fake.lonlat = "经度 " + resultes.lon + "  纬度 " + resultes.lat;
  }
};

// /新增编辑的弹框
const dialog_form = ref(false);
const data = reactive({
  //存地址
  fake: {
    lonlat: "",
  },
  //选择路线后的监测点
  monitorList: [],
  //所有监测点
  monitoringlist: [],
  //起始时间
  timePicker: [],
  //x线路和监测点
  lineIdSelect: [],
  moldAll: "1",
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    monitoringPointName: "", //搜索类型
    facilityType: "", //设备类型
    facilityModel: "",
    addTime: "",
  },
  sesetionData: [], //选中的数据
  deviceData: {
    title: "摄像头型号数量",
    seriesData: [], //设备数量
    color: "#5bc0be",
    xAxisData: [],
    dataZoom: true,
  },
  WeatherDisaster: {
    count: [],
    name: [],
  },
  allMonitor: [],
  foreignLineData: {
    forcast: [],
    history: [],
    forcasttime: [],
    // forcastcreatetime: [],
    historycreatetime: [],
  }, //异物图表
  //校验规则
  rules: {
    ...rulesCopy,
  },
  tableData: [],
});
// 取半年异物侵限走势统计
getForMatTrendall().then((res) => {
  // console.log(res, "异物");
  data.foreignLineData.forcast = res.data.forcast.map((i) => i.fmfc);
  // data.foreignLineData.forcast = [232, 232, 23, 23];
  // data.foreignLineData.forcasttime = res.data.forcast.map((i) => i.fdtime);
  data.foreignLineData.history = res.data.history.map((i) => i.foreignMatter);
  data.foreignLineData.historycreatetime = res.data.history.map(
    (i) => i.createTime
  );
});
//表单的ref
const facilityRef = ref(null);
//查看的表单数据
const formData = ref(null);
//查看详情的开关
const check_details = ref(false);
const {
  rules,
  lineIdSelect,
  queryParams,
  deviceData,
  WeatherDisaster,
  allMonitor,
  moldAll,
  foreignLineData,
  tableData,
  fake,
  monitorList,
  monitoringlist,
  timePicker,
} = toRefs(data);
const total = ref(0);

//新增和编辑的表单
const facility = ref({
  ...new DataFrom(),
  monitor: { monitoringScene: "2" },
});

//查数据字典展示给用户
function formattersence(data, key) {
  let result = data.find((i) => i.monitorID == key);
  return result ? result.monitorName : "空";
}
function formatter(data, key) {
  let res = data.find((i) => i.value == key);
  return res ? res.label : "空";
}
let test = ref("");
//查看详情
function look_details(row) {
  imquire(row.id).then((res) => {
    let pic = [];
    // console.log(res.data.file.fileBytes, "查看");
    if (res.data.file && res.data.file.fileBytes) {
      pic = [
        {
          url: toflowData(res.data.file.fileBytes),
          name: res.data.file ? res.data.file.fileName : "",
        },
      ];
    } else {
      pic = [];
    }
    check_details.value = true;
    formData.value = {
      ...res.data,
      lonlat: "E " + row.lon + " N " + row.lat,
      pic: pic.length > 0 ? pic : [],
    };
    // console.log(formData.value, "vvue");
  });
}
//跳转编辑
async function edit_btn(row) {
  try {
    loading.value = true;
    const res = await imquire(row.id);
    lineChange(res.data.lingId);
    let pic = "";
    // console.log(res, "查看数据");
    // console.log(res.data.file.fileBytes, "查看");
    if (res.data.file && res.data.file.fileBytes) {
      pic = toflowData(res.data.file.fileBytes);
    } else {
      pic = "";
    }
    // console.log(res, "编辑的数据");
    // console.log(pic, "处理的数据");
    //传给子的数据
    let transferarr = [
      {
        url: pic,
        name: res.data.file ? res.data.file.fileName : "",
        file: res.data.file,
        fileUudid: "",
      },
    ];

    // 编辑的数据
    facility.value = {
      ...res.data,
      filesCopy: pic == "" ? [] : transferarr,
    };
    data.fake.lonlat = "E " + res.data.lon + " N " + res.data.lat;
    // console.log(facility.value, "拿到数据");
    dialog_form.value = true;
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
}
//新增弹框
const addfrom = () => {
  data.fake.lonlat = "";
  facility.value = {
    ...new DataFrom(),
    monitoringScene: "2",
  };
  console.log(facility.value, "xinzeng");
  dialog_form.value = true;
};

//获取全部数据
function getAllData() {
  loading.value = true;
  getTable({
    monitoringScene: "2",
    ...data.queryParams,
  })
    .then((res) => {
      data.tableData = res.rows;
      total.value = res.total;
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
}
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
    // console.log(res, "保存");
    if (res) {
      let resutls = {
        ...facility.value,
        sysFileUuid:
          facility.value.filesCopy.length > 0
            ? facility.value.filesCopy[0].fileUudid
            : "",
      };
      if (resutls.sysFileUuid == "") {
        delete resutls.sysFileUuid;
      }
      delete resutls.filesCopy;
      if (facility.value.id) {
        editfacility(resutls).then(() => {
          dialog_form.value = false;
          facility.value = new DataFrom();
          facilityRef.value.resetFields(); //清除校验
          getAllData();
          proxy.$modal.msgSuccess("编辑成功");
        });
      } else {
        addfacility(resutls).then(() => {
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
  proxy.$modal.confirm("是否确认此条数据项？").then(() => {
    // console.log(data.sesetionData, "all");
    let params = data.sesetionData
      .map((i) => i.id)
      .filter((i) => i)
      .join(",");
    deletefacility(params).then(() => {
      proxy.$modal.msgSuccess("删除成功");
      getAllData();
    });
  });
}
//elment自带方法保存选中的数据
function selectionChange(selection) {
  data.sesetionData = selection;
}

//下拉切换
function SelectChange() {
  data.queryParams.beginTime = "";
  data.queryParams.endTime = "";
  data.queryParams.facilityType = "";
  data.queryParams.facilityModel = "";
  data.timePicker = [];
}

//Echarts
facilityCount({ type: "facilityModel" }).then((res) => {
  // console.log(res, "摄像头的数量");
  data.deviceData.xAxisData = res.data.map((i) => i.facility_model);

  // {
  //   let results = facility_type.value.find(
  //     (idx) => idx.value == i.facility_model
  //   );
  //   return {
  //     ...i,
  //     label: results ? results.label : "空",
  //   };
  // })
  // .map((i) => i.label);

  data.deviceData.seriesData = res.data.map((i) => i.count);
});
getAllData();
</script>
<style lang="scss" scoped>
.app-container {
  min-width: 1000px;
  padding: 20px;
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

span {
  color: white;
}
.updateD :deep(.el-upload) {
  display: none;
}
:deep(.select_cutom .el-input .el-input__suffix) {
  display: none;
}
</style>