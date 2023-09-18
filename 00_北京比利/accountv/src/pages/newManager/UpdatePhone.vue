<template>
  <el-dialog :title="$t('manager.updateManager.phoneTitle')" :visible="showPhone" width="30%" @close="close">
    <el-form :model="form" ref="form" label-width="125px" :rules="rules">
      <el-form-item :label="$t('manager.phoneNumber')" prop="phoneNumber">
        <el-input v-model="form.phoneNumber" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t("common.return") }}</el-button>
      <el-button type="primary" @click="submit">{{ $t("common.ok") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ManagerApi from "@/api/ManagerApi";
export default {
  props: {
    showPhone: {
      type: Boolean,
      default: false,
    },
    currData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: { phoneNumber: "" },
      rules: {
        phoneNumber: [
          {
            required: true,
            message: this.$t("manager.confirm.phoneNumber"),
            trigger: "blur",
          },
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: this.$t("manager.confirm.phoneVerify"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    close() {
      this.$emit("update:showPhone", false);
      this.$refs.form.resetFields();
    },
    async submit() {
      await this.$refs.form.validate();
      try {
        this.currData.phoneNumber = this.form.phoneNumber;
        await ManagerApi.updatePhone(this.currData);
        await this.$info(this.$t('common.bindSuccess'));
        await this.$emit("update:showPhone", false);
        this.$parent.refresh();
        this.$refs.form.resetFields();
      } catch (error) {
        this.$error(this.$t('common.bindFail'));
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
