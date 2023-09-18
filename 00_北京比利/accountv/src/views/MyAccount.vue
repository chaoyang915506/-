<template>
  <div class="padding">
    <h3 style="margin-bottom: 25px;">{{$t('myAccount.title')}}</h3>
    <el-form label-position="top" :model="form" ref="form" :rules="rules">
      <el-form-item :label="$t('myAccount.userName')">
        <el-input
          type="text"
          disabled
          v-model="form.user"
          auto-complete="off"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('myAccount.oldPwd')">
        <el-input
          type="password"
          v-model="form.oldPwd"
          auto-complete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('myAccount.newPwd')" prop="newPwd">
        <el-input
          type="password"
          v-model="form.newPwd"
          auto-complete="off"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('myAccount.confirmPwd')" prop="confirmPwd">
        <el-input
          type="password"
          v-model="form.confirmPwd"
          auto-complete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="block">
      <el-button type="primary" @click="submit">{{
        $t("common.ok")
      }}</el-button>
    </div>
  </div>
</template>

<script>
class formData {
  constructor() {
    this.user = JSON.parse(sessionStorage.getItem("user")).managerName;
    this.oldPwd = "";
    this.newPwd = "";
    this.confirmPwd = "";
  }
}
import ManagerApi from "@/api/ManagerApi";
import md5 from "md5";
export default {
  name: "MyAccount",
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
      form: new formData(),
      user: JSON.parse(sessionStorage.getItem("user")),
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
    async submit() {
      await this.$refs.form.validate();
      try {
        this.user.managerOldPwd = md5(this.form.oldPwd);
        this.user.managerPwd = md5(this.form.newPwd);
        // await ManagerApi.updatePwd(this.user);
        await ManagerApi.updatePwdByOld(this.user);
        await this.$info(this.$t("common.success"));
        this.$refs.form.resetFields();
        this.form = new formData()
      } catch (error) {
        // console.log(error);
        this.$error(error);
      }
    },
  },
};
</script>
<style scoped lang="scss">
/deep/ .el-form-item {
  margin-bottom: 15px;
}
/deep/ button:focus {
  outline: 0;
}
/deep/ .el-form--label-top .el-form-item__label {
  padding: 0;
}
.block {
  position: fixed;
  right: 3%;
}
</style>
