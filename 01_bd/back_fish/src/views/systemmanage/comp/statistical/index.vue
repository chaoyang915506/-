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
          class="btn_custom"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
          class="btn_custom"
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
        <el-button
          type="primary"
          size="mini"
          class="btn_custom"
          @click="importXlsx"
          v-hasPermi="['system:role:add']"
          >导入</el-button
        >
        <el-button
          type="primary"
          size="mini"
          class="btn_custom"
          @click="exportXlsx"
          v-hasPermi="['system:role:add']"
          >导出模板</el-button
        >
        <input
          type="file"
          @change="fileChange"
          style="display: none"
          id="file"
          @click.stop
          accept=".xls,.xlsx"
        />
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="userList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column prop="name" label="名称" :show-overflow-tooltip="true" />
      <el-table-column
        label="开始时间"
        prop="begintime"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="endtime"
        label="结束时间"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="addr" label="地址" :show-overflow-tooltip="true" />
      <el-table-column
        label="部署地点	"
        prop="deploymentSite"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="状态"
        prop="states"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="详情"
        prop="detail"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="来源"
        prop="source"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="优先级"
        prop="priority"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        prop="deploymentFlag"
        label="部署标识"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="event"
        label="事件"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="harborName"
        label="母港名称(英文)"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="harborZh"
        label="母港名称(中文)"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="jtType"
        label="舰艇类型"
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
    <select-user
      ref="select"
      :subTypeList="subTypeList"
      :roleId="queryParams.roleId"
      @ok="handleQuery"
    />
  </div>
</template>

<script>
import {
  统计信息管理列表,
  统计信息管理查询,
  统计信息管理删除,
} from "@/api/corpus/statistical.js";
import { 将excel数据导入数据库 } from "@/api/corpus/situation.js";
import selectUser from "./selectUser";

let jt = "舰艇类型(级别)";
let mg = "母港名称（中文）";
let mgz = "母港名称（英文）";
class castDevice {
  constructor() {
    this.舷号名称 = "";
    this.序号 = "";
    this.开始时间 = "";
    this.结束时间 = "";
    this.地址 = "";
    this.事件 = "";
    this.部署标识 = "";
    this.状态 = "";
    this.部署地点 = "";
    this.详情 = "";
    this.来源 = "";
    this.优先级 = "";
    this[jt] = "";
    this[mg] = "";
    this[mgz] = "";
  }
}

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
        name: undefined,
      },
      subTypeList: [],
    };
  },
  created() {
    this.getDicts("subdata_submarine_type").then((res) => {
      this.subTypeList = res.data;
    });
    // console.log(XLSX, "XLSX");
    this.getList();
  },
  methods: {
    importXlsx() {
      document.querySelector("#file").click();
      document.querySelector("#file").value = "";
    },
    fileChange(ev0) {
      // console.log(ev0);
      if (ev0.target.files.length < 0) return this.$modal.msgSuccess("请导入");
      let files = ev0.target.files;
      const fileReader = new FileReader();

      fileReader.onload = async (ev) => {
        const wb = XLSX.read(ev.target.result, {
          type: "binary",
        });

        let dataSheet;

        for (let sheet in wb.Sheets) {
          if (!wb.Sheets.hasOwnProperty(sheet)) {
            continue;
          }
          dataSheet = wb.Sheets[sheet];
          break;
        }
        let payload = [];
        const range = XLSX.utils.decode_range(dataSheet["!ref"]);
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
          let CastDevice = new castDevice();
          for (let col = range.s.c; col <= range.e.c; col++) {
            let cell = dataSheet[XLSX.utils.encode_cell({ r: row, c: col })];
            let text;
            if (cell && cell.w) {
              text = cell.w;
            } else {
              text = "";
            }
            let reg = new RegExp(/([1-9]\d*\.?\d*)|(0\.\d*[1-9])/);
            switch (col) {
              case 0:
                if (text == null || text.trim() == "") {
                  return this.$modal.msgError(
                    `导入excel 第${row + 1}行第${
                      col + 1
                    }列\n 舷号名称不能为空\n`
                  );
                }
                CastDevice.name = text;
                break;
              case 1:
                if (
                  text !== null &&
                  text.trim() != "" &&
                  reg.test(text) == false
                ) {
                  return this.$modal.msgError(
                    `导入excel 第${row + 1}行第${
                      col + 1
                    }列\n 序号格式不正确请输入数字\n`
                  );
                }
                CastDevice.序号 = text;

                break;
              case 2:
                if (text != "") {
                  CastDevice.开始时间 = this.parseTime(
                    text,
                    "{yyyy}-{mm}-{dd}"
                  );
                }
                break;
              case 3:
                if (text != "") {
                  CastDevice.结束时间 = this.parseTime(
                    text,
                    "{yyyy}-{mm}-{dd}"
                  );
                }
                break;
              case 4:
                CastDevice.地址 = text;
                break;
              case 5:
                CastDevice.事件 = text;
                break;
              case 6:
                CastDevice.部署标识 = text;
                break;
              case 7:
                CastDevice.状态 = text;
                break;
              case 8:
                CastDevice.部署地点 = text;
                break;
              case 9:
                CastDevice.详情 = text;
                break;
              case 10:
                CastDevice.来源 = text;
                break;
              case 11:
                if (
                  text !== null &&
                  text.trim() != "" &&
                  reg.test(text) == false
                ) {
                  return this.$modal.msgError(
                    `导入excel 第${row + 1}行第${
                      col + 1
                    }列\n 优先级格式不正确请输入数字\n`
                  );
                }
                CastDevice.优先级 = text;
                break;
              case 12:
                CastDevice[jt] = text;
                break;
              case 13:
                CastDevice[mg] = text;
                break;
              case 14:
                CastDevice[mgz] = text;
                break;

              default:
                console.log("错误");
            }
          }
          payload.push(CastDevice);
        }
        console.log(payload, "range");
        let formData = new FormData();
        formData.append("file", files[0]);
        let res = await 将excel数据导入数据库(formData);
        if (res.code == 200) {
          this.getList();
          document.querySelector("#file").value = "";

          this.$modal.msgSuccess("导入成功");
        }
      };
      // reader.readAsText(file);
      fileReader.readAsBinaryString(files[0]);
    },

    exportXlsx() {
      let aoa = [
        [
          "舷号名称",
          "序号",
          "开始时间",
          "结束时间",
          "地址",
          "事件",
          "部署标识",
          "状态",
          "部署地点",
          "详情",
          "来源",
          "优先级",
          "舰艇类型(级别)",
          "母港名称（中文）",
          "母港名称（英文）",
        ],
      ];
      const sheet = XLSX.utils.aoa_to_sheet(aoa);
      const wb = {
        SheetNames: ["sheet1"],
        Sheets: {
          sheet1: sheet,
        },
      };
      XLSX.writeFile(wb, "导入模板.xlsx", {
        bookType: "xlsx",
        bookSST: false,
        type: "file",
      });
    },
    /** 查询授权用户列表 */
    async getList() {
      this.loading = true;

      let response = await 统计信息管理列表(this.queryParams);
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
      let res = await 统计信息管理查询(row.id);
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

          return 统计信息管理删除(row.id);
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