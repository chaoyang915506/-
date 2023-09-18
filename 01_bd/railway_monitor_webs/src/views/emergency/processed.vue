<template>
  <div class="app-container">
    <div class="top-title-class">
      <span>已完结</span>
      <span>{{ processedCount }}</span>
    </div>
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
          <!-- size="small" -->
      <el-form-item prop="eventName">
        <el-input
          v-model="queryParams.eventName"
          placeholder="请输入事件名称"
          clearable
          @keyup.enter="handleQuery"
        />
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
          >确定</el-button
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
      <el-table-column label="使用模型" align="center" prop="model" />
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
    <el-dialog title="查看" v-model="open" width="50%">
      <el-form
        ref="formRef"
        :model="form"
        label-width="110px"
        :class="isCheck ? 'el-form-check' : ''"
      >
        <el-form-item label="事件名称：" prop="eventName">
          <el-input :disabled="isCheck" v-model="form.eventName" />
        </el-form-item>
        <el-form-item label="事件类型：" prop="eventType">
          <el-select
            v-model="form.eventType"
            clearable
            :disabled="isCheck"
            style="width: 100%"
            size="small"
            placeholder=" "
          >
            <el-option
              v-for="dict in event_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="事件等级：" prop="eventGrade">
          <el-select
            v-model="form.eventGrade"
            clearable
            :disabled="isCheck"
            style="width: 100%"
            size="small"
            placeholder=" "
          >
            <el-option
              v-for="dict in event_grade"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="事发时间：" prop="timeToEvent">
          <el-date-picker
            v-model="form.timeToEvent"
            type="datetime"
            clearable
            :disabled="isCheck"
            value-format="YYYY-MM-DD hh:mm:ss"
            style="width: 100%"
            size="small"
          />
        </el-form-item>
        <el-form-item label="结束时间：" prop="finishTime">
          <el-date-picker
            v-model="form.finishTime"
            type="datetime"
            clearable
            :disabled="isCheck"
            value-format="YYYY-MM-DD hh:mm:ss"
            style="width: 100%"
            size="small"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="eState">
          <el-select
            v-model="form.eState"
            clearable
            :disabled="isCheck"
            style="width: 100%"
            size="small"
            placeholder=" "
          >
            <el-option
              v-for="dict in e_state"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应急预案：" prop="planName">
          <!-- <a
            v-show="form.planName"
            :href="pdfUrl + form.filePath"
            target="_blank"
            style="color: #04bcc6; cursor: pointer"
            >《 {{ form.planName }} 》</a
          > -->
          <span
            v-if="form.planName"
            @click="lookdocumnent = true"
            style="color: #04bcc6; cursor: pointer"
            >《{{ form.planName }}》</span
          >
        </el-form-item>
        <div class="right-flow-class" v-show="form.flows && form.flows.length">
          <el-scrollbar style="height: 100%">
            <ul>
              <li v-for="(item, index) in form.flows" :key="index">
                <div class="flow-wrap">
                  <div class="flow-cicle-class">
                    {{ item.company_name }}
                  </div>
                  <img
                    v-if="index != form.flows.length - 1"
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
          </el-scrollbar>
        </div>
      </el-form>
    </el-dialog>
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
  </div>
</template>
<script setup>
import {
  getDispose,
  getStateCount,
  getDisposeFlow,
  processedQuery,
  getPreviewById,
} from "@/api/emergency/emergency.js";

const { proxy } = getCurrentInstance();
const { event_type, event_grade, e_state } = proxy.useDict(
  "event_type",
  "event_grade",
  "e_state"
);
const lookdocumnent = ref(false);
const tableData = ref([]);
const open = ref(false);
const isCheck = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const pdfUrl = ref("");
const total = ref(0);
let processedCount = ref(0);
const data = reactive({
  timePicker: [],
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    dateRange: [],
    eState: "2",
    eventType: undefined,
    eventName: undefined,
    beginTime: undefined,
    endTime: undefined,
    eventGrade: undefined,
  },
});
const getDate = (e) => {
  if (!e) {
    data.queryParams.beginTime = "";
    data.queryParams.endTime = "";
  } else {
    data.queryParams.beginTime = e[0];
    data.queryParams.endTime = e[1];
  }
};
const { queryParams, form, timePicker } = toRefs(data);
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
// 获取统计
const getStateCountData = async () => {
  let res = await getStateCount();
  if (res.code == 200) {
    if (res.data && res.data.length) {
      let result = res.data.find((item) => item.eState == 2);
      if (result) {
        processedCount.value = result.count;
      }
    }
  }
};
// 获取流程
const getDisposeFlowData = () => {};
// 根据id获取信息
const getById = async (id) => {
  let res = await processedQuery({
    id,
  });

  if (res.data.planId) {
    let pdfdata = await getPreviewById(res.data.planId);
    // console.log(pdfdata, "allpdf");
    pdfUrl.value = proxy.$arrayBufferToBlob(
      pdfdata.data ? pdfdata.data.fileBytes : "",
      "application/pdf"
    );
  }
  if (res.code == 200) {
    // console.log(res, ";res");
    form.value = res.data;
  }
};
// 查看
const handleCheck = (row) => {
  // console.log(row, "查看数据");
  getById(row.id);
  open.value = true;
  isCheck.value = true;
};
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
  // getStateCountData()
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  getStateCountData();
  handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {}
// 格式化列表
const formatterEventType = (row, column, columnIndex) => {
  let result = event_type.value.find((item) => item.value == columnIndex);
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
const formatterEventGrade = (row, column, columnIndex) => {
  let result = event_grade.value.find((item) => item.value == columnIndex);
  // console.log(result, "查");
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
getList();
getStateCountData();
</script>
<style scoped>
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
  box-shadow: 2px 2px 6px #909399, -2px -2px 6px #909399;
}
.top-title-class span:nth-child(2) {
  color: #fff;
  font-size: 34px;
  margin-top: 5px;
}
.right-flow-class {
  height: 30vh;
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
.flow-cicle-class:hover {
  box-shadow: 3px 3px 7px #eee, -3px -3px 7px #eee;
}
.img-svg-class {
  margin: 0 5px;
}
.img-svg-class-arrow {
  width: 110px;
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
</style>