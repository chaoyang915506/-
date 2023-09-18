<template>
  <!-- 授权用户 -->
  <dialogEle
    :title="queryParams.id ? '编辑' : '新增'"
    v-model="visible"
    v-if="visible"
    width="60%"
    top="5vh"
    append-to-body
  >
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :rules="rules"
      :inline="true"
      label-width="150px"
    >
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-form-item label="舰艇名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入舰艇名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              v-model="queryParams.begintime"
              placeholder="请输入开始时间"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="事件">
            <el-input
              v-model="queryParams.event"
              placeholder="请输入事件"
              clearable
            />
          </el-form-item>
          <el-form-item label="部署标识">
            <el-input
              v-model="queryParams.deploymentFlag"
              placeholder="请输入部署标识"
              clearable
            />
          </el-form-item>
          <el-form-item label="地址">
            <el-input
              v-model="queryParams.addr"
              placeholder="请输入地址"
              clearable
            />
          </el-form-item>
          <el-form-item label="部署地点">
            <el-input
              v-model="queryParams.deploymentSite"
              placeholder="请输入部署地点"
              clearable
            />
          </el-form-item>
          <el-form-item label="母港名称(中文)">
            <el-input
              v-model="queryParams.harborZh"
              placeholder="请输入母港名称(中文)"
              clearable
            />
          </el-form-item>
          <!-- <el-form-item label="部署地点">
            <el-input
              v-model="queryParams.states"
              placeholder="请输入状态"
              clearable
            />
          </el-form-item> -->

          <el-form-item label="状态">
            <el-input
              v-model="queryParams.states"
              placeholder="请输入状态"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="标志位">
            <el-input
              v-model="queryParams.flag"
              placeholder="请输入标志位"
              clearable
            />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              v-model="queryParams.endtime"
              placeholder="请输入结束时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="舰艇类型">
            <el-select
              v-model="queryParams.jtType"
              placeholder="请输入舰艇类型"
              clearable
            >
              <el-option
                v-for="item in subTypeList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictLabel"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="位置">
            <el-input
              v-model="queryParams.position"
              placeholder="请输入位置"
              clearable
            />
          </el-form-item>
          <el-form-item label="来源">
            <el-input
              v-model="queryParams.source"
              placeholder="请输入来源"
              clearable
            />
          </el-form-item>
          <el-form-item label="优先级">
            <el-input
              v-model="queryParams.priority"
              placeholder="请输入优先级"
              clearable
            />
          </el-form-item>
          <el-form-item label="母港名称(英文)">
            <el-input
              v-model="queryParams.harborName"
              placeholder="请输入母港名称(英文)"
              clearable
            />
          </el-form-item>
          <el-form-item label="详情">
            <el-input
              type="textarea"
              v-model="queryParams.detail"
              placeholder="请输入详情"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div style="text-align: right">
        <el-button defaut="mini" type="primary" @click="handleSelectUser"
          >确 定</el-button
        >
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </el-form>
  </dialogEle>
</template>

<script>
import {
  统计信息管理增加,
  统计信息管理编辑,
} from "@/api/corpus/statistical.js";
import dialogEle from "@/components/Dialog/index.vue";
export default {
  // dicts: ["sys_normal_disable"],
  props: {
    // 角色编号
    roleId: {
      type: [Number, String],
    },
    subTypeList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    dialogEle,
  },
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: "潜艇名称不能为空",
            trigger: "blur",
          },
        ],
      },
      // 遮罩层
      visible: false,
      // 选中数组值
      userIds: [],
      // 未授权用户数据
      userList: [],
      queryParams: {},
      // 查询参数
    };
  },
  methods: {
    // 显示弹框
    show() {
      //   this.queryParams.roleId = this.roleId;
      //   this.getList();
      this.visible = true;
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map((item) => item.userId);
    },

    /** 选择授权用户操作 */
    handleSelectUser() {
      this.$refs.queryForm.validate(async (res) => {
        if (res) {
          if (this.queryParams.id) {
            let res = await 统计信息管理编辑(this.queryParams);
            if (res.code === 200) {
              this.$modal.msgSuccess("编辑成功");
              this.visible = false;
              this.$emit("ok");
            }
          } else {
            let res = await 统计信息管理增加(this.queryParams);
            if (res.code === 200) {
              this.$modal.msgSuccess("新增成功");
              this.visible = false;
              this.$emit("ok");
            }
          }
        }
      });

      //   const roleId = this.queryParams.roleId;
      //   const userIds = this.userIds.join(",");
      //   if (userIds == "") {
      //     this.$modal.msgError("请选择要分配的用户");
      //     return;
      //   }
      //   authUserSelectAll({ roleId: roleId, userIds: userIds }).then((res) => {
      //     this.$modal.msgSuccess(res.msg);
      //     if (res.code === 200) {
      //       this.visible = false;
      //       this.$emit("ok");
      //     }
      //   });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-textarea__inner {
  width: 220px;
}
::v-deep .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 210px;
}
</style>
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
    this.舰艇类型级别 = "";
    this.母港名称中文 = "";
    this.母港名称英文 = "";