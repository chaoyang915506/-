<template>
  <div class="app-container">
    <div class="top-class-total">
      <div class="top-title-class">
        <span>进行中</span>
        <span style="color: #fed751">{{ processedingCount }}</span>
      </div>
      <div class="top-title-class">
        <span>未处理</span>
        <span style="color: #fc9d9d">{{ noprocessedCount }}</span>
      </div>
    </div>
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
    >
      <!-- size="small" -->
      <!-- label-width="68px" -->
      <el-form-item prop="eventName">
        <el-input
          v-model="queryParams.eventName"
          placeholder="请输入事件名称"
          clearable
          @keyup.enter="handleQuery"
        />
        <!-- style="width: 240px" -->
      </el-form-item>
      <el-form-item prop="eventType">
        <el-select
          v-model="queryParams.eventType"
          placeholder="请选择事件类型"
          clearable
        >
          <el-option
            v-for="dict in event_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="eventGrade">
        <el-select
          v-model="queryParams.eventGrade"
          placeholder="请选择事件等级"
          clearable
        >
          <el-option
            v-for="dict in event_grade"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="dateRange">
        <!-- v-model="queryParams.dateRange" -->
        <el-date-picker
          class="timeline_css"
          value-format="YYYY-MM-DD"
          type="daterange"
          v-model="timePicker"
          @change="getDate"
          range-separator="-"
          start-placeholder="事发开始日期"
          end-placeholder="事发结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn_submit" @click="handleQuery"
          >搜索</el-button
        >
        <el-button type="primary" class="btn_submit" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column label="事件名称" align="center" prop="eventName" />
      <el-table-column
        label="事件类型"
        align="center"
        prop="eventType"
        :formatter="formatterEventType"
      />
      <el-table-column label="事件等级" align="center" prop="eventGrade" />
      <!-- :formatter="formatterEventGrade" -->
      <el-table-column label="事发时间" align="center" prop="timeToEvent" />
      <el-table-column label="当前节点" align="center" prop="flowName" />
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
            icon="View"
            @click="handleCheck(scope.row)"
            v-hasPermi="['system:config:edit']"
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
    <el-dialog title="查看" v-model="open" width="90%">
      <div class="left-right-class">
        <div class="left-class">
          <div class="left-one-class">
            <div class="left-one-one-class">
              <div style="height: 50%">
                <div class="not-process-class">监测点实时风险预测</div>
                <div class="realtimestatus-class">
                  {{ checkObj.risk ? checkObj.risk * 100 : 0 }}
                </div>
              </div>
              <div style="height: 50%">
                <div class="not-process-class">监测点实时综合风险统计</div>
                <div class="handle-line-class">
                  <handleLine :chartData="chartDataRisk"></handleLine>
                </div>
              </div>
            </div>
            <div class="left-one-two-class">
              <chinaGeoCoordMap
                :isShowControl="false"
                :chartData="chartData"
                style="width: 100%; height: 290px"
              ></chinaGeoCoordMap>
            </div>
          </div>
          <div class="left-two-class">
            <div class="left-two-one-class">
              <div class="not-process-class">应急基本信息</div>
              <ul class="ul-class">
                <li>
                  <span>名称： </span
                  ><span>{{ checkObj.monitoring_point_name }}</span>
                </li>
                <li>
                  <span>所在路线： </span><span>{{ checkObj.line_name }}</span>
                </li>
                <li>
                  <span>场景类型： </span
                  ><span>{{ formatterSceneType(checkObj.scene_type) }}</span>
                </li>
                <li>
                  <span>监测点等级： </span
                  ><span>{{
                    formatterMonitoringPointGrade(
                      checkObj.monitoring_point_grade
                    )
                  }}</span>
                </li>
                <li>
                  <span>使用模型： </span><span>{{ checkObj.modelName }}</span>
                </li>
                <li>
                  <span>经纬度： </span
                  ><span
                    >E {{ floatToLonLat(checkObj.lon) }} N
                    {{ floatToLonLat(checkObj.lat) }}</span
                  >
                </li>
                <li>
                  <span>监测场景： </span
                  ><span>{{ fomattervtype(checkObj.monitoring_scene) }}</span>
                </li>
                <li>
                  <span>添加时间： </span
                  ><span>{{
                    proxy.parseTime(
                      checkObj.add_time,
                      "{y}-{m}-{d} {h}:{i}:{s}"
                    )
                  }}</span>
                </li>
                <li>
                  <span>预案等级： </span
                  ><span style="font-weight: bolder">{{
                    formatterPlanReponseLevel(checkObj.response_level)
                  }}</span>
                </li>
                <li>
                  <span>应急预案：</span>
                  <span
                    v-if="checkObj.plan_name"
                    @click="lookdocumnent = true"
                    style="color: #04bcc6; cursor: pointer"
                    >《{{ checkObj.plan_name }}》</span
                  >
                  <!-- <a
                    :href="pdfUrl + checkObj.filePath"
                    target="_blank"
                    style="color: #04bcc6; cursor: pointer"
                    >《 {{ checkObj.plan_name }} 》</a
                  > -->
                </li>
              </ul>
            </div>
            <div class="left-two-two-class">
              <chinaGeoCoordMapLine
                :isCheckPath="isCheckPath"
                :mapLineID="'mapLineID'"
                :isShowControl="false"
                :chartData="chartDataLine"
                style="width: 100%; height: 290px"
              ></chinaGeoCoordMapLine>
            </div>
          </div>
        </div>
        <div class="right-class">
          <div class="right-one-class">
            <div class="not-process-class">应急预案处理流程</div>
            <div class="right-flow-class">
              <ul>
                <li v-for="(item, index) in checkObj.flows" :key="index">
                  <div class="flow-wrap">
                    <div
                      class="flow-cicle-class"
                      :class="
                        checkObj.flow_id == item.id ? 'current-node-class' : ''
                      "
                    >
                      {{ item.company_name }}
                    </div>
                    <img
                      v-if="index != checkObj.flows.length - 1"
                      class="img-svg-class img-svg-class-arrow"
                      src="./../../assets/images/emergencyplan/line-arrow.svg"
                      alt=""
                    />
                  </div>
                  <div class="flow-info">
                    <p>联系人：{{ item.contact }}</p>
                    <p>联系电话：{{ item.phone }}</p>
                  </div>
                  <div class="flow_describe">
                    <p>描述内容：{{ item.flow_describe }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="right-two-class">
            <div class="not-process-class">响应描述</div>
            <div
              style="
                color: #d7d7d7;
                font-size: 17px;
                font-weight: bold;
                display: flex;
                flex-direction: column;
              "
            >
              <div style="display: flex">
                <span>事件描述：</span>
                <el-input
                  type="textarea"
                  v-model="flowObj.flowDescribe"
                  style="width: 85%"
                  placeholder="请输入您的事件描述"
                  :autosize="{ minRows: 7 }"
                ></el-input>
              </div>
              <div
                style="
                  display: flex;
                  width: 100%;
                  justify-content: flex-end;
                  align-items: center;
                  margin-top: 10px;
                "
              >
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template> -->
    </el-dialog>
    <el-scrollbar style="height: 100%">
      <el-dialog
        title="查看文档"
        v-model="lookdocumnent"
        :fullscreen="true"
        width="100%"
        style="z-index: 999"
      >
        <iframe
          :src="pdfUrl"
          frameborder="0"
          style="width: 100%; height: 100vh"
        ></iframe>
      </el-dialog>
    </el-scrollbar>
  </div>
</template>
<script setup>
const lookdocumnent = ref(false);
import {
  getDispose,
  getStateCount,
  pendingQuery,
  getDisposeFlow,
  getPreviewById,
} from "@/api/emergency/emergency.js";
import {
  getMapInformation,
  getLineMonitorState,
  getFilterMapInfor,
} from "@/api/display/display.js";
import { getRiskStat } from "@/api/realtimestatus/realtimestatus.js";
import handleLine from "@/components/echarts/handleLine.vue";
import chinaGeoCoordMap from "@/components/echarts/chinaGeoCoordMap.vue";
import chinaGeoCoordMapLine from "@/components/echarts/chinaGeoCoordMap.vue";
import { nextTick, onMounted } from "@vue/runtime-core";
const { proxy } = getCurrentInstance();
const {
  event_type,
  event_grade,
  monitoring_point_grade,
  scene_type,
  plan_reponse_level,
} = proxy.useDict(
  "event_type",
  "event_grade",
  "monitoring_point_grade",
  "scene_type",
  "plan_reponse_level"
);

const tableData = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const isCheckPath = ref(true);
const total = ref(0);
const riskRate = ref(0);
let chartData = ref([]);
let chartDataLine = ref([]);
const pdfUrl = ref(import.meta.env.VITE_APP_BASE_API);
const checkObj = ref({});
const flowObj = ref({
  flowDescribe: "",
  id: undefined,
});
let processedingCount = ref(0);
let noprocessedCount = ref(0);
let chartDataRisk = ref({
  xData: [],
  yData: [],
  gridTop: 15,
  color: "#2077C8",
  showSymbol: false,
  isShowArea: false,
  showMaxValue: true,
  isMmooth: true,
});
const data = reactive({
  timePicker: [],
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    dateRange: [],
    eState: "1",
    eventType: undefined,
    eventName: undefined,
    beginTime: undefined,
    endTime: undefined,
    eventGrade: undefined,
  },
});
//查询当前的检测类型异物环境
const fomattervtype = (val) => {
  let result = event_type.value.find((i) => i.value == val);
  return result?.label ? result.label : "";
};

const { queryParams, timePicker } = toRefs(data);
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
// 初始化列表
const getList = async () => {
  loading.value = true;
  let res = await getDispose(queryParams.value);
  if (res.code == 200) {
    tableData.value = res.rows;
    total.value = res.total;
    loading.value = false;
  }
};
// 初始化地图数据
async function getInitMapList() {
  let res = await getMapInformation();
  if (res.code == 200) {
    // console.log(res, 'res')
    let tempObj = {};
    let tempArr = {};
    if (res.data.data && res.data.data.length) {
      res.data.data.forEach((item) => {
        tempObj[item.lineId] = [];
      });
      res.data.data.forEach((item) => {
        tempObj[item.lineId].push(item);
      });
    }
    for (let key in tempObj) {
      tempObj[key] = tempObj[key].sort(
        (a, b) => a.serialNumber - b.serialNumber
      );
    }
    for (let key in tempObj) {
      tempObj[key].forEach((item) => {
        tempArr[key] = {
          name: item.lineStart,
          lineId: item.lineId,
          siteNameArr: tempObj[key].map((i) => {
            let reg = /\r\n/g;
            return i.siteName.replace(reg, "");
          }),
          sitesNum: item.sitesNum,
          lineName: item.lineName,
          lineEnd: item.lineEnd,
          path: [],
        };
      });
    }
    for (let key in tempObj) {
      tempObj[key].forEach((item) => {
        tempArr[key].path.push([item.lon, item.lat]);
      });
    }
    let arr = [];
    for (let key in tempArr) {
      arr.push(tempArr[key]);
    }
    // console.log(tempObj, "tempObj", tempArr, arr);
    chartData.value = arr;
  }
}
// 线路点击
async function handleLineClick(val, lineName) {
  let res = await getLineMonitorState({
    lineId: val,
  });
  let ret = await getFilterMapInfor(val);
  if (res.code == 200) {
    if (res.data && res.data.length) {
      res.data.forEach((item) => {
        item.name = item.monitorName;
        item.lnglat = [item.lon, item.lat];
      });
      if (ret.code == 200 && ret.data.data && ret.data.data.length) {
        res.data.unshift({
          lnglat: [ret.data.data[0].lon, ret.data.data[0].lat],
          name: ret.data.data[0].lineStart,
        });
        res.data.push({
          lnglat: [
            ret.data.data[ret.data.data.length - 1].lon,
            ret.data.data[ret.data.data.length - 1].lat,
          ],
          name: ret.data.data[ret.data.data.length - 1].lineStart,
        });
      }
      console.log(ret.data.data);
      let lonlatlist = ret.data.data.map((i) => {
        return [i.lon, i.lat];
      });
      chartDataLine.value = [
        {
          points: res.data,
          trainstatilist: lonlatlist,
          lineName: lineName,
          stationlist: ret.data.data.map((i) => {
            let reg = /\r\n/g;
            return i.siteName.replace(reg, "");
          }),
        },
      ];
    } else {
      chartDataLine.value = [];
    }
  }
}
// 获取统计
const getStateCountData = async () => {
  let res = await getStateCount();
  if (res.code == 200) {
    if (res.data && res.data.length) {
      let noresult = res.data.find((item) => item.eState == 0);
      if (noresult) {
        noprocessedCount.value = noresult.count;
      }
      let resulting = res.data.find((item) => item.eState == 1);
      if (resulting) {
        processedingCount.value = resulting.count;
      }
    }
  }
};
// 获取监测点实时综合风险统计
const getRiskStatData = async (val) => {
  let res = await getRiskStat({
    riskType: "4",
    monitorId: val,
  });
  if (res.code == 200) {
    // 4 综合风险
    if (res.data[4] && res.data[4].length) {
      let xData = [];
      let yData = [];

      let arr = res.data[4].sort(proxy.compareDate("createTime", "positive"));
      arr.forEach((item) => {
        xData.push(proxy.timestampToTime(new Date(item.createTime).getTime()));
        yData.push(item.risk * 100);
      });
      chartDataRisk.value.xData = xData;
      chartDataRisk.value.yData = yData;
    }
  }
};
// 获取详情
const getById = async (id) => {
  let res = await pendingQuery({
    id,
  });
  if (res.code == 200) {
    getRiskStatData(res.data.monitorId);
    getInitMapList();
    handleLineClick(res.data.lineId.toString(), res.data.line_name);
    checkObj.value = res.data;
  }

  if (res.data.planId) {
    let pdfdata = await getPreviewById(res.data.planId);
    // console.log(pdfdata, "allpdf");
    pdfUrl.value = proxy.$arrayBufferToBlob(
      pdfdata.data ? pdfdata.data.fileBytes : "",
      "application/pdf"
    );
  }
};
// 确定
const submitForm = async () => {
  let res = await getDisposeFlow(flowObj.value);
  if (res.code == 200) {
    open.value = false;
    getList();
    getStateCountData();
  }
};
// 取消
const cancel = () => {
  open.value = false;
};
// 查看
const handleCheck = (row) => {
  flowObj.value = {
    flowDescribe: "",
    id: row.flowId,
    disposeId: row.id,
  };
  open.value = true;
  chartDataRisk.value.xData = [];
  chartDataRisk.value.yData = [];
  getById(row.id);
};
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {}

// 格式化列表
const formatterEventType = (row, column, columnIndex) => {
  let result = event_type.value.find((item) => item.value == columnIndex);
  // console.log(result, columnIndex, "all");
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
const formatterEventGrade = (row, column, columnIndex) => {
  let result = event_grade.value.find((item) => item.value == columnIndex);
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
const formatterMonitoringPointGrade = (val) => {
  let result = monitoring_point_grade.value.find((item) => item.value == val);
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
const formatterSceneType = (val) => {
  let result = scene_type.value.find((item) => item.value == val);
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
const formatterPlanReponseLevel = (val) => {
  let result = plan_reponse_level.value.find((item) => item.value == val);
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
function floatToLonLat(val) {
  if (val) {
    let result = val.toString().split(".");
    // return result[0] + "°" + result[1] + "′";
    let resultwto = result[1] ? result[1] : " ";
    return result[0] + "°" + resultwto + "′";
  } else {
    return "";
  }
}
onMounted(() => {
  getList();
  getStateCountData();
});
</script>
<style scoped>
.top-class-total {
  width: 100%;
  display: flex;
}
.top-title-class {
  padding: 15px 0;
  background: #363636;
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #d7d7d7;
  font-size: 17px;
  margin-bottom: 10px;
  margin-right: 40px;
  box-shadow: 2px 2px 6px #909399, -2px -2px 6px #909399;
}
.top-title-class span:nth-child(2) {
  font-size: 34px;
  margin-top: 5px;
}
.left-right-class {
  width: 100%;
  display: flex;
  align-items: center;
}
.left-right-class .left-class {
  flex: 1.3;
  height: calc(96vh + 15px);
  display: flex;
  overflow: hidden;
}
.left-right-class .right-class {
  flex: 1;
  margin-left: 15px;
}
.right-one-class {
  height: 48vh;
  padding: 10px;
  /* overflow-y: auto; */
  overflow-y: hidden;
  box-shadow: 2px 2px 6px #909399, -2px -2px 6px #909399;
}
.right-two-class {
  height: 47vh;
  padding: 10px;
  margin-top: 15px;
  overflow-y: auto;
  box-shadow: 2px 2px 6px #909399, -2px -2px 6px #909399;
}
.left-one-class {
  flex: 1;
}
.left-two-class {
  flex: 1;
  margin-left: 15px;
}
.left-one-one-class,
.left-two-one-class {
  height: 60%;
  padding: 10px;
  overflow-y: auto;
  box-shadow: 2px 2px 6px #909399, -2px -2px 6px #909399;
  margin: 2px;
}
.left-one-two-class,
.left-two-two-class {
  height: calc(40% - 15px);
  margin-top: 15px;
  width: 100%;
  /* overflow-y: auto; */
  background: #3c3d3f;
  border: 2px solid #aaa;
}
.left-one-one-class:hover,
.left-two-one-class:hover,
.right-one-class:hover,
.right-two-class:hover {
  box-shadow: 2px 2px 6px #eee, -2px -2px 6px #eee;
}
.not-process-class {
  color: #c8c8c8;
  font-size: 15px;
  /* font-weight: bold; */
  margin-bottom: 10px;
}
.realtimestatus-class {
  height: 80%;
  width: 85%;
  background-image: url("./../../assets/images/realtimestatus/realtimestatus.jpg");
  background-size: 100% 100%;
  display: flex;
  margin: auto;
  justify-content: center;
  align-items: center;
  font-size: 45px;
  font-weight: bold;
  color: #fff;
}
.ul-class,
li {
  list-style: none;
  /* margin: 0; */
  /* padding: 0; */
}
.ul-class li {
  padding: 10px 0;
  color: #cad4d4;
  font-size: 16px;
}
.right-flow-class {
  height: 90%;
  overflow-y: auto;
}
.right-flow-class ul {
  display: flex;
  flex-wrap: wrap;
}
.right-flow-class ul li {
  list-style: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  margin-bottom: 30px;
}
.flow-cicle-class {
  width: 100px;
  height: 100px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 50%;
  background: #666666;
  box-shadow: 3px 3px 7px #bbb, -3px -3px 7px #bbb;
}
.current-node-class {
  background: #04bcc6;
}
.flow-cicle-class:hover {
  box-shadow: 3px 3px 7px #eee, -3px -3px 7px #eee;
}
.img-svg-class {
  margin: 0 5px;
}
.img-svg-class-arrow {
  width: 100px;
  height: 30px;
}
.flow-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.flow-info,
.flow_describe {
  color: #fff;
}
.handle-line-class {
  height: 84%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
/* .el-form :deep(.el-select-dropdown__item) {
  padding: 0 32px 0 20px;
}
:deep(.el-select__popper .el-popper .is-light .is-pure) {
  padding: 0 32px 0 20px;
} */
</style>