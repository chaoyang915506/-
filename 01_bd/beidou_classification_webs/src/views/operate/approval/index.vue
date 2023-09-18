<template>
  <div class="app-container app-box">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="申请类型">
        <el-select
          v-model="queryParams.申请类型"
          placeholder="请输入申请类型"
          clearable
        >
          <el-option
            v-for="item in apply_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="北斗卡号">
        <el-input
          v-model="queryParams.北斗卡号"
          clearable
          placeholder="请输入北斗卡号"
        ></el-input>
      </el-form-item>
      <el-form-item> </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryParams.状态"
          placeholder="请输入状态"
          clearable
        >
          <el-option
            v-for="item in approval_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
              <el-button
        icon="Search"
        type="primary"
        class="btn_submit"
        style="margin-left:6px"
        @click="handleSearch"
        >查询</el-button
      >
      </el-form-item>

    </el-form>
    <el-table
      v-loading="table_loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column label="申请类型" align="center" prop="receiptsType" />
      <el-table-column label="北斗卡号" align="center" prop="北斗卡号" />
      <el-table-column label="填报用户" align="center" prop="userName" />
      <el-table-column label="申请单位" align="center" prop="deptName" />
      <el-table-column label="操作原因" align="center" prop="cause" />
      <el-table-column label="提交时间" align="center" prop="createTime" />
      <el-table-column label="状态" align="center" prop="approvalStatus">
        <template #default="scope">
          <dict-tag
            :options="approval_status"
            :value="scope.row.approvalStatus"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
        v-hasPermi="['operate:approval:examine']"
      >
        <template #default="scope">
          <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
            >审核</el-button
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
    <el-dialog
      title="审核"
      v-model="open"
      width="50%"
      append-to-body
      @close="cancel()"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <h3>申请详情：</h3>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="申请人" prop="申请人">
              <span>{{ form.userName ? form.userName : "暂无" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请部门" prop="申请部门">
              <span>{{ form.deptName ? form.deptName : "暂无" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请数量" prop="申请数量">
              <span>{{ form.applyNumber ? form.applyNumber : "暂无" }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="所用项目" prop="所用项目">
              <span>{{ form.useItem ? form.useItem : "暂无" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用 途" prop="用途">
              <span>{{ form.use ? form.use : "暂无" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="附 件" prop="附 件">
              <span
                @click="
                  exportHandle(form.fileName ? form.fileName : '审核附件')
                "
                style="color: #178bff; cursor: pointer"
                >{{ form.fileName ? form.fileName : "审核附件" }}</span
              >
            </el-form-item>
          </el-col>
        </el-row>

        <hr />
        <h3>审批：</h3>
        <el-form-item label="审核结果" prop="approvalStatus">
          <el-select
            v-model="form.approvalStatus"
            placeholder="请输入审核结果"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in approval_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="approvalOpinion">
          <el-input
            v-model="form.approvalOpinion"
            placeholder="请输入审核意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <!-- <el-button @click="cancel">取 消</el-button> -->
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { uuid } from "@/utils/uuid.js";
import { getTimeStr } from "@/utils/time.js";
const { proxy } = getCurrentInstance();
const { bds_state, approval_status, apply_type } = proxy.useDict(
  "bds_state",
  "approval_status"
);
import { 查询, 获取审批信息, 导出, 审核 } from "@/api/approval/index.js";
let data = reactive({
  open: false,
  form: {},
  rules: {
    approvalStatus: [
      { required: true, message: "审核结果不能为空", trigger: "blur" },
    ],
    approvalOpinion: [
      { required: true, message: "审核意见不能为空", trigger: "blur" },
    ],
  },
  timePicker: null,
  total: 0,
  table_loading: false,
  tableList: [],
  tableData: [
    {
      id: 1,
      申请类型: "申请北斗卡",
      北斗卡号: "4299",
      填报用户: "陈珊",
      申请单位: "XXX单位",
      操作原因: "测试注销",
      提交时间: "2022-11-01 15:21:30",
      状态: "通过",
    },
    {
      id: 2,
      申请类型: "申请北斗卡",
      北斗卡号: "4299",
      填报用户: "陈珊",
      申请单位: "XXX单位",
      操作原因: "测试注销",
      提交时间: "2022-11-01 15:21:30",
      状态: "通过",
    },
    {
      id: 3,
      申请类型: "申请北斗卡",
      北斗卡号: "4299",
      填报用户: "陈珊",
      申请单位: "XXX单位",
      操作原因: "测试注销",
      提交时间: "2022-11-01 15:21:30",
      状态: "通过",
    },
    {
      id: 4,
      申请类型: "申请北斗卡",
      北斗卡号: "4299",
      填报用户: "陈珊",
      申请单位: "XXX单位",
      操作原因: "测试注销",
      提交时间: "2022-11-01 15:21:30",
      状态: "通过",
    },
    {
      id: 5,
      申请类型: "申请北斗卡",
      北斗卡号: "4299",
      填报用户: "陈珊",
      申请单位: "XXX单位",
      操作原因: "测试注销",
      提交时间: "2022-11-01 15:21:30",
      状态: "通过",
    },
    {
      id: 6,
      申请类型: "申请北斗卡",
      北斗卡号: "4299",
      填报用户: "陈珊",
      申请单位: "XXX单位",
      操作原因: "测试注销",
      提交时间: "2022-11-01 15:21:30",
      状态: "通过",
    },
    {
      id: 7,
      申请类型: "申请北斗卡",
      北斗卡号: "4299",
      填报用户: "陈珊",
      申请单位: "XXX单位",
      操作原因: "测试注销",
      提交时间: "2022-11-01 15:21:30",
      状态: "通过",
    },
    {
      id: 8,
      申请类型: "申请北斗卡",
      北斗卡号: "4299",
      填报用户: "陈珊",
      申请单位: "XXX单位",
      操作原因: "测试注销",
      提交时间: "2022-11-01 15:21:30",
      状态: "通过",
    },
    {
      id: 9,
      申请类型: "申请北斗卡",
      北斗卡号: "4299",
      填报用户: "陈珊",
      申请单位: "XXX单位",
      操作原因: "测试注销",
      提交时间: "2022-11-01 15:21:30",
      状态: "通过",
    },
    {
      id: 10,
      申请类型: "申请北斗卡",
      北斗卡号: "4299",
      填报用户: "陈珊",
      申请单位: "XXX单位",
      操作原因: "测试注销",
      提交时间: "2022-11-01 15:21:30",
      状态: "通过",
    },
    {
      id: 11,
      申请类型: "申请北斗卡",
      北斗卡号: "4299",
      填报用户: "陈珊",
      申请单位: "XXX单位",
      操作原因: "测试注销",
      提交时间: "2022-11-01 15:21:30",
      状态: "通过",
    },
  ],
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
});
const {
  open,
  tableData,
  table_loading,
  total,
  queryParams,
  timePicker,
  form,
  rules,
  tableList,
} = toRefs(data);
onMounted(() => {
  getList();
});
// 表格勾选
const handleSelectionChange = () => {};
// 编辑
const handleUpdate = (val) => {
  获取审批信息(val.approvalId).then((res) => {
    if (res.code === 200) data.form = res.data[0];
    data.form.id = val.id ? val.id : null;
    data.form.approvalId = val.approvalId ? val.approvalId : null;
  });
  data.open = true;
};
// 获取列表
const getList = async () => {
  let res = await 查询(data.queryParams);
  if (res.code === 200) {
    data.tableList = res.rows;
    data.total = res.total;
  } else {
    data.tableList = [];
    data.total = 0;
  }
};
// 提交
const submitForm = () => {
  proxy.$refs["formRef"].validate(async (valid) => {
    if (valid) {
      let res = await 审核(data.form);
      if (res.code === 200) {
        proxy.$modal.msgSuccess("审核成功");
      } else {
        proxy.$modal.msgWarning("审核失败");
      }
      data.open = false;
      getList();
      cancel();
    }
  });
};
// 取消
const cancel = () => {
  data.form = {};
  data.open = false;
};
const exportHandle = (name) => {
  let type = name.split(".");
  导出({
    fileName: data.form.file,
    delete: false,
  }).then((res) => {
    let blob = new Blob([res]);
    let url = window.URL.createObjectURL(blob);
    let donloadElement = document.createElement("a");
    donloadElement.style.display = "none";
    donloadElement.href = url;
    donloadElement.download = `${type[0]}.${type[1]}`;
    document.body.appendChild(donloadElement);
    donloadElement.click();
    document.body.removeChild(donloadElement);
    window.URL.revokeObjectURL(url);
    proxy.$modal.msgSuccess("导出成功");
  });
};
</script>

<style scoped lang="scss">
::v-deep .el-upload-dragger {
  width: 260px;
  height: 115px;
}
::v-deep .el-range-editor--medium.el-input__inner {
  width: 220px !important;
}
.el-row span {
  display: inline-block;
  width: 200px;
}
</style>
