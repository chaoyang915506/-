<template>
  <el-dialog :title="$t('manager.updateManager.pwdTitle')" :visible="showPwd" width="38%" @close="close">
    <el-form :model="form" ref="form" label-width="230px" :rules="rules">
      <el-form-item :label="$t('manager.updateManager.newPassword')" prop="newPwd">
        <el-input
          type="password"
          v-model="form.newPwd"
          auto-complete="off"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('manager.updateManager.comfirmNewPwd')" prop="confirmPwd">
        <el-input
          type="password"
          v-model="form.confirmPwd"
          auto-complete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t("common.return") }}</el-button>
      <el-button type="primary" @click="submit">{{ $t("common.ok") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import md5 from "md5";
import ManagerApi from "@/api/ManagerApi";
export default {
  props: {
    showPwd: {
      type: Boolean,
      default: false,
    },
    currData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    var validatePwd = (rule, value, callback) => {
      if (value.length < 10) {
        callback(new Error(this.$t("manager.confirm.pwdLang")));
      } else {
        callback();
      }
    };
    var validateComfirmPwd = (rule, value, callback) => {
      if (value !== this.form.newPwd) {
        callback(new Error(this.$t("manager.confirm.confirmpwdVerify")));
      } else {
        callback();
      }
    };
    return {
      form: {
        newPwd: "",
        confirmPwd: "",
      },
      rules: {
        newPwd: [
          {
            required: true,
            message: this.$t("manager.confirm.pwd"),
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z](?=.+\d)(?=.*\w).*$/,
            message: this.$t("manager.confirm.pwdVerify"),
            trigger: "change",
          },
          { validator: validatePwd, trigger: "blur" },
        ],
        confirmPwd: [
          {
            required: true,
            message: this.$t("manager.confirm.comfirmPwd"),
            trigger: "blur",
          },
          { validator: validateComfirmPwd, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    close() {
      this.$emit("update:showPwd", false);
      this.$refs.form.resetFields();
    },
    async submit() {
      await this.$refs.form.validate();
      try {
        this.currData.managerPwd = md5(this.form.newPwd);
        await ManagerApi.updatePwd(this.currData);
        await this.$info(this.$t('common.editsuccess'));
        await this.$emit("update:showPwd", false);
        this.$parent.refresh();
        this.$refs.form.resetFields();
      } catch (error) {
        this.$error(this.$t('common.editfail'));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-form-item__content {
  margin-bottom: 10px;
}
/deep/ .el-input {
  width: 80% !important;
}
</style>
