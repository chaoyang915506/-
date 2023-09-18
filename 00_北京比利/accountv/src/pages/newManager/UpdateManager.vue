<template>
  <el-dialog
    id="dialog"
    :title="$t('manager.updateManager.title')"
    :visible="showDialog"
    width="40%"
    @close="close"
  >
    <el-form :model="formData" ref="form" label-width="190px" :rules="rules">
      <el-form-item
        :label="$t('manager.roleName')"
        prop="roleId"
        v-if="this.currentRoleId == 0 || this.currentRoleId == false"
      >
        <el-select v-model="formData.roleId" :placeholder="$t('common.pleasechoose')">
          <el-option
            v-for="role in roles"
            :key="role.id"
            :label="role.roleName"
            :value="role.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('manager.userName')" prop="managerAccount">
        <el-input v-model="formData.managerAccount" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('manager.updateManager.password')"
        prop="managerPwd"
        v-if="formData.id === ''"
      >
        <!-- auto-complete="new-password"防止浏览器自动填充用户名密码 -->
        <el-input
          auto-complete="new-password"
          type="password"
          v-model="formData.managerPwd"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('manager.updateManager.comfirmPwd')"
        prop="comfirmPwd"
        v-if="formData.id === ''"
      >
        <el-input type="password" v-model="formData.comfirmPwd" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('manager.managerName')" prop="managerName">
        <el-input v-model="formData.managerName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('manager.mode')">
        <el-select v-model="formData.mode">
          <el-option :label="$t('manager.mode0')" :value="0"></el-option>
          <el-option :label="$t('manager.mode1')" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('manager.phoneNumber')"
        v-if="formData.mode == '1'"
        prop="phoneNumber"
      >
        <el-input v-model="formData.phoneNumber" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('manager.updateManager.hotelGroupId')">
        <el-select v-model="formData.hotelGroupId">
          <el-option :label="$t('manager.updateManager.hotelGroup0')" :value="0"></el-option>
          <el-option
            v-for="group in hotelGroups"
            :key="group.grpId"
            :label="group.grpName"
            :value="group.grpId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('manager.updateManager.hotelId')">
        <el-select v-model="formData.hotelId">
          <el-option :label="$t('manager.updateManager.hotelId0')" :value="0"></el-option>
          <el-option
            v-for="hotel in hotels"
            :key="hotel.hotelId"
            :label="hotel.hotelName"
            :value="hotel.hotelId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('manager.managerStatus')">
        <el-select v-model="formData.managerStatus">
          <el-option :label="$t('manager.status0')" :value="0"></el-option>
          <el-option :label="$t('manager.status1')" :value="1"></el-option>
          <el-option :label="$t('manager.status2')" :value="2"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t("common.return") }}</el-button>
      <el-button type="primary" @click="submit">{{ $t("common.ok") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import ManagerApi from "@/api/ManagerApi";
import md5 from "md5";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currData: {
      type: Object,
      default: () => ({})
    },
    currentRoleId: {
      type: Number,
      default: 0
    }
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
      if (value !== this.formData.managerPwd) {
        callback(new Error(this.$t("manager.confirm.confirmpwdVerify")));
      } else {
        callback();
      }
    };
    return {
      // formData: JSON.parse(JSON.stringify(this.currData)),
      formData: this.currData,
      rules: {
        roleId: [
          {
            required: true,
            message: this.$t("manager.confirm.roleId"),
            trigger: ["blur", "change"]
          }
        ],
        managerAccount: [
          {
            required: true,
            message: this.$t("manager.confirm.account"),
            trigger: "blur"
          }
        ],
        managerPwd: [
          {
            required: true,
            message: this.$t("manager.confirm.pwd"),
            trigger: "blur"
          },
          {
            pattern: /^[a-zA-Z](?=.+\d)(?=.*\w).*$/,
            message: this.$t("manager.confirm.pwdVerify"),
            trigger: "change"
          },
          { validator: validatePwd, trigger: "blur" }
        ],
        comfirmPwd: [
          {
            required: true,
            message: this.$t("manager.confirm.comfirmPwd"),
            trigger: "blur"
          },
          { validator: validateComfirmPwd, trigger: "blur" }
        ],
        phoneNumber: [
          {
            required: true,
            message: this.$t("manager.confirm.phoneNumber"),
            trigger: "blur"
          },
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: this.$t("manager.confirm.phoneVerify"),
            trigger: "blur"
          }
        ],
        managerName: [
          {
            required: true,
            message: this.$t("manager.confirm.managerName"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    // console.log(this.roleList);
    console.log(this.currentRoleId, "id");
  },
  computed: {
    ...mapState({
      roles: "roles",
      hotelGroups: "hotelGroups"
    }),
    // roleList() {
    //   return this.roles.filter((i) => {
    //     return this.currentRoleId == 0 || this.currentRoleId == false
    //       ? i
    //       : i.id == this.currentRoleId;
    //   });
    // },
    hotels() {
      // console.log("酒店房间", this.$store.state.hotels);
      return this.$store.state.hotels.filter(
        hotel => this.formData.hotelId === 0 || this.formData.hotelId === hotel.hotelId
      );
    }
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
      this.formData = {
        id: "",
        mode: 1, // 登录方式
        hotelId: 0,
        roleId: "",
        managerAccount: "",
        managerName: "",
        managerPwd: "",
        comfirmPwd: "",
        phoneNumber: "",
        hotelGroupId: 0, // 所属集团
        managerStatus: 1 // 用户状态
      };
    },
    async submit() {
      await this.$refs.form.validate();
      try {
        // console.log(this.formData.id, "id126");
        if (!this.formData.id) {
          let add;
          if (this.currentRoleId == 0 || !this.currentRoleId) {
            add = { ...this.formData, managerPwd: md5(this.formData.comfirmPwd) };
          } else {
            this.formData.roleId = this.currentRoleId;
            add = { ...this.formData, managerPwd: md5(this.formData.comfirmPwd) };
          }
          delete add.comfirmPwd;
          await ManagerApi.create(add);
          await this.$info(this.$t("common.addSuccess"));
        } else {
          // console.log("修改", this.formData);
          let data;
          if (this.currentRoleId == 0 || !this.currentRoleId) {
            // console.log("11111111111111111");
            data = { ...this.formData };
            // console.log('传参',data);
          } else {
            this.formData.roleId = this.currentRoleId;
            data = { ...this.formData };
          }
          delete data.comfirmPwd;
          delete data.managerPwd;
          // console.log("传参", data);
          await ManagerApi.update(data);
          await this.$info(this.$t("common.editsuccess"));
        }
        this.$emit("update:showDialog", false);
        this.$parent.refresh();
        this.$refs.form.resetFields();
        this.formData = {
          id: "",
          mode: 1, // 登录方式
          hotelId: 0,
          roleId: "",
          managerAccount: "",
          managerName: "",
          managerPwd: "",
          comfirmPwd: "",
          phoneNumber: "",
          hotelGroupId: 0, // 所属集团
          managerStatus: 1 // 用户状态
        };
      } catch (error) {
        console.log(error);
        this.$error(
          this.formData.id ? `${this.$t("common.editfail")}` : error
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#dialog {
  // transform: translate(0, -12%) !important;
  overflow: visible !important;
}
/deep/ .el-dialog {
  margin-top: 2vh !important;
}
/deep/ .el-input {
  width: 80% !important;
}
/deep/ .el-select {
  width: 100%;
}
/deep/ .el-dialog__body {
  padding: 10px 20px 0px 20px;
}
/deep/ .el-form-item__content {
  margin-bottom: 7px;
}
/deep/ .el-dialog__footer {
  padding: 0 15px 15px 0;
}
</style>
