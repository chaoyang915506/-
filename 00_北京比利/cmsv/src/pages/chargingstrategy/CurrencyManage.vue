<template>
  <div>
    <div v-if="view == 'table'">
      <!-- <h1>酒店语言管理</h1> -->
      <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin-bottom: 1%">
        <div slot="header">
          <span>{{ $t("confirm.screeningCondition") }}</span>
        </div>
        <el-form ref="form" :model="screen" label-width="40%">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item :label="$t('chargingStrategy.chinesename')">
                <el-input @change="pageData" v-model="screen.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('chargingStrategy.enlishname')">
                <el-input @change="pageData" v-model="screen.nameEn"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('chargingStrategy.code')">
                <el-input @change="pageData" v-model="screen.code"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-button class="add" size="medium" @click="view = 'form'">{{
        $t("confirm.Added")
      }}</el-button>
      <el-button class="add" size="medium" @click="$emit('close', 'add')">{{
        $t("confirm.return")
      }}</el-button>
      <cool-em-table
        style="margin-top: 1%"
        :checkbox="false"
        @SelectionChange="(value) => (selected = value)"
        :tableList="tableList"
        :opt="opt"
        :columns="columns"
        :pageModel.sync="pageModel"
        :totalLength="totalLength"
        @pageData="pageData"
      >
        <el-table-column slot="btn" align="center" :label="$t('confirm.operate')" prop="id">
          <template #default="{ row }">
            <el-button type="text" @click="edit(row.id)">{{ $t("confirm.edit") }}</el-button>
            <el-button type="text" @click="del(row.id)">{{ $t("confirm.delete") }}</el-button>
          </template>
        </el-table-column>
      </cool-em-table>
    </div>
    <div v-if="view == 'form'">
      <el-row :gutter="20" style="margin-top: 4%">
        <el-col :span="12" :offset="6">
          <h3>
            {{
              !form.id
                ? view2 == "input"
                  ? $t("confirm.add") + $t("chargingStrategy.currency") + $t("confirm.name")
                  : $t("confirm.add") + $t("chargingStrategy.currency")
                : view2 == "input"
                ? $t("confirm.edit") + $t("chargingStrategy.currency") + $t("confirm.name")
                : $t("confirm.edit") + $t("chargingStrategy.currency")
            }}
          </h3>
          <el-form
            v-show="view2 == 'form'"
            :model="form"
            ref="form"
            :rules="rules"
            label-width="20%"
            :inline="false"
            size="normal"
          >
            <el-form-item label="ID" v-if="form.id">
              <el-input v-model="form.id" disabled></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('chargingStrategy.symbol') + '(' + $t('chargingStrategy.example') + '￥)'"
              prop="timeAmount"
            >
              <el-input v-model="form.code"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('chargingStrategy.code') + '(' + $t('chargingStrategy.example') + 'RMB)'"
              prop="timeAmount"
            >
              <el-input v-model="form.symbol"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('chargingStrategy.currency') + $t('confirm.name')"
              prop="desclanguage"
            >
              <el-input
                v-model="form.desclanguage"
                type="textarea"
                @focus="view2 = 'input'"
                :rows="2"
              >
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{ $t("confirm.ok") }}</el-button>
              <el-button @click="view = 'table'">{{ $t("confirm.return") }}</el-button>
            </el-form-item>
          </el-form>

          <el-form label-width="80px" :inline="false" size="normal" v-show="view2 == 'input'">
            <el-form-item :label="i.langLabel" v-for="i in languageList" :key="i.id">
              <el-input v-model="text['l' + i.langId]"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="languageSub">{{ $t("confirm.ok") }}</el-button>
              <el-button @click="view2 = 'form'">{{ $t("confirm.return") }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
class from {
  constructor() {
    this.id = "";
    this.code = "";
    this.symbol = "";
    this.desclanguage = "";
  }
}
import env from "@/env";
import CoolEmTable from "@/components/CoolEmTable.vue";
import HotelLanguageApi from "../../api/HotelLanguageApi.js";
import ChargingStrategyApi from "@/api/ChargingStrategyApi";
export default {
  data() {
    return {
      selected: [],
      form: new from(),
      screen: {
        name: "",
        nameEn: "",
        code: "",
      },
      vendor: env.vendor,
      view: "table",
      view2: "form",
      columns: [
        {
          prop: "id",
          label: "ID",
          align: "center",
        },
        {
          prop: "symbol",
          label: this.$t("chargingStrategy.symbol"),
          align: "center",
        },
        {
          prop: "name",
          label: this.$t("chargingStrategy.chinesename") + this.$t("confirm.name"),
          align: "center",
        },
        {
          prop: "nameEn",
          label: this.$t("chargingStrategy.enlishname"),
          align: "center",
        },
        {
          prop: "code",
          label: this.$t("chargingStrategy.code"),
          align: "center",
        },
      ],
      languageList: [], //语言
      tableList: [],
      totalLength: 0,
      opt: { sidePagination: "server" },
      pageModel: {
        limit: 15, //每页的数据
        offset: 0,
        currentPage: 1, //当前页
      },
      text: JSON.parse(JSON.stringify({})),
      rules: {
        code: [
          {
            required: true,
            message: this.$t("chargingStrategy.unitprice") + this.$t("confirm.notempty"),
            trigger: "blur",
          },
        ],
        symbol: [
          {
            required: true,
            message: this.$t("chargingStrategy.explain") + this.$t("confirm.notempty"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    ChargingStrategyApi.getlanguage().then((data) => {
      this.languageList = data;
    });
    this.getTable();
  },
  components: {
    CoolEmTable,
  },
  computed: {
    tableData() {
      return this.tableList;
    },
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((res) => {
        if (res) {
          let map = {};
          this.languageList.forEach((i) => {
            map["l" + i.langId] = "";
          });
          let data = {
            currency: { id: "", ...this.form },
            name: { ...map, ...this.text },
          };
          delete data.currency.desclanguage;
          delete data.currency.name;
          delete data.currency.nameId;
          delete data.currency.nameEn;
          if (this.form.id) {
            ChargingStrategyApi.editCurrent(data).then((data) => {
              this.close("add");
              this.$info("编辑成功");
            });
          } else {
            ChargingStrategyApi.addCurrency(data).then((data) => {
              this.close("add");
              this.$info("添加成功");
            });
          }
        }
      });
    },
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
      this.view2 = "form";
    },
    close(val) {
      if (val == "add") {
        this.pageData({
          ...this.pageModel,
          currentPage: 1,
        });
      }
      if (val == "form") {
        this.pageData({
          limit: this.pageModel.limit, //每页的数据
          offset: 0,
          currentPage: 1,
        });
      }
      this.form = new from();
      this.view = "table";
    },
    delAll() {
      if (this.selected.length == 0) return;
      this.$confirm(
        this.$t("chargingStrategy.deleteinfo "),
        this.$t("chargingStrategy.deleteAll ")
      ).then((res) => {
        if (res) {
          ChargingStrategyApi.deleteAll({ idList: this.selected.map((i) => i.id) })
            .then((d) => {
              this.$info(this.$t("confirm.delSuccess"));
              this.close("add");
            })
            .catch((err) => {
              this.$error(err);
            });
        }
      });
    },
    async edit(id) {
      this.info = this.$t("confirm.edit");
      await ChargingStrategyApi.geteditCurrent(id).then((data) => {
        let str = "";
        for (let k in data.name) {
          if (data.name[k] && str == "" && k !== "id") {
            str += data.name[k];
          } else if (data.name[k] && k !== "id") {
            str += "|" + data.name[k];
          }
        }
        this.form = {
          ...data.currency,
          desclanguage: str,
        };
        this.text = data.name;
      });
      this.view = "form";
    },
    del(id) {
      console.log(555, "a");
      this.$confirm(this.$t("chargingStrategy.deleteconfirm").replace("x", id)).then((res) => {
        if (!res) return;
        ChargingStrategyApi.delCurrent(id)
          .then((data) => {
            this.$info(this.$t("confirm.delSuccess"));
            this.close("add");
          })
          .catch((err) => {
            this.$error(err);
          });
      });
    },
    //数据发生变化
    pageData(val) {
      if (typeof val == "object") {
        this.pageModel = val;
      }
      let data = {
        offset: this.pageModel.offset,
        limit: this.pageModel.limit,
        name: this.screen.name,
        nameEn: this.screen.nameEn,
        code: this.screen.code,
      };
      if (!this.screen.currencyId) delete data.currencyId;
      if (!this.screen.amount) delete data.amount;
      ChargingStrategyApi.getCurrency(data).then((data) => {
        this.tableList = data.rows;
        this.totalLength = data.total;
      });
    },
    //获取全部的数据
    getTable() {
      ChargingStrategyApi.getCurrency({
        offset: this.pageModel.offset,
        limit: this.pageModel.limit,
      }).then((tabledata) => {
        this.tableList = tabledata.rows;
        this.totalLength = tabledata.total;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add:hover {
  color: #fff;
  background-color: #3090f0;
}
.del:hover {
  color: #fff;
  background-color: #f05656;
}
::v-deep .el-form-item__label {
  line-height: 150%;
}
</style>
