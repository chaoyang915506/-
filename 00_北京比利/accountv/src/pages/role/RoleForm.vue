<template>
  <el-dialog :title="$t('role.roleForm.title')" :visible="showDialog" width="40%" @close="close">
    <el-form :model="formData" ref="form" label-width="150px" :rules="rules">
      <el-form-item :label="$t('role.roleName')" prop="roleName">
        <el-input v-model="formData.roleName" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item :label="$t('role.roleType')" prop="roleType">
        <el-select v-model="formData.roleType">
          <el-option :label="$t('role.roleType2')" :value="2"></el-option>
          <el-option :label="$t('role.roleType3')" :value="3"></el-option>
          <el-option :label="$t('role.roleType4')" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('role.roleDesc')">
        <el-input v-model="formData.roleDesc" auto-complete="off" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t("common.return") }}</el-button>
      <el-button type="primary" @click="submit">{{ $t("common.ok") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import RoleApi from "@/api/RoleApi";
import { Role } from "./role";
export default {
  name: "RoleForm",
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currData: Object
  },
  data() {
    return {
      formData: this.currData,
      rules: {
        roleName: [
          {
            required: true,
            message: this.$t("role.roleForm.roleName"),
            trigger: "blur"
          }
        ],
        roleType: [
          {
            required: true,
            message: this.$t("role.roleForm.roleType"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    currData() {
      this.formData = this.currData;
    }
  },
  methods: {
    close() {
      // 通知父组件改变量,关闭弹层
      this.$emit("update:showDialog", false);
      this.$refs.form.resetFields();
    },
    async submit() {
      await this.$refs.form.validate();
      try {
        if (this.formData.id < 1) {
          // create
          await RoleApi.create(this.formData);
          await this.$info(this.$t("role.confirm.addS"));
        } else {
          // update
          await RoleApi.update(this.formData);
          await this.$info(this.$t("role.confirm.editS"));
        }
      } catch (error) {
        this.$error(
          this.formData.id ? this.$t("role.confirm.addF") : this.$t("role.confirm.editF")
        );
      }
      this.$emit("update:showDialog", false);
      this.$parent.refresh();
      this.$refs.form.resetFields();
      this.formData = new Role();
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-form .el-input {
  width: 80%;
}
/deep/ .el-textarea {
  width: 80%;
}
/deep/ .el-select {
  width: 100%;
}
</style>
