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
              v-model="queryParams.begintime"
              placeholder="请输入开始时间"
              value-format="yyyy/M/d"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="当前时间">
            <el-date-picker
              type="date"
              v-model="queryParams.ct"
              placeholder="请输入当前时间"
              value-format="yyyy/M/d"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="间隔天数">
            <el-input
              v-model="queryParams.duration"
              placeholder="请输入间隔天数"
            />
          </el-form-item>

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
              v-model="queryParams.endtime"
              placeholder="请输入结束时间"
              value-format="yyyy/M/d"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="百分比">
            <div style="display: inline-block; width: 210px">
              <el-input
                v-model="queryParams.percent"
                placeholder="请输入百分比"
                clearable
              />
            </div>

            <span style="width: 5px; color: #fff"> %</span>
          </el-form-item>
          <el-form-item label="位置">
            <el-input
              v-model="queryParams.position"
              placeholder="请输入位置"
              clearable
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              v-model="queryParams.remark"
              placeholder="请输入备注"
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
import { 态势管理增加, 态势管理编辑 } from "@/api//corpus/situation.js";
import dialogEle from "@/components/Dialog/index.vue";
export default {
  // dicts: ["sys_normal_disable"],
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
          if (this.queryParams.id) {
            let res = await 态势管理编辑(this.queryParams);
            if (res.code === 200) {
              this.$modal.msgSuccess("编辑成功");
              this.visible = false;
              this.$emit("ok");
            }
          } else {
            let res = await 态势管理增加(this.queryParams);
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
