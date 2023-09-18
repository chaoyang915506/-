<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <!-- <el-form-item
        prop="searchType"
        v-show="Object.keys(route.query).length > 0"
      >
        <el-select
          v-model="queryParams.searchType"
          placeholder="请选择搜索类型"
          size="small"
          @change="handleSelect"
        >
          <el-option
            v-for="(item, index) in searchTypeOpt"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item prop="planType" v-if="queryParams.searchType != 'planName'">
        <el-select
          v-model="queryParams.planType"
          placeholder="请选择预案类型"
          clearable
          :disabled="Object.keys(route.query).length > 0 ? true : false"
        >
          <!-- size="small" -->
          <el-option
            v-for="dict in plan_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- queryParams.searchType == 'planName' && -->
      <el-form-item prop="planName" v-if="Object.keys(route.query).length > 0">
        <el-input
          clearable
          v-model="queryParams.planName"
          placeholder="请输入预案名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn_submit" @click="handleQuery"
          >确定</el-button
        >
        <!-- <el-button
          icon="Refresh"
          type="primary"
          round
          class="common_style"
          @click="resetQuery"
          >重置</el-button
        > -->
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          type="primary"
          class="common_style"
          round
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:config:remove']"
          >删除</el-button
        >
        <el-button
          type="primary"
          icon="Plus"
          round
          class="common_style"
          :disabled="Object.keys(route.query).length > 0 ? true : false"
          @click="handleAdd"
          v-hasPermi="['system:config:add']"
          >添加预案</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column label="预案名称" align="center" prop="planName" />
      <el-table-column
        label="响应级别"
        align="center"
        prop="responseLevel"
        :formatter="formatterLevel"
      />
      <el-table-column label="发布日期" align="center" prop="releaseDate" />
      <el-table-column
        label="操作"
        align="center"
        width="260"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="Document"
            @click="handleDucument(scope.row)"
            v-hasPermi="['system:config:edit']"
            >文档</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="Operation"
            @click="handleProcess(scope.row)"
            v-hasPermi="['system:config:remove']"
            >流程</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="VideoPlay"
            v-if="Object.keys(route.query).length > 0"
            @click="handleStartEmergency(scope.row)"
            v-hasPermi="['system:config:remove']"
            >启动预案</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      v-show="total > 0"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 添加或者修改 -->
    <el-dialog
      :title="title"
      v-model="open"
      width="70%"
      append-to-body
      ref="elDialogFlow"
      @close="nodeSign = false"
      custom-class="elDialogFlow"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <div style="display: flex; width: 100%">
          <!-- 左边表单 -->
          <div style="width: 35%">
            <div class="form-title" style="margin-bottom: 30px">
              <span>1</span><span>预案基本信息</span>
            </div>
            <el-form-item label="预案名称" prop="planName">
              <el-input v-model="form.planName" placeholder="请输入预案名称" />
            </el-form-item>
            <el-form-item label="预案类型" prop="planType">
              <el-select
                v-model="form.planType"
                placeholder="请选择预案类型"
                clearable
                :disabled="isCheck"
                style="width: 100%"
                size="small"
              >
                <el-option
                  v-for="dict in plan_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <div class="form-title" style="margin: 30px 0">
              <span>2</span><span>响应启动条件</span>
            </div>
            <el-form-item label="响应级别" prop="responseLevel">
              <el-select
                v-model="form.responseLevel"
                placeholder="请选择响应级别"
                clearable
                style="width: 100%"
                size="small"
              >
                <el-option
                  v-for="dict in plan_reponse_level"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="发布日期" prop="releaseDate">
              <el-date-picker
                v-model="form.releaseDate"
                type="datetime"
                clearable
                value-format="YYYY-MM-DD hh:mm:ss"
                style="width: 100%"
                size="small"
                placeholder="请选择日期"
              />
            </el-form-item>
            <el-form-item
              label="上传文件"
              prop="fileList"
              ref="fileRef"
              v-if="open"
            >
              <el-upload
                class="upload-demo"
                :auto-upload="false"
                :on-change="handleChange"
                :on-remove="handleRemove"
                :file-list="fileList"
              >
                <!-- <el-button size="small" icon="Upload" type="primary"
                  >点击上传</el-button -->
                <!-- > -->
                <span class="info">{{
                  fileList.length == 0 ? info : "更换文件"
                }}</span>
                <div class="upload_css" v-if="fileList.length == 0">
                  <div>上传文件</div>
                  <span>(支持pdf格式)</span>
                </div>
              </el-upload>
            </el-form-item>
          </div>
          <!-- 右边流程图 -->
          <div style="width: 63%; margin-left: 2%">
            <div class="form-title" style="margin-bottom: 30px">
              <span>3</span><span>流程制作</span>
            </div>
            <div class="right-flow-class">
              <ul>
                <li v-for="(item, index) in form.flowList" :key="index">
                  <div class="flow-wrap">
                    <div
                      @click="clickright(item, index)"
                      ref="rightClick"
                      @contextmenu.prevent="handleContext(item, index, $event)"
                      class="flow-cicle-class"
                      :class="index == currentItem.index ? 'active-flow' : ''"
                    >
                      {{ item.companyName ? item.companyName : "请输入" }}
                    </div>
                    <img
                      v-if="index == form.flowList.length - 1"
                      @click="addFlowList(item)"
                      class="img-svg-class-add img-svg-class"
                      src="./../../../assets/images/emergencyplan/add-btn.svg"
                      alt=""
                    />
                    <img
                      v-if="index != form.flowList.length - 1"
                      class="img-svg-class img-svg-class-arrow"
                      src="./../../../assets/images/emergencyplan/line-arrow.svg"
                      alt=""
                    />
                  </div>
                  <div class="flow-info">
                    <p>联系人：{{ item.contact }}</p>
                    <p>联系电话：{{ item.phone }}</p>
                    <!-- <p>联系人：{{ item.contact }}</p>
                      <p>联系电话：{{ item.phone }}</p> -->
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-form>
      <!-- 编辑流程 -->
      <el-dialog
        title="编辑流程"
        v-model="openEditFlow"
        direction="rtl"
        append-to-body
        :before-close="handleClose"
        width="25%"
      >
        <el-form
          :model="currentItem.data"
          :rules="rules"
          label-width="110px"
          ref="currentForm"
        >
          <el-form-item label="单位名称" prop="companyName">
            <el-input
              v-model="currentItem.data.companyName"
              placeholder="请输入单位名称"
            />
          </el-form-item>
          <el-form-item label="联系人" prop="contact">
            <el-input
              v-model="currentItem.data.contact"
              placeholder="请输入联系人"
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input
              v-model="currentItem.data.phone"
              placeholder="请输入联系电话"
            />
          </el-form-item>
          <!-- <el-form-item label="描述" prop="flowDescribe">
            <el-input
              v-model="currentItem.data.flowDescribe"
              type="textarea"
              placeholder="请输入描述"
            />
          </el-form-item> -->
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="confirmClick">确 定</el-button>
            <el-button @click="cancelClick">取 消</el-button>
          </div>
        </template>
      </el-dialog>
      <template #footer v-if="!isCheck">
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 右键列表 -->

    <transition name="sidebarLogoFade" v-if="nodeSign">
      <div
        class="contextmenuContent modalDiaLog"
        :style="{ top: topVal, left: leftVal }"
      >
        <div class="contentItem" @click="editFlow">编辑</div>
        <div class="contentItem" @click="delFlow">删除</div>
      </div>
    </transition>

    <!-- 流程 -->
    <el-dialog title="流程" v-model="openFlow" width="60%">
      <div class="right-flow-class">
        <ul v-if="flowCollection && flowCollection.length">
          <li v-for="(item, index) in flowCollection" :key="index">
            <div class="flow-wrap">
              <div class="flow-cicle-class">
                {{ item.companyName ? item.companyName : "请输入" }}
              </div>
              <img
                v-if="index != flowCollection.length - 1"
                class="img-svg-class img-svg-class-arrow"
                src="./../../../assets/images/emergencyplan/line-arrow.svg"
                alt=""
              />
            </div>
            <div class="flow-info">
              <p>联系人：{{ item.contact }}</p>
              <p>联系电话：{{ item.phone }}</p>
            </div>
          </li>
        </ul>
        <el-empty v-else class="empty-class-wrap" description="暂无数据" />
      </div>
    </el-dialog>
    <!-- 文档 -->
    <el-dialog title="应急预案文档" v-model="openDocument" width="70%">
      <iframe
        :src="pdfUrl"
        id="previewPdf"
        frameborder="0"
        scrolling="auto"
        style="width: 100%; height: 75vh"
      ></iframe>
    </el-dialog>
  </div>
</template>
<script setup>
import {
  getPlan,
  addPlan,
  updatePlan,
  delPlan,
  getPlanById,
  getFlow,
  startContingencyPlan,
  getRiskGradePlan,
  getPreviewById,
} from "@/api/baseinfo/emergencyplan.js";
import { uploadFile } from "@/api/file.js";
import { nextTick, onBeforeUnmount, onMounted, watch } from "@vue/runtime-core";
import { registerTheme } from "echarts/core";
import { useRoute, useRouter } from "vue-router";
const info = ref("上传文件");
// watch()
const { proxy } = getCurrentInstance();
const { plan_type, plan_reponse_level } = proxy.useDict(
  "plan_type",
  "plan_reponse_level"
);
let route = useRoute();
const tableData = ref([]);
const open = ref(false);
const isCheck = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const openEditFlow = ref(false);
const openFlow = ref(false);
const openDocument = ref(false);
const total = ref(0);
const title = ref("");
const fileList = ref([]);
let topVal = ref("");
let leftVal = ref("");
let pdfUrl = ref(undefined);
let nodeSign = ref(false);
let currentItem = ref({});
let flowCollection = ref({});

// watch()
const searchTypeOpt = ref([
  {
    label: "按关键词",
    value: "planName",
  },
  {
    label: "按类型",
    value: "planType",
  },
]);

let validateAttach = (rule, value, callback) => {
  if (fileList.value.length == 0) {
    callback(new Error("上传文件不能为空"));
  } else {
    callback();
  }
};
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    planType: route.query.planType ? route.query.planType : undefined,
    responseLevel: route.query.responseLevel,
    searchType: "planType",
    planName: undefined,
  },
  rules: {
    planName: [
      { required: true, message: "预案名称不能为空", trigger: "blur" },
    ],
    companyName: [
      { required: true, message: "单位名称不能为空", trigger: "blur" },
    ],
    contact: [{ required: true, message: "联系人不能为空", trigger: "blur" }],
    phone: [
      { required: true, message: "联系电话不能为空", trigger: "blur" },
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: "请输入正确的手机号码",
        trigger: "blur",
      },
    ],
    planType: [
      { required: true, message: "预案类型不能为空", trigger: "change" },
    ],
    responseLevel: [
      { required: true, message: "响应级别不能为空", trigger: "change" },
    ],
    releaseDate: [
      { required: true, message: "发布日期不能为空", trigger: "change" },
    ],
    fileList: [
      { required: true, validator: validateAttach, trigger: "change" },
    ],
  },
});
watch(
  () => route.query,
  () => {
    getList();
  }
);
const { queryParams, form, rules } = toRefs(data);
// 初始化数据
const getList = async () => {
  try {
    loading.value = true;
    let res;
    // Object.keys(route.query)?.[0] !== "login"
    if (Object.keys(route.query).length > 0) {
      // console.log(queryParams, "value");
      // data.queryParams.value.planType = route.query.conLimitType;
      // queryParams.value.planType = route.query.conLimitType;
      queryParams.value.contingencyPlan = {
        planName: queryParams.value.planName,
        ...route.query,
        // responseLevel: queryParams.value.responseLevel,
        pageNum: data.queryParams.pageNum,
        pageSize: data.queryParams.pageSize,
      };
      // console.log(queryParams.value.contingencyPlan, "every");
      res = await getRiskGradePlan(queryParams.value.contingencyPlan);
    } else {
      res = await getPlan(queryParams.value);
    }
    if (res.code == 200) {
      tableData.value = res.rows;
      total.value = res.total;
      loading.value = false;
    }
  } catch (error) {
    loading.value = false;
  }
};
const handleSelect = () => {
  queryParams.value.planName = undefined;
  queryParams.value.planType = undefined;
};
// 添加预案
const handleAdd = () => {
  reset();
  open.value = true;
  title.value = "添加预案";
};
// 编辑流程
const editFlow = () => {
  openEditFlow.value = true;
};
// 删除流程
const delFlow = () => {
  if (form.value.flowList.length == 1)
    return proxy.$modal.msgSuccess("至少保留一项！");
  proxy.$modal.confirm("是否确认删除选中的数据项？").then(() => {
    form.value.flowList.splice(currentItem.value.index, 1);
  });
};
// 删除预案
const handleDelete = () => {
  proxy.$modal
    .confirm("是否确认删除选中的数据项？")
    .then(function () {
      return delPlan(ids.value.join(","));
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {
      proxy.$modal.msgError("删除失败");
    });
};
// 根据id获取数据
const getFlowData = async (id) => {
  let res = await getFlow({ planId: id });
  if (res.code == 200) {
    flowCollection.value = res.rows;
  }
};
// 文档
const handleDucument = async (row) => {
  let res = await getPreviewById(row.id);
  if (res.code == 200) {
    if (res && res.data && res.data.fileBytes) {
      pdfUrl.value = proxy.$arrayBufferToBlob(
        res.data.fileBytes,
        "application/pdf"
      );
      openDocument.value = true;
    } else {
      proxy.$modal.msgError("当前预案没有文档上传");
    }
  }
};
const router = useRouter();
// 流程
const handleProcess = (row) => {
  openFlow.value = true;
  getFlowData(row.id);
};
// 启动应急预案
const handleStartEmergency = async (row) => {
  let res = await startContingencyPlan({
    planId: row.id,
    eventNumber: route.query.eventNumber,
    eventGrade: row.responseLevel,
    eventType: route.query.conLimitType,
    conLimitType: route.query.conLimitType,
    // conLimitType: route.query.planType == 0 ? 1 : 2,
  });
  if (res.code == 200) {
    nextTick(() => {
      // router.push({ path: "/index", query: { login: true } });
      router.push({ path: "/index" });
    });
    proxy.$modal.msgSuccess("启动预案成功");
  }
  // console.log(row, "row");
};
// 提交信息
const submitForm = () => {
  proxy.$refs["formRef"].validate(async (valid) => {
    if (valid) {
      let formData = new FormData();
      formData.append("file", fileList.value[0].raw);
      let ret = await uploadFile(formData);
      if (ret.code == 200) {
        form.value.sysFileUuid = ret.data.fileUuid;
      }
      // 加排序字段
      if (form.value.flowList && form.value.flowList.length) {
        form.value.flowList.forEach((item, index) => {
          item.sort = index;
        });
      }
      let resd = form.value.flowList[form.value.flowList.length - 1];
      // console.log(resd, "shuju ");
      if (!resd.companyName || !resd.phone || !resd.contact) {
        return proxy.$modal.msgError("请先完成流程");
      }
      try {
        let res = await addPlan(form.value);
        if (res.code == 200) {
          getList();
          open.value = false;
          proxy.$modal.msgSuccess("新增成功");
        }
      } catch (error) {
        open.value = false;
      }
    }
  });
};
const handleClose = () => {
  openEditFlow.value = false;
  resetFlow();
};
const confirmClick = () => {
  proxy.$refs["currentForm"].validate((valid) => {
    if (valid) {
      form.value.flowList.forEach((item, index) => {
        if (index == currentItem.value.index) {
          item.companyName = currentItem.value.data.companyName;
          item.contact = currentItem.value.data.contact;
          item.phone = currentItem.value.data.phone;
          item.flowDescribe = currentItem.value.data.flowDescribe;
        }
      });
      openEditFlow.value = false;
    }
  });
};
const cancelClick = () => {
  openEditFlow.value = false;
  resetFlow();
};
// 取消提交
const cancel = () => {
  open.value = false;
  reset();
};
let rightClick = ref(null);
const clickright = (item, index) => {
  handleContext(item, index, event);
};
// 右键菜单
const handleContext = (item, index, event) => {
  // console.log(item, "item");
  nodeSign.value = true;
  resetFlow();
  topVal.value = event.clientY - 80 + "px";
  leftVal.value = event.clientX - 180 + "px";
  // console.log(leftVal.value, "alllred");

  currentItem.value = {
    data: JSON.parse(JSON.stringify(item)),
    index: index,
  };
};
// 添加流程
const addFlowList = (item) => {
  // console.log(item, "添加流程");
  if (item.companyName && item.contact && item.phone) {
    nextTick(() => {
      form.value.flowList.push({
        companyName: "", // 单位名称
        contact: "", // 联系人
        phone: "", // 联系电话
        // flowDescribe: "", // 描述
      });
    });
  } else {
    return proxy.$modal.msgError("请先完成现有流程");
  }
};
const handleChange = (file, filelist) => {
  if (filelist && filelist.length) {
    filelist.forEach((item, index) => {
      if (!item.name.endsWith(".pdf")) {
        // if (item.uid == file.uid) {
        //   filelist.splice(index, 1);
        // }
        // filelist.splice(index, 1);
        // filelist = [];
        fileList.value = [];
        return proxy.$modal.msgError(
          item.name + " 文档格式不正确，请重新上传PDF格式文件！"
        );
      } else {
        fileList.value = [filelist[filelist.length - 1]];
      }
    });
    // proxy.$refs["fileRef"].clearValidate();
  }
};
const handleRemove = (file, filelist) => {
  fileList.value = filelist;
};
/**重置流程表单**/
function resetFlow() {
  currentItem.value.data = {
    companyName: "", // 单位名称
    contact: "", // 联系人
    phone: "", // 联系电话
    // flowDescribe: "", // 描述
  };
  proxy.resetForm("currentForm");
}
/** 表单重置 */
function reset() {
  fileList.value = [];
  form.value = {
    planName: undefined, // 预案名称
    planType: undefined, // 预案类型
    responseLevel: undefined, // 响应级别
    releaseDate: undefined, // 发布日期
    file: undefined, // 文件地址
    flowList: [
      {
        companyName: "", // 单位名称
        contact: "", // 联系人
        phone: "", // 联系电话
        // flowDescribe: "", // 描述
      },
    ],
  };
  proxy.resetForm("formRef");
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
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
onMounted(() => {
  getList();
});
document.addEventListener("click", (e) => {
  if (
    e.target.className != "modalDiaLog" &&
    e.target.className !== "flow-cicle-class"
  ) {
    // nodeSign.value = !nodeSign.value;
    nodeSign.value = false;
  }
});
nextTick(() => {
  document.querySelector(".elDialogFlow").addEventListener("click", (e) => {
    // nodeSign.value = false;
  });
});
let settimeVal = ref(null);
watch(nodeSign, (val) => {
  if (val) {
    settimeVal = setTimeout(() => {
      nodeSign.value = false;
    }, 2000);
  }
});
onBeforeUnmount(() => {
  settimeVal.value = null;
});
// 格式化列表
const formatterLevel = (row, column, columnIndex) => {
  let result = plan_reponse_level.value.find(
    (item) => item.value == columnIndex
  );
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
</script>

<style scoped lang="scss">
.form-title {
  font-size: 20px;
  color: #fff;
}
.form-title span:nth-child(1) {
  font-size: 40px;
  display: inline-block;
  margin-right: 25px;
}
.right-flow-class {
  height: 50vh;
  overflow-y: auto;
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
  background: #404040;
  box-shadow: 3px 3px 7px #bbb, -3px -3px 7px #bbb;
}
.flow-cicle-class:hover {
  box-shadow: 3px 3px 7px #eee, -3px -3px 7px #eee;
}
.right-flow-class ul {
  display: flex;
  flex-wrap: wrap;
}
.img-svg-class {
  margin: 0 5px;
}
.img-svg-class-add {
  width: 30px;
  height: 30px;
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
.flow-info {
  color: #fff;
}
.contextmenuContent {
  position: absolute;
  background: #fff;
  border-radius: 3px;
  padding: 6px 0px;
  box-shadow: 2px 2px 2px #058e8a, -2px -2px 2px #058e8a;
  z-index: 99999;
}
.contentItem {
  padding: 6px 26px;
  cursor: pointer;
  border-bottom: 1px solid #ccc;
}
.contentItem:hover {
  color: #fff;
  background: #058e8a;
}
.active-flow {
  box-shadow: 3px 3px 7px #058e8a, -3px -3px 7px #058e8a;
}
.info {
  font-size: 1.1875rem;
  color: #00bfbf;
  font-weight: 700;
}
.upload_css {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100px;
  width: 300px;
  color: #c0c0c0;
  box-shadow: 3px 3px 7px #bbb, -3px -3px 7px #bbb;
  div {
    font-size: 25px;
    font-weight: 500;
  }
}
</style>