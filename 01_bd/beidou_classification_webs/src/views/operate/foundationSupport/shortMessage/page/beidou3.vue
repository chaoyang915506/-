<template>
  <div style="display: initial">
    <div class="title">
      <el-button type="text" @click="data.tableType = '主页面'"
        >短报文管理</el-button
      >
      <el-button type="text" v-if="data.tableType == '发送次数'"
        >/发送次数</el-button
      >
      <el-button type="text" v-if="data.tableType == '接收次数'">
        /接收次数</el-button
      >
    </div>
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="来源" label-width="90px">
        <el-input
          v-model="queryParams.北斗卡状态"
          placeholder="请输入北斗卡状态"
        ></el-input>
      </el-form-item>
      <el-form-item label="卡ID号">
        <el-input
          v-model="queryParams.使用单位"
          placeholder="请输入使用单位"
        ></el-input>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="timePicker"
          type="datetimerange"
          @change="getDate"
          clearable
          class="timeline_css"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 350px"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
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
    </el-form>
    <el-table
      v-loading="table_loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column
        v-if="data.tableType === '主页面'"
        label="北斗ID卡号"
        align="center"
        prop="北斗卡号"
      />
      <el-table-column
        v-if="data.tableType === '主页面'"
        label="发送次数"
        align="center"
        prop="发送次数"
      >
        <template #default="scope">
          <el-button type="text" @click="data.tableType = '发送次数'">
            {{ scope.row.发送次数 }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        v-if="data.tableType === '主页面'"
        label="接收次数"
        align="center"
        prop="接收次数"
      >
        <template #default="scope">
          <el-button type="text" @click="data.tableType = '接收次数'">
            {{ scope.row.接收次数 }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        v-if="data.tableType === '主页面'"
        label="来源"
        align="center"
        prop="来源"
      />
      <el-table-column
        v-if="data.tableType !== '主页面'"
        label="发送ID号"
        align="center"
        prop="发送ID号"
      />
      <el-table-column
        v-if="data.tableType === '发送次数'"
        label="发送内容"
        align="center"
        prop="发送内容"
      />
      <el-table-column
        v-if="data.tableType === '接收次数'"
        label="接收内容"
        align="center"
        prop="接收内容"
      />
      <el-table-column
        v-if="data.tableType !== '主页面'"
        label="接收ID号"
        align="center"
        prop="接收ID号"
      />
      <el-table-column
        v-if="data.tableType !== '主页面'"
        label="经度"
        align="center"
        prop="经度"
      />
      <el-table-column
        v-if="data.tableType !== '主页面'"
        label="纬度"
        align="center"
        prop="纬度"
      />
      <el-table-column
        v-if="data.tableType !== '主页面'"
        label="天气"
        align="center"
        prop="天气"
      />
      <el-table-column
        v-if="data.tableType !== '主页面'"
        label="来源"
        align="center"
        prop="来源"
      />
      <el-table-column
        v-if="data.tableType === '发送次数'"
        label="发送时间"
        align="center"
        prop="发送时间"
      />
      <el-table-column
        v-if="data.tableType === '接收次数'"
        label="接收时间"
        align="center"
        prop="接收时间"
      />
      <el-table-column
        v-if="data.tableType !== '主页面'"
        label="操作"
        align="center"
        width="240"
        class-name="small-padding fixed-width"
      >
        <template #default="">
          <el-button size="mini" type="text">编辑</el-button>
          <el-button size="mini" type="text">删除</el-button>
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
          prop="使用人"
          v-show="title === '分配使用人'"
        >
          <el-input v-model="form.使用人" placeholder="请输入使用人" />
        </el-form-item>
        <el-form-item
          label="使用单位"
          prop="使用单位"
          v-show="title === '分配使用人'"
        >
          <el-input v-model="form.使用单位" placeholder="请输入使用单位" />
        </el-form-item>
        <el-form-item
          label="终端编号"
          prop="终端编号"
          v-show="title === '关联终端'"
        >
          <el-input v-model="form.终端编号" placeholder="请输入终端编号" />
        </el-form-item>
        <el-form-item label="使用人" v-show="title === '解绑'">
          <span>{{ form.使用人 }}</span>
          <el-button
            style="float: right; margin-right: 40px"
            @click="unbindHandle('使用人')"
            type="text"
            >解绑</el-button
          >
        </el-form-item>
        <el-form-item label="终端编号" v-show="title === '解绑'">
          <span>{{ form.终端编号 }}</span>
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
  </div>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { uuid } from "@/utils/uuid.js";
import { getTimeStr } from "@/utils/time.js";
const { proxy } = getCurrentInstance();
let data = reactive({
  tableType: "主页面",
  open: false,
  form: {},
  rules: {
    使用人: [{ required: true, message: "使用人不能为空", trigger: "blur" }],
    使用单位: [
      { required: true, message: "使用单位不能为空", trigger: "blur" },
    ],
    终端编号: [
      { required: true, message: "终端编号不能为空", trigger: "blur" },
    ],
  },
  title: null,
  timePicker: null,
  total: 0,
  table_loading: false,
  tableList: [],
  tableData: [
    {
      id: 1,
      北斗卡号: 1102,
      北斗卡版本: "北1",
      使用人: "张珊珊",
      使用单位: "天津海事局",
      关联时间: "2022/11/17",
      下发时间: "2022/11/17",
      北斗卡状态: "分配成功",
      终端编号: 789,
      发送次数: 10,
      接收次数: 20,
      来源: "中国海静3106",
      发送ID号: "3442",
      接收内容: "暂无",
      接收ID号: "15321",
      经度: "117.4",
      纬度: "39.4",
      天气: "晴",
      来源: "中国海警3106",
      接收时间: "2022/11/28",
      发送时间: "2022/11/28",
      发送内容: "暂无",
    },
    {
      id: 2,
      北斗卡号: 1103,
      北斗卡版本: "北1",
      使用人: "王辛",
      使用单位: "河北海事局",
      关联时间: "2022/11/18",
      下发时间: "2022/11/18",
      北斗卡状态: "分配成功",
      终端编号: 788,
      发送次数: 10,
      接收次数: 20,
      来源: "中国海静3106",
      发送ID号: "3442",
      接收内容: "暂无",
      接收ID号: "15321",
      经度: "117.4",
      纬度: "39.4",
      天气: "晴",
      来源: "中国海警3106",
      接收时间: "2022/11/28",
      发送时间: "2022/11/28",
      发送内容: "暂无",
    },
    {
      id: 11,
      北斗卡号: 1102,
      北斗卡版本: "北3",
      使用人: "刘雅",
      使用单位: "河北海事局",
      关联时间: "2022/11/19",
      下发时间: "2022/11/19",
      北斗卡状态: "分配成功",
      终端编号: 787,
      发送次数: 10,
      接收次数: 20,
      来源: "中国海静3106",
      发送ID号: "3442",
      接收内容: "暂无",
      接收ID号: "15321",
      经度: "117.4",
      纬度: "39.4",
      天气: "晴",
      来源: "中国海警3106",
      接收时间: "2022/11/28",
      发送时间: "2022/11/28",
      发送内容: "暂无",
    },
    {
      id: 3,
      北斗卡号: 1102,
      北斗卡版本: "北3",
      使用人: "王蒙",
      使用单位: "河北海事局",
      关联时间: "2022/11/19",
      下发时间: "2022/11/19",
      北斗卡状态: "分配成功",
      终端编号: 786,
      发送次数: 10,
      接收次数: 20,
      来源: "中国海静3106",
      发送ID号: "3442",
      接收内容: "暂无",
      接收ID号: "15321",
      经度: "117.4",
      纬度: "39.4",
      天气: "晴",
      来源: "中国海警3106",
      接收时间: "2022/11/28",
      发送时间: "2022/11/28",
      发送内容: "暂无",
    },
    {
      id: 4,
      北斗卡号: 1102,
      北斗卡版本: "北3",
      使用人: "李朗",
      使用单位: "河北海事局",
      关联时间: "2022/11/19",
      下发时间: "2022/11/19",
      北斗卡状态: "分配成功",
      终端编号: 785,
      发送次数: 10,
      接收次数: 20,
      来源: "中国海静3106",
      发送ID号: "3442",
      接收内容: "暂无",
      接收ID号: "15321",
      经度: "117.4",
      纬度: "39.4",
      天气: "晴",
      来源: "中国海警3106",
      接收时间: "2022/11/28",
      发送时间: "2022/11/28",
      发送内容: "暂无",
    },

    {
      id: 5,
      北斗卡号: 1102,
      北斗卡版本: "北3",
      使用人: "狄怀英",
      使用单位: "河北海事局",
      关联时间: "2022/11/19",
      下发时间: "2022/11/19",
      北斗卡状态: "分配成功",
      终端编号: 784,
      发送次数: 10,
      接收次数: 20,
      来源: "中国海静3106",
      发送ID号: "3442",
      接收内容: "暂无",
      接收ID号: "15321",
      经度: "117.4",
      纬度: "39.4",
      天气: "晴",
      来源: "中国海警3106",
      接收时间: "2022/11/28",
      发送时间: "2022/11/28",
      发送内容: "暂无",
    },
    {
      id: 6,
      北斗卡号: 1102,
      北斗卡版本: "北3",
      使用人: "李元芳",
      使用单位: "河北海事局",
      关联时间: "2022/11/19",
      下发时间: "2022/11/19",
      北斗卡状态: "分配成功",
      发送次数: 10,
      接收次数: 20,
      来源: "中国海静3106",
      发送ID号: "3442",
      接收内容: "暂无",
      接收ID号: "15321",
      经度: "117.4",
      纬度: "39.4",
      天气: "晴",
      来源: "中国海警3106",
      接收时间: "2022/11/28",
      发送时间: "2022/11/28",
      发送内容: "暂无",
    },
    {
      id: 7,
      北斗卡号: 1102,
      北斗卡版本: "北3",
      使用人: "苏显",
      使用单位: "河北海事局",
      关联时间: "2022/11/19",
      下发时间: "2022/11/19",
      北斗卡状态: "分配成功",
      终端编号: 783,
      发送次数: 10,
      接收次数: 20,
      来源: "中国海静3106",
      发送ID号: "3442",
      接收内容: "暂无",
      接收ID号: "15321",
      经度: "117.4",
      纬度: "39.4",
      天气: "晴",
      来源: "中国海警3106",
      接收时间: "2022/11/28",
      发送时间: "2022/11/28",
      发送内容: "暂无",
    },
    {
      id: 8,
      北斗卡号: 1102,
      北斗卡版本: "北3",
      使用人: "王强",
      使用单位: "河北海事局",
      关联时间: "2022/11/19",
      下发时间: "2022/11/19",
      北斗卡状态: "分配成功",
      终端编号: 782,
      发送次数: 10,
      接收次数: 20,
      来源: "中国海静3106",
      发送ID号: "3442",
      接收内容: "暂无",
      接收ID号: "15321",
      经度: "117.4",
      纬度: "39.4",
      天气: "晴",
      来源: "中国海警3106",
      接收时间: "2022/11/28",
      发送时间: "2022/11/28",
      发送内容: "暂无",
    },
    {
      id: 9,
      北斗卡号: 1102,
      北斗卡版本: "北3",
      使用人: "张怀",
      使用单位: "河北海事局",
      关联时间: "2022/11/19",
      下发时间: "2022/11/19",
      北斗卡状态: "分配成功",
      终端编号: 781,
      发送次数: 10,
      接收次数: 20,
      来源: "中国海静3106",
      发送ID号: "3442",
      接收内容: "暂无",
      接收ID号: "15321",
      经度: "117.4",
      纬度: "39.4",
      天气: "晴",
      来源: "中国海警3106",
      接收时间: "2022/11/28",
      发送时间: "2022/11/28",
      发送内容: "暂无",
    },
    {
      id: 10,
      北斗卡号: 1102,
      北斗卡版本: "北3",
      使用人: "付欣源",
      使用单位: "河北海事局",
      关联时间: "2022/11/19",
      下发时间: "2022/11/19",
      北斗卡状态: "分配成功",
      终端编号: 780,
      发送次数: 10,
      接收次数: 20,
      来源: "中国海静3106",
      发送ID号: "3442",
      接收内容: "暂无",
      接收ID号: "15321",
      经度: "117.4",
      纬度: "39.4",
      天气: "晴",
      来源: "中国海警3106",
      接收时间: "2022/11/28",
      发送时间: "2022/11/28",
      发送内容: "暂无",
    },
  ],
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
});

// 表格勾选
const handleSelectionChange = () => {};
// 编辑
const handleUpdate = (val) => {
  data.title = "编辑北斗卡";
  data.open = true;
  data.form = val;
};
// 获取列表
const getList = () => {
  // 请求接口
  let start =
    data.queryParams.pageNum === 1
      ? data.queryParams.pageNum - 1
      : (data.queryParams.pageNum - 1) * data.queryParams.pageSize;
  let end =
    data.queryParams.pageNum === 1
      ? data.queryParams.pageSize
      : data.queryParams.pageNum * data.queryParams.pageSize;
  data.total = data.tableData.length;
  data.tableList = data.tableData.slice(start, end);
};
// 条件搜索
const handleSearch = () => {};
// 提交
const submitForm = () => {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {
      data.tableData.map((item, index) => {
        if (data.form.id === item.id) {
          if (data.title === "分配使用人") {
            item.使用人 = data.form.使用人;
            item.使用单位 = data.form.使用单位;
            item.北斗卡状态 = item.终端编号 ? "分配成功" : "使用人分配成功";
          }
          if (data.title === "关联终端") {
            item.北斗卡状态 = item.使用人 ? "分配成功" : "终端编号分配成功";
            item.终端编号 = data.form.终端编号;
          }
        }
      });
      if (data.title === "分配使用人")
        proxy.$modal.msgSuccess("分配使用人成功");
      if (data.title === "关联终端") proxy.$modal.msgSuccess("关联终端成功");
      getList();
      cancel();
    }
  });
  cancel();
};
// 取消
const cancel = () => {
  data.form = {};
  data.open = false;
};
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