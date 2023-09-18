<template>
  <div>
    <!-- <el-card class="cardone" style="margin-bottom: 20px" shadow="always"> -->

    <!-- <span v-html="test"></span> -->
    <!-- </el-card> -->

    <!-- 表格 -->
    <!-- <el-card shadow="always" :body-style="{ padding: '20px' }"> -->
    <el-form :model="form" ref="form" :inline="true" size="normal">
      <el-form-item>
        <span @click="goHome" class="back_css"> &lt;返回</span>
      </el-form-item>
      <el-form-item label="" style="float: right">
        <el-button
          type="primary"
          class="common_style"
          round
          size="small"
          icon="Download"
          @click="eportData"
          >导出</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="
        tableDataV.slice(
          (queryParams.currentPage - 1) * queryParams.pageSize,
          queryParams.currentPage * queryParams.pageSize
        )
      "
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        v-for="(column, index) in templatobj"
        :key="index"
        :prop="column.prop"
        :label="column.label"
        align="center"
        :show-overflow-tooltip="true"
        fit
      >
        <template #default="{ row }">
          <span>{{ row[column.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="props.coutent == 'text8'"
        prop="image"
        label="异物id"
        align="center"
        :show-overflow-tooltip="true"
        fit
      >
        <template #default="{ row }">
          <span>{{ row.foreMatter[0].id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="props.coutent == 'text8'"
        prop="image"
        label="异物类型"
        align="center"
        :show-overflow-tooltip="true"
        fit
      >
        <template #default="{ row }">
          <span>{{ row.foreMatter[0].material }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="props.coutent == 'text8'"
        prop="image"
        label="异物类型识别准确率"
        align="center"
        :show-overflow-tooltip="true"
        fit
      >
        <template #default="{ row }">
          <span>{{ row.foreMatter[0].clsValue }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="props.coutent == 'pic' || props.coutent == 'text8'"
        prop="image"
        label="背景图片"
        align="center"
      >
        <template #default="{ row }">
          <el-image
            @click.prevent="lookimage(row.image3)"
            :src="row.image3"
            fit="fill"
            :lazy="true"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column prop="image" label="原图片" align="center">
        <template #default="{ row }">
          <el-image
            @click.prevent="lookimage(row.image2)"
            :src="row.image2"
            fit="fill"
            :lazy="true"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        v-if="props.coutent != 'text3'"
        prop="image"
        label="增强后图片"
        align="center"
      >
        <template #default="{ row }">
          <el-image
            @click="lookimage(row.image1)"
            :src="row.image1"
            fit="fill"
            :lazy="true"
          ></el-image>
        </template>
      </el-table-column>
    </el-table>
    <div :class="{ hidden: hidden }" class="pagination-container">
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="queryParams.currentPage"
        :page-sizes="[1, 10, 20, 40, 80, 100]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableDataV.length"
        background
      >
      </el-pagination>
    </div>
    <!-- </el-card> -->
    <viewper :imgUrl="imgUrl" @resetImgValue="imgUrl = ''" ref="view" />
    <test />
  </div>
</template>

<script setup>
import viewper from "./viewper.vue";
import {
  download,
  validationexport,
} from "@/api/simulation/compTest/verify.js";
const props = defineProps({
  coutent: {
    type: String,
    default: "",
  },
  tableData: {
    type: Array,
    default: () => [],
  },
});
const tableDataV = computed(() => {
  // console.log(props.tableData,'数据');
  return props.tableData;
  // return JSON.parse(JSON.stringify(props.tableData));
});

const templatobj = computed(() => {
  return props.coutent == "pic"
    ? template1.value
    : props.coutent == "text3"
    ? template2.value
    : props.coutent == "text4"
    ? template4.value
    : props.coutent == "text8"
    ? template8.value
    : [];
});

const template1 = ref([
  {
    prop: "modelId",
    label: "模型id",
  },
  {
    prop: "modelName",
    label: "模型名称",
  },
  {
    prop: "algType",
    label: "模型种类",
  },
  {
    prop: "ssimValue",
    label: "结构相似度",
  },
  {
    prop: "psnrValue",
    label: "峰值信噪比",
  },
]);
//场景识别模板
const template2 = ref([
  {
    prop: "modelId",
    label: "模型id",
  },
  {
    prop: "modelName",
    label: "模型名称",
  },
  {
    prop: "algType",
    label: "模型种类",
  },
  {
    prop: "sceneName",
    label: "场景名称",
  },
  {
    prop: "clsProb",
    label: "类型概率",
  },
  // {
  //   prop: "psnrValue",
  //   label: "峰值信噪比",
  // },
]);
const template4 = ref([
  {
    prop: "modelId",
    label: "模型id",
  },
  {
    prop: "modelName",
    label: "模型名称",
  },
  {
    prop: "algType",
    label: "模型种类",
  },
]);
const template8 = ref([
  {
    prop: "modelId",
    label: "模型id",
  },
  {
    prop: "modelName",
    label: "模型名称",
  },
  {
    prop: "algType",
    label: "模型种类",
  },
  {
    prop: "foreMatter[0].id",
    label: "异物id",
  },
]);

const data = reactive({
  queryParams: {
    currentPage: 1,
    pageSize: 10,
  },
  tableColums: [],
});
const { tableColums, queryParams } = toRefs(data);

const loading = ref(false);
const { proxy } = getCurrentInstance();
const emit = defineEmits(["gohome"]);
const goHome = () => {
  emit("gohome", "home");
};
import { saveAs } from "file-saver";
import { blobValidate } from "@/utils/currency.js";
import { ElLoading } from "element-plus";
let downloadLoadingInstance;

//导出
const eportData = async () => {
  let list = [];
  if (selectValue.value.length == 0) {
    list = tableDataV.value;
  } else {
    list = selectValue.value;
  }
  if (list.length == 0) return proxy.$modal.msgError("列表为空");
  downloadLoadingInstance = ElLoading.service({
    text: "正在下载数据，请稍候",
    background: "rgba(0, 0, 0, 0.7)",
  });
  if (proxy.coutent !== "text3") {
    exportpic(list);
  }
  if (
    proxy.coutent == "pic" ||
    proxy.coutent == "text8" ||
    proxy.coutent == "text3"
  ) {
    exportelsx(list);
  }
};

const exportpic = async (list) => {
  try {
    let res = await download(list);

    let isture = await blobValidate(res);
    if (isture) {
      const blob = new Blob([res], { type: `application/zip` });
      saveAs(blob, `verify_${new Date().getTime()}.zip`);
      downloadLoadingInstance.close();
    }
    if (res.code != 200) {
      downloadLoadingInstance.close();
    }
  } catch (error) {
    downloadLoadingInstance.close();
  }
};
const exportelsx = async (list) => {
  try {
    let res = await validationexport(list);

    let isture = await blobValidate(res);
    if (isture) {
      const blob = new Blob([res], { type: `application/xlsx` });
      saveAs(blob, `verify_${new Date().getTime()}.xlsx`);
      downloadLoadingInstance.close();
    }
    if (res.code != 200) {
      downloadLoadingInstance.close();
    }
  } catch (error) {
    downloadLoadingInstance.close();
  }
};
onMounted(() => {
  if (props.coutent == "pic") {
    data.tableColums = template1;
  } else {
    data.tableColums = template1;
  }
});

let imgUrl = ref("");
const lookimage = (val) => {
  // alert(999);
  imgUrl.value = val;
  proxy.$refs["view"].onPreview();
};
let selectValue = ref([]);
const handleSelectionChange = (val) => {
  selectValue.value = val;
  // console.log(val, "red", arr);
};

const sizeChange = (val) => {
  queryParams.value.pageSize = val;
};
const currentChange = (val) => {
  queryParams.value.currentPage = val;
};
</script>

<style lang="scss" scoped>
.cardone :deep(.el-card__body) {
  padding: 10px;
}
.back_css {
  // float: left;
  cursor: pointer;
  // background;
  color: #fff;
}

.pagination-container {
  background: none;
  padding: 32px 16px;
  position: relative;
}
.pagination-container.hidden {
  display: none;
}
.pagination-container :deep(.el-pagination__total) {
  color: #fff;
}
.pagination-container :deep(.el-pagination__jump) {
  color: #fff;
}
</style>