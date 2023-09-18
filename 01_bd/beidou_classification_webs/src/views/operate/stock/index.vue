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
          v-model="queryParams.北斗卡号"
          placeholder="请输入北斗卡号"
        ></el-input>
      </el-form-item>
      <el-form-item label="北斗卡段">
        <el-input
          v-model="queryParams.北斗卡段1"
          placeholder="请输入北斗卡段"
          style="width:48%"
        ></el-input>
        <span>至</span>
        <el-input
          v-model="queryParams.北斗卡段2"
          style="width:48%"

          placeholder="请输入北斗卡段"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="Search"
          type="primary"
          class="btn_submit"
          @click="handleSearch"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item style="float: right">
        <!-- <el-button type="primary" class="common_style" @click="handleIssued">下发</el-button> -->
        <el-button type="primary" class="common_style" @click="handleImport"
          >导入</el-button
        >
        <el-button type="primary" class="common_style" @click="handleAdd"
          >入库</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-loading="table_loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column label="北斗卡号" align="center" prop="bdsNumber" />
      <el-table-column label="北斗卡版本" align="center" prop="bdsVersion" />
      <el-table-column label="北斗卡状态" align="center" prop="bdsState">
        <template #default="scope">
          <dict-tag :options="bds_state" :value="scope.row.bdsState" />
        </template>
      </el-table-column>
      <el-table-column label="入库时间" align="center" prop="createTime" />
      <el-table-column
        label="操作"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="text" @click="handleDelete(scope.row)"
            >删除</el-button
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
      width="30%"
      append-to-body
      @close="cancel()"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="110px"
        v-if="title === '入库北斗卡' || title === '编辑北斗卡'"
      >
        <el-form-item label="北斗卡号" prop="bdsNumber">
          <el-input v-model="form.bdsNumber" placeholder="请输入北斗卡号" />
        </el-form-item>
        <el-form-item label="北斗卡版本" prop="bdsVersion">
          <!-- <el-input v-model="form.北斗版本" placeholder="请输入北斗卡版本" /> -->
          <el-select
            v-model="form.bdsVersion"
            placeholder="请选择北斗卡版本"
            style="width: 100%"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="北斗卡状态" prop="bdsState" v-if="title === '编辑北斗卡'">
          <el-select
            v-model="form.bdsState"
            placeholder="请输入北斗卡状态"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in bds_state"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="110px"
        v-if="title === '下发卡'"
      >
        <el-form-item label="下发单位" prop="deptId">
          <tree-select
            v-model:value="form.deptId"
            :options="deptOptions"
            placeholder="请选择下发单位"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
            clearable
          />
        </el-form-item>
      </el-form>
      <div style="height: 150px">
        <el-upload
          v-if="title === '导入'"
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip text-center">
              <span>仅允许导入xls、xlsx格式文件。</span>
              <el-link
                type="primary"
                :underline="false"
                style="font-size: 12px; vertical-align: baseline"
                @click="importTemplate"
                >下载模板</el-link
              >
            </div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <div class="dialog-footer" v-if="title === '导入'">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <!-- <el-button @click="cancel">取 消</el-button> -->
        </div>
        <div class="dialog-footer" v-else>
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { getTimeStr } from "@/utils/time.js";
const { proxy } = getCurrentInstance();
const { bds_state } = proxy.useDict("bds_state");
import { 入库, 列表, 删除, 编辑, 下发 } from "@/api/stock/index.js";
import { treeselect } from "@/api/system/dept";
import { getToken } from "@/utils/auth";
const options = [
  {
    value: "北斗二号",
    label: "北斗二号",
  },
  {
    value: "北斗三号",
    label: "北斗三号",
  },
];
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/app/card/importData",
});
const deptOptions = ref(undefined);
let data = reactive({
  tableSelectId: [],
  open: false,
  form: {},
  rules: {
    bdsNumber: [
      { required: true, message: "北斗卡号不能为空", trigger: "blur" },
    ],
    bdsVersion: [
      { required: true, message: "北斗卡版本不能为空", trigger: "blur" },
    ],
    bdsState: [
      { required: true, message: "北斗卡状态不能为空", trigger: "change" },
    ],
    deptId: [
      { required: true, message: "下发单位不能为空", trigger: "change" },
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
} = toRefs(data);
onMounted(() => {
  getList();
  treeselect().then((response) => {
    deptOptions.value = response.data;
  });
});
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
  getDepList();
};
/** 下载模板操作 */
function importTemplate() {
  proxy.download("/app/card/importTemplate", {}, `卡库存管理模板.xlsx`);
}
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
  cancel();
}
// 表格勾选
const handleSelectionChange = (val) => {
  data.tableSelectId = val.map((item) => {
    return item.id;
  });
};
// 添加
const handleAdd = () => {
  data.title = "入库北斗卡";
  data.open = true;
};
// 编辑
const handleUpdate = (val) => {
  data.title = "编辑北斗卡";
  data.open = true;
  data.form = val;
};
// 删除
const handleDelete = (val) => {
  proxy.$modal.confirm("是否确认删除选中的数据项？").then(function () {
    删除(val.id).then((res) => {
      if (res.code === 200) proxy.$modal.msgSuccess("删除成功");
      getList();
    });
  });
};
// 获取列表
const getList = () => {
  列表(data.queryParams).then((res) => {
    data.tableList = res.rows;
  });
};
// 条件搜索
const handleSearch = () => {
  //  data.timePicker
  // queryParams.申请部门
  // queryParams.申请人
};
// 提交
const submitForm = () => {
  proxy.$refs["formRef"].validate(async (valid) => {
    if (valid) {
      let res;
      if (data.title === "编辑北斗卡") {
        res = await 编辑(data.form);
        if (res.code === 200) proxy.$modal.msgSuccess("编辑成功");
        proxy.$modal.msgSuccess("编辑成功");
      }
      if (data.title === "入库北斗卡") {
        res = await 入库(data.form);
        if (res.code === 200) proxy.$modal.msgSuccess("入库成功");
      }
      if (data.title === "下发卡") {
        data.form.ids = data.tableSelectId;
        res = await 下发(data.form);
        if (res.code === 200) proxy.$modal.msgSuccess("下发卡成功");
      }
      getList();
      cancel();
    }
  });
};
// 取消
const cancel = () => {
  data.form = {};
  data.open = false;
  data.form.deptId = null;
};
// 导入
const handleImport = () => {
  data.title = "导入";
  data.open = true;
};
// 下发
const handleIssued = () => {
  if (data.tableSelectId.length === 0) {
    return proxy.$modal.msgWarning("请先勾选下发卡号！");
  } else {
    data.open = true;
    data.title = "下发卡";
  }
};
// 获取时间
const getDate = () => {};
</script>

<style scoped>
::v-deep .el-upload-dragger {
  width: 260px;
  height: 115px;
}
::v-deep .el-range-editor--medium.el-input__inner {
  width: 220px !important;
}
::v-deep .el-upload,
::v-deep .el-upload__tip.text-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
::v-deep .el-upload__tip.text-center {
  bottom: 20%;
}
</style>
