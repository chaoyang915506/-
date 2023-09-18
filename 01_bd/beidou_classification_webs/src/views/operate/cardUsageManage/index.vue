<template>
  <div class="app-container app-box">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="北斗卡号">
        <el-input
          v-model="queryParams.bdsNumber"
          placeholder="请输入北斗卡号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="北斗卡状态" label-width="90px">
        <el-select
          v-model="queryParams.bdsState"
          placeholder="请输入北斗卡状态"
          clearable
        >
          <el-option
            v-for="item in bds_state"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="使用单位" label-width="90px">
        <tree-select
          v-model:value="queryParams.deptId"
          placeholder="请输入使用单位"
          clearable
          :options="data.deptOptions"
          :objMap="{ value: 'id', label: 'label', children: 'children' }"
        />
      </el-form-item>
      <el-form-item label="使用人">
        <el-input
          v-model="userName"
          placeholder="请输入使用人"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="接受时间">
        <el-date-picker
          v-model="timePicker"
          type="datetimerange"
          @change="getDate"
          class="timeline_css"
          value-format="YYYY-MM-DD HH:mm:ss"
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
    <el-button type="primary" @click="getList" style="float: right"
      >批量导入</el-button
    >
    <el-table
      v-loading="table_loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column label="北斗卡号" align="center" prop="bdsNumber" />
      <el-table-column label="北斗卡类型" align="center" prop="bdsVersion" />
      <el-table-column label="使用人" align="center" prop="userName" />
      <el-table-column label="使用单位" align="center" prop="deptName" />
      <el-table-column label="关联终端" align="center" prop="bdsState">
        <template #default="scope">
          {{ 56320 }}
        </template>
      </el-table-column>
      <el-table-column label="关联载体" align="center" prop="bdsState">
        <template #default="scope">
          {{ "中国海警2104" }}
        </template>
      </el-table-column>
      <el-table-column label="接收时间" align="center" prop="issueTime">
        <template #default="scope">
          {{ "2022-11-7" }}
        </template>
      </el-table-column>
      <el-table-column label="关联时间" align="center" prop="issueTime">
        <template #default="scope">
          {{ "2022-11-7" }}
        </template>
      </el-table-column>
      <el-table-column label="北斗卡状态" align="center" prop="bdsState">
        <template #default="scope">
          <dict-tag :options="bds_state" :value="scope.row.bdsState" />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="240"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <!-- <el-button
            size="mini"
            type="text"
            :disabled="scope.row.北斗卡状态 === '卡注销' ? true : false"
            @click="handleDistribution(scope.row)"
            >分配使用人</el-button
          > -->
          <el-button
            size="mini"
            type="text"
            :disabled="scope.row.北斗卡状态 === '卡注销' ? true : false"
            @click="handleRelation(scope.row)"
            >关联终端</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            @click="handleUnbinding(scope.row)"
            :disabled="scope.row.北斗卡状态 === '卡注销' ? true : false"
            >解绑</el-button
          > -->
          <el-button
            size="mini"
            type="text"
            :disabled="scope.row.北斗卡状态 === '卡注销' ? true : false"
            @click="handleCancellation(scope.row)"
            >注销</el-button
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
      :title="title"
      v-model="open"
      width="35%"
      append-to-body
      @close="cancel()"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item
          label="使用人"
          prop="userId"
          v-if="title === '分配使用人'"
        >
          <el-select
            v-model="form.userId"
            placeholder="请输入使用人"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in data.userList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="使用单位"
          v-if="title === '分配使用人'"
          prop="deptId"
        >
          <tree-select
            v-model:value="form.deptId"
            placeholder="请输入使用单位"
            clearable
            :options="data.deptOptions"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item
          label="终端编号"
          prop="terminalId"
          v-if="title === '关联终端'"
        >
          <el-input v-model="form.terminalId" placeholder="请输入终端编号" />
        </el-form-item>
        <el-form-item label="使用人" v-if="title === '解绑'">
          <span>{{ form.userName }}</span>
          <el-button
            style="float: right; margin-right: 40px"
            @click="unbindHandle('使用人')"
            type="text"
            >解绑</el-button
          >
        </el-form-item>
        <el-form-item label="终端编号" v-if="title === '解绑'">
          <span>{{ form.terminalId }}</span>
          <el-button
            style="float: right; margin-right: 40px"
            @click="unbindHandle('终端编号')"
            type="text"
            >解绑</el-button
          >
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer" v-show="title !== '解绑'">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <!-- <el-button @click="cancel">取 消</el-button> -->
        </div>
      </template>
    </el-dialog>
    <!-- 添加或者修改 -->
    <el-dialog
      title="北斗卡注销"
      v-model="data.writeOffOpen"
      width="50%"
      append-to-body
      @close="cancel()"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <h3>申请详情：</h3>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="北斗卡号" prop="北斗卡号">
              <span>{{ form.bdsNumber ? form.bdsNumber : "暂无" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="北斗卡类型" prop="北斗卡类型">
              <span>{{ form.bdsVersion ? form.bdsVersion : "暂无" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="使用人" prop="使用人">
              <span>{{ form.userName ? form.userName : "暂无" }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="使用单位" prop="使用单位">
              <span>{{ form.deptName ? form.deptName : "暂无" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关联终端" prop="关联终端">
              <span>{{ form.glzd ? form.glzd : "暂无" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关联载体" prop="关联载体">
              <span>{{ form.glzt ? form.glzt : "暂无" }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <hr />
        <el-form-item label="注销原因" prop="approvalStatus">
          <el-input v-model="data.form.m"/>
        </el-form-item>
        <el-form-item label="附件" prop="approvalOpinion">
           <el-upload class="upload-demo" :on-change="handleChange" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false" drag action="">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="data.writeOffOpen = false;data.form = {}">确 定</el-button>
          <el-button @click="data.writeOffOpen = false;data.form = {}">取 消</el-button>
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
import {
  查询,
  注销,
  解绑使用人,
  解绑终端编号,
  关联终端,
  分配使用人,
} from "@/api/cardUsageManage/index.js";
import { treeselect } from "@/api/system/dept";
import { 查询部门列表, 查询人员列表 } from "@/api/applicationCard/index.js";
const { proxy } = getCurrentInstance();
const { bds_state } = proxy.useDict("bds_state");
let userName = ref(null);
let data = reactive({
  fileList:[],
  deptOptions: {},
  depList: [],
  userList: [],
  open: false,
  writeOffOpen: false,
  form: {},
  rules: {
    userId: [{ required: true, message: "使用人不能为空", trigger: "change" }],
    deptId: [
      { required: true, message: "使用单位不能为空", trigger: "change" },
    ],
    terminalId: [
      { required: true, message: "终端编号不能为空", trigger: "blur" },
    ],
  },
  title: null,
  timePicker: null,
  total: 0,
  table_loading: false,
  tableList: [],
  tableData: [],
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
});
const {
  title,
  open,
  tableData,
  table_loading,
  total,
  queryParams,
  timePicker,
  form,
  rules,
  tableList,
  fileList
} = toRefs(data);
onMounted(() => {
  getList();
  getUserDepList();
});
const getUserDepList = () => {
  treeselect().then((response) => {
    data.deptOptions = response.data;
    console.log(data.deptOptions, "deptOptions.value");
  });
  查询人员列表().then((res) => {
    if (res.code === 200) data.userList = res.rows;
  });
};
// 分配使用人
const handleDistribution = (val) => {
  data.open = true;
  data.title = "分配使用人";
  data.form.userId = val.userId;
  data.form.deptId = val.deptName;
};
// 表格勾选
const handleSelectionChange = () => {};
// 编辑
const handleUpdate = (val) => {
  data.title = "编辑北斗卡";
  data.open = true;
  data.form = val;
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
// 条件搜索
const handleSearch = () => {};
// 提交
const submitForm = () => {
  proxy.$refs["formRef"].validate(async (valid) => {
    let res;
    if (valid) {
      if (data.title === "分配使用人") {
        分配使用人(data.queryParams).then((res) => {
          if (res.code === 200) {
            proxy.$modal.msgSuccess("分配使用人成功");
            cancel();
            getList();
          }
        });
      }
      if (data.title === "关联终端") {
        res = await 关联终端({
          id: data.form.id,
          terminalId: data.form.terminalId,
        });
      }
      if (res && res.code === 200) {
        proxy.$modal.msgSuccess(data.title + "成功");
        getList();
        cancel();
      }
    }
  });
};
// 取消
const cancel = () => {
  data.form = {};
  data.open = false;
  delete data.queryParams.deptId;
};
// 注销
const handleCancellation = (val) => {
  // proxy.$modal.confirm("是否确认注销选中的数据项？").then(async function () {
  //   let res = await 注销({ id: val.id });
  //   if (res.code === 200) proxy.$modal.msgSuccess("提交成功");
  //   getList();
  // });
  data.writeOffOpen = true;
  data.form = val;
};
// 解绑
const handleUnbinding = (val) => {
  data.open = true;
  data.title = "解绑";
  data.form = val;
};
// 解绑
const unbindHandle = (val) => {
  proxy.$modal.confirm("是否确认解绑" + val + "？").then(async function () {
    let res;
    if (val === "使用人") {
      res = await 解绑使用人({ id: data.form.id, userId: data.form.userId });
    }
    if (val === "终端编号") {
      res = await 解绑终端编号({
        id: data.form.id,
        terminalId: data.form.terminalId,
      });
    }
    if (res.code === 200) {
      proxy.$modal.msgSuccess(val + "解绑成功");
      cancel();
      getList();
    } else {
      proxy.$modal.msgWarning(val + "解绑失败");
    }
  });
};
// 关联终端
const handleRelation = (val) => {
  // if (val.终端编号 !== "")  return proxy.$modal.msgWarning("请先解绑终端编号再进行关联！");
  data.open = true;
  data.title = "关联终端";
  data.form = val;
};
const getDate = (val) => {
  if (val) {
    data.queryParams.startTime = val[0];
    data.queryParams.endTime = val[1];
  } else {
    data.queryParams.startTime = "";
    data.queryParams.endTime = "";
  }
};
// 成功
const handleChange = (file, fileList) => {
    data.fileList = [fileList[fileList.length - 1]]
    proxy.$refs['fileRef'].clearValidate()
}
// 删除文件
const handleRemove = (file, fileList) => {
    data.fileList = fileList
}
</script>

<style scoped>
::v-deep .el-upload-dragger {
  width: 260px;
  height: 115px;
}
::v-deep .el-range-editor--medium.el-input__inner {
  width: 220px !important;
}
</style>
