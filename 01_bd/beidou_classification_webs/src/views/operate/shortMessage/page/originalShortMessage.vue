<template>
  <div>
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="">
      <el-form-item label="发送北斗卡号">
        <el-input
          v-model="queryParams.bdsNumber"
          style="width: 110px"
          placeholder="请输入发送北斗卡号"
        ></el-input>
      </el-form-item>
      <el-form-item label="接收北斗卡号">
        <el-input
          v-model="queryParams.receiverCode"
          style="width: 110px"
          placeholder="请输入接收北斗卡号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="短报文类型">
        <el-select
          v-model="queryParams.msgType"
          style="width: 110px"
          placeholder="请输入短报文类型"
          clearable
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
      <el-form-item label="收发时间">
        <el-date-picker
          v-model="timePicker"
          type="daterange"
          @change="changeTime"
          clearable
          value-format="YYYY-MM-DD"
          style="width: 250px"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="changeText">{{ timeText }}</el-button>
        <el-button
          icon="Search"
          type="primary"
          class="btn_submit"
          @click="getList"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleExport">批量导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="table_loading"
      :data="data.tableList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="25" align="center">
      </el-table-column>
      <el-table-column label="序号" prop="code" align="center">
        <template #default="scope">
          {{
            scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="发送北斗卡号"
        prop="bdsNumber"
        align="center"
      ></el-table-column>
      <el-table-column
        label="接收北斗卡号"
        prop="receiverCode"
        align="center"
      ></el-table-column>
      <el-table-column label="短报文类型" prop="originType" align="center">
        位置类</el-table-column
      >
      <el-table-column label="接发时间" prop="receiverTime" align="center">
        <template #default="{ row }">
          {{ parseTime(row.sendTime, "{y}-{m}-{d} {h}:{i}:{s}") }}
        </template>
      </el-table-column>
      <el-table-column
        label="原始短报文内容"
        prop="cmdValue"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="操作" prop="code" align="center">
        <template #default="{ row }">
          <el-button type="text" size="default" @click="lookHandle(row)"
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
    <el-dialog title="查看详情" v-model="lookState" width="900px">
      <el-form
        :model="lookFrom"
        ref="form"
        label-width=""
        :inline="false"
        size="normal"
      >
        <el-row :gutter="20">
          <el-col :span="5" :offset="2">
            <div class="label_cy">发送北斗卡号:</div>
            <div class="content_cy">{{ lookFrom.bdsNumber }}</div>
          </el-col>
          <el-col :span="5" :offset="0">
            <div class="label_cy">接收北斗卡号:</div>
            <div class="content_cy">{{ lookFrom.receiverCode }}</div>
          </el-col>
          <el-col :span="4" :offset="0">
            <div class="label_cy">短报文类型:</div>
            <!-- <div class="content_cy">{{ lookFrom.originType }}</div> -->
            <div class="content_cy">位置类</div>
          </el-col>
          <el-col :span="6" :offset="0">
            <div class="label_cy">接发时间:</div>
            <div class="content_cy">
              {{ parseTime(lookFrom.sendTime, "{y}-{m}-{d} {h}:{i}:{s}") }}
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="20" :offset="2">
            <div>原始短报文内容：</div>
            <div>
              {{ lookFrom.cmdValue }}
            </div>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="lookState = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { 短报文列表查询新, 导出原始短报文 } from "@/api/shortMessage/index.js";
const { proxy } = getCurrentInstance();
const { msg_type } = proxy.useDict("msg_type");
const table_loading = ref(false);
const ids = ref([]);
//查询时间
const timePicker = ref([]);
//分页查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  ishour: 1, //默认30天
  msgType: "",
});
//查看开关
const lookState = ref(false);

const total = ref(0);
const data = reactive({
  lookFrom: {}, //查看数据
  tableList: [],
});
//查看参数
const lookFrom = ref({});

function changeTime(e) {
  queryParams.value.sendTime = "";
  queryParams.value.acceptTim = "";
  if (e.length == 2) {
    queryParams.value.sendTime = e[0];
    queryParams.value.acceptTim = e[1];
  }
}

// 查看
function lookHandle(row) {
  lookFrom.value = row;
  lookState.value = true;
}

//获取列表数据
async function getList() {
  try {
    table_loading.value = true;
    if (queryParams.value.msgType == 2 || !queryParams.value.msgType) {
      const res = await 短报文列表查询新(queryParams.value);
      data.tableList = res.rows;
      total.value = res.total;
      table_loading.value = false;
    } else {
      data.tableList = [];
      total.value = 0;
      table_loading.value = false;
    }
  } catch (error) {
    table_loading.value = false;
  }
}
// 导出文件
async function handleExport() {
  table_loading.value = true;
  const formData = new FormData();
  if (ids.value.length > 0) {
    formData.append("ids", ids.value.join(","));
  }
  formData.append("ishour", 1);
  const res = await 导出原始短报文(formData);
  proxy.downDefinedUrlFile(res, "原始短报文.xlsx");
  table_loading.value = false;
}

// 表格勾选
const handleSelectionChange = (e) => {
  ids.value = e.map((i) => i.id);
};
const timeText = ref("30天");
function changeText() {
  if (timeText.value == "30天") {
    timeText.value = "24小时";
    queryParams.value.ishour = 0;
    getList();
  } else {
    timeText.value = "30天";
    queryParams.value.ishour = 1;
    getList();
  }
}
onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
.label_cy,
.content_cy {
  display: inline-block;
}
.content_cy {
  margin-left: 4px;
}
</style>