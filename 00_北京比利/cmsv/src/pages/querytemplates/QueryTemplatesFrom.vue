<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <h2>
          {{
            this.form.templateId
              ? $t("QueryTemplates.templateMan") + $t("confirm.edit")
              : $t("QueryTemplates.templateMan") + $t("confirm.add")
          }}
        </h2>
        <el-form
          :model="form"
          ref="form"
          :rules="rules"
          label-width="20%"
          :inline="false"
          size="normal"
        >
          <el-form-item :label="$t('QueryTemplates.templateid')" v-if="form.templateId">
            <el-input v-model="form.templateId" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('QueryTemplates.templatename')" prop="templateName">
            <el-input
              v-model="form.templateName"
              :placeholder="$t('QueryTemplates.pleaseEnter') + $t('QueryTemplates.templatename')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('QueryTemplates.templatedesc')" prop="templateDesc">
            <el-input
              v-model="form.templateDesc"
              type="textarea"
              show-word-limit
              :autosize="{ minRows: 5, maxRows: 9 }"
              :placeholder="$t('QueryTemplates.pleaseEnter') + $t('QueryTemplates.templatedesc')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('QueryTemplates.templatedescdfile')" prop="configFile">
            <el-input
              v-model="form.configFile"
              type="textarea"
              show-word-limit
              :autosize="{ minRows: 5, maxRows: 9 }"
              :placeholder="
                $t('QueryTemplates.pleaseEnter') + $t('QueryTemplates.templatedescdfile')
              "
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">{{ $t("confirm.ok") }}</el-button>
            <el-button @click="$emit('close', 'form')">{{ $t("confirm.return") }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import QueryTemplatesApi from "@/api/QueryTemplatesApi";
export default {
  props: {
    editData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: this.editData,
      rules: {
        templateName: [
          {
            required: true,
            message: this.$t("QueryTemplates.confirmrequired").replace(
              "X",
              this.$t("QueryTemplates.templatename")
            ),
            trigger: "blur",
          },
          { max: 64, message: this.$t("QueryTemplates.valuesixfour"), trigger: "change" },
        ],
        templateDesc: [
          {
            required: true,
            message: this.$t("QueryTemplates.confirmrequired").replace(
              "X",
              this.$t("QueryTemplates.templatedesc")
            ),
            trigger: "blur",
          },
          {
            max: 256,
            message: this.$t("QueryTemplates.confirmNum").replace(
              "X",
              this.$t("QueryTemplates.templatedesc")
            ),
            trigger: "change",
          },
        ],
        configFile: [
          {
            required: true,
            message: this.$t("QueryTemplates.confirmrequired").replace(
              "X",
              this.$t("QueryTemplates.templatedescdfile")
            ),
            trigger: "blur",
          },
          {
            max: 256,
            message: this.$t("QueryTemplates.confirmNum").replace(
              "X",
              this.$t("QueryTemplates.templatedescdfile")
            ),
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(async (res) => {
        if (res) {
          let data;
          if (this.form.templateId) {
            data = {
              ...JSON.parse(JSON.stringify(this.form)),
              code: "edit",
              updateId: this.form.templateId,
            };
          } else {
            data = { ...JSON.parse(JSON.stringify(this.form)), code: "add", updateId: -100 };
          }
          await QueryTemplatesApi.saveAddTemplate(data);
          this.$emit("close", "form");
          await this.$message.success(this.$t("confirm.success"));
        }
      });
    },
  },
};
</script>

<style lang="postcss" scoped></style>
