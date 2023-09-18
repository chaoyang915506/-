<template>
  <div>
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      label-width=""
      @submit.prevent
    >
      <el-form-item label="发送北斗卡号">
        <el-input
          v-model="queryParams.bdsNumber"
          @keyup.enter="getList"
          style="width: 6.875rem"
          placeholder="请输入发送北斗卡号" clearable
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="接收北斗卡号">
        <el-input
          v-model="queryParams.bdsNumber"
          style="width: 6.875rem"
          @keyup.enter="getList"
          placeholder="请输入接收北斗卡号"
          clearable
        ></el-input>
      </el-form-item> -->
      <el-form-item label="短报文类型">
        <!-- v-model="queryParams.originType" -->
        <el-select
          v-model="queryParams.msgType"
          style="width: 6.875rem"
          placeholder="请选择短报文类型"
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
      <el-form-item label="接收时间">
        <el-date-picker
          v-model="timePicker"
          type="datetimerange"
          @change="changeTime"
          clearable
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 15.625rem"
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
        <el-button type="primary" @click="handleSearch">批量导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="table_loading"
      :data="data.tableList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
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
      <el-table-column
        label="载体"
        prop="carrierName"
        align="center"
      ></el-table-column>
      <el-table-column
        label="短报文类型"
        prop="originType"
        align="center"
      ></el-table-column>
      <el-table-column
        label="通信内容"
        prop="cmdValue"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="经度" prop="lon" align="center"></el-table-column>
      <el-table-column label="纬度" prop="lat" align="center"></el-table-column>
      <el-table-column
        label="环境温度"
        prop="temperature"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" prop="code" align="center">
        <template #default="{ row }">
          <el-button type="text" size="default" @click="lookHandle(row)"
            >查看详情</el-button
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
    <el-dialog title="查看详情" v-model="lookState" width="56.25rem">
      <el-form
        :model="lookFrom"
        ref="form"
        label-width=""
        :inline="false"
        size="normal"
      >
        <el-row :gutter="20" style="margin-top: .625rem">
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
            <!-- <div class="content_cy"> {{ lookFrom.originType }}</div> -->
            <div class="content_cy">位置类</div>
          </el-col>
          <el-col :span="6" :offset="0">
            <div class="label_cy">载体:</div>
            <div class="content_cy">
              {{ lookFrom.carrierName }}
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: .625rem">
          <el-col :span="5" :offset="2">
            <div class="label_cy">经度:</div>
            <div class="content_cy">{{ lookFrom.lon }}</div>
          </el-col>
          <el-col :span="5" :offset="0">
            <div class="label_cy">纬度:</div>
            <div class="content_cy">{{ lookFrom.lat }}</div>
          </el-col>
          <el-col :span="4" :offset="0">
            <div class="label_cy">蓄电池电压:</div>
            <div class="content_cy">{{ lookFrom.batterVoltage }}</div>
          </el-col>
          <el-col :span="6" :offset="0">
            <div class="label_cy">蓄电池负载电压:</div>
            <div class="content_cy">
              {{ lookFrom.batteryLoadVoltage }}
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: .625rem">
          <el-col :span="5" :offset="2">
            <div class="label_cy">负载电流:</div>
            <div class="content_cy">{{ lookFrom.loadCurrent }}</div>
          </el-col>
          <el-col :span="5" :offset="0">
            <div class="label_cy">太阳能充电电流:</div>
            <div class="content_cy">{{ lookFrom.sunCurrent }}</div>
          </el-col>
          <el-col :span="4" :offset="0">
            <div class="label_cy">环境温度:</div>
            <div class="content_cy">{{ lookFrom.temperature }}</div>
          </el-col>
          <el-col :span="6" :offset="0">
            <div class="label_cy">灯器亮度设置值:</div>
            <div class="content_cy">
              {{ lookFrom.light }}
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: .625rem">
          <el-col :span="20" :offset="2">
            <div class="label_cy">上报时间:</div>
            {{ parseTime(lookFrom.sendTime, "{y}-{m}-{d} {h}:{i}:{s}") }}
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: .625rem">
          <el-col :span="20" :offset="2">
            <div>通信内容:</div>
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
import { 发送列表查询 } from "@/api/shortMessage/index.js";
const { proxy } = getCurrentInstance();
const { msg_type } = proxy.useDict("msg_type");
const table_loading = ref(false);
//查询时间
const timePicker = ref([]);
const props = defineProps({
  bdsNumber: {
    type: [String, Number],
  },
});
//分页查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  ishour: 1, //默认1为30天
});

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

watch(
  () => props.bdsNumber,
  (val) => {
    if (val) {
      queryParams.value.bdsNumber = val;
      getList();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

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
  queryParams.value.acceptTime = "";
  if (e.length == 2) {
    queryParams.value.sendTime = e[0];
    queryParams.value.acceptTime = e[1];
  }
}

// 查看
function lookHandle(row) {
  lookFrom.value = row;
  lookState.value = true;
}

//获取列表数据
async function getList() {
  table_loading.value = true;
  // let origin = await 发送列表查询(queryParams.value);
  // data.tableList = origin.rows;
  // total.value = origin.total;
  table_loading.value = false;
}
</script>

<style lang="scss" scoped>
.label_cy,
.content_cy {
  display: inline-block;
}
.content_cy {
  margin-left: .25rem;
}
</style>