<template>
  <div>
    <h3>
      {{
        !formData.id
          ? view == "input"
            ? $t("confirm.add") + $t("chargingStrategy.Clientdesc")
            : $t("confirm.add")
          : view == "input"
          ? $t("confirm.add") + $t("chargingStrategy.Clientdesc")
          : $t("confirm.edit")
      }}
    </h3>
    <el-form
      v-show="view == 'form'"
      :model="form"
      ref="form"
      :rules="rules"
      label-width="20%"
      :inline="false"
      size="normal"
    >
      <el-form-item label="ID" v-if="form.id">
        <el-input v-model="form.id" disabled size="normal"></el-input>
      </el-form-item>
      <el-form-item :label="$t('chargingStrategy.unitprice')" prop="feeId">
        <el-select filterable :placeholder="$t('confirm.pleasechoose')" v-model="form.feeId">
          <el-option v-for="item in allfeelist" :key="item.id" :label="item.desc" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('chargingStrategy.validitytype')" prop="timeStrategy">
        <el-select v-model="form.timeStrategy" filterable :placeholder="$t('confirm.pleasechoose')">
          <el-option label="按check in周期" value="0"> </el-option>
          <el-option label="按天" value="1"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.timeStrategy == 1"
        :label="$t('chargingStrategy.numberdays')"
        prop="timeAmount"
      >
        <el-input v-model="form.timeAmount"></el-input>
      </el-form-item>

      <el-form-item :label="$t('chargingStrategy.explain')" prop="desc">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" readonly v-model="form.desc">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('chargingStrategy.Clientdescription')" prop="desclanguage">
        <el-input
          v-model="form.desclanguage"
          type="textarea"
          @focus="view = 'input'"
          :rows="2"
          placeholder="请输入内容"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ $t("confirm.ok") }}</el-button>
        <el-button @click="$emit('close', 'form')">{{ $t("confirm.return") }}</el-button>
      </el-form-item>
    </el-form>

    <div v-show="view == 'input'">
      <el-form label-width="80px" :inline="false" size="normal">
        <el-form-item :label="i.langLabel" v-for="i in languageList" :key="i.id">
          <el-input v-model="text['l' + i.langId]"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="languageSub">{{ $t("confirm.ok") }}</el-button>
          <el-button @click="view = 'form'">{{ $t("confirm.return") }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import env from "@/env";
import HotelLanguageApi from "@/api/HotelLanguageApi";
import ChargingStrategyApi from "@/api/ChargingStrategyApi";
export default {
  props: {
    moneylist: {
      type: Array,
      default: [],
    },
    allfeelist: {
      type: Array,
      default: [],
    },
    formData: {
      type: Object,
      default: () => {},
    },
    langData: {
      type: Object,
      default: () => {},
    },
    hotelList: {
      type: Array,
      default: () => [],
    },
    test: String,
  },
  // mdoel:{
  //   event:"change",
  //   value:""
  // },
  data() {
    return {
      view: "form",
      lang: [],
      vendor: env.vendor,
      form: this.formData, //JSON.parse(JSON.stringify(this.formData)),
      rules: {
        feeId: [
          {
            required: true,
            message: this.$t("chargingStrategy.unitprice") + this.$t("confirm.notempty"),
            trigger: "blur",
          },
        ],
        desc: [
          {
            required: true,
            message: this.$t("chargingStrategy.explain") + this.$t("confirm.notempty"),
            trigger: "blur",
          },
        ],
        timeAmount: [
          {
            required: true,
            message: this.$t("chargingStrategy.numberdays") + this.$t("confirm.notempty"),
            trigger: "blur",
          },
        ],
        desclanguage: [
          {
            required: true,
            message: this.$t("chargingStrategy.Clientdesc") + this.$t("confirm.notempty"),
            trigger: "blur",
          },
        ],
      },
      text: JSON.parse(JSON.stringify(this.langData)),
      languageList: [], //语言
      desclanguage: "", //描述语言的
    };
  },

  watch: {
    "form.feeId"(val) {
      this.form.desc = `按周期，每周期${this.desc.code}+${this.desc.amount}分`;
    },
    "form.timeAmount"(val) {
      if (this.desc) {
        this.form.desc = `按天，${val}天${this.desc.code}+${this.desc.amount}分`;
      }
    },
    "form.timeStrategy": {
      immediate: true,
      handler(val) {
        if (val == 1 && this.desc) {
          this.form.desc = `按天，${this.form.timeAmount}天${this.desc.code}+${this.desc.amount}分`;
        } else if (val == 0 && this.desc) {
          this.form.desc = `按周期，每周期${this.desc.code}+${this.desc.amount}分`;
        }
      },
    },
  },
  computed: {
    desc() {
      let obj1;
      let obj = this.allfeelist.map((i) => {
        obj1 = this.moneylist.find((idx) => i.currencyId == idx.id);
        return { ...i, code: obj1.code };
      });
      let data = obj.find((i) => i.id == this.form.feeId);
      return data;
    },
  },
  created() {
    ChargingStrategyApi.getlanguage().then((data) => {
      this.languageList = data;
    });
  },
  methods: {
    //语言的提交
    languageSub() {
      let str = "";
      for (let k in this.text) {
        if (str == "" && this.text[k] && k !== "id") {
          str += this.text[k];
        } else if (this.text[k] && k !== "id") {
          str += "|" + this.text[k];
        }
      }
      let data = {
        ...this.form,
        desclanguage: str,
      };
      this.form = data;
      this.$refs.form.resetFields();
      this.view = "form";
    },
    onSubmit() {
      this.$refs.form.validate(async (res) => {
        if (res) {
          let map = {};
          this.languageList.forEach((i) => {
            map["l" + i.langId] = "";
          });
          let data = {
            chargeStrategy: this.form,
            text: { ...map, ...this.text },
          };
          delete data.chargeStrategy.desclanguage;
          try {
            if (this.form.id) {
              await ChargingStrategyApi.updatefrom(data);
              await this.$emit("close", "add");
              await this.$info("编辑成功");
            } else {
              await ChargingStrategyApi.addSubmit(data);
              await this.$emit("close", "add");
              await this.$info("添加成功");
            }
          } catch (error) {
            this.$info(error);
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep.el-select {
  width: 100%;
}
::v-deep .el-form-item__label {
  line-height: 150%;
}
</style>
