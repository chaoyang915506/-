<template>
  <!-- 授权用户 -->
  <dialogEle
    :title="queryParams.pid ? '编辑' : '新增'"
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
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入用户名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="返港开始时间">
            <el-date-picker
              type="date"
              value-format="yyyy/M/d"
              v-model="queryParams.fgbegintime"
              placeholder="请输入返港开始时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="维修开始时间">
            <el-date-picker
              type="date"
              value-format="yyyy/M/d"
              v-model="queryParams.wxbegintime"
              placeholder="请输入维修开始时间"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="部署开始时间">
            <el-date-picker
              type="date"
                      value-format="yyyy/M/d"
              v-model="queryParams.bsbegintime"
              placeholder="请输入部署开始时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="维修信息">
            <el-input
              v-model="queryParams.weixiu"
              type="textarea"
              placeholder="请输入维修信息"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="部署信息">
            <el-input
              v-model="queryParams.bushu"
              placeholder="请输入部署信息"
              clearable
            />
          </el-form-item>

          <el-form-item label="返港结束时间">
            <el-date-picker
              type="date"
                      value-format="yyyy/M/d"
              placeholder="返港结束时间"
              v-model="queryParams.fgendtime"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="维修结束时间">
            <el-date-picker
                    value-format="yyyy/M/d"
              type="date"
              placeholder="维修结束时间"
              v-model="queryParams.wxendtime"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="部署结束时间">
            <el-date-picker
                    value-format="yyyy/M/d"
              type="date"
              placeholder="部署结束时间"
              v-model="queryParams.bsendtime"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="返港信息">
            <el-input
              v-model="queryParams.fangang"
              type="textarea"
              placeholder="请输入返港信息"
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
import { unallocatedUserList, authUserSelectAll } from "@/api/system/role";
import { 潜艇预测管理增加, 潜艇预测管理编辑 } from "@/api/corpus/forecast.js";
import dialogEle from "@/components/Dialog/index.vue";
export default {
  dicts: ["sys_normal_disable"],
  props: {
    // 角色编号
    roleId: {
      type: [Number, String],
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
          if (this.queryParams.pid) {
            let res = await 潜艇预测管理编辑(this.queryParams);
            if (res.code === 200) {
              this.$modal.msgSuccess("编辑成功");
              this.visible = false;
              this.$emit("ok");
            }
          } else {
            let res = await 潜艇预测管理增加(this.queryParams);
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
</style>
