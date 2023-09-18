<template>
  <div style="display: initial">
    <el-form
      :model="queryParams"
      ref="queryRef"
      @submit.prevent
      :inline="true"
      label-width=""
    >
      <el-form-item label="载体">
        <el-input
          @keyup.enter="getList"
          style="width: 150px"
          v-model="queryParams.carrierName"
          placeholder="请输入载体"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="北斗卡号">
        <el-input
          @keyup.enter="getList"
          style="width: 150px"
          v-model="queryParams.bdsNumber"
          placeholder="请输入北斗卡号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="短报文类型">
        <el-select
          v-model="queryParams.msgType"
          placeholder="请选择短报文类型"
          clearable
          style="width: 150px"
          filterable
        >
          <el-option
            v-for="item in msg_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属单位">
        <el-input
          @keyup.enter="getList"
          style="width: 150px"
          v-model="queryParams.deptName"
          placeholder="请输入所属单位"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="收发时间">
        <el-date-picker
          v-model="timePicker"
          type="daterange"
          @change="getDate"
          clearable
          value-format="YYYY-MM-DD"
          style="width: 250px"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          icon="Search"
          type="primary"
          class="btn_submit"
          @click="getList"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-loading="table_loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index" label="序号" width="55" align="center">
        <template #default="scope">
          {{
            scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize
          }}
        </template>
      </el-table-column>
      <el-table-column label="北斗卡号" align="center" prop="bdsNumber" />
      <el-table-column label="载体" align="center" prop="carrierName" />
      <el-table-column label="所属单位" align="center" prop="deptName" />
      <el-table-column label="短报文类型" align="center" prop="deptName"
        >位置类</el-table-column
      >
      <el-table-column label="发送次数" align="center" prop="sendCount">
        <template #default="{ row }">
          <el-button type="text" @click="sendHandel(row)">
            {{ row.sendCount || "0" }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="接收次数" align="center" prop="acceptCount">
        <template #default="{ row }">
          <el-button type="text" @click="receiptHandle(row)">
            {{ row.acceptCount || "0" }}</el-button
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
  </div>
</template>

<script setup>
import { computed, reactive } from "@vue/reactivity";

let store = useStore();
import { 短报文列表查询 } from "@/api/shortMessage/index.js";
const emit = defineEmits(["sendbdsNumber"]);
const { proxy } = getCurrentInstance();
const { msg_type } = proxy.useDict("msg_type");
let data = reactive({
  timePicker: null,
  total: 0,
  table_loading: false,
  tableList: [],
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    ishour: 1, //默认30天
    bdsVersion: "北斗二号",
    msgType: "",
  },
});
const { table_loading, total, queryParams, timePicker, tableList } =
  toRefs(data);
onMounted(() => {
  getList();
});
// 接收
function receiptHandle(row) {
  let metaRouteArr = ref([
    {
      meta: {
        title: "接收次数",
      },
    },
  ]);
  emit("sendbdsNumber", row.bdsNumber);
  store.dispatch("app/setNavigationRouter", metaRouteArr.value);
}
//发送
function sendHandel(row) {
  let metaRouteArr = ref([
    {
      meta: {
        title: "发送次数",
      },
    },
  ]);
  emit("sendbdsNumber", row.bdsNumber);
  store.dispatch("app/setNavigationRouter", metaRouteArr.value);
}

// 编辑
const handleUpdate = (val) => {
  data.title = "编辑北斗卡";
  data.open = true;
  data.form = val;
};
// 获取列表
const getList = async () => {
  try {
    table_loading.value = true;
    if (queryParams.value.msgType == 2 || !queryParams.value.msgType) {
      const res = await 短报文列表查询(queryParams.value);
      tableList.value = res.rows;
      total.value = res.total;
      table_loading.value = false;
    } else {
      tableList.value = [];
      total.value = 0;
      table_loading.value = false;
    }
  } catch (error) {
    table_loading.value = false;
  }
};

function getDate(e) {
  queryParams.value.sendTime = "";
  queryParams.value.acceptTim = "";
  if (e.length == 2) {
    queryParams.value.sendTime = e[0];
    queryParams.value.acceptTim = e[1];
  }
}
</script>

<style scoped>
.title {
  display: inline-block;
  margin-left: 20px;
}
::v-deep .el-upload-dragger {
  width: 260px;
  height: 115px;
}
::v-deep .el-range-editor--medium.el-input__inner {
  width: 220px !important;
}
::v-deep .pagination-container .el-pagination {
  bottom: 24px !important;
}
</style>