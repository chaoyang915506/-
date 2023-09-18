<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="潜艇名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入潜艇名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="时间" prop="begintime">
        <el-date-picker
          type="date"
          placeholder="请选择时间"
          v-model="queryParams.begintime"
        ></el-date-picker>
        <!-- <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号码"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        /> -->
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          class="btn_custom"
          >搜索</el-button
        >
        <el-button
          icon="el-icon-refresh"
          class="btn_custom"
          size="mini"
          @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          type="primary"
          size="mini"
          class="btn_custom"
          @click="openSelectUser"
          v-hasPermi="['system:role:add']"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          @click="openSelectUser"
          v-hasPermi="['system:role:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-circle-close"
          size="mini"
          :disabled="multiple"
          @click="cancelAuthUserAll"
          v-hasPermi="['system:role:remove']"
          >批量取消授权</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-close"
          size="mini"
          @click="handleClose"
          >关闭</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row> -->

    <el-table
      v-loading="loading"
      :data="userList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="name" label="名称" :show-overflow-tooltip="true" />
      <el-table-column
        label="开始时间"
        prop="begintime"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="当前时间	"
        prop="ct"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="间隔天数"
        prop="duration"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        prop="endtime"
        label="结束时间"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        prop="flag"
        label="标志位"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="percent"
        label="百分比"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="position"
        label="位置"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="remark"
        label="备注"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="states"
        label="状态"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="editData(scope.row)"
            v-hasPermi="['system:role:remove']"
            >编辑</el-button
          >

          <el-button
            size="mini"
            type="text"
            @click="cancelAuthUser(scope.row)"
            v-hasPermi="['system:role:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <select-user ref="select" :roleId="queryParams.roleId" @ok="handleQuery" />
  </div>
</template>

<script>import {
  态势管理列表,
  态势管理查询,
  态势管理删除,
} from "@/api/corpus/situation.js";
import selectUser from "./selectUser";

export default {
  dicts: ["sys_normal_disable"],
  components: { selectUser },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中用户组
      userIds: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleId: undefined,
        name: undefined,
        phonenumber: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询授权用户列表 */
    async getList() {
      this.loading = true;

      let response = await 态势管理列表(this.queryParams);
      console.log(response, "response");
      this.userList = response.rows;
      this.total = response.total;
      this.loading = false;
    },
    // 返回按钮
    handleClose() {
      const obj = { path: "/system/role" };
      this.$tab.closeOpenPage(obj);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map((item) => item.userId);
      this.multiple = !selection.length;
    },
    async editData(row) {
      let res = await 态势管理查询(row.id);
      console.log(res, "res");
      this.$refs.select.queryParams = res.data;
      if (res.code == 200) {
        this.$refs.select.show();
      }
    },
    /** 打开授权用户表弹窗 */
    openSelectUser() {
      this.$refs.select.queryParams = {};
      this.$refs.select.show();
    },
    /** 取消授权按钮操作 */
    cancelAuthUser(row) {
      //   const roleId = this.queryParams.roleId;
      this.$modal
        .confirm('确认要删除"' + row.name + '"的信息吗？')
        .then(function () {
          //   return authUserCancel({ userId: row.userId, roleId: roleId });

          return 态势管理删除(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 批量取消授权按钮操作 */
    cancelAuthUserAll(row) {
      const roleId = this.queryParams.roleId;
      const userIds = this.userIds.join(",");
      this.$modal
        .confirm("是否取消选中用户授权数据项？")
        .then(function () {
          return authUserCancelAll({ roleId: roleId, userIds: userIds });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("取消授权成功");
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .btn_custom {
  font-size: 12px;
  border-radius: 3px;
  background: #122b54;
  border: 0;
  color: #1296db;
  box-shadow: inset 3px 3px 3px #054588, inset -3px -3px 3px #054588;
}
</style>