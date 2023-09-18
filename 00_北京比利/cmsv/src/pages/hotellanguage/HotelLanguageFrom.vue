<template>
  <div>
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="20%"
      :inline="false"
      size="normal"
    >
      <el-form-item label="ID">
        <el-input v-model="form.id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item :label="vendor + $t('confirm.name')" prop="hotelId">
        <el-select
          filterable
          :placeholder="$t('confirm.pleasechoose')"
          v-model="form.hotelId"
          :disabled="form.id ? true : false"
        >
          <el-option
            v-for="item in hotelList"
            :key="item.hotelId"
            :label="item.hotelName"
            :value="item.hotelId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('hotellanguage.language')" prop="langId">
        <el-select
          v-model="form.langId"
          filterable
          :placeholder="$t('confirm.pleasechoose')"
          :disabled="form.id ? true : false"
        >
          <el-option
            v-for="item in languageList"
            :key="item.langId"
            :label="item.langLabel"
            :value="item.langId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('hotellanguage.label')" prop="label">
        <el-input v-model="form.label"></el-input>
      </el-form-item>
      <el-form-item :label="$t('hotellanguage.sort')" prop="sort">
        <el-input-number v-model="form.sort" :min="0" :max="99999"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ $t("confirm.ok") }}</el-button>
        <el-button @click="$emit('close', 'form')">{{ $t("confirm.return") }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import env from "@/env";
import HotelLanguageApi from "@/api/HotelLanguageApi";
export default {
  props: {
    formData: {
      type: Object,
      default: () => new from()
    },
    languageList: {
      type: Array,
      default: () => []
    },
    hotelList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      vendor: env.vendor,
      form: JSON.parse(JSON.stringify(this.formData)),
      rules: {
        label: [
          {
            required: true,
            message: this.$t("hotellanguage.label") + this.$t("confirm.notempty"),
            trigger: "blur"
          }
        ],
        hotelId: [
          {
            required: true,
            message: env.vendor + this.$t("confirm.name") + this.$t("confirm.notempty"),
            trigger: "blur"
          }
        ],
        langId: [
          {
            required: true,
            message: this.$t("hotellanguage.language") + this.$t("confirm.notempty"),
            trigger: "blur"
          }
        ],
        sort: [
          {
            required: true,
            message: this.$t("hotellanguage.sort") + this.$t("confirm.notempty"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(res => {
        if (res) {
          if (this.form.id) {
            HotelLanguageApi.edithotelLang(this.form).then(data => {
              this.$emit("close", "add");
              this.$info("编辑成功");
            });
          } else {
            HotelLanguageApi.addhotelLang(this.form).then(data => {
              this.$emit("close", "add");
              this.$info("添加成功");
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep.el-select {
  width: 100%;
}
</style>
